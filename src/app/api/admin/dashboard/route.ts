import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServiceClient();

    const [
      { count: totalHomes },
      { count: claimed },
      { count: enquiries },
      { count: pendingClaims },
      { data: recentClaims },
      { data: recentEnquiries },
    ] = await Promise.all([
      supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_claimed", true),
      supabase.from("enquiries").select("*", { count: "exact", head: true }),
      supabase.from("claims").select("*", { count: "exact", head: true }).eq("verified", false),
      supabase.from("claims").select("*").order("created_at", { ascending: false }).limit(20),
      supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(20),
    ]);

    return NextResponse.json({
      stats: {
        total_homes: totalHomes || 0,
        claimed: claimed || 0,
        enquiries: enquiries || 0,
        pending_claims: pendingClaims || 0,
      },
      claims: recentClaims || [],
      enquiries: recentEnquiries || [],
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
