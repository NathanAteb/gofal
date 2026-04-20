/**
 * Vercel Deployment Webhook — receives deployment.succeeded events
 * and notifies Telegram when preview deployments are ready.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createHmac, timingSafeEqual } from "crypto";

function verifySignature(body: string, signature: string | null): boolean {
  const secret = process.env.VERCEL_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha1", secret).update(body).digest("hex");
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-vercel-signature");

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(body);

    // Only handle deployment succeeded
    if (payload.type !== "deployment.succeeded") {
      return NextResponse.json({ ok: true });
    }

    const deployment = payload.payload?.deployment || payload.payload;
    const branch = deployment?.meta?.githubCommitRef;
    const deploymentUrl = deployment?.url;

    // Only care about telegram/* branches
    if (!branch?.startsWith("telegram/")) {
      return NextResponse.json({ ok: true });
    }

    const supabase = await createServiceClient();

    // Find the code task for this branch
    const { data: task } = await supabase
      .from("code_tasks")
      .select("id, prompt, files_changed, telegram_chat_id")
      .eq("branch", branch)
      .in("status", ["preview-building", "running", "done"])
      .single();

    if (!task) {
      return NextResponse.json({ ok: true });
    }

    // Update task with preview URL
    await supabase
      .from("code_tasks")
      .update({
        status: "preview-ready",
        preview_url: `https://${deploymentUrl}`,
      })
      .eq("id", task.id);

    // Notify via Telegram
    const { sendTelegramAlert } = await import("@/app/api/telegram/webhook/route");

    const filesMsg = task.files_changed?.length
      ? task.files_changed.map((f: string) => `• \`${f}\``).join("\n")
      : "None";

    await sendTelegramAlert(
      `✅ *Preview Ready*\n\n📝 ${(task.prompt as string).slice(0, 150)}\n\n🔗 https://${deploymentUrl}\n\n✏️ *Files:*\n${filesMsg}\n\n👉 \`/deploy ${(task.id as string).slice(0, 8)}\` to ship\n👉 \`/cancel ${(task.id as string).slice(0, 8)}\` to discard`
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Vercel webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}
