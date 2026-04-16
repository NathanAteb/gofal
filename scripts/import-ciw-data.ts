/**
 * import-ciw-data.ts
 *
 * Imports real CIW (Care Inspectorate Wales) care home data
 * from the official CIW digital register CSV export.
 *
 * Source: https://digital.careinspectorate.wales/api/DataExport
 * License: OGL v3.0 (Open Government Licence)
 *
 * Usage:
 *   npx tsx scripts/import-ciw-data.ts              # Full import
 *   npx tsx scripts/import-ciw-data.ts --dry-run    # Preview only
 *   npx tsx scripts/import-ciw-data.ts --adults-only # Skip children's homes
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CSV_PATH = path.join(__dirname, "../data/ciw-export.csv");
const DRY_RUN = process.argv.includes("--dry-run");

// Map CIW Local Authority names to our county slugs
const LA_TO_COUNTY_SLUG: Record<string, string> = {
  "Isle of Anglesey": "ynys-mon",
  "Blaenau Gwent": "blaenau-gwent",
  "Bridgend": "pen-y-bont-ar-ogwr",
  "Caerphilly": "caerffili",
  "Cardiff": "caerdydd",
  "Carmarthenshire": "sir-gaerfyrddin",
  "Ceredigion": "ceredigion",
  "Conwy": "conwy",
  "Denbighshire": "sir-ddinbych",
  "Flintshire": "sir-y-fflint",
  "Gwynedd": "gwynedd",
  "Merthyr Tydfil": "merthyr-tudful",
  "Monmouthshire": "sir-fynwy",
  "Neath Port Talbot": "castell-nedd-port-talbot",
  "Newport": "casnewydd",
  "Pembrokeshire": "sir-benfro",
  "Powys": "powys",
  "Rhondda Cynon Taf": "rhondda-cynon-taf",
  "Swansea": "abertawe",
  "Torfaen": "torfaen",
  "Vale of Glamorgan": "bro-morgannwg",
  "Wrexham": "wrecsam",
};

// Map CIW sub-types to our service_type
function mapServiceType(subType: string): string {
  if (subType.includes("With Nursing")) return "nursing";
  if (subType.includes("Without Nursing")) return "residential";
  if (subType.includes("Children")) return "residential"; // children's care homes
  return "residential";
}

// Parse CIW ratings string: "Well-being: Good; Care and Support: Good; ..."
function parseRatings(ratingsStr: string) {
  const ratings: Record<string, string | null> = {
    wellbeing: null,
    care_support: null,
    leadership: null,
    environment: null,
  };
  if (!ratingsStr?.trim()) return ratings;

  const parts = ratingsStr.split(";").map((s) => s.trim());
  for (const part of parts) {
    const [theme, rating] = part.split(":").map((s) => s.trim());
    if (!theme || !rating) continue;
    const r = rating.charAt(0).toUpperCase() + rating.slice(1).toLowerCase();
    if (theme.includes("Well-being")) ratings.wellbeing = r;
    else if (theme.includes("Care and Support")) ratings.care_support = r;
    else if (theme.includes("Leadership")) ratings.leadership = r;
    else if (theme.includes("Environment")) ratings.environment = r;
  }
  return ratings;
}

// Generate a URL-safe slug
function slugify(name: string, town: string): string {
  const raw = `${name}-${town}`
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return raw.slice(0, 80);
}

// Derive Active Offer level from language field
function deriveActiveOfferLevel(language: string): number {
  const lang = language?.toLowerCase() || "";
  if (lang === "welsh" || lang === "cymraeg") return 3;
  if (lang.includes("bilingual") || lang.includes("dwyieithog")) return 2;
  if (lang.includes("welsh") || lang.includes("cymraeg")) return 1;
  return 0;
}

// Parse UK date dd/mm/yyyy to ISO
function parseDate(dateStr: string): string | null {
  if (!dateStr?.trim()) return null;
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
}

async function main() {
  console.log("=== CIW Data Import ===");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE IMPORT"}`);
  console.log();

  // Read CSV
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`CSV not found at ${CSV_PATH}`);
    console.error("Run: curl the CIW export first (see script comments)");
    process.exit(1);
  }

  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });

  // Filter to adult care home services only (skip children's homes)
  const careHomes = records.filter((r: any) => {
    if (r["Service Type"] !== "Care Home Service") return false;
    const subType = r["Service Sub-Type"] || "";
    // Include: Adults Without Nursing, Adults With Nursing, Adults and Children
    // Exclude: Childrens Home (these are not care homes for elderly)
    if (subType.includes("Children") && !subType.includes("Adults")) return false;
    return true;
  });

  console.log(`Total CIW records: ${records.length}`);
  console.log(`Care Home Services: ${careHomes.length}`);
  console.log();

  if (DRY_RUN) {
    // Show sample
    console.log("Sample records (first 5):");
    for (const h of careHomes.slice(0, 5)) {
      const ratings = parseRatings(h["Service Ratings"]);
      console.log(`  ${h["Service Name"]} — ${h["Service Town/City"]}, ${h["Service Postcode"]}`);
      console.log(`    URN: ${h["Service URN"]}, Phone: ${h["Primary telephone number"]}`);
      console.log(`    Email: ${h["Primary email address"]}, Web: ${h["Website"]}`);
      console.log(`    Places: ${h["Maximum No. of Places"]}, Type: ${h["Service Sub-Type"]}`);
      console.log(`    Ratings: ${JSON.stringify(ratings)}`);
      console.log(`    Provider: ${h["Provider Name"]}`);
      console.log();
    }

    // Stats
    const withRatings = careHomes.filter((h: any) => h["Service Ratings"]?.trim()).length;
    const withEmail = careHomes.filter((h: any) => h["Primary email address"]?.trim()).length;
    const withWebsite = careHomes.filter((h: any) => h["Website"]?.trim()).length;
    const withPhone = careHomes.filter((h: any) => h["Primary telephone number"]?.trim()).length;
    console.log("=== Completeness ===");
    console.log(`  With ratings: ${withRatings}/${careHomes.length} (${Math.round(withRatings/careHomes.length*100)}%)`);
    console.log(`  With email: ${withEmail}/${careHomes.length} (${Math.round(withEmail/careHomes.length*100)}%)`);
    console.log(`  With website: ${withWebsite}/${careHomes.length} (${Math.round(withWebsite/careHomes.length*100)}%)`);
    console.log(`  With phone: ${withPhone}/${careHomes.length} (${Math.round(withPhone/careHomes.length*100)}%)`);
    console.log();
    console.log("Dry run complete. Run without --dry-run to import.");
    return;
  }

  // Live import
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Clear existing seed data
  console.log("Clearing existing seed data...");
  const { error: deleteProfilesErr } = await supabase.from("care_home_profiles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteProfilesErr) console.error("Error clearing profiles:", deleteProfilesErr.message);
  const { error: deleteHomesErr } = await supabase.from("care_homes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteHomesErr) console.error("Error clearing homes:", deleteHomesErr.message);
  console.log("Seed data cleared.");

  let imported = 0;
  let skipped = 0;
  const seenSlugs = new Set<string>();

  for (const row of careHomes) {
    const name = row["Service Name"]?.trim();
    const town = row["Service Town/City"]?.trim();
    if (!name || !town) { skipped++; continue; }

    let slug = slugify(name, town);
    // Ensure unique slug
    if (seenSlugs.has(slug)) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }
    seenSlugs.add(slug);

    const countySlug = LA_TO_COUNTY_SLUG[row["Local Authority"]?.trim()] || "";
    if (!countySlug) { skipped++; continue; }

    const ratings = parseRatings(row["Service Ratings"]);
    const activeOfferLevel = deriveActiveOfferLevel(row["Main Operating Language of Service"]);
    const serviceType = mapServiceType(row["Service Sub-Type"] || "");

    const careHome = {
      ciw_service_id: row["Service URN"]?.trim() || "",
      name,
      name_cy: null as string | null, // Real Welsh names need translation
      address_line_1: row["Service Address Line 1"]?.trim() || name,
      address_line_2: row["Service Address Line 2"]?.trim() || null,
      town,
      county: countySlug,
      postcode: row["Service Postcode"]?.trim() || "",
      phone: row["Primary telephone number"]?.trim() || null,
      email: row["Primary email address"]?.trim() || null,
      website: row["Website"]?.trim() || null,
      lat: null as number | null, // Will be geocoded in step 4
      lng: null as number | null,
      service_type: serviceType,
      operator_name: row["Provider Name"]?.trim() || null,
      registered_manager: row["Registered Person Names"]?.trim() || null,
      registration_date: parseDate(row["Provider Registration Date"]) || null,
      bed_count: parseInt(row["Maximum No. of Places"]) || null,
      local_authority: row["Local Authority"]?.trim() || null,
      ciw_rating_wellbeing: ratings.wellbeing,
      ciw_rating_care_support: ratings.care_support,
      ciw_rating_leadership: ratings.leadership,
      ciw_rating_environment: ratings.environment,
      ciw_last_inspected: null as string | null, // Not in CSV export
      ciw_report_url: null as string | null, // Will construct from URN
      active_offer_level: activeOfferLevel,
      active_offer_verified: false,
      is_claimed: false,
      is_active: true,
      is_featured: false,
      listing_tier: "free" as const,
      slug,
      enrichment_status: "pending",
    };

    // Construct CIW report URL from URN
    if (careHome.ciw_service_id) {
      careHome.ciw_report_url = `https://digital.careinspectorate.wales/service/${careHome.ciw_service_id}`;
    }

    const { data: insertedHome, error: homeErr } = await supabase
      .from("care_homes")
      .insert(careHome)
      .select("id")
      .single();

    if (homeErr) {
      console.error(`  Error inserting ${name}: ${homeErr.message}`);
      skipped++;
      continue;
    }

    // Create empty profile (will be enriched later)
    const { error: profileErr } = await supabase
      .from("care_home_profiles")
      .insert({
        care_home_id: insertedHome.id,
        description: null,
        description_cy: null,
        photos: [],
        video_url: null,
        services: [serviceType, "personal care"].filter(Boolean),
        amenities: [],
        welsh_language_notes: activeOfferLevel >= 2 ? "Welsh language service available" : null,
        weekly_fee_from: null,
        weekly_fee_to: null,
        accepts_local_authority: true,
      });

    if (profileErr) {
      console.error(`  Error creating profile for ${name}: ${profileErr.message}`);
    }

    imported++;
    if (imported % 100 === 0) {
      console.log(`  Imported ${imported}/${careHomes.length}...`);
    }
  }

  console.log();
  console.log("=== Import Complete ===");
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total in DB: ${imported}`);
}

main().catch(console.error);
