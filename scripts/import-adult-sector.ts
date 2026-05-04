/**
 * import-adult-sector.ts
 *
 * Reads data/ciw-export.csv, filters to the adult sector (1,855 rows):
 *   • Care Home Service · Adults With Nursing
 *   • Care Home Service · Adults Without Nursing
 *   • Care Home Service · Adults and Children Without Nursing
 *   • Domiciliary Support Service
 *   • Adult Placement Service
 *
 * Geocodes every unique postcode via postcodes.io (free, no key, batch 100),
 * then upserts into Supabase by ciw_service_id (idempotent).
 *
 *   npx tsx scripts/import-adult-sector.ts
 *   npx tsx scripts/import-adult-sector.ts --dry-run
 */
import { parse } from "csv-parse/sync";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const ROOT = resolve(__dirname, "..");
const CSV_PATH = resolve(ROOT, "data/ciw-export.csv");
const DRY_RUN = process.argv.includes("--dry-run");
const GEOCODE_BATCH = 100;
const UPSERT_BATCH = 200;

type Row = Record<string, string>;

const ADULT_CARE_HOME_SUBTYPES = new Set([
  "Adults With Nursing",
  "Adults Without Nursing",
  "Adults and Children Without Nursing",
]);

function isAdultRow(r: Row): boolean {
  const t = r["Service Type"]?.trim() ?? "";
  const s = r["Service Sub-Type"]?.trim() ?? "";
  if (t === "Care Home Service") return ADULT_CARE_HOME_SUBTYPES.has(s);
  if (t === "Domiciliary Support Service") return true;
  if (t === "Adult Placement Service") return true;
  return false;
}

function nullable(v: string | undefined | null): string | null {
  if (v == null) return null;
  const trimmed = String(v).trim();
  // CIW exports the literal string "None" for service_sub_type on domiciliary
  // and adult placement rows — treat as null so DB queries can use IS NULL.
  if (trimmed === "" || trimmed === "None") return null;
  return trimmed;
}

function num(v: string | undefined): number | null {
  const t = nullable(v);
  if (t == null) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function isoDateFromUk(v: string | undefined): string | null {
  const t = nullable(v);
  if (!t) return null;
  // CIW uses dd/mm/yyyy, sometimes with " HH:MM" appended
  const m = t.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
  if (!m) return null;
  const [, d, mo, y, hh, mm] = m;
  return hh ? `${y}-${mo}-${d}T${hh}:${mm}:00Z` : `${y}-${mo}-${d}`;
}

function slugify(name: string, urn: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
  const suffix = urn.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(-6);
  return base ? `${base}-${suffix}` : suffix;
}

function normalisePostcode(p: string): string {
  return p.toUpperCase().replace(/\s+/g, "");
}

function deriveLanguage(raw: string | null): string | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes("welsh") && lower.includes("english")) return "Bilingual";
  if (lower.includes("welsh")) return "Welsh";
  if (lower.includes("english")) return "English";
  return raw;
}

interface GeoHit {
  lat: number;
  lng: number;
  adminDistrict: string | null;
}

async function bulkGeocode(postcodes: string[]): Promise<Map<string, GeoHit>> {
  const out = new Map<string, GeoHit>();
  if (postcodes.length === 0) return out;
  const res = await fetch("https://api.postcodes.io/postcodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postcodes }),
  });
  if (!res.ok) {
    console.error(`  postcodes.io error ${res.status}`);
    return out;
  }
  const data = (await res.json()) as {
    result: Array<{
      query: string;
      result: { latitude: number; longitude: number; admin_district?: string | null } | null;
    }>;
  };
  for (const item of data.result ?? []) {
    if (item.result) {
      out.set(normalisePostcode(item.query), {
        lat: item.result.latitude,
        lng: item.result.longitude,
        adminDistrict: item.result.admin_district ?? null,
      });
    }
  }
  return out;
}

interface RowToInsert {
  ciw_service_id: string;
  name: string;
  address_line_1: string;
  address_line_2: string | null;
  town: string;
  county: string;
  postcode: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  lat: number | null;
  lng: number | null;
  service_type: string;
  service_sub_type: string | null;
  operator_name: string | null;
  registered_manager: string | null;
  responsible_individual: string | null;
  provider_urn: string | null;
  provider_name: string | null;
  provider_company_number: string | null;
  provider_approved_services: number | null;
  max_places: number | null;
  bed_count: number | null;
  registration_date: string | null;
  ciw_last_updated: string | null;
  local_authority: string;
  main_language: string | null;
  is_active: boolean;
  slug: string;
}

