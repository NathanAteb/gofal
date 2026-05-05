import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/gofal/contact-form
 *
 * Receives a Pro page contact-form submission, persists it, and forwards a
 * notification to the customer's contact email via Resend.
 *
 * Body: { subscription_id, sender_name, sender_email, sender_phone?, message, language_preference }
 *
 * NOTE: Resend forwarding is wired below. The Resend env vars already exist
 * for the Ateb stack (RESEND_API_KEY, RESEND_FROM_HELLO).
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_HELLO ?? "gofal.wales <hello@gofal.wales>";

interface Body {
  subscription_id?: string;
  sender_name?: string;
  sender_email?: string;
  sender_phone?: string | null;
  message?: string;
  language_preference?: "en" | "cy";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  if (
    !body?.subscription_id ||
    !body.sender_name ||
    !body.sender_email ||
    !body.message
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Confirm the subscription is active and load the recipient address.
  const { data: sub, error: subErr } = await supabase
    .from("gofal_subscriptions")
    .select("id, status, ciw_service_id, gofal_page_content(contact_email, contact_name)")
    .eq("id", body.subscription_id)
    .eq("status", "active")
    .maybeSingle();

  if (subErr || !sub) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  const { error: insertErr } = await supabase.from("gofal_contact_submissions").insert({
    subscription_id: body.subscription_id,
    sender_name: body.sender_name,
    sender_email: body.sender_email,
    sender_phone: body.sender_phone ?? null,
    message: body.message,
    language_preference: body.language_preference ?? "cy",
  });
  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  // Look up the recipient. Fall back to the care_home email if the customer
  // hasn't overridden it in page content.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageContent = (sub as any).gofal_page_content?.[0];
  let recipientEmail: string | null = pageContent?.contact_email ?? null;
  if (!recipientEmail) {
    const { data: home } = await supabase
      .from("care_homes")
      .select("email")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .eq("ciw_service_id", (sub as any).ciw_service_id)
      .maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recipientEmail = (home as any)?.email ?? null;
  }

  if (RESEND_API_KEY && recipientEmail) {
    const lang = body.language_preference === "cy" ? "Cymraeg" : "English";
    const subject =
      body.language_preference === "cy"
        ? `Ymholiad newydd o gofal.wales — ${body.sender_name}`
        : `New enquiry via gofal.wales — ${body.sender_name}`;
    const html = `
      <p><strong>${escape(body.sender_name)}</strong> &lt;${escape(body.sender_email)}&gt;${
      body.sender_phone ? ` · ${escape(body.sender_phone)}` : ""
    } (${lang})</p>
      <p>${escape(body.message).replace(/\n/g, "<br/>")}</p>
      <hr/>
      <p style="font-size:12px;color:#6B5670;">Sent via your gofal.wales managed page. Reply to this email to respond directly.</p>
    `;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: recipientEmail,
          reply_to: body.sender_email,
          subject,
          html,
        }),
      });
      if (res.ok) {
        await supabase
          .from("gofal_contact_submissions")
          .update({ forwarded_at: new Date().toISOString() })
          .eq("subscription_id", body.subscription_id)
          .order("created_at", { ascending: false })
          .limit(1);
      }
    } catch {
      // Soft-fail: the row is in the DB, an admin can re-send. Family still
      // sees the success state because their submission has been captured.
    }
  }

  return NextResponse.json({ ok: true });
}

function escape(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
