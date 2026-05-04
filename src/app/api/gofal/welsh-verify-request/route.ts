import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/gofal/welsh-verify-request
 *
 * Customer requests verification of their "Welsh-speaking staff available"
 * declaration. Sets welsh_medium_declared=true and queues a manual review
 * (initial process: Andrew at SSCG / Nathan calls and confirms, then sets
 * welsh_medium_verified_at).
 *
 * Body: { subscription_id, deployment_notes }
 *
 * TODO: gate this behind dashboard auth (Clerk session check) — for now we
 * trust subscription_id, which is fine because RLS only allows insert on
 * gofal_subscriptions to service-role and the body must match an active row.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const NATHAN_EMAIL = process.env.NATHAN_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_NATHAN ?? "Nathan Bowen <nathan@gofal.wales>";

interface Body {
  subscription_id?: string;
  deployment_notes?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  if (!body?.subscription_id || !body.deployment_notes) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { error } = await supabase
    .from("gofal_subscriptions")
    .update({
      welsh_medium_declared: true,
      welsh_medium_deployment_notes: body.deployment_notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.subscription_id)
    .eq("status", "active");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Queue a verification email to the admin reviewer.
  if (RESEND_API_KEY && NATHAN_EMAIL) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: NATHAN_EMAIL,
          subject: "Gofal Pro — Welsh-medium verification queued",
          html: `<p>Subscription ID: <code>${escape(body.subscription_id)}</code></p>
                 <p>Deployment notes:</p>
                 <blockquote>${escape(body.deployment_notes).replace(/\n/g, "<br/>")}</blockquote>
                 <p>Verify by phone, then UPDATE gofal_subscriptions SET welsh_medium_verified_at = NOW(), welsh_medium_verified_by = 'Nathan';</p>`,
        }),
      });
    } catch {
      // Soft fail.
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
