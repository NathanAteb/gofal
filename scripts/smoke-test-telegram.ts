#!/usr/bin/env npx tsx
/**
 * Smoke Test — sends synthetic Telegram webhook payloads to the bot
 * and checks response codes.
 *
 * Usage:
 *   npx tsx scripts/smoke-test-telegram.ts [base_url]
 *
 * Default base_url: http://localhost:3000
 */

const BASE_URL = process.argv[2] || "http://localhost:3000";
const CHAT_ID = Number(process.env.TELEGRAM_CHAT_ID || "12345");

interface TestResult {
  command: string;
  status: number;
  ok: boolean;
  ms: number;
}

function makeTelegramPayload(text: string) {
  return {
    update_id: Math.floor(Math.random() * 100000),
    message: {
      message_id: Math.floor(Math.random() * 100000),
      from: { id: CHAT_ID, is_bot: false, first_name: "Test" },
      chat: { id: CHAT_ID, first_name: "Test", type: "private" },
      date: Math.floor(Date.now() / 1000),
      text,
    },
  };
}

async function test(command: string): Promise<TestResult> {
  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/api/telegram/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(makeTelegramPayload(command)),
    });
    return { command, status: res.status, ok: res.ok, ms: Date.now() - start };
  } catch {
    return { command, status: 0, ok: false, ms: Date.now() - start };
  }
}

async function main() {
  console.log(`🧪 Smoke testing Telegram bot at ${BASE_URL}\n`);

  const commands = [
    "/start",
    "/help",
    "/stats",
    "/county",
    "/county Cardiff",
    "/search nursing",
    "/lookup test",
    "/pipeline",
    "/data how many homes?",
    "what is the Active Offer?",
  ];

  const results: TestResult[] = [];

  for (const cmd of commands) {
    process.stdout.write(`  ${cmd.padEnd(30)}`);
    const result = await test(cmd);
    results.push(result);
    const icon = result.ok ? "✅" : "❌";
    console.log(`${icon} ${result.status} (${result.ms}ms)`);
  }

  console.log("\n---");
  const passed = results.filter((r) => r.ok).length;
  console.log(`\n${passed}/${results.length} passed`);

  if (passed < results.length) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
