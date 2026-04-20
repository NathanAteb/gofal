/**
 * Telegram Bot Webhook — AIOS Mobile Interface
 *
 * POST /api/telegram/webhook
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getReadonlyClient } from "@/lib/supabase/readonly";
import { ask, askJSON } from "@/lib/ai/claude";
import { sendEmail } from "@/lib/email/resend";
import { createPR, mergePR, deleteBranch } from "@/lib/github";
import { getRecentProductionDeployments, promoteDeployment } from "@/lib/vercel";
import { SYSTEM_GOFAL, dailyBriefingPrompt, outreachEmailPrompt } from "@/lib/ai/prompts";

const TELEGRAM_API = "https://api.telegram.org/bot";

// --- Auth: fail-closed ---
if (!process.env.TELEGRAM_CHAT_ID) {
  console.error("WARNING: TELEGRAM_CHAT_ID not set — bot will reject all commands");
}

function isAuthorized(chatId: number): boolean {
  const allowed = process.env.TELEGRAM_CHAT_ID;
  if (!allowed) return false;
  return String(chatId) === allowed;
}

// --- Telegram messaging ---
async function sendMessage(chatId: number, text: string, parseMode = "Markdown") {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN not set");

  const chunks = splitMessage(text, 4000);
  for (const chunk of chunks) {
    await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: chunk, parse_mode: parseMode }),
    });
  }
}

function splitMessage(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxLen) { chunks.push(remaining); break; }
    let splitAt = remaining.lastIndexOf("\n", maxLen);
    if (splitAt === -1) splitAt = maxLen;
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }
  return chunks;
}

// --- Exported alert helper ---
export async function sendTelegramAlert(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
}

// ===================== COMMAND HANDLERS =====================

async function handleBriefing(chatId: number) {
  await sendMessage(chatId, "🔄 Generating briefing...");
  const supabase = await createServiceClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalHomes }, { count: claimedHomes }, { count: totalEnquiries },
    { count: newEnquiryCount }, { data: recentEnquiries },
    { data: recentClaims }, { count: pendingClaims },
  ] = await Promise.all([
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_claimed", true),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    supabase.from("enquiries").select("family_name, care_type, timeline, welsh_speaker, status, created_at").gte("created_at", sevenDaysAgo).order("created_at", { ascending: false }).limit(10),
    supabase.from("claims").select("claimant_name, claimant_role, verified, created_at").gte("created_at", sevenDaysAgo).order("created_at", { ascending: false }).limit(10),
    supabase.from("claims").select("*", { count: "exact", head: true }).eq("verified", false),
  ]);

  const response = await ask({
    prompt: dailyBriefingPrompt({
      totalHomes: totalHomes || 0, claimedHomes: claimedHomes || 0,
      totalEnquiries: totalEnquiries || 0, newEnquiries: newEnquiryCount || 0,
      pendingClaims: pendingClaims || 0,
      recentEnquiries: recentEnquiries || [], recentClaims: recentClaims || [],
    }),
    system: SYSTEM_GOFAL, tier: "reasoning", maxTokens: 1024, temperature: 0.4,
  });

  await sendMessage(chatId, response.text);
  await sendMessage(chatId, `_Cost: $${response.costUsd.toFixed(4)} · ${response.inputTokens + response.outputTokens} tokens_`);
}

async function handleStats(chatId: number) {
  const supabase = await createServiceClient();
  const [
    { count: totalHomes }, { count: claimed }, { count: enquiries },
    { count: pendingClaims }, { count: withWebsite }, { count: geocoded },
  ] = await Promise.all([
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_claimed", true),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
    supabase.from("claims").select("*", { count: "exact", head: true }).eq("verified", false),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).not("website", "is", null),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).not("lat", "is", null),
  ]);

  await sendMessage(chatId, `📊 *gofal.wales — Stats*\n\n🏠 Care homes: *${totalHomes}*\n✅ Claimed: *${claimed}*\n📩 Enquiries: *${enquiries}*\n⏳ Pending claims: *${pendingClaims}*\n🌐 With website: *${withWebsite}*\n📍 Geocoded: *${geocoded}*`);
}

async function handleAsk(chatId: number, question: string) {
  await sendMessage(chatId, "🤔 Thinking...");
  const supabase = await createServiceClient();
  const [{ count: totalHomes }, { count: claimed }, { count: enquiries }] = await Promise.all([
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_claimed", true),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
  ]);

  const response = await ask({
    prompt: `Platform context: ${totalHomes} care homes listed, ${claimed} claimed, ${enquiries} enquiries.\n\nNathan asks: ${question}`,
    system: SYSTEM_GOFAL + "\n\nYou are responding via Telegram to Nathan (the founder). Keep answers concise — max 3 paragraphs.",
    tier: "reasoning", maxTokens: 512, temperature: 0.4,
  });
  await sendMessage(chatId, response.text);
}

async function handleCountyBreakdown(chatId: number, county?: string) {
  const supabase = await createServiceClient();
  if (county) {
    const { data, count } = await supabase.from("care_homes").select("name, town, active_offer_level, ciw_rating_care_support", { count: "exact" }).ilike("county", `%${county}%`).eq("is_active", true).order("name").limit(10);
    if (!data?.length) { await sendMessage(chatId, `No homes found for "${county}".`); return; }
    const lines = data.map((h) => `• *${h.name}* (${h.town}) — AO:${h.active_offer_level}/3 CIW:${h.ciw_rating_care_support || "n/a"}`);
    await sendMessage(chatId, `🏠 *${county}* — ${count} homes\n\nTop 10:\n${lines.join("\n")}`);
  } else {
    const { data: homes } = await supabase.from("care_homes").select("county").eq("is_active", true);
    if (!homes) { await sendMessage(chatId, "Could not fetch county data."); return; }
    const counts: Record<string, number> = {};
    for (const h of homes) counts[h.county] = (counts[h.county] || 0) + 1;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    await sendMessage(chatId, `🗺 *Homes by county*\n\n${sorted.map(([c, n]) => `• ${c}: *${n}*`).join("\n")}`);
  }
}

async function handleOutreach(chatId: number, county: string) {
  if (!county) { await sendMessage(chatId, "Usage: `/outreach Cardiff`"); return; }
  await sendMessage(chatId, `✍️ Finding unclaimed home in ${county}...`);
  const supabase = await createServiceClient();
  const { data: home } = await supabase.from("care_homes").select("id, name, town, county, service_type, bed_count, active_offer_level, ciw_rating_care_support, operator_name, email").ilike("county", `%${county}%`).eq("is_claimed", false).eq("is_active", true).not("email", "is", null).limit(1).single();
  if (!home) { await sendMessage(chatId, `No unclaimed homes with email in "${county}".`); return; }

  const response = await askJSON<{ subject_cy: string; subject_en: string; body_cy: string; body_en: string }>({
    prompt: outreachEmailPrompt({ name: home.name, town: home.town, county: home.county, service_type: home.service_type, bed_count: home.bed_count, active_offer_level: home.active_offer_level, ciw_rating_care_support: home.ciw_rating_care_support, operator_name: home.operator_name }),
    system: SYSTEM_GOFAL, tier: "standard", maxTokens: 1024,
  });
  const d = response.data;
  await sendMessage(chatId, `📧 *Outreach for ${home.name}*\n📍 ${home.town}, ${home.county}\n📩 ${home.email}\n\n*Subject (CY):* ${d.subject_cy}\n*Subject (EN):* ${d.subject_en}\n\n--- Welsh ---\n${d.body_cy}\n\n--- English ---\n${d.body_en}\n\n_Cost: $${response.costUsd.toFixed(4)}_`);
}

async function handleLookup(chatId: number, query: string) {
  if (!query) { await sendMessage(chatId, "Usage: `/lookup Bryn Mawr` or `/lookup SIN-00012345`"); return; }
  const supabase = await createServiceClient();
  let home;
  if (query.startsWith("SIN-")) {
    const { data } = await supabase.from("care_homes").select("*, care_home_profiles(*)").eq("ciw_service_id", query).single();
    home = data;
  } else {
    const { data } = await supabase.from("care_homes").select("*, care_home_profiles(*)").ilike("name", `%${query}%`).limit(1).single();
    home = data;
  }
  if (!home) { await sendMessage(chatId, `No care home found for "${query}".`); return; }
  const p = home.care_home_profiles;
  const ratings = [home.ciw_rating_wellbeing ? `Well-being: ${home.ciw_rating_wellbeing}` : null, home.ciw_rating_care_support ? `Care & Support: ${home.ciw_rating_care_support}` : null, home.ciw_rating_leadership ? `Leadership: ${home.ciw_rating_leadership}` : null, home.ciw_rating_environment ? `Environment: ${home.ciw_rating_environment}` : null].filter(Boolean).join("\n");
  await sendMessage(chatId, `🏠 *${home.name}*\n📍 ${home.address_line_1}, ${home.town}, ${home.postcode}\n📞 ${home.phone || "—"}\n📧 ${home.email || "—"}\n🌐 ${home.website || "—"}\n\n*CIW ID:* ${home.ciw_service_id}\n*Type:* ${home.service_type}\n*Beds:* ${home.bed_count || "—"}\n*Operator:* ${home.operator_name || "—"}\n*Active Offer:* ${home.active_offer_level}/3\n*Claimed:* ${home.is_claimed ? "Yes ✅" : "No"}\n*Tier:* ${home.listing_tier}\n\n*CIW Ratings:*\n${ratings || "Not yet inspected"}\n\n${p?.weekly_fee_from ? `*Fees:* £${p.weekly_fee_from}–£${p.weekly_fee_to}/week` : ""}\n${home.ciw_report_url ? `[CIW Report](${home.ciw_report_url})` : ""}\n[View on gofal.wales](https://gofal.wales/cartrefi-gofal/${home.slug})`);
}

async function handleSearch(chatId: number, query: string) {
  if (!query) { await sendMessage(chatId, "Usage: `/search dementia Swansea`"); return; }
  const supabase = await createServiceClient();
  const { data: homes, count } = await supabase.from("care_homes").select("name, town, county, service_type, active_offer_level, ciw_rating_care_support", { count: "exact" }).eq("is_active", true).or(`name.ilike.%${query}%,town.ilike.%${query}%,service_type.ilike.%${query}%,county.ilike.%${query}%`).order("name").limit(10);
  if (!homes?.length) { await sendMessage(chatId, `No results for "${query}".`); return; }
  const lines = homes.map((h) => `• *${h.name}* (${h.town}, ${h.county})\n  ${h.service_type} · AO:${h.active_offer_level}/3 · CIW:${h.ciw_rating_care_support || "n/a"}`);
  await sendMessage(chatId, `🔍 *"${query}"* — ${count} results\n\n${lines.join("\n\n")}`);
}

// --- /data — AI-generated SQL with readonly client + logging ---
async function handleData(chatId: number, question: string) {
  if (!question) { await sendMessage(chatId, "Usage: `/data how many nursing homes in Cardiff?`"); return; }
  await sendMessage(chatId, "🔍 Querying database...");

  const sqlResponse = await ask({
    prompt: `Given this Postgres schema:\n- care_homes: id, name, town, county, postcode, phone, email, website, service_type, operator_name, bed_count, active_offer_level (0-3), ciw_rating_wellbeing, ciw_rating_care_support, ciw_rating_leadership, ciw_rating_environment, is_claimed, is_active, listing_tier, slug\n- care_home_profiles: care_home_id, description, weekly_fee_from, weekly_fee_to\n- enquiries: id, care_home_id, family_name, care_type, timeline, welsh_speaker, status, created_at\n- claims: id, care_home_id, claimant_name, verified, created_at\n- outreach_log: id, care_home_id, email_to, subject, status, sent_at, opened_at\n\nWrite a SELECT-only SQL query to answer: "${question}"\n\nRules: SELECT only — no INSERT, UPDATE, DELETE, DROP, ALTER, GRANT, REVOKE, TRUNCATE, CREATE. Always add LIMIT 20. Return ONLY the SQL, no explanation.`,
    system: "You are a SQL expert. Return only the SQL query, nothing else.",
    tier: "reasoning", maxTokens: 256, temperature: 0,
  });

  const sql = sqlResponse.text.replace(/```sql\n?/g, "").replace(/```\n?/g, "").trim();

  if (/\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE)\b/i.test(sql)) {
    await sendMessage(chatId, "⛔ Query blocked — read-only queries only.");
    return;
  }

  const readonly = getReadonlyClient();
  const serviceClient = await createServiceClient();

  try {
    const { data, error } = await (readonly.rpc as any)("exec_sql", { query: sql }).single();
    if (error) {
      await serviceClient.from("data_query_log").insert({ chat_id: String(chatId), query: sql, error: error.message });
      await sendMessage(chatId, `SQL generated:\n\`${sql}\`\n\n⚠️ Requires exec_sql RPC function. Run this in the Supabase SQL editor.`);
      return;
    }
    const result = JSON.stringify(data, null, 2);
    const rowCount = Array.isArray(data) ? (data as unknown[]).length : 1;
    await serviceClient.from("data_query_log").insert({ chat_id: String(chatId), query: sql, row_count: rowCount });
    await sendMessage(chatId, `📊 *Result:*\n\`\`\`\n${result.slice(0, 3000)}\n\`\`\`\n\n_Query: ${sql}_`);
  } catch {
    await serviceClient.from("data_query_log").insert({ chat_id: String(chatId), query: sql, error: "execution failed" });
    await sendMessage(chatId, `SQL generated:\n\`${sql}\`\n\n💡 Run this in the Supabase SQL editor.`);
  }
}

// --- /send — Generate + send outreach via Resend ---
async function handleSend(chatId: number, county: string) {
  if (!county) { await sendMessage(chatId, "Usage: `/send Cardiff`"); return; }
  await sendMessage(chatId, `📧 Finding unclaimed home in ${county}...`);

  const supabase = await createServiceClient();
  const { data: alreadySent } = await supabase.from("outreach_log").select("care_home_id");
  const sentIds = (alreadySent || []).map((r) => r.care_home_id);

  let query = supabase.from("care_homes").select("id, name, town, county, service_type, bed_count, active_offer_level, ciw_rating_care_support, operator_name, email").ilike("county", `%${county}%`).eq("is_claimed", false).eq("is_active", true).not("email", "is", null);
  if (sentIds.length > 0) query = query.not("id", "in", `(${sentIds.join(",")})`);

  const { data: home } = await query.limit(1).single();
  if (!home) { await sendMessage(chatId, `No unsent unclaimed homes with email in "${county}".`); return; }

  const response = await askJSON<{ subject_cy: string; subject_en: string; body_cy: string; body_en: string }>({
    prompt: outreachEmailPrompt({ name: home.name as string, town: home.town as string, county: home.county as string, service_type: home.service_type as string, bed_count: home.bed_count as number | null, active_offer_level: home.active_offer_level as number, ciw_rating_care_support: home.ciw_rating_care_support as string | null, operator_name: home.operator_name as string | null }),
    system: SYSTEM_GOFAL, tier: "standard", maxTokens: 1024,
  });

  const d = response.data;
  const subject = `${d.subject_cy} / ${d.subject_en}`;
  const html = `<div style="font-family:Nunito,Arial,sans-serif;max-width:600px;color:#2C2430;"><div style="margin-bottom:24px;">${d.body_cy.replace(/\n/g, "<br>")}</div><hr style="border:none;border-top:1px solid #DDD4CE;margin:24px 0;"><div style="color:#6B5C6B;">${d.body_en.replace(/\n/g, "<br>")}</div></div>`;

  const result = await sendEmail({ to: home.email as string, subject, html });

  if (result.success) {
    await supabase.from("outreach_log").insert({ care_home_id: home.id, email_to: home.email, subject, body_html: html, status: "sent" });
    await sendMessage(chatId, `✅ *Sent to ${home.name}*\n📩 ${home.email}\n📝 ${subject}\n\n_Logged to pipeline_`);
  } else {
    await sendMessage(chatId, `❌ Failed to send: ${result.error}`);
  }
}

// --- /pipeline ---
async function handlePipeline(chatId: number) {
  const supabase = await createServiceClient();
  const { data: logs } = await supabase.from("outreach_log").select("status, care_home_id").order("sent_at", { ascending: false });
  if (!logs?.length) { await sendMessage(chatId, "📭 No outreach sent yet. Try `/send Cardiff`."); return; }

  const counts: Record<string, number> = {};
  for (const log of logs) counts[log.status] = (counts[log.status] || 0) + 1;
  const funnel = [`📧 Sent: *${counts["sent"] || 0}*`, `👀 Opened: *${counts["opened"] || 0}*`, `💬 Replied: *${counts["replied"] || 0}*`, `✅ Claimed: *${counts["claimed"] || 0}*`, `⭐ Upgraded: *${counts["upgraded"] || 0}*`];

  const { data: recent } = await supabase.from("outreach_log").select("email_to, status, sent_at, care_home_id").order("sent_at", { ascending: false }).limit(5);
  let recentLines = "";
  if (recent?.length) {
    const ids = recent.map((r) => r.care_home_id);
    const { data: homes } = await supabase.from("care_homes").select("id, name").in("id", ids);
    const nameMap: Record<string, string> = {};
    for (const h of homes || []) nameMap[h.id] = h.name;
    recentLines = recent.map((r) => { const date = new Date(r.sent_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }); return `• ${nameMap[r.care_home_id] || "?"} — ${r.status} (${date})`; }).join("\n");
  }
  await sendMessage(chatId, `📊 *Outreach Pipeline* (${logs.length} total)\n\n${funnel.join("\n")}\n\n*Recent:*\n${recentLines}`);
}

// --- /linkedin ---
async function handleLinkedIn(chatId: number, topic?: string) {
  await sendMessage(chatId, "✍️ Drafting LinkedIn post...");
  const supabase = await createServiceClient();
  const [{ count: totalHomes }, { count: claimed }] = await Promise.all([
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("care_homes").select("*", { count: "exact", head: true }).eq("is_claimed", true),
  ]);

  const response = await ask({
    prompt: `Write a LinkedIn post for Nathan Bowen, founder of gofal.wales.\n\nPlatform stats: ${totalHomes} care homes listed across Wales, ${claimed} claimed.\n\n${topic ? `Topic: ${topic}` : "Pick a compelling topic from: the Active Offer, Welsh language in care, CIW ratings."}\n\nRules:\n- English, include 1-2 Welsh sentences naturally\n- Personal, authentic tone — Welsh speaker from Llanelli\n- Under 200 words, end with a question\n- 3-5 hashtags, NO emojis in first line`,
    system: SYSTEM_GOFAL, tier: "reasoning", maxTokens: 512, temperature: 0.7,
  });
  await sendMessage(chatId, `📝 *LinkedIn Draft:*\n\n${response.text}\n\n_Cost: $${response.costUsd.toFixed(4)}_`);
}

// --- /code ---
async function handleCode(chatId: number, prompt: string) {
  if (!prompt) { await sendMessage(chatId, "Usage: `/code add a dark mode toggle`"); return; }
  const supabase = await createServiceClient();
  const { data: running } = await supabase.from("code_tasks").select("id, prompt").in("status", ["running", "preview-building"]).limit(1);
  if (running?.length) { await sendMessage(chatId, `⏳ A task is already running:\n\`${(running[0].prompt as string).slice(0, 100)}\`\n\nWait or use /cancel.`); return; }

  const { data: task, error } = await supabase.from("code_tasks").insert({ prompt, status: "pending", telegram_chat_id: String(chatId) }).select("id").single();
  if (error) { await sendMessage(chatId, `❌ Failed to queue: ${error.message}`); return; }
  await sendMessage(chatId, `📋 *Task queued*\n\`${prompt.slice(0, 200)}\`\n\n_Worker will pick it up in seconds..._\nID: \`${task.id}\``);
}

// --- /cancel [task_id] ---
async function handleCancel(chatId: number, taskIdPrefix?: string) {
  const supabase = await createServiceClient();

  if (taskIdPrefix) {
    // Cancel specific task
    const { data: tasks } = await supabase.from("code_tasks").select("id, branch, status").ilike("id", `${taskIdPrefix}%`).limit(1);
    if (!tasks?.length) { await sendMessage(chatId, "No task found with that ID."); return; }
    const task = tasks[0];
    if (task.status === "deployed") { await sendMessage(chatId, "Cannot cancel a deployed task. Use /rollback instead."); return; }

    // Delete branch if exists
    if (task.branch) {
      try { await deleteBranch(task.branch); } catch { /* branch may not exist */ }
    }

    await supabase.from("code_tasks").update({ status: "cancelled", result: "Cancelled by user", completed_at: new Date().toISOString() }).eq("id", task.id);
    await sendMessage(chatId, `🛑 Cancelled task \`${task.id.slice(0, 8)}\`${task.branch ? ` and deleted branch \`${task.branch}\`` : ""}`);
  } else {
    // Cancel all pending/running
    const { data: tasks } = await supabase.from("code_tasks").select("id, branch").in("status", ["pending", "running", "preview-building", "preview-ready"]);
    if (!tasks?.length) { await sendMessage(chatId, "No active tasks to cancel."); return; }
    for (const t of tasks) {
      if (t.branch) { try { await deleteBranch(t.branch); } catch { /* ok */ } }
    }
    await supabase.from("code_tasks").update({ status: "cancelled", result: "Cancelled by user", completed_at: new Date().toISOString() }).in("status", ["pending", "running", "preview-building", "preview-ready"]);
    await sendMessage(chatId, `🛑 Cancelled ${tasks.length} task(s).`);
  }
}

// --- /deploy [task_id] ---
async function handleDeploy(chatId: number, taskIdPrefix: string) {
  if (!taskIdPrefix) { await sendMessage(chatId, "Usage: `/deploy abc12345`"); return; }
  const supabase = await createServiceClient();

  const { data: tasks } = await supabase.from("code_tasks").select("id, prompt, branch, status, files_changed").ilike("id", `${taskIdPrefix}%`).limit(1);
  if (!tasks?.length) { await sendMessage(chatId, "No task found with that ID."); return; }
  const task = tasks[0];

  if (task.status !== "preview-ready") {
    await sendMessage(chatId, `Task status is \`${task.status}\` — can only deploy \`preview-ready\` tasks.`);
    return;
  }
  if (!task.branch) { await sendMessage(chatId, "Task has no branch to deploy."); return; }

  await sendMessage(chatId, `🚀 Deploying \`${task.branch}\` to production...`);

  try {
    const commitTitle = `telegram: ${(task.prompt as string).slice(0, 60)}`;
    const pr = await createPR(task.branch, commitTitle, `From Telegram /code:\n\n${task.prompt}\n\nFiles changed: ${(task.files_changed as string[])?.join(", ") || "none"}`);
    await mergePR(pr.number, commitTitle);
    await deleteBranch(task.branch);

    await supabase.from("code_tasks").update({ status: "deploying", pr_number: pr.number }).eq("id", task.id);
    await sendMessage(chatId, `✅ *Merged PR #${pr.number}*\n\nVercel will build from main in ~60s. You'll get a notification when production is live.`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    await sendMessage(chatId, `❌ Deploy failed: ${msg}`);
  }
}

