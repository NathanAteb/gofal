/**
 * geocode-postcodes.ts
 *
 * Geocodes all care homes using postcodes.io (free, no API key).
 * Supports bulk lookups (up to 100 postcodes per request).
 *
 * Usage:
 *   npx tsx scripts/geocode-postcodes.ts
 *   npx tsx scripts/geocode-postcodes.ts --dry-run
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DRY_RUN = process.argv.includes("--dry-run");
const BATCH_SIZE = 100; // postcodes.io max per request

interface PostcodeResult {
  postcode: string;
  latitude: number;
  longitude: number;
}

async function bulkLookup(postcodes: string[]): Promise<Map<string, PostcodeResult>> {
  const results = new Map<string, PostcodeResult>();

  const res = await fetch("https://api.postcodes.io/postcodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postcodes }),
  });

  if (!res.ok) {
    console.error(`postcodes.io error: ${res.status}`);
    return results;
  }

  const data = await res.json();
  for (const item of data.result || []) {
    if (item.result) {
      results.set(item.query.toUpperCase().replace(/\s/g, ""), {
        postcode: item.query,
        latitude: item.result.latitude,
        longitude: item.result.longitude,
      });
    }
  }
  return results;
}

async function main() {
  console.log("=== Postcode Geocoding ===");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE UPDATE"}`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Fetch all homes without lat/lng
  const { data: homes, error } = await supabase
    .from("care_homes")
    .select("id, name, postcode, lat, lng")
    .is("lat", null)
    .order("name");

  if (error) {
    console.error("Error fetching homes:", error.message);
    return;
  }

  console.log(`Homes needing geocoding: ${homes?.length || 0}`);
  if (!homes || homes.length === 0) {
    console.log("All homes already geocoded.");
    return;
  }

  let geocoded = 0;
  let failed = 0;

  // Process in batches
  for (let i = 0; i < homes.length; i += BATCH_SIZE) {
    const batch = homes.slice(i, i + BATCH_SIZE);
    const postcodes = batch
      .map((h) => h.postcode?.trim())
      .filter(Boolean) as string[];

    if (postcodes.length === 0) continue;

    const results = await bulkLookup(postcodes);

    for (const home of batch) {
      const key = home.postcode?.toUpperCase().replace(/\s/g, "") || "";
      const result = results.get(key);

      if (result) {
        if (!DRY_RUN) {
          const { error: updateErr } = await supabase
            .from("care_homes")
            .update({ lat: result.latitude, lng: result.longitude })
            .eq("id", home.id);

          if (updateErr) {
            console.error(`  Error updating ${home.name}: ${updateErr.message}`);
            failed++;
            continue;
          }
        }
        geocoded++;
      } else {
        console.log(`  No result for: ${home.name} (${home.postcode})`);
        failed++;
      }
    }

    console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${geocoded} geocoded, ${failed} failed`);

    // Rate limit: 1 second between batches
    if (i + BATCH_SIZE < homes.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log();
  console.log("=== Geocoding Complete ===");
  console.log(`  Geocoded: ${geocoded}`);
  console.log(`  Failed: ${failed}`);
}

main().catch(console.error);
