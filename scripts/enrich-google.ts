/**
 * enrich-google.ts
 *
 * Enriches care homes with Google Places data:
 * - Google rating + review count
 * - Google photos
 * - Google Place ID
 * - Real website (if missing from CIW data)
 *
 * Usage:
 *   npx tsx scripts/enrich-google.ts
 *   npx tsx scripts/enrich-google.ts --dry-run
 *   npx tsx scripts/enrich-google.ts --limit 50
 */

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "AIzaSyBvjgRtjoaa0oDTYjFMP89gkY8Cbvi_1WI";

interface PlaceResult {
  place_id: string;
  rating?: number;
  user_ratings_total?: number;
  photos?: { photo_reference: string }[];
  website?: string;
  formatted_phone_number?: string;
}

async function findPlace(name: string, postcode: string): Promise<PlaceResult | null> {
  const query = `${name} ${postcode}`;
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.candidates && data.candidates.length > 0) {
    const placeId = data.candidates[0].place_id;
    return getPlaceDetails(placeId);
  }
  return null;
}

async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  const fields = "place_id,rating,user_ratings_total,photos,website,formatted_phone_number";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.result) {
    return data.result;
  }
  return null;
}

function getPhotoUrl(photoRef: string, maxWidth: number = 800): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;
}

async function main() {
  const DRY_RUN = process.argv.includes("--dry-run");
  const LIMIT = parseInt(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] || "0") || 9999;

  console.log("=== Google Places Enrichment ===");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  console.log(`Limit: ${LIMIT}`);
  console.log();

  // We'll output SQL UPDATE statements to a file since we don't have service role key
  const updates: string[] = [];

  // Read care homes from the CSV (since we can't query Supabase without service key)
  const { parse } = await import("csv-parse/sync");
  const fs = await import("fs");
  const path = await import("path");

  const csvPath = path.join(__dirname, "../data/ciw-export.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });

  const careHomes = records
    .filter((r: any) => {
      if (r["Service Type"] !== "Care Home Service") return false;
      const sub = r["Service Sub-Type"] || "";
      if (sub.includes("Children") && !sub.includes("Adults")) return false;
      return true;
    })
    .slice(0, LIMIT);

  console.log(`Processing ${careHomes.length} care homes...`);

  let enriched = 0;
  let notFound = 0;
  let errors = 0;

  for (let i = 0; i < careHomes.length; i++) {
    const home = careHomes[i];
    const name = home["Service Name"];
    const postcode = home["Service Postcode"];
    const urn = home["Service URN"];

    if (!name || !postcode) { notFound++; continue; }

    try {
      const place = await findPlace(name, postcode);

      if (place) {
        const rating = place.rating || null;
        const reviewCount = place.user_ratings_total || 0;
        const placeId = place.place_id;
        const website = place.website || null;
        const photoRefs = (place.photos || []).slice(0, 5).map((p) => p.photo_reference);
        const photoUrls = photoRefs.map((ref) => getPhotoUrl(ref));

        const urnEsc = urn.replace(/'/g, "''");
        const websiteEsc = website ? `'${website.replace(/'/g, "''")}'` : "NULL";
        const photosArray = photoUrls.length > 0
          ? `ARRAY[${photoUrls.map((u) => `'${u.replace(/'/g, "''")}'`).join(",")}]`
          : "'{}'";

        updates.push(
          `UPDATE care_homes SET google_place_id = '${placeId}', google_rating = ${rating || "NULL"}, google_review_count = ${reviewCount}, enrichment_status = 'enriched'${website && !home["Website"] ? `, website = ${websiteEsc}` : ""} WHERE ciw_service_id = '${urnEsc}';`
        );
        updates.push(
          `UPDATE care_home_profiles SET photos = ${photosArray} FROM care_homes WHERE care_home_profiles.care_home_id = care_homes.id AND care_homes.ciw_service_id = '${urnEsc}' AND (care_home_profiles.photos IS NULL OR array_length(care_home_profiles.photos, 1) IS NULL);`
        );

        enriched++;

        if (DRY_RUN && enriched <= 3) {
          console.log(`  ${name} (${postcode})`);
          console.log(`    Rating: ${rating} (${reviewCount} reviews)`);
          console.log(`    Photos: ${photoUrls.length}`);
          console.log(`    Website: ${website || "none"}`);
          console.log();
        }
      } else {
        notFound++;
      }
    } catch (err: any) {
      console.error(`  Error for ${name}: ${err.message}`);
      errors++;
    }

    // Rate limit: ~5 requests per second (find + details = 2 calls each)
    if (i % 5 === 4) {
      await new Promise((r) => setTimeout(r, 1000));
    }

    if ((i + 1) % 50 === 0) {
      console.log(`  Progress: ${i + 1}/${careHomes.length} (${enriched} enriched, ${notFound} not found)`);
    }
  }

  // Write SQL file
  const sqlPath = path.join(__dirname, "../data/sql/google_enrichment.sql");
  fs.writeFileSync(sqlPath, updates.join("\n") + "\n");

  console.log();
  console.log("=== Enrichment Complete ===");
  console.log(`  Enriched: ${enriched}`);
  console.log(`  Not found: ${notFound}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  SQL written to: data/sql/google_enrichment.sql`);
}

main().catch(console.error);
