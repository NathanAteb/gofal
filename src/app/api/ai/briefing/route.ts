/**
 * Daily Business Briefing — AIOS Intelligence Layer
 *
 * GET /api/ai/briefing
 *
 * Queries all data sources, generates an AI briefing for Nathan.
 * Designed to be called daily via cron or manually.
 */

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { ask } from "@/lib/ai/claude";
import { getAnalytics } from "@/lib/vercel-analytics";
import { SYSTEM_GOFAL, dailyBriefingPrompt } from "@/lib/ai/prompts";

export async function GET() {
  try {
    const supabase = await createServiceClient();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Gather all platform data in parallel
    const [
      { count: totalHomes },
      { count: claimedHomes },
      { count: totalEnquiries },
      { data: recentEnquiries },
      { count: newEnquiryCount },
      { data: recentClaims },
      { count: pendingClaims },
    ] = await Promise.all([
      supabase
        .from("care_homes")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("care_homes")
        .select("*", { count: "exact", head: true })
        .eq("is_claimed", true),
      supabase
        .from("enquiries")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("enquiries")
        .select("family_name, care_type, timeline, welsh_speaker, status, created_at")
        .gte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("enquiries")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
      supabase
        .from("claims")
        .select("claimant_name, claimant_role, verified, created_at")
        .gte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("claims")
        .select("*", { count: "exact", head: true })
        .eq("verified", false),
    ]);

    // Fetch analytics (non-blocking — returns null if unavailable)
    const analytics = await getAnalytics();

    const prompt = dailyBriefingPrompt({
      totalHomes: totalHomes || 0,
      claimedHomes: claimedHomes || 0,
      totalEnquiries: totalEnquiries || 0,
      newEnquiries: newEnquiryCount || 0,
      pendingClaims: pendingClaims || 0,
      recentEnquiries: recentEnquiries || [],
      recentClaims: recentClaims || [],
      analytics: analytics.last7Days ? {
        visitors: analytics.last7Days.visitors,
        pageViews: analytics.last7Days.pageViews,
        previousVisitors: analytics.previous7Days?.visitors || 0,
        previousPageViews: analytics.previous7Days?.pageViews || 0,
        topPages: analytics.last7Days.topPages,
        topReferrers: analytics.last7Days.topReferrers,
      } : undefined,
    });

    const response = await ask({
      prompt,
      system: SYSTEM_GOFAL,
      tier: "reasoning",
      maxTokens: 1024,
      temperature: 0.4,
    });

    return NextResponse.json({
      briefing: response.text,
      generated_at: new Date().toISOString(),
      stats: {
        total_homes: totalHomes || 0,
        claimed: claimedHomes || 0,
        total_enquiries: totalEnquiries || 0,
        new_enquiries_7d: newEnquiryCount || 0,
        pending_claims: pendingClaims || 0,
      },
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
