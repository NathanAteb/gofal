/**
 * Description Generator — AIOS Intelligence Layer
 *
 * POST /api/ai/generate-descriptions
 *
 * Generates bilingual descriptions for care homes using AI.
 * Replaces the template-based enrich-content.ts script.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { askJSON } from "@/lib/ai/claude";
import { SYSTEM_GOFAL, descriptionPrompt } from "@/lib/ai/prompts";

interface GeneratedDescription {
  description_en: string;
  description_cy: string;
}

export async function POST(request: NextRequest) {
  try {
    const { care_home_id, batch_limit = 10, dry_run = false } = await request.json();

    const supabase = await createServiceClient();

    let query = supabase
      .from("care_homes")
      .select("id, name, town, county, service_type, bed_count, active_offer_level, ciw_rating_wellbeing, ciw_rating_care_support, ciw_rating_leadership, ciw_rating_environment, operator_name, registered_manager")
      .eq("is_active", true);

    if (care_home_id) {
      query = query.eq("id", care_home_id);
    } else {
      // Process homes without good descriptions (short or templated)
      query = query.order("name").limit(batch_limit);
    }

    const { data: homes, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const results = [];
    let totalCost = 0;

    for (const home of homes || []) {
      const prompt = descriptionPrompt({
        name: home.name,
        town: home.town,
        county: home.county,
        service_type: home.service_type,
        bed_count: home.bed_count,
        active_offer_level: home.active_offer_level,
        ciw_rating_wellbeing: home.ciw_rating_wellbeing,
        ciw_rating_care_support: home.ciw_rating_care_support,
        ciw_rating_leadership: home.ciw_rating_leadership,
        ciw_rating_environment: home.ciw_rating_environment,
        operator_name: home.operator_name,
        registered_manager: home.registered_manager,
      });

      const response = await askJSON<GeneratedDescription>({
        prompt,
        system: SYSTEM_GOFAL,
        model: "claude-haiku-4-5-20251001",
        maxTokens: 1024,
      });

      totalCost += response.costUsd;

      if (!dry_run) {
        await supabase
          .from("care_home_profiles")
          .upsert(
            {
              care_home_id: home.id,
              description: response.data.description_en,
              description_cy: response.data.description_cy,
            },
            { onConflict: "care_home_id" }
          );
      }

      results.push({
        care_home_id: home.id,
        name: home.name,
        ...response.data,
      });
    }

    return NextResponse.json({
      count: results.length,
      dry_run,
      descriptions: results,
      ai: {
        total_cost_usd: totalCost,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