async function main() {
  console.log("=== Import adult-sector services ===");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE WRITE"}`);

  const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);

  const csv = readFileSync(CSV_PATH, "utf8");
  const rows = parse(csv, { columns: true, skip_empty_lines: true, relax_quotes: true }) as Row[];
  const adult = rows.filter(isAdultRow);
  console.log(`Filtered: ${adult.length} adult-sector rows from ${rows.length} total`);

  // Drop rows where we have no postcode AND no address — we can't map or persist them.
  // (CIW intentionally redacts ~19 children's hospital sites; for domiciliary, Local Authority
  // is left blank in the CIW export but postcode is present, so we recover LA via postcodes.io.)
  const usable: Row[] = [];
  let dropped = 0;
  for (const r of adult) {
    const urn = nullable(r["Service URN"]);
    const name = nullable(r["Service Name"]);
    const town = nullable(r["Service Town/City"]);
    const postcode = nullable(r["Service Postcode"]);
    if (urn && name && town && postcode) {
      usable.push(r);
    } else {
      dropped++;
    }
  }
  if (dropped > 0) console.log(`Skipped ${dropped} rows with no mappable address (postcode missing)`);

  // Geocode unique postcodes
  const uniquePostcodes = Array.from(
    new Set(usable.map((r) => nullable(r["Service Postcode"])!).filter(Boolean))
  );
  console.log(`Unique postcodes to geocode: ${uniquePostcodes.length}`);

  const geo = new Map<string, GeoHit>();
  for (let i = 0; i < uniquePostcodes.length; i += GEOCODE_BATCH) {
    const batch = uniquePostcodes.slice(i, i + GEOCODE_BATCH);
    const res = await bulkGeocode(batch);
    res.forEach((v, k) => geo.set(k, v));
    process.stdout.write(`  Geocoded ${Math.min(i + GEOCODE_BATCH, uniquePostcodes.length)}/${uniquePostcodes.length}\r`);
    if (i + GEOCODE_BATCH < uniquePostcodes.length) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  console.log(`\n  Geocode hit rate: ${geo.size}/${uniquePostcodes.length}`);

  // Build payload, deduplicating slugs
  const usedSlugs = new Set<string>();
  const payload: RowToInsert[] = usable.map((r) => {
    const urn = nullable(r["Service URN"])!;
    const name = nullable(r["Service Name"])!;
    let slug = slugify(name, urn);
    while (usedSlugs.has(slug)) slug = `${slug}-x`;
    usedSlugs.add(slug);

    const postcode = nullable(r["Service Postcode"])!;
    const coords = geo.get(normalisePostcode(postcode)) ?? null;
    const language = deriveLanguage(nullable(r["Main Operating Language of Service"]));
    const maxPlaces = num(r["Maximum No. of Places"]);
    const serviceType = nullable(r["Service Type"])!;
    const subType = nullable(r["Service Sub-Type"]);
    // Local Authority is blank for all 790 domiciliary rows in the CIW export — recover it
    // from postcodes.io's admin_district. For care homes the CSV value is correct.
    const localAuthority =
      nullable(r["Local Authority"]) ?? coords?.adminDistrict ?? "Wales";
    // Address Line 1 is blank for the redacted children's-mixed sites, but we already filtered
    // those when postcode is also missing. Fall back to Provider Name as a last resort.
    const addressLine1 =
      nullable(r["Service Address Line 1"]) ??
      nullable(r["Provider Name"]) ??
      nullable(r["Service Town/City"])!;

    return {
      ciw_service_id: urn,
      name,
      address_line_1: addressLine1,
      address_line_2:
        nullable(r["Service Address Line 2"]) ?? nullable(r["Service Address Line 3"]) ?? null,
      town: nullable(r["Service Town/City"])!,
      county: localAuthority,
      postcode,
      phone: nullable(r["Primary telephone number"]),
      email: nullable(r["Primary email address"]),
      website: nullable(r["Website"]),
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      service_type: serviceType,
      service_sub_type: subType,
      operator_name: nullable(r["Provider Name"]),
      registered_manager: nullable(r["Registered Person Names"]),
      responsible_individual: nullable(r["Responsible Individual Names"]),
      provider_urn: nullable(r["Provider URN"]),
      provider_name: nullable(r["Provider Name"]),
      provider_company_number: nullable(r["Company Number"]),
      provider_approved_services: num(r["Provider No. of Approved Services"]),
      max_places: maxPlaces,
      bed_count: serviceType === "Care Home Service" ? maxPlaces : null,
      registration_date: isoDateFromUk(r["Provider Registration Date"]),
      ciw_last_updated: isoDateFromUk(r["Last Updated On"]),
      local_authority: localAuthority,
      main_language: language,
      is_active: true,
      slug,
    };
  });

  console.log(`Prepared ${payload.length} rows`);
  console.log(`  with coords: ${payload.filter((p) => p.lat != null).length}`);

  const breakdown: Record<string, number> = {};
  for (const r of payload) {
    const k = r.service_sub_type ? `${r.service_type} · ${r.service_sub_type}` : r.service_type;
    breakdown[k] = (breakdown[k] ?? 0) + 1;
  }
  console.log("Breakdown:");
  for (const [k, v] of Object.entries(breakdown).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(5)}  ${k}`);
  }

  if (DRY_RUN) {
    console.log("\nDRY RUN — no writes performed.");
    return;
  }

  // Upsert in batches by ciw_service_id
  let inserted = 0;
  let failed = 0;
  for (let i = 0; i < payload.length; i += UPSERT_BATCH) {
    const batch = payload.slice(i, i + UPSERT_BATCH);
    const { error } = await supabase
      .from("care_homes")
      .upsert(batch, { onConflict: "ciw_service_id", ignoreDuplicates: false });
    if (error) {
      console.error(`  Batch ${Math.floor(i / UPSERT_BATCH) + 1} failed: ${error.message}`);
      failed += batch.length;
    } else {
      inserted += batch.length;
    }
    process.stdout.write(`  Upserted ${Math.min(i + UPSERT_BATCH, payload.length)}/${payload.length}\r`);
  }
  console.log(`\n=== Done ===`);
  console.log(`  Upserted: ${inserted}`);
  console.log(`  Failed: ${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
