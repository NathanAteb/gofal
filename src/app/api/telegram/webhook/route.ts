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
import { ask, askJSON } from "@/lib/ai/claude";
import { sendEmail } from "@/lib/email/gmail";
import { SYSTEM_GOFAL, dailyBriefingPrompt, outreachEmailPrompt } from "@/lib/ai/prompts";

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

async function handleOutreach(chatId: number, county: string) {
  if (!county) {
    await sendMessage(chatId, "Usage: `/outreach Cardiff`\nGenerates a personalised outreach email for the first unclaimed home in that county.");
    return;
  }

  await sendMessage(chatId, `✍️ Finding unclaimed home in ${county}...`);

  const supabase = await createServiceClient();

  const { data: home } = await supabase
    .from("care_homes")
    .select("id, name, town, county, service_type, bed_count, active_offer_level, ciw_rating_care_support, operator_name, email")
    .ilike("county", `%${county}%`)
    .eq("is_claimed", false)
    .eq("is_active", true)
    .not("email", "is", null)
    .limit(1)
    .single();

  if (!home) {
    await sendMessage(chatId, `No unclaimed homes with email found in "${county}".`);
    return;
  }

  const response = await askJSON<{
    subject_cy: string;
    subject_en: string;
    body_cy: string;
    body_en: string;
  }>({
    prompt: outreachEmailPrompt({
      name: home.name,
      town: home.town,
      county: home.county,
      service_type: home.service_type,
      bed_count: home.bed_count,
      active_offer_level: home.active_offer_level,
      ciw_rating_care_support: home.ciw_rating_care_support,
      operator_name: home.operator_name,
    }),
    system: SYSTEM_GOFAL,
    tier: "standard",
    maxTokens: 1024,
  });

  const d = response.data;
  await sendMessage(chatId,
    `📧 *Outreach for ${home.name}*\n📍 ${home.town}, ${home.county}\n📩 ${home.email}\n\n` +
    `*Subject (CY):* ${d.subject_cy}\n*Subject (EN):* ${d.subject_en}\n\n` +
    `--- Welsh ---\n${d.body_cy}\n\n--- English ---\n${d.body_en}\n\n` +
    `_Cost: $${response.costUsd.toFixed(4)}_`
  );
}

async function handleLookup(chatId: number, query: string) {
  if (!query) {
    await sendMessage(chatId, "Usage: `/lookup Bryn Mawr` or `/lookup SIN-00012345`\nLooks up a specific care home.");
    return;
  }

  const supabase = await createServiceClient();

  // Try by CIW ID first, then by name
  let home;
  if (query.startsWith("SIN-")) {
    const { data } = await supabase
      .from("care_homes")
      .select("*, care_home_profiles(*)")
      .eq("ciw_service_id", query)
      .single();
    home = data;
  } else {
    const { data } = await supabase
      .from("care_homes")
      .select("*, care_home_profiles(*)")
      .ilike("name", `%${query}%`)
      .limit(1)
      .single();
    home = data;
  }

  if (!home) {
    await sendMessage(chatId, `No care home found for "${query}".`);
    return;
  }

  const p = home.care_home_profiles;
  const ratings = [
    home.ciw_rating_wellbeing ? `Well-being: ${home.ciw_rating_wellbeing}` : null,
    home.ciw_rating_care_support ? `Care & Support: ${home.ciw_rating_care_support}` : null,
    home.ciw_rating_leadership ? `Leadership: ${home.ciw_rating_leadership}` : null,
    home.ciw_rating_environment ? `Environment: ${home.ciw_rating_environment}` : null,
  ].filter(Boolean).join("\n");

  const msg = `🏠 *${home.name}*
📍 ${home.address_line_1}, ${home.town}, ${home.postcode}
📞 ${home.phone || "—"}
📧 ${home.email || "—"}
🌐 ${home.website || "—"}

*CIW ID:* ${home.ciw_service_id}
*Type:* ${home.service_type}
*Beds:* ${home.bed_count || "—"}
*Operator:* ${home.operator_name || "—"}
*Active Offer:* ${home.active_offer_level}/3
*Claimed:* ${home.is_claimed ? "Yes ✅" : "No"}
*Tier:* ${home.listing_tier}

*CIW Ratings:*
${ratings || "Not yet inspected"}

${p?.weekly_fee_from ? `*Fees:* £${p.weekly_fee_from}–£${p.weekly_fee_to}/week` : ""}
${home.ciw_report_url ? `[CIW Report](${home.ciw_report_url})` : ""}
[View on gofal.wales](https://gofal.wales/cartrefi-gofal/${home.slug})`;

  await sendMessage(chatId, msg);
}

