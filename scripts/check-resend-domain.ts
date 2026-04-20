#!/usr/bin/env npx tsx
// Uses Resend API to check gofal.wales domain verification status
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const { data: domains } = await resend.domains.list();
  const domain = domains?.find((d: any) => d.name === "gofal.wales");

  if (!domain) {
    console.error("❌ gofal.wales not found in Resend domains");
    process.exit(1);
  }

  console.log(`Domain: ${domain.name}`);
  console.log(`Status: ${domain.status}`);
  console.log(`Created: ${domain.created_at}`);

  // Check DNS records
  if (domain.records) {
    console.log("\nDNS Records:");
    for (const record of domain.records) {
      const status = record.status === "verified" ? "✅" : "⏳";
      console.log(`  ${status} ${record.type} ${record.name} → ${record.value}`);
    }
  }

  if (domain.status !== "verified") {
    console.error("\n❌ Domain not fully verified");
    process.exit(1);
  }

  console.log("\n✅ All good — gofal.wales is verified on Resend");
}

main().catch((e) => { console.error(e); process.exit(1); });
