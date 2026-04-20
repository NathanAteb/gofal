/**
 * Enquiry Scoring — AIOS Intelligence Layer
 *
 * POST /api/ai/score-enquiry
 *
 * Scores an enquiry for conversion likelihood using AI.
 * Called automatically after enquiry creation or manually from admin.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { askJSON } from "@/lib/ai/claude";
import { SYSTEM_GOFAL, enquiryScoringPrompt } from "@/lib/ai/prompts";

interface EnquiryScore {
  score: number;
  reasoning: string;
  priority: "high" | "medium" | "low";
  suggested_action: string;
}

export async function POST(request: NextRequest) {
  try {
    const { enquiry_id } = await request.json();

    if (!enquiry_id) {
      return NextResponse.json(
        { error: "Missing enquiry_id" },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    // Fetch enquiry with care home data
    const { data: enquiry, error: enquiryError } = await supabase
      .from("enquiries")
      .select("*")
      .eq("id", enquiry_id)
      .single();

    if (enquiryError || !enquiry) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      );
    }

    const { data: careHome } = await supabase
      .from("care_homes")
      .select("is_claimed, listing_tier")
      .eq("id", enquiry.care_home_id)
      .single();

    const prompt = enquiryScoringPrompt({
      care_type: enquiry.care_type,
      timeline: enquiry.timeline,
      welsh_speaker: enquiry.welsh_speaker,
      message: enquiry.message,
      care_home_claimed: careHome?.is_claimed || false,
      care_home_tier: careHome?.listing_tier || "free",
    });

    const response = await askJSON<EnquiryScore>({
      prompt,
      system: SYSTEM_GOFAL,
      tier: "standard",
      maxTokens: 256,
    });

    return NextResponse.json({
      enquiry_id,
      ...response.data,
      ai: {
        model: response.model,
        tokens: response.inputTokens + response.outputTokens,
        cost_usd: response.costUsd,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
