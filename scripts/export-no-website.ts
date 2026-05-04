/**
 * export-no-website.ts
 *
 * Exports every adult-care service in Wales that has no website on file
 * to a CSV — the gofal claim-listing + Ateb outreach hot list.
 *
 *   npx tsx scripts/export-no-website.ts
 *   npx tsx scripts/export-no-website.ts --care-homes-only
 */
import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const ROOT = resolve(__dirname, "..");
const CARE_HOMES_ONLY = process.argv.includes("--care-homes-only");
const TODAY = new Date().toISOString().slice(0, 10);
const OUT = resolve(
  ROOT,
  "reports",
  `care-services-no-website-${CARE_HOMES_ONLY ? "homes-only-" : ""}${TODAY}.csv`
);

interface Row {
  ciw_service_id: string;
  name: string;
  service_type: string;
  service_sub_type: string | null;
  address_line_1: string;
  address_line_2: string | null;
  town: string;
  postcode: string;
  local_authority: string | null;
  phone: string | null;
  email: string | null;
  main_language: string | null;
  max_places: number | null;
  provider_name: string | null;
  provider_company_number: string | null;
  provider_approved_services: number | null;
  responsible_individual: string | null;
  registered_manager: string | null;
  registration_date: string | null;
  lat: number | null;
  lng: number | null;
}

const COLUMNS: Array<{ key: keyof Row | "site_count_for_provider"; header: string }> = [
  { key: "name", header: "Service name" },
  { key: "service_type", header: "Service type" },
  { key: "service_sub_type", header: "Sub-type" },
  { key: "address_line_1", header: "Address line 1" },
  { key: "address_line_2", header: "Address line 2" },
  { key: "town", header: "Town" },
  { key: "postcode", header: "Postcode" },
  { key: "local_authority", header: "Local authority" },
  { key: "phone", header: "Phone" },
  { key: "email", header: "Email" },
  { key: "max_places", header: "Registered places" },
  { key: "provider_name", header: "Operator (Provider)" },
  { key: "site_count_for_provider", header: "Operator's total sites" },
  { key: "provider_company_number", header: "Company number" },
  { key: "provider_approved_services", header: "CIW approved services (provider)" },
  { key: "responsible_individual", header: "Responsible individual" },
  { key: "registered_manager", header: "Registered manager" },
  { key: "main_language", header: "Operating language" },
  { key: "registration_date", header: "Provider registered" },
  { key: "ciw_service_id", header: "CIW service URN" },
  { key: "lat", header: "Latitude" },
  { key: "lng", header: "Longitude" },
];

function csvCell(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  console.log("=== Export: care services with NO website ===");
  console.log(`Mode: ${CARE_HOMES_ONLY ? "Care homes only" : "Full adult sector"}`);

  const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);

  // First get provider site counts so we can flag independents vs chains in the CSV.
  const providerSites = new Map<string, number>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("care_homes")
      .select("provider_urn")
      .not("provider_urn", "is", null)
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;
    for (const r of data) {
      const u = (r as { provider_urn: string | null }).provider_urn;
      if (u) providerSites.set(u, (providerSites.get(u) ?? 0) + 1);
    }
    if (data.length < 1000) break;
  }

  // Now fetch all rows with no website (paginated past PostgREST's 1000-row cap).
  const rows: (Row & { provider_urn: string | null })[] = [];
  for (let from = 0; ; from += 1000) {
    let q = supabase
      .from("care_homes")
      .select(
        "ciw_service_id,name,service_type,service_sub_type,address_line_1,address_line_2,town,postcode,local_authority,phone,email,main_language,max_places,provider_name,provider_company_number,provider_approved_services,responsible_individual,registered_manager,registration_date,lat,lng,provider_urn"
      )
      .is("website", null)
      .eq("is_active", true)
      .order("local_authority")
      .order("name")
      .range(from, from + 999);

    if (CARE_HOMES_ONLY) q = q.eq("service_type", "Care Home Service");

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;
    rows.push(...(data as unknown as (Row & { provider_urn: string | null })[]));
    if (data.length < 1000) break;
  }

  console.log(`Fetched ${rows.length} services with no website`);

  // Build CSV
  const headerRow = COLUMNS.map((c) => csvCell(c.header)).join(",");
  const lines: string[] = [headerRow];
  for (const r of rows) {
    const siteCount = r.provider_urn ? providerSites.get(r.provider_urn) ?? null : null;
    const cells = COLUMNS.map((c) => {
      if (c.key === "site_count_for_provider") return csvCell(siteCount);
      return csvCell(r[c.key as keyof Row]);
    });
    lines.push(cells.join(","));
  }

  mkdirSync(resolve(ROOT, "reports"), { recursive: true });
  writeFileSync(OUT, lines.join("\n") + "\n", "utf8");

  // Quick breakdown for the console
  const byType: Record<string, number> = {};
  const byLA: Record<string, number> = {};
  const byBracket: Record<string, number> = {};
  for (const r of rows) {
    byType[r.service_type] = (byType[r.service_type] ?? 0) + 1;
    const la = r.local_authority ?? "(unknown)";
    byLA[la] = (byLA[la] ?? 0) + 1;
    const sites = r.provider_urn ? providerSites.get(r.provider_urn) ?? 0 : 0;
    const bracket =
      sites === 1 ? "1 (independent)" : sites <= 3 ? "2-3" : sites <= 9 ? "4-9" : sites <= 24 ? "10-24" : "25+";
    byBracket[bracket] = (byBracket[bracket] ?? 0) + 1;
  }

  console.log(`\nWrote ${OUT}`);
  console.log(`Size: ${(lines.join("\n").length / 1024).toFixed(1)} KB`);

  console.log("\nBy service type:");
  for (const [k, v] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(4)}  ${k}`);
  }
  console.log("\nBy operator portfolio size:");
  for (const [k, v] of Object.entries(byBracket).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(4)}  ${k} sites`);
  }
  console.log("\nTop 10 local authorities:");
  for (const [k, v] of Object.entries(byLA).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`  ${String(v).padStart(4)}  ${k}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
