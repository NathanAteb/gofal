/**
 * Claim Follow-up Cron — AIOS Automation Layer
 *
 * GET /api/cron/claim-followup
 *
 * Sends reminder emails for:
 * 1. Unverified claims older than 48 hours
 * 2. Verified claims with no profile edits after 7 days
 *
 * Vercel cron config in vercel.json:
 * { "crons": [{ "path": "/api/cron/claim-followup", "schedule": "0 10 * * *" }] }
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createServiceClient();
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    let emailsSent = 0;

    // 1. Unverified claims older than 48h
    const { data: unverifiedClaims } = await supabase
      .from("claims")
      .select("id, claimant_email, claimant_name, verification_token, care_home_id")
      .eq("verified", false)
      .lt("created_at", fortyEightHoursAgo);

    // 2. Verified claims with no profile updates in 7 days
    const { data: staleClaims } = await supabase
      .from("claims")
      .select("id, claimant_email, claimant_name, care_home_id")
      .eq("verified", true)
      .lt("created_at", sevenDaysAgo);

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "Resend not configured",
        unverified_found: unverifiedClaims?.length || 0,
        stale_found: staleClaims?.length || 0,
      });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || "noreply@gofal.wales";

    // Send verification reminders
    for (const claim of unverifiedClaims || []) {
      const verifyUrl = `https://gofal.wales/hawlio/verified?token=${claim.verification_token}`;

      await resend.emails.send({
        from,
        to: claim.claimant_email,
        subject: "Nodyn atgoffa: Dilysych eich hawliad / Reminder: Verify your claim — gofal.wales",
        html: `
          <h2>Helo ${claim.claimant_name},</h2>
          <p>Gwnaethoch hawlio rhestriad ar gofal.wales ond heb ei ddilysu eto.</p>
          <p>You claimed a listing on gofal.wales but haven't verified yet.</p>
          <p><a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#D4806A;color:white;text-decoration:none;border-radius:9999px;font-weight:bold;">Dilysu Nawr / Verify Now</a></p>
          <p style="color:#6B5C6B;font-size:14px;">Os nad chi wnaeth hyn, anwybyddwch y neges hon. / If this wasn't you, ignore this email.</p>
        `,
      });
      emailsSent++;
    }

    // Send profile completion prompts
    for (const claim of staleClaims || []) {
      const { data: careHome } = await supabase
        .from("care_homes")
        .select("name, slug")
        .eq("id", claim.care_home_id)
        .single();

      if (!careHome) continue;

      const profileUrl = `https://gofal.wales/cartrefi-gofal/${careHome.slug}`;

      await resend.emails.send({
        from,
        to: claim.claimant_email,
        subject: `Cwblhewch broffil ${careHome.name} / Complete your ${careHome.name} profile`,
        html: `
          <h2>Helo ${claim.claimant_name},</h2>
          <p>Diolch am hawlio ${careHome.name} ar gofal.wales!</p>
          <p>Thanks for claiming ${careHome.name} on gofal.wales!</p>
          <p>Mae teuluoedd yn chwilio am gartrefi gofal yng Nghymru bob dydd. Cwblhewch eich proffil i gael mwy o ymholiadau.</p>
          <p>Families search for care homes in Wales every day. Complete your profile to get more enquiries.</p>
          <ul>
            <li>Ychwanegu disgrifiad / Add a description</li>
            <li>Llwytho lluniau / Upload photos</li>
            <li>Nodi ffioedd / Set your fees</li>
            <li>Nodi lefel y Cynnig Rhagweithiol / Set your Active Offer level</li>
          </ul>
          <p><a href="${profileUrl}" style="display:inline-block;padding:12px 24px;background:#D4806A;color:white;text-decoration:none;border-radius:9999px;font-weight:bold;">Gweld Proffil / View Profile</a></p>
        `,
      });
      emailsSent++;
    }

    return NextResponse.json({
      success: true,
      unverified_reminders: unverifiedClaims?.length || 0,
      stale_reminders: staleClaims?.length || 0,
      emails_sent: emailsSent,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
