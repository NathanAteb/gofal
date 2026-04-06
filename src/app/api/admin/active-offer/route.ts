import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { care_home_id, level } = await request.json();

  if (!care_home_id || level === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from("care_homes")
    .update({ active_offer_level: level, active_offer_verified: true })
    .eq("id", care_home_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, level });
}
