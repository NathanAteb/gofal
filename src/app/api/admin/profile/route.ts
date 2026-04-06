import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = await createServiceClient();
  const { data: profile } = await supabase
    .from("care_home_profiles")
    .select("*")
    .eq("care_home_id", id)
    .single();

  return NextResponse.json({ profile });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { care_home_id, ...fields } = body;

  if (!care_home_id) {
    return NextResponse.json({ error: "Missing care_home_id" }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from("care_home_profiles")
    .upsert({ care_home_id, ...fields }, { onConflict: "care_home_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