async function handleSearch(chatId: number, query: string) {
  if (!query) {
    await sendMessage(chatId, "Usage: `/search dementia Swansea` or `/search nursing Gwynedd`");
    return;
  }

  const supabase = await createServiceClient();

  const { data: homes, count } = await supabase
    .from("care_homes")
    .select("name, town, county, service_type, active_offer_level, ciw_rating_care_support", { count: "exact" })
    .eq("is_active", true)
    .or(`name.ilike.%${query}%,town.ilike.%${query}%,service_type.ilike.%${query}%,county.ilike.%${query}%`)
    .order("name")
    .limit(10);

  if (!homes?.length) {
    await sendMessage(chatId, `No results for "${query}".`);
    return;
  }

  const lines = homes.map((h) =>
    `• *${h.name}* (${h.town}, ${h.county})\n  ${h.service_type} · AO:${h.active_offer_level}/3 · CIW:${h.ciw_rating_care_support || "n/a"}`
  );

  await sendMessage(chatId, `🔍 *"${query}"* — ${count} results\n\n${lines.join("\n\n")}`);
}

async function handleData(chatId: number, question: string) {
  if (!question) {
    await sendMessage(chatId, "Usage: `/data how many nursing homes in Cardiff?`\nI'll query the database to answer.");
    return;
  }

  await sendMessage(chatId, "🔍 Querying database...");

  const supabase = await createServiceClient();

  // Ask AI to generate a SQL query
  const sqlResponse = await ask({
    prompt: `Given this Postgres schema:
- care_homes: id, name, town, county, postcode, phone, email, website, service_type, operator_name, bed_count, active_offer_level (0-3), ciw_rating_wellbeing, ciw_rating_care_support, ciw_rating_leadership, ciw_rating_environment, is_claimed, is_active, listing_tier, slug
- care_home_profiles: care_home_id, description, weekly_fee_from, weekly_fee_to
- enquiries: id, care_home_id, family_name, care_type, timeline, welsh_speaker, status, created_at
- claims: id, care_home_id, claimant_name, verified, created_at

Write a SELECT-only SQL query to answer: "${question}"

Rules: SELECT only — no INSERT, UPDATE, DELETE, DROP, ALTER. Always add LIMIT 20. Return ONLY the SQL, no explanation.`,
    system: "You are a SQL expert. Return only the SQL query, nothing else.",
    tier: "standard",
    maxTokens: 256,
    temperature: 0,
  });

  const sql = sqlResponse.text.replace(/```sql\n?/g, "").replace(/```\n?/g, "").trim();

  // Safety check
  if (/\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE)\b/i.test(sql)) {
    await sendMessage(chatId, "⛔ Query blocked — read-only queries only.");
    return;
  }

  try {
    const { data, error } = await supabase.rpc("exec_sql", { query: sql }).single();

    if (error) {
      // Fallback: run via direct query on a known table
      await sendMessage(chatId, `SQL generated:\n\`${sql}\`\n\n⚠️ Direct SQL execution requires an RPC function. For now, use /ask instead.`);
      return;
    }

    await sendMessage(chatId, `📊 *Result:*\n\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\n_Query: ${sql}_`);
  } catch {
    await sendMessage(chatId, `SQL generated:\n\`${sql}\`\n\n💡 Tip: Run this in the Supabase SQL editor.`);
  }
}

