#!/usr/bin/env npx tsx
/**
 * Code Worker — runs on Mac Mini, polls Supabase for prompts,
 * executes them via Claude Code CLI, posts results to Telegram.
 *
 * Usage:
 *   npx tsx scripts/code-worker.ts
 *
 * Runs forever. Use pm2 or launchd to keep it alive:
 *   pm2 start scripts/code-worker.ts --interpreter "npx" --interpreter-args "tsx"
 */

import { createClient } from "@supabase/supabase-js";
import { execSync, spawn } from "child_process";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const PROJECT_DIR = process.env.PROJECT_DIR || process.cwd();
const POLL_INTERVAL = 3000; // 3 seconds

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!TELEGRAM_TOKEN) {
  console.error("Missing TELEGRAM_BOT_TOKEN");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function sendTelegram(chatId: string, text: string) {
  const chunks = splitMessage(text, 4000);
  for (const chunk of chunks) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: chunk,
        parse_mode: "Markdown",
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
    let splitAt = remaining.lastIndexOf("\n", maxLen);
    if (splitAt === -1) splitAt = maxLen;
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }
  return chunks;
}

async function runClaude(prompt: string): Promise<{ output: string; filesChanged: string[] }> {
  return new Promise((resolve, reject) => {
    const args = [
      "-p", prompt,
      "--output-format", "text",
      "--max-turns", "20",
    ];

    const proc = spawn("claude", args, {
      cwd: PROJECT_DIR,
      env: { ...process.env, CLAUDE_CODE_ENTRYPOINT: "cli" },
      timeout: 300000, // 5 min max
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      // Get changed files from git
      let filesChanged: string[] = [];
      try {
        const diff = execSync("git diff --name-only HEAD", {
          cwd: PROJECT_DIR,
          encoding: "utf-8",
        }).trim();
        if (diff) filesChanged = diff.split("\n");
      } catch {
        // no changes
      }

      if (code !== 0 && !stdout) {
        reject(new Error(stderr || `Claude exited with code ${code}`));
      } else {
        resolve({ output: stdout || stderr, filesChanged });
      }
    });

    proc.on("error", (err) => {
      reject(err);
    });
  });
}

async function processTask(task: { id: string; prompt: string; telegram_chat_id: string }) {
  console.log(`\n⚡ Processing task ${task.id}: "${task.prompt.slice(0, 80)}..."`);

  // Mark as running
  await supabase
    .from("code_tasks")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("id", task.id);

  await sendTelegram(task.telegram_chat_id, `⚡ *Running Claude Code...*\n\`${task.prompt.slice(0, 100)}\``);

  try {
    const { output, filesChanged } = await runClaude(task.prompt);

    // Truncate output for DB storage (keep last 10000 chars)
    const truncatedOutput = output.length > 10000
      ? "...(truncated)\n" + output.slice(-10000)
      : output;

    // Mark as done
    await supabase
      .from("code_tasks")
      .update({
        status: "done",
        result: truncatedOutput,
        files_changed: filesChanged,
        completed_at: new Date().toISOString(),
      })
      .eq("id", task.id);

    // Format result for Telegram
    const filesMsg = filesChanged.length
      ? `\n\n📁 *Files changed:*\n${filesChanged.map((f) => `• \`${f}\``).join("\n")}`
      : "\n\n_No files changed._";

    // Send summary (truncate for Telegram)
    const summaryLength = 3000 - filesMsg.length;
    const summary = output.length > summaryLength
      ? output.slice(-summaryLength) + "\n...(truncated)"
      : output;

    await sendTelegram(
      task.telegram_chat_id,
      `✅ *Done*${filesMsg}\n\n\`\`\`\n${summary}\n\`\`\``
    );

    console.log(`✅ Task ${task.id} done. ${filesChanged.length} files changed.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    await supabase
      .from("code_tasks")
      .update({
        status: "error",
        result: message,
        completed_at: new Date().toISOString(),
      })
      .eq("id", task.id);

    await sendTelegram(task.telegram_chat_id, `❌ *Error:* ${message}`);
    console.error(`❌ Task ${task.id} failed:`, message);
  }
}

async function poll() {
  // Fetch oldest pending task
  const { data: tasks } = await supabase
    .from("code_tasks")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(1);

  if (tasks?.length) {
    await processTask(tasks[0]);
  }
}

// Main loop
console.log(`🤖 Code Worker started`);
console.log(`📂 Project: ${PROJECT_DIR}`);
console.log(`🔄 Polling every ${POLL_INTERVAL / 1000}s...\n`);

setInterval(poll, POLL_INTERVAL);
poll(); // Run immediately on start
