import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendTelegramAlert } from "@/app/api/telegram/webhook/route";

interface ResendWebhookPayload {
  type: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
    [key: string]: unknown;
  };
}

export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("RESEND_WEBHOOK_SECRET not configured");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const headerSecret = req.headers.get("x-webhook-secret");
    if (headerSecret !== webhookSecret) {
      console.error("Invalid webhook secret");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payload: ResendWebhookPayload = await req.json();
    const { type, data } = payload;

    const supabase = await createServiceClient();

    switch (type) {
      case "email.sent": {
        console.log(`[Resend] Email sent: ${data.email_id} to ${data.to}`);
        break;
      }

      case "email.delivered": {
        console.log(
          `[Resend] Email delivered: ${data.email_id} to ${data.to}`
        );
        break;
      }

      case "email.opened": {
        const recipient = data.to?.[0];
        if (recipient) {
          const { error } = await supabase
            .from("outreach_log")
            .update({
              status: "opened",
              opened_at: new Date().toISOString(),
            })
            .eq("email_to", recipient);

          if (error) {
            console.error(
              `[Resend] Failed to update outreach_log for ${recipient}:`,
              error.message
            );
          } else {
            console.log(
              `[Resend] Email opened by ${recipient}, outreach_log updated`
            );
          }
        }
        break;
      }

      case "email.bounced": {
        const bouncedRecipient = data.to?.[0];
        if (bouncedRecipient) {
          const { error } = await supabase
            .from("outreach_log")
            .update({ status: "bounced" })
            .eq("email_to", bouncedRecipient);

          if (error) {
            console.error(
              `[Resend] Failed to update outreach_log for bounce:`,
              error.message
            );
          }

          await sendTelegramAlert(
            `📧 Email bounced: ${bouncedRecipient} — subject: "${data.subject}"`
          );
        }
        break;
      }

      case "email.complained": {
        const complainedRecipient = data.to?.[0];
        if (complainedRecipient) {
          const { error } = await supabase
            .from("outreach_log")
            .update({ status: "bounced" })
            .eq("email_to", complainedRecipient);

          if (error) {
            console.error(
              `[Resend] Failed to update outreach_log for complaint:`,
              error.message
            );
          }

          await sendTelegramAlert(
            `🚨 Spam complaint from: ${complainedRecipient} — subject: "${data.subject}"`
          );
        }
        break;
      }

      default: {
        console.log(`[Resend] Unhandled event type: ${type}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Resend webhook] Error: ${message}`);
    // Always return 200 to Resend to avoid retries
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
