/**
 * CIW Import Script
 *
 * Imports care home data from a CIW CSV export into Supabase.
 *
 * Usage: npx tsx scripts/import-ciw.ts path/to/ciw-data.csv
 *
 * Expected CSV columns:
 * - Service ID, Service Name, Address Line 1, Address Line 2, Town,
 *   County, Postcode, Phone, Email, Website, Service Type,
 *   Operator Name, Registered Manager, Registration Date,
 *   Number of Places, Local Authority,
 *   Rating - Well-being, Rating - Care and Support,
 *   Rating - Leadership and Management, Rating - Environment,
 *   Last Inspection Date, Report URL
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { slugify } from "../src/lib/utils/slugify";
import { normalizeCounty } from "../src/lib/utils/counties";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split("\n").filter(Boolean);
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

  return lines.slice(1).map((line) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row;
  });
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npx tsx scripts/import-ciw.ts path/to/ciw-data.csv");
    process.exit(1);
  }

  console.log(`Reading ${csvPath}...`);
  const csv = readFileSync(csvPath, "utf-8");
  const rows = parseCSV(csv);
  console.log(`Found ${rows.length} rows`);

  const existingSlugs = new Set<string>();
  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    const serviceId = row["Service ID"];
    if (!serviceId) {
      skipped++;
      continue;
    }

    const county = normalizeCounty(row["County"] || "");
    const countySlug = county?.slug || slugify(row["County"] || "unknown");

    let slug = slugify(`${row["Service Name"]}-${row["Town"]}`);
    if (existingSlugs.has(slug)) {
      let counter = 2;
      while (existingSlugs.has(`${slug}-${counter}`)) counter++;
      slug = `${slug}-${counter}`;
    }
    existingSlugs.add(slug);

    const { error } = await supabase.from("care_homes").upsert(
      {
        ciw_service_id: serviceId,
        name: row["Service Name"],
        address_line_1: row["Address Line 1"] || "",
        address_line_2: row["Address Line 2"] || null,
        town: row["Town"] || "",
        county: countySlug,
        postcode: row["Postcode"] || "",
        phone: row["Phone"] || null,
        email: row["Email"] || null,
        website: row["Website"] || null,
        service_type: row["Service Type"] || "residential",
        operator_name: row["Operator Name"] || null,
        registered_manager: row["Registered Manager"] || null,
        registration_date: row["Registration Date"] || null,
        bed_count: parseInt(row["Number of Places"]) || null,
        local_authority: row["Local Authority"] || null,
        ciw_rating_wellbeing: row["Rating - Well-being"] || null,
        ciw_rating_care_support: row["Rating - Care and Support"] || null,
        ciw_rating_leadership: row["Rating - Leadership and Management"] || null,
        ciw_rating_environment: row["Rating - Environment"] || null,
        ciw_last_inspected: row["Last Inspection Date"] || null,
        ciw_report_url: row["Report URL"] || null,
        slug,
        is_active: true,
      },
      { onConflict: "ciw_service_id" }
    );

    if (error) {
      console.error(`Error importing ${serviceId}: ${error.message}`);
      skipped++;
    } else {
      imported++;
    }

    if (imported % 100 === 0 && imported > 0) {
      console.log(`Imported ${imported}/${rows.length}...`);
    }
  }

  console.log(`\nDone! Imported: ${imported}, Skipped: ${skipped}`);
}

main().catch(console.error);
