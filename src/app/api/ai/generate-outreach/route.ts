/**
 * Outreach Email Generator — AIOS Intelligence Layer
 *
 * POST /api/ai/generate-outreach
 *
 * Generates personalised bilingual outreach emails for care homes.
 * Can target a specific home or batch of unclaimed homes.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { askJSON } from "@/lib/ai/claude";
import { SYSTEM_GOFAL, outreachEmailPrompt } from "@/lib/ai/prompts";

interface OutreachEmail {
  subject_cy: string;
  subject_en: string;
  body_cy: string;
  body_en: string;
}

export async function POST(request: NextRequest) {
  try {
    const { care_home_id, batch_county, batch_limit } = await request.json();

    const supabase = await createServiceClient();
    let homes: Array<Record<string, unknown>> = [];

    if (care_home_id) {
      // Single home
      const { data, error } = await supabase
        .from("care_homes")
        .select("id, name, town, county, service_type, bed_count, active_offer_level, ciw_rating_care_support, operator_name, email")
        .eq("id", care_home_id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Care home not found" }, { status: 404 });
      }
      homes = [data];
    } else if (batch_county) {
      // Batch by county — unclaimed homes with email addresses
      const { data, error } = await supabase
        .from("care_homes")
        .select("id, name, town, county, service_type, bed_count, active_offer_level, ciw_rating_care_support, operator_name, email")
        .eq("county", batch_county)
        .eq("is_claimed", false)
        .eq("is_active", true)
        .not("email", "is", null)
        .limit(batch_limit || 10);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      homes = data || [];
    } else {
      return NextResponse.json(
        { error: "Provide care_home_id or batch_county" },
        { status: 400 }
      );
    }

    const results = [];
    let totalCost = 0;

    for (const home of homes) {
      const prompt = outreachEmailPrompt({
        name: home.name as string,
        town: home.town as string,
        county: home.county as string,
        service_type: home.service_type as string,
        bed_count: home.bed_count as number | null,
        active_offer_level: home.active_offer_level as number,
        ciw_rating_care_support: home.ciw_rating_care_support as string | null,
        operator_name: home.operator_name as string | null,
      });

      const response = await askJSON<OutreachEmail>({
        prompt,
        system: SYSTEM_GOFAL,
        tier: "standard",
        maxTokens: 1024,
      });

      totalCost += response.costUsd;

      results.push({
        care_home_id: home.id,
        care_home_name: home.name,
        email: home.email,
        ...response.data,
      });
    }

    return NextResponse.json({
      count: results.length,
      emails: results,
      ai: {
        total_cost_usd: totalCost,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
