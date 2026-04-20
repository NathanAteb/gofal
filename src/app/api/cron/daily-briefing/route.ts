/**
 * Daily Briefing Cron — AIOS Automation Layer
 *
 * GET /api/cron/daily-briefing
 *
 * Called by Vercel Cron at 7am UK time.
 * Generates AI briefing and emails it to Nathan.
 *
 * Vercel cron config in vercel.json:
 * { "crons": [{ "path": "/api/cron/daily-briefing", "schedule": "0 7 * * *" }] }
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Call the briefing endpoint internally
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gofal.wales";
    const briefingRes = await fetch(`${baseUrl}/api/ai/briefing`);
    const briefingData = await briefingRes.json();

    if (!briefingRes.ok) {
      throw new Error(briefingData.error || "Briefing generation failed");
    }

    // Email the briefing to Nathan
    if (process.env.RESEND_API_KEY && process.env.NATHAN_EMAIL) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const today = new Date().toISOString().split("T")[0];

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@gofal.wales",
        to: process.env.NATHAN_EMAIL,
        subject: `gofal.wales — Bore da, Nathan 🏴󠁧󠁢󠁷󠁬󠁳󠁿 (${today})`,
        html: `
          <div style="font-family: Nunito, sans-serif; max-width: 600px; margin: 0 auto; color: #2C2430;">
            <div style="background: #4A2F4E; padding: 24px; border-radius: 16px 16px 0 0;">
              <h1 style="font-family: Poppins, sans-serif; color: white; margin: 0; font-size: 20px;">
                gofal.wales — Brîff Dyddiol
              </h1>
              <p style="color: #A68AAB; margin: 4px 0 0 0; font-size: 14px;">${today}</p>
            </div>
            <div style="background: #FBF7F3; padding: 24px; border: 1px solid #DDD4CE; border-top: none; border-radius: 0 0 16px 16px;">
              <div style="white-space: pre-wrap; line-height: 1.7;">${briefingData.briefing}</div>
              <hr style="border: none; border-top: 1px solid #DDD4CE; margin: 24px 0;" />
              <table style="width: 100%; font-size: 14px; color: #6B5C6B;">
                <tr>
                  <td>Cartrefi: <strong>${briefingData.stats.total_homes}</strong></td>
                  <td>Hawliwyd: <strong>${briefingData.stats.claimed}</strong></td>
                  <td>Ymholiadau: <strong>${briefingData.stats.total_enquiries}</strong></td>
                </tr>
              </table>
              <p style="font-size: 11px; color: #A68AAB; margin-top: 16px;">
                AI cost: $${briefingData.ai.cost_usd.toFixed(4)} · ${briefingData.ai.tokens} tokens · ${briefingData.ai.model}
              </p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      briefing_generated: true,
      email_sent: !!(process.env.RESEND_API_KEY && process.env.NATHAN_EMAIL),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
