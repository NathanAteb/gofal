/**
 * generate-descriptions.ts
 *
 * Generates bilingual (Welsh + English) descriptions for care homes
 * that don't have descriptions yet, using their real CIW data.
 *
 * Usage:
 *   npx tsx scripts/generate-descriptions.ts
 *   npx tsx scripts/generate-descriptions.ts --dry-run
 *   npx tsx scripts/generate-descriptions.ts --limit 50
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DRY_RUN = process.argv.includes("--dry-run");
const LIMIT = parseInt(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] || "0") || 9999;

const SERVICE_TYPE_EN: Record<string, string> = {
  residential: "residential",
  nursing: "nursing",
  dementia: "dementia",
  respite: "respite",
};

const SERVICE_TYPE_CY: Record<string, string> = {
  residential: "preswyl",
  nursing: "nyrsio",
  dementia: "dementia",
  respite: "seibiant",
};

const RATING_CY: Record<string, string> = {
  Excellent: "Rhagorol",
  Good: "Da",
  Adequate: "Digonol",
  Poor: "Gwael",
};

function generateEnglishDescription(home: any): string {
  const parts: string[] = [];

  // Opening
  const typeLabel = SERVICE_TYPE_EN[home.service_type] || "care";
  parts.push(`${home.name} is a ${typeLabel} care home in ${home.town}, ${home.local_authority || home.county}.`);

  // Bed count
  if (home.bed_count) {
    parts.push(`The home has ${home.bed_count} registered places.`);
  }

  // CIW ratings
  const rating = home.ciw_rating_care_support;
  if (rating) {
    parts.push(`It received a "${rating}" rating for care and support from Care Inspectorate Wales (CIW).`);
  }

  // Welsh language
  if (home.active_offer_level >= 2) {
    parts.push("Welsh language care is available through the Active Offer.");
  } else if (home.active_offer_level === 1) {
    parts.push("Some Welsh language provision is available.");
  }

  // Operator
  if (home.operator_name) {
    parts.push(`The home is operated by ${home.operator_name}.`);
  }

  // CIW note
  parts.push("All information is sourced from the Care Inspectorate Wales register.");

  return parts.join(" ");
}

function generateWelshDescription(home: any): string {
  const parts: string[] = [];

  const typeLabel = SERVICE_TYPE_CY[home.service_type] || "gofal";
  parts.push(`Mae ${home.name} yn gartref gofal ${typeLabel} yn ${home.town}, ${home.local_authority || home.county}.`);

  if (home.bed_count) {
    parts.push(`Mae gan y cartref ${home.bed_count} o leoedd cofrestredig.`);
  }

  const rating = home.ciw_rating_care_support;
  if (rating) {
    const ratingCy = RATING_CY[rating] || rating;
    parts.push(`Cafodd y radd "${ratingCy}" am ofal a chymorth gan Arolygiaeth Gofal Cymru (CIW).`);
  }

  if (home.active_offer_level >= 2) {
    parts.push("Mae gofal Cymraeg ar gael drwy'r Cynnig Rhagweithiol.");
  } else if (home.active_offer_level === 1) {
    parts.push("Mae rhywfaint o ddarpariaeth Gymraeg ar gael.");
  }

  if (home.operator_name) {
    parts.push(`Mae'r cartref yn cael ei redeg gan ${home.operator_name}.`);
  }

  parts.push("Daw'r holl wybodaeth o gofrestr Arolygiaeth Gofal Cymru.");

  return parts.join(" ");
}

async function main() {
  console.log("=== Description Generator ===");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE UPDATE"}`);
  console.log(`Limit: ${LIMIT}`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Fetch homes with empty descriptions
  const { data: profiles, error } = await supabase
    .from("care_home_profiles")
    .select("id, care_home_id, description, description_cy")
    .or("description.is.null,description.eq.")
    .limit(LIMIT);

  if (error) {
    console.error("Error fetching profiles:", error.message);
    return;
  }

  console.log(`Profiles needing descriptions: ${profiles?.length || 0}`);
  if (!profiles || profiles.length === 0) {
    console.log("All profiles already have descriptions.");
    return;
  }

  // Fetch the corresponding care home data
  const homeIds = profiles.map((p) => p.care_home_id);
  const { data: homes } = await supabase
    .from("care_homes")
    .select("*")
    .in("id", homeIds);

  const homeMap = new Map((homes || []).map((h) => [h.id, h]));

  let updated = 0;
  for (const profile of profiles) {
    const home = homeMap.get(profile.care_home_id);
    if (!home) continue;

    const descEn = generateEnglishDescription(home);
    const descCy = generateWelshDescription(home);

    if (DRY_RUN) {
      console.log(`\n--- ${home.name} ---`);
      console.log(`EN: ${descEn}`);
      console.log(`CY: ${descCy}`);
    } else {
      const { error: updateErr } = await supabase
        .from("care_home_profiles")
        .update({ description: descEn, description_cy: descCy })
        .eq("id", profile.id);

      if (updateErr) {
        console.error(`  Error updating ${home.name}: ${updateErr.message}`);
        continue;
      }
    }
    updated++;
  }

  console.log();
  console.log("=== Generation Complete ===");
  console.log(`  Updated: ${updated}`);
}

main().catch(console.error);
