/**
 * Telegram Bot Webhook — AIOS Mobile Interface
 *
 * POST /api/telegram/webhook
 *
 * Receives Telegram updates and routes commands to AIOS endpoints.
 *
 * Commands:
 *   /briefing        — Morning business briefing
 *   /stats           — Quick platform numbers
 *   /outreach [county] — Generate outreach emails for a county
 *   /score [id]      — Score an enquiry
 *   /ask [question]  — Ask anything about gofal.wales
 *
 * Setup:
 *   1. Create bot via @BotFather → get token
 *   2. Set TELEGRAM_BOT_TOKEN in env
 *   3. Register webhook:
 *      curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://gofal.wales/api/telegram/webhook&secret_token=<CRON_SECRET>"
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { ask } from "@/lib/ai/claude";
import { SYSTEM_GOFAL, dailyBriefingPrompt } from "@/lib/ai/prompts";

const TELEGRAM_API = "https://api.telegram.org/bot";

// Only allow Nathan's chat ID
function isAuthorized(chatId: number): boolean {
  const allowed = process.env.TELEGRAM_CHAT_ID;
  if (!allowed) return true; // If not set, allow all (for initial setup)
  return String(chatId) === allowed;
}

async function sendMessage(chatId: number, text: string, parseMode = "Markdown") {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN not set");

  // Telegram has a 4096 char limit — split if needed
  const chunks = splitMessage(text, 4000);

  for (const chunk of chunks) {
    await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: chunk,
        parse_mode: parseMode,
      }),
    });
  }
}

function splitMessage(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }
    // Split at last newline before limit
    let splitAt = remaining.lastIndexOf("\n", maxLen);
    if (splitAt === -1) splitAt = maxLen;
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }
  return chunks;
}

async function handleBriefing(chatId: number) {
  await sendMessage(chatId, "🔄 Generating briefing...");

  const supabase = await createServiceClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalHomes },
    { count: claimedHomes },
    { count: totalEnquiries },
    { count: newEnquiryCount },
    { data: recentEnquiries },
    { data: recentClaims },
    { count: pendingClaims },
  ] = await Promise.all([
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_claimed", true),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    supabase.from("enquiries").select("family_name, care_type, timeline, welsh_speaker, status, created_at").gte("created_at", sevenDaysAgo).order("created_at", { ascending: false }).limit(10),
    supabase.from("claims").select("claimant_name, claimant_role, verified, created_at").gte("created_at", sevenDaysAgo).order("created_at", { ascending: false }).limit(10),
    supabase.from("claims").select("*", { count: "exact", head: true }).eq("verified", false),
  ]);

  const prompt = dailyBriefingPrompt({
    totalHomes: totalHomes || 0,
    claimedHomes: claimedHomes || 0,
    totalEnquiries: totalEnquiries || 0,
    newEnquiries: newEnquiryCount || 0,
    pendingClaims: pendingClaims || 0,
    recentEnquiries: recentEnquiries || [],
    recentClaims: recentClaims || [],
  });

  const response = await ask({
    prompt,
    system: SYSTEM_GOFAL,
    tier: "reasoning",
    maxTokens: 1024,
    temperature: 0.4,
  });

  await sendMessage(chatId, response.text);
  await sendMessage(chatId, `_Cost: $${response.costUsd.toFixed(4)} · ${response.inputTokens + response.outputTokens} tokens_`);
}

async function handleStats(chatId: number) {
  const supabase = await createServiceClient();

  const [
    { count: totalHomes },
    { count: claimed },
    { count: enquiries },
    { count: pendingClaims },
    { count: withWebsite },
    { count: geocoded },
  ] = await Promise.all([
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_claimed", true),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
    supabase.from("claims").select("*", { count: "exact", head: true }).eq("verified", false),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).not("website", "is", null),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).not("lat", "is", null),
  ]);

  const msg = `📊 *gofal.wales — Stats*

🏠 Care homes: *${totalHomes}*
✅ Claimed: *${claimed}*
📩 Enquiries: *${enquiries}*
⏳ Pending claims: *${pendingClaims}*
🌐 With website: *${withWebsite}*
📍 Geocoded: *${geocoded}*`;

  await sendMessage(chatId, msg);
}

async function handleAsk(chatId: number, question: string) {
  await sendMessage(chatId, "🤔 Thinking...");

  const supabase = await createServiceClient();

  // Get context data for the AI
  const [
    { count: totalHomes },
    { count: claimed },
    { count: enquiries },
  ] = await Promise.all([
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_claimed", true),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
  ]);

  const response = await ask({
    prompt: `Platform context: ${totalHomes} care homes listed, ${claimed} claimed, ${enquiries} enquiries.

Nathan asks: ${question}`,
    system: SYSTEM_GOFAL + "\n\nYou are responding via Telegram to Nathan (the founder). Keep answers concise — max 3 paragraphs. Use Telegram markdown formatting.",
    tier: "standard",
    maxTokens: 512,
    temperature: 0.4,
  });

  await sendMessage(chatId, response.text);
}

async function handleCountyBreakdown(chatId: number, county?: string) {
  const supabase = await createServiceClient();

  if (county) {
    const { data, count } = await supabase
      .from("care_homes")
      .select("name, town, active_offer_level, ciw_rating_care_support", { count: "exact" })
      .ilike("county", `%${county}%`)
      .eq("is_active", true)
      .order("name")
      .limit(10);

    if (!data?.length) {
      await sendMessage(chatId, `No homes found for "${county}".`);
      return;
    }

    const lines = data.map((h) =>
      `• *${h.name}* (${h.town}) — AO:${h.active_offer_level}/3 CIW:${h.ciw_rating_care_support || "n/a"}`
    );

    await sendMessage(chatId, `🏠 *${county}* — ${count} homes\n\nTop 10:\n${lines.join("\n")}`);
  } else {
    const { data: homes } = await supabase
      .from("care_homes")
      .select("county")
      .eq("is_active", true);

    if (!homes) {
      await sendMessage(chatId, "Could not fetch county data.");
      return;
    }

    const counts: Record<string, number> = {};
    for (const h of homes) {
      counts[h.county] = (counts[h.county] || 0) + 1;
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const lines = sorted.map(([c, n]) => `• ${c}: *${n}*`);

    await sendMessage(chatId, `🗺 *Homes by county*\n\n${lines.join("\n")}`);
  }
}

export async function POST(request: NextRequest) {
  // Verify Telegram secret token
  const secretToken = request.headers.get("x-telegram-bot-api-secret-token");
  if (process.env.CRON_SECRET && secretToken !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const update = await request.json();
    const message = update.message;

    if (!message?.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();

    // Auth check
    if (!isAuthorized(chatId)) {
      await sendMessage(chatId, "⛔ Unauthorized. Ask Nathan to add your chat ID.");
      return NextResponse.json({ ok: true });
    }

    // Route commands
    if (text === "/briefing" || text === "/bore" || text === "/morning") {
      await handleBriefing(chatId);
    } else if (text === "/stats" || text === "/ystadegau") {
      await handleStats(chatId);
    } else if (text.startsWith("/county") || text.startsWith("/sir")) {
      const county = text.split(" ").slice(1).join(" ").trim();
      await handleCountyBreakdown(chatId, county || undefined);
    } else if (text === "/help" || text === "/start") {
      await sendMessage(chatId, `🏴󠁧󠁢󠁷󠁬󠁳󠁿 *gofal.wales AIOS*

Commands:
/briefing — Morning business briefing
/stats — Quick platform numbers
/county — Homes by county
/county Cardiff — Homes in a specific county
/ask [question] — Ask anything

Or just type a question and I'll answer.

_Bore da, Nathan!_`);
    } else if (text.startsWith("/ask ")) {
      await handleAsk(chatId, text.slice(5));
    } else if (text.startsWith("/")) {
      await sendMessage(chatId, "Unknown command. Try /help");
    } else {
      // Freeform text → treat as question
      await handleAsk(chatId, text);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Telegram webhook error:", message);
    return NextResponse.json({ ok: true }); // Always 200 to Telegram
  }
}
