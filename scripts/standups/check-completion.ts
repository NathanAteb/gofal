/**
 * DOD Completion Checker
 * Reads DEFINITION_OF_DONE.md and counts checked vs unchecked items.
 *
 * Usage: npx tsx scripts/standups/check-completion.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const dodPath = resolve(__dirname, "../../DEFINITION_OF_DONE.md");
const content = readFileSync(dodPath, "utf-8");

const lines = content.split("\n");
let checked = 0;
let unchecked = 0;
const uncheckedItems: string[] = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith("- [x]") || trimmed.startsWith("- [X]")) {
    checked++;
  } else if (trimmed.startsWith("- [ ]")) {
    unchecked++;
    uncheckedItems.push(trimmed.replace("- [ ] ", "").trim());
  }
}

const total = checked + unchecked;
const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

console.log("=".repeat(60));
console.log("  gofal.wales — Definition of Done Status");
console.log("=".repeat(60));
console.log(`  Completed:  ${checked}/${total} (${pct}%)`);
console.log(`  Remaining:  ${unchecked}`);
console.log("=".repeat(60));

if (uncheckedItems.length > 0) {
  console.log("\nUnchecked items:");
  uncheckedItems.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item}`);
  });
}

if (pct === 100) {
  console.log("\n🎉 ALL ITEMS COMPLETE!");
}
