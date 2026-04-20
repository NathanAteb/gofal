import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { care_home_id, claimant_name, claimant_email, claimant_role } = body;

    if (!care_home_id || !claimant_name || !claimant_email || !claimant_role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    // Check if already claimed
    const { data: existingClaim } = await supabase
      .from("claims")
      .select("id")
      .eq("care_home_id", care_home_id)
      .eq("verified", true)
      .single();

    if (existingClaim) {
      return NextResponse.json(
        { error: "This listing has already been claimed" },
        { status: 409 }
      );
    }

    const verification_token = randomBytes(32).toString("hex");

    const { data: claim, error } = await supabase
      .from("claims")
      .insert({
        care_home_id,
        claimant_name,
        claimant_email,
        claimant_role,
        verification_token,
        verified: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send verification email
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const verifyUrl = `https://gofal.wales/hawlio/verified?token=${verification_token}`;

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "noreply@gofal.wales",
          to: claimant_email,
          subject: "Dilysu eich hawliad / Verify your claim — gofal.wales",
          html: `
            <h2>Dilysych eich hawliad / Verify your claim</h2>
            <p>Cliciwch y ddolen isod i gwblhau eich hawliad ar gofal.wales:</p>
            <p>Click the link below to complete your claim on gofal.wales:</p>
            <p><a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#D4806A;color:white;text-decoration:none;border-radius:9999px;font-weight:bold;">Dilysu / Verify</a></p>
          `,
        });
      } catch {
        // Email failed but claim was saved
      }
    }

    // Telegram alert — new claim submitted
    if (process.env.TELEGRAM_BOT_TOKEN) {
      import("@/app/api/telegram/webhook/route").then(({ sendTelegramAlert }) => {
        sendTelegramAlert(
          `📋 *New Claim Submitted*\n👤 ${claimant_name} (${claimant_role})\n📧 ${claimant_email}\n⏳ Awaiting verification`
        ).catch(() => {});
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, id: claim.id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const supabase = await createServiceClient();

    const { data: claim, error } = await supabase
      .from("claims")
      .update({ verified: true })
      .eq("verification_token", token)
      .eq("verified", false)
      .select("care_home_id")
      .single();

    if (error || !claim) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Mark care home as claimed
    await supabase
      .from("care_homes")
      .update({ is_claimed: true })
      .eq("id", claim.care_home_id);

    // Telegram alert — claim verified! 🎉
    if (process.env.TELEGRAM_BOT_TOKEN) {
      const { data: home } = await supabase
        .from("care_homes")
        .select("name, town, county")
        .eq("id", claim.care_home_id)
        .single();

      import("@/app/api/telegram/webhook/route").then(({ sendTelegramAlert }) => {
        sendTelegramAlert(
          `🎉 *CLAIM VERIFIED!*\n🏠 ${home?.name || "Unknown"}\n📍 ${home?.town || ""}, ${home?.county || ""}\n\nThis home is now claimed. Time to nurture → upgrade → Ateb pitch.`
        ).catch(() => {});
      }).catch(() => {});

      // Update outreach_log if this home was in the pipeline
      await supabase
        .from("outreach_log")
        .update({ status: "claimed" })
        .eq("care_home_id", claim.care_home_id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
