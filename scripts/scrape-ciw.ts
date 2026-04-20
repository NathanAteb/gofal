/**
 * scripts/scrape-ciw.ts
 *
 * Fetches all care home data from the Care Inspectorate Wales
 * directory API and imports into Supabase.
 *
 * Source: digital.careinspectorate.wales/directory
 * Licence: Open Government Licence v3.0
 * Attribution: Care Inspectorate Wales (CIW)
 *
 * Usage:
 *   npx ts-node scripts/scrape-ciw.ts
 *   npx ts-node scripts/scrape-ciw.ts --dry-run   (preview only, no DB writes)
 *   npx ts-node scripts/scrape-ciw.ts --replace    (clear seed data first)
 *   npx ts-node scripts/scrape-ciw.ts --care-homes-only  (skip childcare)
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DRY_RUN = process.argv.includes('--dry-run')
const REPLACE = process.argv.includes('--replace')
const CARE_HOMES_ONLY = process.argv.includes('--care-homes-only')

const BASE_URL = 'https://digital.careinspectorate.wales'
const SEARCH_ENDPOINT = '/backend/Directory/GetSearchResults'
const PAGE_SIZE = 100
const RATE_LIMIT_MS = 500

const TODAY = new Date().toISOString().split('T')[0]
const LOG_DIR = path.join(process.cwd(), 'data', 'ciw', 'imports')
const ERROR_LOG = path.join(LOG_DIR, `errors-${TODAY}.json`)

// Service types to include — adults care homes only
// From getreferencedata response on CIW site
const ADULT_CARE_HOME_TYPES = [
  'Care Home Service',
  'Care Home Service with Nursing',
  'Domiciliary Support Service',
  'Residential Family Centre',
]

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// ─── Step 1: Get session cookie + XSRF token ─────────────────────────────────

async function getSession(): Promise<{ cookie: string; xsrfToken: string }> {
  console.log('  Getting session token from CIW...')

  const response = await fetch(`${BASE_URL}/directory/search?keywords=&location=&serviceType=&distance=20`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; gofal.wales/1.0; +https://gofal.wales)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'cy,en;q=0.9',
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to get session: ${response.status}`)
  }

  // Extract cookies from response
  const setCookieHeaders = response.headers.getSetCookie?.() || []
  const allCookies: string[] = []
  let xsrfToken = ''

  for (const cookie of setCookieHeaders) {
    const parts = cookie.split(';')[0]
    allCookies.push(parts)

    if (cookie.startsWith('XSRF-TOKEN=')) {
      xsrfToken = cookie.split('XSRF-TOKEN=')[1].split(';')[0]
      // URL decode the token
      xsrfToken = decodeURIComponent(xsrfToken)
    }
  }

  if (!xsrfToken) {
    throw new Error('Could not extract XSRF token from CIW session')
  }

  const cookieString = allCookies.join('; ')
  console.log(`  ✓ Session established, XSRF token obtained`)
  return { cookie: cookieString, xsrfToken }
}

// ─── Step 2: Fetch one page of results ───────────────────────────────────────

async function fetchPage(
  page: number,
  session: { cookie: string; xsrfToken: string },
  serviceType: string = ''
): Promise<{ services: any[]; totalRecordCount: number }> {

  const body = {
    currentPage: page,
    localAuthority: '',
    operatingArea: '',
    serviceType,
    keywords: '',
    postcode: '',
    distance: '20',
    mainLanguage: '',
    serviceRatings: '',
    serviceNeeds: '',
    childcareAndPlaySubTypes: '',
    deliveringEarlyYearsEducation: '',
    flyingStartOnly: '',
    openDuring: '',
    providerServiceTypes: '',
    registeredToDeliverChildcareOffer: '',
  }

  const response = await fetch(`${BASE_URL}${SEARCH_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'Cookie': session.cookie,
      'X-XSRF-TOKEN': session.xsrfToken,
      'Referer': `${BASE_URL}/directory/search?keywords=&location=&serviceType=&distance=20`,
      'Origin': BASE_URL,
      'User-Agent': 'Mozilla/5.0 (compatible; gofal.wales/1.0; +https://gofal.wales)',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} on page ${page}`)
  }

  const data = await response.json()
  return {
    services: data.services || [],
    totalRecordCount: data.totalRecordCount || 0,
  }
}

// ─── Step 3: Fetch individual service detail ──────────────────────────────────

async function fetchServiceDetail(
  serviceId: string,
  session: { cookie: string; xsrfToken: string }
): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/backend/Directory/GetServiceDetails/${serviceId}`, {
      headers: {
        'Accept': 'application/json',
        'Cookie': session.cookie,
        'X-XSRF-TOKEN': session.xsrfToken,
        'Referer': `${BASE_URL}/directory/service/${serviceId}`,
        'User-Agent': 'Mozilla/5.0 (compatible; gofal.wales/1.0; +https://gofal.wales)',
      }
    })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

// ─── Step 4: Map CIW service to gofal.wales schema ───────────────────────────

function mapServiceToSchema(service: any, detail: any = null): any {
  const address = service.address || {}
  const ratings = service.ratings || detail?.ratings || {}

  // Map CIW rating strings to our format
  const mapRating = (r: string): string => {
    if (!r) return ''
    const lower = r.toLowerCase()
    if (lower.includes('excellent')) return 'Rhagorol'
    if (lower.includes('good')) return 'Da'
    if (lower.includes('adequate') || lower.includes('requires improvement')) return 'Digonol'
    if (lower.includes('poor') || lower.includes('unsatisfactory')) return 'Angen Gwella'
    return r
  }

  // Extract CIW report URL from detail
  const reportUrl = detail?.inspectionReports?.[0]?.reportUrl
    || detail?.latestReport?.reportUrl
    || null

  // Phone and email from detail
  const phone = detail?.telephoneNumber || detail?.telephone || service.telephoneNumber || ''
  const email = detail?.emailAddress || detail?.email || service.emailAddress || ''
  const website = detail?.website || service.website || ''

  // Service type mapping
  const serviceTypeMap: Record<string, string> = {
    'Care Home Service': 'residential',
    'Care Home Service with Nursing': 'nursing',
    'Domiciliary Support Service': 'domiciliary',
    'Residential Family Centre': 'residential',
    'Adult Placement Service': 'adult-placement',
  }

  const rawServiceType = service.serviceType || service.serviceTypeName || ''
  const serviceType = serviceTypeMap[rawServiceType] || rawServiceType.toLowerCase().replace(/\s+/g, '-')

  // Generate slug from name + town
  const slugify = (str: string) => str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const name = service.fullEnglishName || service.name || ''
  const town = address.town || ''
  const county = address.county || address.localAuthority || ''
  const slug = `${slugify(name)}-${slugify(town)}`.slice(0, 200)

  return {
    ciw_service_id: service.urn || service.serviceId,
    name,
    name_cy: service.fullWelshName || name,
    address_line_1: address.line1 || '',
    address_line_2: address.line2 || '',
    town,
    county,
    postcode: address.postcode || '',
    phone,
    email,
    website,
    lat: address.latitude ? parseFloat(address.latitude) : null,
    lng: address.longitude ? parseFloat(address.longitude) : null,
    service_type: serviceType,
    operator_name: service.providerName || '',
    registered_manager: detail?.responsibleIndividual || detail?.registeredManager || '',
    registration_date: detail?.registrationDate || null,
    bed_count: detail?.maximumCapacity || detail?.numberOfPlaces || null,
    local_authority: address.localAuthority || county,
    ciw_rating_wellbeing: mapRating(ratings.wellbeing || ratings.Wellbeing || ''),
    ciw_rating_care_support: mapRating(ratings.careAndSupport || ratings['Care and Support'] || ''),
    ciw_rating_leadership: mapRating(ratings.leadership || ratings.Leadership || ''),
    ciw_rating_environment: mapRating(ratings.environment || ratings.Environment || ''),
    ciw_last_inspected: detail?.lastInspectionDate || null,
    ciw_report_url: reportUrl,
    active_offer_level: 0, // Will be enriched separately
    active_offer_verified: false,
    is_claimed: false,
    is_active: true,
    is_featured: false,
    listing_tier: 'free',
    slug,
    enrichment_status: 'pending',
  }
}

// ─── Step 5: Upsert to Supabase ───────────────────────────────────────────────

async function upsertCareHome(record: any): Promise<void> {
  if (DRY_RUN) return

  const { error } = await supabase
    .from('care_homes')
    .upsert(record, {
      onConflict: 'ciw_service_id',
      ignoreDuplicates: false,
    })

  if (error) {
    throw new Error(`Supabase upsert failed: ${error.message}`)
  }

  // Create empty profile if it doesn't exist
  const { data: home } = await supabase
    .from('care_homes')
    .select('id')
    .eq('ciw_service_id', record.ciw_service_id)
    .single()

  if (home?.id) {
    await supabase
      .from('care_home_profiles')
      .upsert({
        care_home_id: home.id,
        description: '',
        description_cy: '',
        photos: [],
        services: [],
        amenities: [],
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'care_home_id',
        ignoreDuplicates: true,
      })
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n═══════════════════════════════════════════════════')
  console.log('  gofal.wales — CIW Data Import')
  console.log(`  ${new Date().toISOString()}`)
  if (DRY_RUN) console.log('  MODE: DRY RUN — no database writes')
  if (REPLACE) console.log('  MODE: REPLACE — will clear seed data')
  console.log('═══════════════════════════════════════════════════\n')

  fs.mkdirSync(LOG_DIR, { recursive: true })

  // Get session
  const session = await getSession()

  // Get first page to find total count
  console.log('  Fetching page 1 to get total count...')
  const firstPage = await fetchPage(1, session)
  const total = firstPage.totalRecordCount
  const totalPages = Math.ceil(total / PAGE_SIZE)

  console.log(`  Total services: ${total}`)
  console.log(`  Pages to fetch: ${totalPages} (${PAGE_SIZE} per page)`)
  console.log()

  if (DRY_RUN) {
    console.log('  DRY RUN — Sample of first page data:')
    const sample = firstPage.services.slice(0, 3)
    for (const s of sample) {
      const mapped = mapServiceToSchema(s)
      console.log(`  → ${mapped.name} | ${mapped.town} | ${mapped.county} | ${mapped.postcode}`)
    }
    console.log('\n  DRY RUN COMPLETE. Run without --dry-run to import.')
    return
  }

  // Optionally clear seed data
  if (REPLACE) {
    console.log('  Clearing seed data...')
    await supabase.from('care_home_profiles').delete().not('care_home_id', 'is', null)
    await supabase.from('care_homes').delete().not('id', 'is', null)
    console.log('  ✓ Seed data cleared')
  }

  // Import all pages
  let imported = 0
  let failed = 0
  const errors: any[] = []

  // Process first page results
  const allServices = [...firstPage.services]

  // Fetch remaining pages
  for (let page = 2; page <= totalPages; page++) {
    try {
      process.stdout.write(`  Fetching page ${page}/${totalPages}...`)
      const result = await fetchPage(page, session)
      allServices.push(...result.services)
      process.stdout.write(` ${result.services.length} services\n`)
      await sleep(RATE_LIMIT_MS)
    } catch (error) {
      console.error(`  ✗ Page ${page} failed: ${error}`)
      errors.push({ page, error: String(error) })
    }
  }

  console.log(`\n  Total services fetched: ${allServices.length}`)
  console.log('  Importing to Supabase...\n')

  // Filter to care homes only if flag set
  const toImport = CARE_HOMES_ONLY
    ? allServices.filter(s => {
        const type = (s.serviceType || s.serviceTypeName || '').toLowerCase()
        return type.includes('care home')
      })
    : allServices

  console.log(`  Services to import: ${toImport.length}`)

  for (let i = 0; i < toImport.length; i++) {
    const service = toImport[i]
    try {
      // Optionally fetch detail for richer data
      // Commented out by default to avoid rate limiting on 5000+ requests
      // const detail = await fetchServiceDetail(service.serviceId, session)
      // await sleep(RATE_LIMIT_MS)
      const detail = null

      const mapped = mapServiceToSchema(service, detail)
      await upsertCareHome(mapped)
      imported++

      if (i % 100 === 0) {
        console.log(`  [${i + 1}/${toImport.length}] ${imported} imported, ${failed} failed`)
      }
    } catch (error) {
      failed++
      errors.push({
        serviceId: service.serviceId,
        name: service.name,
        error: String(error),
      })
    }

    await sleep(100) // Small delay between DB writes
  }

  // Save errors
  if (errors.length > 0) {
    fs.writeFileSync(ERROR_LOG, JSON.stringify(errors, null, 2))
  }

  // Save full raw data for reference
  const rawFile = path.join(LOG_DIR, `raw-${TODAY}.json`)
  fs.writeFileSync(rawFile, JSON.stringify(allServices, null, 2))

  console.log('\n═══════════════════════════════════════════════════')
  console.log('  IMPORT COMPLETE')
  console.log(`  ✓ Imported: ${imported}`)
  console.log(`  ✗ Failed:   ${failed}`)
  console.log(`  Raw data:   ${rawFile}`)
  if (errors.length > 0) {
    console.log(`  Errors:     ${ERROR_LOG}`)
  }
  console.log('═══════════════════════════════════════════════════\n')

  // Attribution reminder
  console.log('  Data source: Care Inspectorate Wales')
  console.log('  Licence: Open Government Licence v3.0')
  console.log('  https://www.careinspectorate.wales/\n')
}

main().catch(console.error)
