/**
 * scripts/enrich-content.ts
 *
 * Content enrichment pipeline for gofal.wales care home listings.
 *
 * Sources (all legitimate):
 * 1. CIW inspection report PDFs — Open Government Licence
 * 2. Care home's own website — their own public marketing content
 * 3. Google Places API — explicitly permitted via API terms, free tier
 *
 * Run:         npx ts-node scripts/enrich-content.ts
 * Resume:      npx ts-node scripts/enrich-content.ts --resume
 * Single home: npx ts-node scripts/enrich-content.ts --id=SIN-00009213-FXJW
 */

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const RESUME = process.argv.includes('--resume')
const SINGLE_ID = process.argv.find(a => a.startsWith('--id='))?.split('=')[1]
const ERROR_LOG_DIR = path.join(process.cwd(), 'data', 'ciw', 'enrichment-errors')
const TODAY = new Date().toISOString().split('T')[0]

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// ─── Source 1: CIW Inspection Report PDF ─────────────────────────────────────

async function extractInspectionReport(reportUrl: string): Promise<string> {
  if (!reportUrl) return ''
  try {
    const response = await fetch(reportUrl, {
      headers: { 'User-Agent': 'gofal.wales/1.0 (Welsh care home directory; contact@gofal.wales)' }
    })
    if (!response.ok) return ''
    const buffer = await response.arrayBuffer()
    const pdfParse = await import('pdf-parse')
    const data = await pdfParse.default(Buffer.from(buffer))
    return data.text.replace(/\s+/g, ' ').trim().slice(0, 3000)
  } catch { return '' }
}

// ─── Source 2: Care Home Website ─────────────────────────────────────────────

async function fetchWebsiteContent(websiteUrl: string): Promise<string> {
  if (!websiteUrl) return ''
  const urlsToTry = [websiteUrl, `${websiteUrl}/about`]
  let combined = ''
  for (const url of urlsToTry) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'gofal.wales/1.0 (Welsh care home directory; contact@gofal.wales)' },
        signal: AbortSignal.timeout(8000)
      })
      if (!response.ok) continue
      const html = await response.text()
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ').trim().slice(0, 1500)
      combined += text + ' '
      await sleep(1000)
    } catch { continue }
  }
  return combined.trim()
}

// ─── Source 3: Google Places API ─────────────────────────────────────────────

async function fetchGooglePlaceData(name: string, postcode: string, town: string) {
  if (!GOOGLE_API_KEY) return null
  try {
    const q = encodeURIComponent(`${name} care home ${town} ${postcode}`)
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q}&key=${GOOGLE_API_KEY}&region=gb`
    )
    const search = await searchRes.json()
    if (!search.results?.length) return null
    const placeId = search.results[0].place_id

    const detailRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,editorial_summary,photos&key=${GOOGLE_API_KEY}`
    )
    const details = (await detailRes.json()).result
    if (!details) return null

    const photoUrls = (details.photos || []).slice(0, 3).map((p: any) =>
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_API_KEY}`
    )

    return {
      placeId,
      rating: details.rating || 0,
      reviewCount: details.user_ratings_total || 0,
      description: details.editorial_summary?.overview || '',
      photos: photoUrls,
    }
  } catch { return null }
}

// ─── Store Google Photos in Supabase Storage ──────────────────────────────────

async function storePhotos(careHomeId: string, photoUrls: string[]): Promise<string[]> {
  const stored: string[] = []
  for (let i = 0; i < photoUrls.length; i++) {
    try {
      const res = await fetch(photoUrls[i])
      if (!res.ok) continue
      const buffer = await res.arrayBuffer()
      const filename = `care-homes/${careHomeId}/google/${i + 1}.jpg`
      const { error } = await supabase.storage.from('photos').upload(filename, buffer, {
        contentType: 'image/jpeg', upsert: true
      })
      if (!error) {
        const { data } = supabase.storage.from('photos').getPublicUrl(filename)
        stored.push(data.publicUrl)
      }
    } catch { continue }
  }
  return stored
}

// ─── Generate Bilingual Descriptions via Claude ───────────────────────────────

async function generateDescriptions(home: any, sources: {
  inspectionText: string
  websiteText: string
  googleDescription: string
}): Promise<{ cy: string; en: string }> {
  const hasContent = sources.inspectionText || sources.websiteText || sources.googleDescription

  if (!hasContent) {
    // Pure fallback from registration data
    const ao = home.active_offer_level || 0
    const aoEn = ao >= 2 ? 'Welsh language care is available — staff can support residents in Welsh.' : ao === 1 ? 'Some Welsh language provision is available.' : ''
    const aoCy = ao >= 2 ? 'Mae gofal Cymraeg ar gael — gall staff gefnogi preswylwyr yn Gymraeg.' : ao === 1 ? 'Mae rhywfaint o ddarpariaeth Gymraeg ar gael.' : ''
    return {
      en: `${home.name} is a care home in ${home.town}, ${home.county}, providing care for up to ${home.bed_count || 'a number of'} residents. ${aoEn} Regulated by Care Inspectorate Wales. Contact the home directly to discuss availability and care needs.`,
      cy: `Mae ${home.name} yn gartref gofal yn ${home.town}, ${home.county}, yn darparu gofal i hyd at ${home.bed_count || 'nifer'} o breswylwyr. ${aoCy} Rheoleiddir gan Arolygiaethgofal Cymru. Cysylltwch â'r cartref i drafod argaeledd ac anghenion gofal.`,
    }
  }

  const prompt = `You are writing listing descriptions for gofal.wales — Wales' first Welsh-language care home directory. Families use this when making one of the hardest decisions of their lives. Write with warmth and humanity. Never clinical or corporate.

Home: ${home.name}, ${home.town}, ${home.county}
Type: ${home.service_type} | Beds: ${home.bed_count}
Active Offer level: ${home.active_offer_level} (0=unknown, 1=basic Welsh, 2=good Welsh, 3=excellent Welsh)
CIW Well-being: ${home.ciw_rating_wellbeing || 'not yet rated'}

CIW INSPECTION EXTRACT:
${sources.inspectionText || 'Not available'}

WEBSITE CONTENT:
${sources.websiteText || 'Not available'}

GOOGLE DESCRIPTION:
${sources.googleDescription || 'Not available'}

Write TWO descriptions of 120-150 words each:

WELSH:
Natural spoken Welsh. Use chi throughout. Mention Welsh provision if Active Offer > 0. Warm and human. No clichés. Natively Welsh — not translated.

ENGLISH:
Same warmth. Different natural expression. Not a translation of the Welsh.

Format:
WELSH:
[Welsh text]

ENGLISH:
[English text]`

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const cy = text.match(/WELSH:\n([\s\S]+?)\n\nENGLISH:/i)?.[1]?.trim()
    const en = text.match(/ENGLISH:\n([\s\S]+?)$/i)?.[1]?.trim()
    return {
      cy: cy || `Mae ${home.name} yn gartref gofal yn ${home.town}. Cysylltwch â'r cartref am ragor o wybodaeth.`,
      en: en || `${home.name} is a care home in ${home.town}. Contact the home for more information.`,
    }
  } catch {
    return {
      cy: `Mae ${home.name} yn gartref gofal yn ${home.town}. Cysylltwch â'r cartref am ragor o wybodaeth.`,
      en: `${home.name} is a care home in ${home.town}. Contact the home for more information.`,
    }
  }
}