// --- /send [county] — Generate + send outreach email from Nathan's Gmail ---
async function handleSend(chatId: number, county: string) {
  if (!county) {
    await sendMessage(chatId, "Usage: `/send Cardiff`\nGenerates and sends an outreach email from your Gmail to an unclaimed home.");
    return;
  }

  await sendMessage(chatId, `📧 Finding unclaimed home in ${county}...`);

  const supabase = await createServiceClient();

  // Find unclaimed home NOT already in outreach_log
  const { data: alreadySent } = await supabase
    .from("outreach_log")
    .select("care_home_id");

  const sentIds = (alreadySent || []).map((r) => r.care_home_id);

  let query = supabase
    .from("care_homes")
    .select("id, name, town, county, service_type, bed_count, active_offer_level, ciw_rating_care_support, operator_name, email")
    .ilike("county", `%${county}%`)
    .eq("is_claimed", false)
    .eq("is_active", true)
    .not("email", "is", null);

  if (sentIds.length > 0) {
    // Filter out already contacted homes
    query = query.not("id", "in", `(${sentIds.join(",")})`);
  }

  const { data: home } = await query.limit(1).single();

  if (!home) {
    await sendMessage(chatId, `No unsent unclaimed homes with email in "${county}".`);
    return;
  }

  // Generate personalised email
  const response = await askJSON<{
    subject_cy: string;
    subject_en: string;
    body_cy: string;
    body_en: string;
  }>({
    prompt: outreachEmailPrompt({
      name: home.name as string,
      town: home.town as string,
      county: home.county as string,
      service_type: home.service_type as string,
      bed_count: home.bed_count as number | null,
      active_offer_level: home.active_offer_level as number,
      ciw_rating_care_support: home.ciw_rating_care_support as string | null,
      operator_name: home.operator_name as string | null,
    }),
    system: SYSTEM_GOFAL,
    tier: "standard",
    maxTokens: 1024,
  });

  const d = response.data;
  const subject = `${d.subject_cy} / ${d.subject_en}`;
  const html = `
    <div style="font-family: Nunito, Arial, sans-serif; max-width: 600px; color: #2C2430;">
      <div style="margin-bottom: 24px;">${d.body_cy.replace(/\n/g, "<br>")}</div>
      <hr style="border: none; border-top: 1px solid #DDD4CE; margin: 24px 0;">
      <div style="color: #6B5C6B;">${d.body_en.replace(/\n/g, "<br>")}</div>
    </div>`;

  // Send via Gmail
  const result = await sendEmail({
    to: home.email as string,
    subject,
    html,
  });

  if (result.success) {
    // Log to pipeline
    await supabase.from("outreach_log").insert({
      care_home_id: home.id,
      email_to: home.email,
      subject,
      body_html: html,
      status: "sent",
    });

    await sendMessage(chatId,
      `✅ *Sent to ${home.name}*\n📩 ${home.email}\n📝 ${subject}\n\n_Logged to pipeline_`
    );
  } else {
    await sendMessage(chatId, `❌ Failed to send: ${result.error}\n\nCheck GMAIL_ADDRESS and GMAIL_APP_PASSWORD in .env.local`);
  }
}

