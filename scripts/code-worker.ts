#!/usr/bin/env npx tsx
/**
 * Code Worker — runs on Mac Mini, polls Supabase for prompts,
 * executes them via Claude Code CLI, pushes to a preview branch.
 *
 * Usage:
 *   npx tsx scripts/code-worker.ts
 *
 * Keep alive with pm2:
 *   pm2 start scripts/code-worker.ts --interpreter "npx" --interpreter-args "tsx"
 */

import { createClient } from "@supabase/supabase-js";
import { execSync, spawn } from "child_process";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const PROJECT_DIR = process.env.PROJECT_DIR || process.cwd();
const POLL_INTERVAL = 3000;

if (!SUPABASE_URL || !SUPABASE_KEY) { console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
if (!TELEGRAM_TOKEN) { console.error("Missing TELEGRAM_BOT_TOKEN"); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function sendTelegram(chatId: string, text: string) {
  const chunks = splitMessage(text, 4000);
  for (const chunk of chunks) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: chunk, parse_mode: "Markdown" }),
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

function exec(cmd: string): string {
  return execSync(cmd, { cwd: PROJECT_DIR, encoding: "utf-8", timeout: 60000 }).trim();
}

async function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("claude", ["-p", prompt, "--output-format", "text", "--max-turns", "20"], {
      cwd: PROJECT_DIR,
      env: { ...process.env, CLAUDE_CODE_ENTRYPOINT: "cli" },
      timeout: 300000,
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });

    proc.on("close", (code) => {
      if (code !== 0 && !stdout) reject(new Error(stderr || `Claude exited with code ${code}`));
      else resolve(stdout || stderr);
    });
    proc.on("error", reject);
  });
}

async function processTask(task: { id: string; prompt: string; telegram_chat_id: string }) {
  const shortId = task.id.slice(0, 8);
  const branch = `telegram/${shortId}`;

  console.log(`\n⚡ Task ${shortId}: "${task.prompt.slice(0, 80)}..."`);

  await supabase.from("code_tasks").update({ status: "running", started_at: new Date().toISOString(), branch }).eq("id", task.id);
  await sendTelegram(task.telegram_chat_id, `⚡ *Running Claude Code...*\n\`${task.prompt.slice(0, 100)}\`\nBranch: \`${branch}\``);

  try {
    // Ensure clean state and create branch from main
    exec("git stash --include-untracked 2>/dev/null || true");
    exec("git checkout main");
    exec("git pull origin main");
    exec(`git checkout -b ${branch}`);

    // Run Claude
    const output = await runClaude(task.prompt);

    // Check for cancellation
    const { data: check } = await supabase.from("code_tasks").select("status").eq("id", task.id).single();
    if (check?.status === "cancelled") {
      exec("git checkout main");
      exec(`git branch -D ${branch} 2>/dev/null || true`);
      console.log(`🛑 Task ${shortId} was cancelled.`);
      return;
    }

    // Get changed files
    let filesChanged: string[] = [];
    try {
      const diff = exec("git diff --name-only");
      const untracked = exec("git ls-files --others --exclude-standard");
      const all = [diff, untracked].filter(Boolean).join("\n");
      if (all) filesChanged = all.split("\n").filter(Boolean);
    } catch { /* no changes */ }

    if (filesChanged.length === 0) {
      await supabase.from("code_tasks").update({ status: "done", result: output.slice(-10000), files_changed: [], completed_at: new Date().toISOString() }).eq("id", task.id);
      exec("git checkout main");
      exec(`git branch -D ${branch} 2>/dev/null || true`);
      await sendTelegram(task.telegram_chat_id, `✅ *Done — no files changed*\n\n\`\`\`\n${output.slice(-2000)}\n\`\`\``);
      return;
    }

    // Typecheck + lint before committing
    try {
      exec("npx tsc --noEmit");
      exec("npx eslint " + filesChanged.filter(f => f.endsWith(".ts") || f.endsWith(".tsx")).join(" ") + " --max-warnings 0 2>/dev/null || true");
    } catch (e) {
      const err = e instanceof Error ? e.message : "typecheck failed";
      await supabase.from("code_tasks").update({ status: "error", result: `Typecheck failed:\n${err}`, completed_at: new Date().toISOString() }).eq("id", task.id);
      exec("git checkout -- . 2>/dev/null || true");
      exec("git clean -fd 2>/dev/null || true");
      exec("git checkout main");
      exec(`git branch -D ${branch} 2>/dev/null || true`);
      await sendTelegram(task.telegram_chat_id, `❌ *Typecheck failed — changes discarded*\n\n\`\`\`\n${err.slice(-2000)}\n\`\`\``);
      return;
    }

    // Commit and push
    exec("git add -A");
    const commitMsg = `telegram: ${task.prompt.slice(0, 60)}`;
    exec(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);

    try {
      exec(`git push origin ${branch}`);
    } catch (e) {
      const err = e instanceof Error ? e.message : "push failed";
      await supabase.from("code_tasks").update({ status: "error", result: `Git push failed:\n${err}`, completed_at: new Date().toISOString() }).eq("id", task.id);
      await sendTelegram(task.telegram_chat_id, `❌ *Push failed:* ${err.slice(0, 500)}`);
      exec("git checkout main");
      return;
    }

    // Update task
    await supabase.from("code_tasks").update({
      status: "preview-building",
      result: output.slice(-10000),
      files_changed: filesChanged,
      completed_at: new Date().toISOString(),
    }).eq("id", task.id);

    const filesMsg = filesChanged.map((f) => `• \`${f}\``).join("\n");
    await sendTelegram(task.telegram_chat_id, `🔨 *Pushed to* \`${branch}\`\n\n📁 *Files:*\n${filesMsg}\n\n_Waiting for Vercel preview..._`);

    // Return to main
    exec("git checkout main");

    console.log(`✅ Task ${shortId} pushed. ${filesChanged.length} files changed.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await supabase.from("code_tasks").update({ status: "error", result: message, completed_at: new Date().toISOString() }).eq("id", task.id);
    await sendTelegram(task.telegram_chat_id, `❌ *Error:* ${message.slice(0, 1000)}`);

    // Clean up
    try { exec("git checkout main 2>/dev/null || true"); } catch { /* ok */ }
    console.error(`❌ Task ${shortId} failed:`, message);
  }
}

async function poll() {
  const { data: tasks } = await supabase.from("code_tasks").select("*").eq("status", "pending").order("created_at", { ascending: true }).limit(1);
  if (tasks?.length) await processTask(tasks[0]);
}

console.log(`🤖 Code Worker started`);
console.log(`📂 Project: ${PROJECT_DIR}`);
console.log(`🔄 Polling every ${POLL_INTERVAL / 1000}s...\n`);
setInterval(poll, POLL_INTERVAL);
poll();
