const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://rnyrbyrhxpwwwawsgink.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJueXJieXJoeHB3d3dhd3NnaW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NzM3OTYsImV4cCI6MjA5MTA0OTc5Nn0.C6i2f3j3f1P114QVD_UBNpAVd3RA-AIeuLodhlPmDH0'
);

// Parse a SQL INSERT statement VALUES clause into a JS object
function parseValuesFromSQL(sql) {
  const cols = [
    'ciw_service_id', 'name', 'address_line_1', 'address_line_2', 'town', 'county',
    'postcode', 'phone', 'email', 'website', 'service_type', 'operator_name',
    'registered_manager', 'registration_date', 'bed_count', 'local_authority',
    'ciw_rating_wellbeing', 'ciw_rating_care_support', 'ciw_rating_leadership',
    'ciw_rating_environment', 'ciw_report_url', 'active_offer_level',
    'active_offer_verified', 'is_claimed', 'is_active', 'is_featured',
    'listing_tier', 'slug', 'enrichment_status'
  ];

  // Extract VALUES clauses
  const regex = /VALUES\s*\((.+?)\);/gs;
  const rows = [];
  let match;

  while ((match = regex.exec(sql)) !== null) {
    const valuesStr = match[1];
    // Parse the values - handle quoted strings, NULL, numbers, booleans
    const values = [];
    let current = '';
    let inQuote = false;
    let escaped = false;

    for (let i = 0; i < valuesStr.length; i++) {
      const ch = valuesStr[i];

      if (escaped) {
        current += ch;
        escaped = false;
        continue;
      }

      if (ch === "'" && !inQuote) {
        inQuote = true;
        continue;
      }

      if (ch === "'" && inQuote) {
        // Check for escaped quote ''
        if (i + 1 < valuesStr.length && valuesStr[i + 1] === "'") {
          current += "'";
          i++; // skip next quote
          continue;
        }
        inQuote = false;
        continue;
      }

      if (ch === ',' && !inQuote) {
        values.push(current.trim());
        current = '';
        continue;
      }

      current += ch;
    }
    values.push(current.trim());

    // Convert to object
    const obj = {};
    for (let i = 0; i < cols.length && i < values.length; i++) {
      let val = values[i];
      if (val === 'NULL') {
        obj[cols[i]] = null;
      } else if (val === 'true') {
        obj[cols[i]] = true;
      } else if (val === 'false') {
        obj[cols[i]] = false;
      } else if (!isNaN(val) && val !== '') {
        obj[cols[i]] = Number(val);
      } else {
        obj[cols[i]] = val;
      }
    }
    rows.push(obj);
  }

  return rows;
}

async function main() {
  // Get existing count
  const { count: existingCount } = await supabase
    .from('care_homes')
    .select('*', { count: 'exact', head: true });
  console.log(`Existing care homes: ${existingCount}`);

  // Get existing CIW service IDs to avoid duplicates
  const { data: existingData } = await supabase
    .from('care_homes')
    .select('ciw_service_id');
  const existingIds = new Set(existingData.map(r => r.ciw_service_id));
  console.log(`Existing IDs: ${existingIds.size}`);

  // Process all batch files
  const sqlDir = __dirname;
  let totalInserted = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (let batchNum = 0; batchNum <= 42; batchNum++) {
    const filename = `batch_${String(batchNum).padStart(4, '0')}.sql`;
    const filepath = path.join(sqlDir, filename);

    if (!fs.existsSync(filepath)) {
      console.log(`${filename}: not found, skipping`);
      continue;
    }

    const sql = fs.readFileSync(filepath, 'utf8');
    const rows = parseValuesFromSQL(sql);

    // Filter out existing rows
    const newRows = rows.filter(r => !existingIds.has(r.ciw_service_id));
    const skipped = rows.length - newRows.length;
    totalSkipped += skipped;

    if (newRows.length === 0) {
      console.log(`${filename}: ${rows.length} rows, all already exist - skipping`);
      continue;
    }

    // Insert in batches of 50
    for (let i = 0; i < newRows.length; i += 50) {
      const batch = newRows.slice(i, i + 50);
      const { error } = await supabase
        .from('care_homes')
        .insert(batch);

      if (error) {
        console.log(`${filename}: ERROR inserting rows ${i}-${i + batch.length}: ${error.message}`);
        totalErrors += batch.length;
        // Try one at a time
        for (const row of batch) {
          const { error: singleError } = await supabase.from('care_homes').insert(row);
          if (singleError) {
            console.log(`  Failed: ${row.ciw_service_id} ${row.name}: ${singleError.message}`);
            totalErrors++;
          } else {
            totalInserted++;
            existingIds.add(row.ciw_service_id);
          }
        }
      } else {
        totalInserted += batch.length;
        batch.forEach(r => existingIds.add(r.ciw_service_id));
      }
    }

    console.log(`${filename}: ${newRows.length} inserted, ${skipped} skipped`);
  }

  console.log(`\n=== DONE ===`);
  console.log(`Total inserted: ${totalInserted}`);
  console.log(`Total skipped (already existed): ${totalSkipped}`);
  console.log(`Total errors: ${totalErrors}`);

  // Final count
  const { count: finalCount } = await supabase
    .from('care_homes')
    .select('*', { count: 'exact', head: true });
  console.log(`Final care homes count: ${finalCount}`);
}

main().catch(console.error);