// --- /pipeline — Show outreach funnel ---
async function handlePipeline(chatId: number) {
  const supabase = await createServiceClient();

  const { data: logs } = await supabase
    .from("outreach_log")
    .select("status, care_home_id")
    .order("sent_at", { ascending: false });

  if (!logs?.length) {
    await sendMessage(chatId, "📭 No outreach sent yet. Try `/send Cardiff` to get started.");
    return;
  }

  const counts: Record<string, number> = {};
  for (const log of logs) {
    counts[log.status] = (counts[log.status] || 0) + 1;
  }

  const total = logs.length;
  const funnel = [
    `📧 Sent: *${counts["sent"] || 0}*`,
    `👀 Opened: *${counts["opened"] || 0}*`,
    `💬 Replied: *${counts["replied"] || 0}*`,
    `✅ Claimed: *${counts["claimed"] || 0}*`,
    `⭐ Upgraded: *${counts["upgraded"] || 0}*`,
  ];

  // Last 5 sent
  const { data: recent } = await supabase
    .from("outreach_log")
    .select("email_to, status, sent_at, care_home_id")
    .order("sent_at", { ascending: false })
    .limit(5);

  // Get care home names for recent
  let recentLines = "";
  if (recent?.length) {
    const ids = recent.map((r) => r.care_home_id);
    const { data: homes } = await supabase
      .from("care_homes")
      .select("id, name")
      .in("id", ids);

    const nameMap: Record<string, string> = {};
    for (const h of homes || []) {
      nameMap[h.id] = h.name;
    }

    recentLines = recent
      .map((r) => {
        const date = new Date(r.sent_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        return `• ${nameMap[r.care_home_id] || "?"} — ${r.status} (${date})`;
      })
      .join("\n");
  }

  await sendMessage(chatId,
    `📊 *Outreach Pipeline* (${total} total)\n\n${funnel.join("\n")}\n\n*Recent:*\n${recentLines}`
  );
}

// --- /linkedin — Generate a LinkedIn post ---
async function handleLinkedIn(chatId: number, topic?: string) {
  await sendMessage(chatId, "✍️ Drafting LinkedIn post...");

  const supabase = await createServiceClient();

  const [
    { count: totalHomes },
    { count: claimed },
  ] = await Promise.all([
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_claimed", true),
  ]);

  const response = await ask({
    prompt: `Write a LinkedIn post for Nathan Bowen, founder of gofal.wales.

Platform stats: ${totalHomes} care homes listed across Wales, ${claimed} claimed.

${topic ? `Topic: ${topic}` : "Pick a compelling topic from: the Active Offer, Welsh language in care, CIW ratings, finding care for a parent, what makes gofal.wales different."}

Rules:
- Write in English (LinkedIn audience)
- Include 1-2 sentences in Welsh naturally (with translation)
- Personal, authentic tone — Nathan is a Welsh speaker from Llanelli
- Under 200 words
- End with a question to drive engagement
- Include 3-5 relevant hashtags
- NO emojis in the first line (LinkedIn algorithm)`,
    system: SYSTEM_GOFAL,
    tier: "standard",
    maxTokens: 512,
    temperature: 0.7,
  });

  await sendMessage(chatId, `📝 *LinkedIn Draft:*\n\n${response.text}\n\n_Copy and paste to LinkedIn. Cost: $${response.costUsd.toFixed(4)}_`);
}

// --- Telegram alert helper (called from other API routes) ---
export async function sendTelegramAlert(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });
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
    } else if (text.startsWith("/send ")) {
      const county = text.split(" ").slice(1).join(" ").trim();
      await handleSend(chatId, county);
    } else if (text.startsWith("/outreach")) {
      const county = text.split(" ").slice(1).join(" ").trim();
      await handleOutreach(chatId, county);
    } else if (text === "/pipeline" || text === "/funnel") {
      await handlePipeline(chatId);
    } else if (text.startsWith("/linkedin")) {
      const topic = text.split(" ").slice(1).join(" ").trim();
      await handleLinkedIn(chatId, topic || undefined);
    } else if (text.startsWith("/lookup ") || text.startsWith("/home ")) {
      const query = text.split(" ").slice(1).join(" ").trim();
      await handleLookup(chatId, query);
    } else if (text.startsWith("/search ") || text.startsWith("/chwilio ")) {
      const query = text.split(" ").slice(1).join(" ").trim();
      await handleSearch(chatId, query);
    } else if (text.startsWith("/data ") || text.startsWith("/sql ")) {
      const question = text.split(" ").slice(1).join(" ").trim();
      await handleData(chatId, question);
    } else if (text === "/help" || text === "/start") {
      await sendMessage(chatId, `🏴󠁧󠁢󠁷󠁬󠁳󠁿 *gofal.wales AIOS*

📊 *Dashboard*
/briefing — AI morning briefing
/stats — Platform numbers

🔍 *Explore*
/county — All counties breakdown
/county Cardiff — Specific county
/search nursing Gwynedd — Search homes
/lookup Bryn Mawr — Full care home profile
/data how many nursing homes? — AI queries the DB

📧 *Outreach*
/send Cardiff — Generate + send email from your Gmail
/outreach Cardiff — Preview email without sending
/pipeline — View outreach funnel

📣 *Content*
/linkedin — Generate a LinkedIn post
/linkedin Active Offer — Post about a specific topic

💬 *Chat*
/ask [anything] — or just type freely

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