// ─── Enrich one home ──────────────────────────────────────────────────────────

async function enrichHome(home: any): Promise<'success' | 'failed' | 'skipped'> {
  if (RESUME && home.enrichment_status === 'complete') return 'skipped'

  try {
    const [inspectionText, websiteText] = await Promise.all([
      extractInspectionReport(home.ciw_report_url),
      fetchWebsiteContent(home.website),
    ])
    await sleep(2000)

    const googleData = await fetchGooglePlaceData(home.name, home.postcode, home.town)
    await sleep(1000)

    const storedPhotos = googleData?.photos.length
      ? await storePhotos(home.id, googleData.photos)
      : []

    const descriptions = await generateDescriptions(home, {
      inspectionText,
      websiteText,
      googleDescription: googleData?.description || '',
    })
    await sleep(1000)

    await supabase.from('care_homes').update({
      google_place_id: googleData?.placeId,
      google_rating: googleData?.rating,
      google_review_count: googleData?.reviewCount,
      google_photos: storedPhotos,
      enrichment_status: 'complete',
      enrichment_date: new Date().toISOString(),
    }).eq('id', home.id)

    await supabase.from('care_home_profiles').upsert({
      care_home_id: home.id,
      description: descriptions.en,
      description_cy: descriptions.cy,
      photos: storedPhotos,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'care_home_id' })

    return 'success'
  } catch (error) {
    fs.mkdirSync(ERROR_LOG_DIR, { recursive: true })
    const errorFile = path.join(ERROR_LOG_DIR, `${TODAY}.json`)
    const existing = fs.existsSync(errorFile) ? JSON.parse(fs.readFileSync(errorFile, 'utf-8')) : []
    fs.writeFileSync(errorFile, JSON.stringify([...existing, {
      ciw_service_id: home.ciw_service_id, name: home.name,
      error: String(error), timestamp: new Date().toISOString(),
    }], null, 2))
    await supabase.from('care_homes').update({ enrichment_status: 'failed' }).eq('id', home.id)
    return 'failed'
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n═══════════════════════════════════════════════════')
  console.log('  gofal.wales Content Enrichment Pipeline')
  console.log(`  ${new Date().toISOString()}`)
  if (!GOOGLE_API_KEY) console.warn('  ⚠  No GOOGLE_PLACES_API_KEY — Google data skipped')
  console.log('═══════════════════════════════════════════════════\n')

  let query = supabase.from('care_homes').select('*').eq('is_active', true)
  if (SINGLE_ID) query = query.eq('ciw_service_id', SINGLE_ID)
  else if (RESUME) query = query.neq('enrichment_status', 'complete')

  const { data: homes, error } = await query
  if (error) { console.error('DB error:', error); process.exit(1) }

  console.log(`Processing ${homes?.length || 0} homes...\n`)

  let success = 0, failed = 0, skipped = 0

  for (const home of homes || []) {
    process.stdout.write(`  ${home.name} (${home.town})... `)
    const result = await enrichHome(home)
    console.log(result === 'success' ? '✓' : result === 'skipped' ? '→ skip' : '✗ failed')
    if (result === 'success') success++
    if (result === 'failed') failed++
    if (result === 'skipped') skipped++
    const done = success + failed + skipped
    if (done % 25 === 0) console.log(`\n  [${done}/${homes?.length}] ${success} enriched, ${failed} failed\n`)
    await sleep(2000)
  }

  console.log('\n═══════════════════════════════════════════════════')
  console.log(`  ✓ Enriched: ${success} | ✗ Failed: ${failed} | → Skipped: ${skipped}`)
  if (failed > 0) console.log(`  Errors: data/ciw/enrichment-errors/${TODAY}.json`)
  console.log('═══════════════════════════════════════════════════\n')
}

main().catch(console.error)
