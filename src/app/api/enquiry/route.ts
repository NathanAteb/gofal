import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendTransactionalEmail } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      care_home_id,
      family_name,
      family_email,
      family_phone,
      care_needed_for,
      care_type,
      timeline,
      welsh_speaker,
      message,
    } = body;

    // Validation
    if (!care_home_id || !family_name || !family_email || !care_needed_for || !care_type || !timeline) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    // Save enquiry
    const { data: enquiry, error: enquiryError } = await supabase
      .from("enquiries")
      .insert({
        care_home_id,
        family_name,
        family_email,
        family_phone: family_phone || null,
        care_needed_for,
        care_type,
        timeline,
        welsh_speaker: welsh_speaker || false,
        message: message || null,
        status: "new",
      })
      .select()
      .single();

    if (enquiryError) {
      return NextResponse.json(
        { error: enquiryError.message },
        { status: 500 }
      );
    }

    // Get care home details for email
    const { data: careHome } = await supabase
      .from("care_homes")
      .select("name, email")
      .eq("id", care_home_id)
      .single();

    // Send emails via Resend
    if (careHome?.email) {
      try {
        // Notify care home
        await sendTransactionalEmail({
          to: careHome.email,
          subject: `Ymholiad newydd / New enquiry — ${family_name}`,
          html: `
            <h2>Ymholiad newydd trwy gofal.wales</h2>
            <p><strong>Enw / Name:</strong> ${family_name}</p>
            <p><strong>E-bost / Email:</strong> ${family_email}</p>
            <p><strong>Ffôn / Phone:</strong> ${family_phone || "—"}</p>
            <p><strong>Gofal ar gyfer / Care for:</strong> ${care_needed_for}</p>
            <p><strong>Math / Type:</strong> ${care_type}</p>
            <p><strong>Pryd / When:</strong> ${timeline}</p>
            <p><strong>Siaradwr Cymraeg / Welsh speaker:</strong> ${welsh_speaker ? "Ie / Yes" : "Na / No"}</p>
            ${message ? `<p><strong>Neges / Message:</strong> ${message}</p>` : ""}
          `,
        });

        // Confirm to family
        await sendTransactionalEmail({
          to: family_email,
          subject: `Cadarnhad ymholiad / Enquiry confirmation — ${careHome.name}`,
          html: `
            <h2>Diolch am eich ymholiad / Thank you for your enquiry</h2>
            <p>Rydym wedi anfon eich ymholiad i <strong>${careHome.name}</strong>.</p>
            <p>We have sent your enquiry to <strong>${careHome.name}</strong>.</p>
            <p>Byddant yn cysylltu â chi'n fuan. / They will contact you soon.</p>
          `,
        });

        // Update status
        await supabase
          .from("enquiries")
          .update({ status: "sent" })
          .eq("id", enquiry.id);
      } catch {
        // Email sending failed but enquiry was saved
      }
    }

    // Fire-and-forget: AI enquiry scoring (non-blocking)
    if (process.env.OPENROUTER_API_KEY) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gofal.wales";
      fetch(`${baseUrl}/api/ai/score-enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enquiry_id: enquiry.id }),
      }).catch(() => {});
    }

    // Fire-and-forget: Telegram alert
    if (process.env.TELEGRAM_BOT_TOKEN) {
      import("@/app/api/telegram/webhook/route").then(({ sendTelegramAlert }) => {
        sendTelegramAlert(
          `🔔 *New Enquiry*\n👤 ${family_name}\n🏠 ${careHome?.name || "Unknown"}\n📋 ${care_type}\n⏰ ${timeline}\n🏴󠁧󠁢󠁷󠁬󠁳󠁿 Welsh: ${welsh_speaker ? "Yes" : "No"}${message ? `\n💬 "${message}"` : ""}`
        ).catch(() => {});
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