// --- /rollback ---
async function handleRollback(chatId: number, confirm: boolean) {
  try {
    const deployments = await getRecentProductionDeployments(3);
    if (deployments.length < 2) { await sendMessage(chatId, "Not enough production deployments to rollback."); return; }

    const current = deployments[0];
    const previous = deployments[1];
    const prevDate = new Date(previous.created).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    const prevCommit = previous.meta?.githubCommitMessage?.slice(0, 60) || "unknown";

    if (!confirm) {
      await sendMessage(chatId, `⏮ *Rollback available*\n\n*Current:* \`${current.url}\`\n*Previous:* \`${previous.url}\` (${prevDate})\n📝 ${prevCommit}\n\nSend \`/rollback confirm\` to execute.`);
      return;
    }

    await sendMessage(chatId, "⏮ Rolling back...");
    await promoteDeployment(previous.uid);
    await sendMessage(chatId, `✅ *Rolled back to* \`${previous.url}\`\n📝 ${prevCommit}\n⏰ ${prevDate}\n\nInvestigate the issue, then deploy a fix.`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    await sendMessage(chatId, `❌ Rollback failed: ${msg}`);
  }
}

// ===================== MAIN ROUTER =====================

export async function POST(request: NextRequest) {
  const secretToken = request.headers.get("x-telegram-bot-api-secret-token");
  if (process.env.CRON_SECRET && secretToken !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const update = await request.json();
    const message = update.message;
    if (!message?.text) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text.trim();

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
      await handleCountyBreakdown(chatId, text.split(" ").slice(1).join(" ").trim() || undefined);
    } else if (text.startsWith("/code ")) {
      await handleCode(chatId, text.slice(6).trim());
    } else if (text.startsWith("/deploy ")) {
      await handleDeploy(chatId, text.slice(8).trim());
    } else if (text === "/rollback") {
      await handleRollback(chatId, false);
    } else if (text === "/rollback confirm") {
      await handleRollback(chatId, true);
    } else if (text.startsWith("/cancel")) {
      const id = text.split(" ").slice(1).join(" ").trim();
      await handleCancel(chatId, id || undefined);
    } else if (text.startsWith("/send ")) {
      await handleSend(chatId, text.split(" ").slice(1).join(" ").trim());
    } else if (text.startsWith("/outreach")) {
      await handleOutreach(chatId, text.split(" ").slice(1).join(" ").trim());
    } else if (text === "/pipeline" || text === "/funnel") {
      await handlePipeline(chatId);
    } else if (text.startsWith("/linkedin")) {
      await handleLinkedIn(chatId, text.split(" ").slice(1).join(" ").trim() || undefined);
    } else if (text.startsWith("/lookup ") || text.startsWith("/home ")) {
      await handleLookup(chatId, text.split(" ").slice(1).join(" ").trim());
    } else if (text.startsWith("/search ") || text.startsWith("/chwilio ")) {
      await handleSearch(chatId, text.split(" ").slice(1).join(" ").trim());
    } else if (text.startsWith("/data ") || text.startsWith("/sql ")) {
      await handleData(chatId, text.split(" ").slice(1).join(" ").trim());
    } else if (text === "/help" || text === "/start") {
      await sendMessage(chatId, `🏴󠁧󠁢󠁷󠁬󠁳󠁿 *gofal.wales AIOS*\n\n📊 *Dashboard*\n/briefing — AI morning briefing\n/stats — Platform numbers\n\n🔍 *Explore*\n/county — All counties breakdown\n/county Cardiff — Specific county\n/search nursing Gwynedd — Search homes\n/lookup Bryn Mawr — Full care home profile\n/data how many nursing homes? — AI queries DB\n\n📧 *Outreach*\n/send Cardiff — Generate + send outreach email\n/outreach Cardiff — Preview without sending\n/pipeline — View outreach funnel\n\n📣 *Content*\n/linkedin — Generate a LinkedIn post\n\n🛠 *Code & Deploy*\n/code [prompt] — Run Claude Code\n/deploy [task\\_id] — Ship preview to production\n/cancel [task\\_id] — Cancel task + delete branch\n/rollback — Rollback production\n\n💬 *Chat*\n/ask [anything] — or just type freely\n\n_Bore da, Nathan!_`);
    } else if (text.startsWith("/ask ")) {
      await handleAsk(chatId, text.slice(5));
    } else if (text.startsWith("/")) {
      await sendMessage(chatId, "Unknown command. Try /help");
    } else {
      await handleAsk(chatId, text);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Telegram webhook error:", msg);
    return NextResponse.json({ ok: true });
  }
}
