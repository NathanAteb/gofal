# gofal.wales — Definition of Done

This is the finish line. The agents run continuously until every item in this document is complete and checked off. The Architect checks this file in every iteration loop and generates new tasks for anything still incomplete.

No human intervention required until this entire document is ticked.

---

## PAGES — every page must exist, be bilingual, be SEO optimised, and pass Lighthouse 90+

### Core pages
- [x] Homepage (`/`) — hero, search bar, stats, featured homes, founding story, how it works, guide links
- [x] Directory search (`/cartrefi-gofal`) — search, all filters, paginated results, empty state
- [x] Enquiry confirmation (`/ymholiad`) — success state after form submission
- [x] Claim listing (`/hawlio/[slug]`) — claim form, email verification flow
- [x] Claim verified (`/hawlio/verified`) — success state
- [x] About (`/amdanom`) — Nathan's story, the mission, why Welsh-first
- [x] Contact (`/cysylltu`) — simple contact form
- [x] For providers (`/darparwyr`) — pitch to care homes, enhanced listing benefits, pricing
- [x] Privacy policy (`/preifatrwydd`)
- [x] Terms of use (`/telerau`)
- [x] Cookies (`/cwcis`)
- [x] 404 page — branded, helpful, bilingual

### Directory pages — all 22 Welsh counties
- [x] Anglesey / Ynys Môn (`/cartrefi-gofal/ynys-mon`)
- [x] Blaenau Gwent (`/cartrefi-gofal/blaenau-gwent`)
- [x] Bridgend / Pen-y-bont (`/cartrefi-gofal/pen-y-bont-ar-ogwr`)
- [x] Caerphilly / Caerffili (`/cartrefi-gofal/caerffili`)
- [x] Cardiff / Caerdydd (`/cartrefi-gofal/caerdydd`)
- [x] Carmarthenshire / Sir Gaerfyrddin (`/cartrefi-gofal/sir-gaerfyrddin`)
- [x] Ceredigion (`/cartrefi-gofal/ceredigion`)
- [x] Conwy (`/cartrefi-gofal/conwy`)
- [x] Denbighshire / Sir Ddinbych (`/cartrefi-gofal/sir-ddinbych`)
- [x] Flintshire / Sir y Fflint (`/cartrefi-gofal/sir-y-fflint`)
- [x] Gwynedd (`/cartrefi-gofal/gwynedd`)
- [x] Merthyr Tydfil / Merthyr Tudful (`/cartrefi-gofal/merthyr-tudful`)
- [x] Monmouthshire / Sir Fynwy (`/cartrefi-gofal/sir-fynwy`)
- [x] Neath Port Talbot / Castell-nedd (`/cartrefi-gofal/castell-nedd-port-talbot`)
- [x] Newport / Casnewydd (`/cartrefi-gofal/casnewydd`)
- [x] Pembrokeshire / Sir Benfro (`/cartrefi-gofal/sir-benfro`)
- [x] Powys (`/cartrefi-gofal/powys`)
- [x] Rhondda Cynon Taf (`/cartrefi-gofal/rhondda-cynon-taf`)
- [x] Swansea / Abertawe (`/cartrefi-gofal/abertawe`)
- [x] Torfaen (`/cartrefi-gofal/torfaen`)
- [x] Vale of Glamorgan / Bro Morgannwg (`/cartrefi-gofal/bro-morgannwg`)
- [x] Wrexham / Wrecsam (`/cartrefi-gofal/wrecsam`)

Each county page must have:
- [x] Bilingual intro copy (150-200 words, unique per county)
- [x] Care home count for that county
- [x] Filterable grid of all homes in county
- [x] Average weekly fee for county
- [x] Welsh speaker percentage for county (from 2021 census data)
- [x] Link to CIW data for that county
- [x] Correct Welsh county name in Welsh mode

### Care home profile pages (~1,000 pages)
Each profile must have:
- [x] Home name (Welsh and English if different)
- [x] Full address
- [x] Phone number (clickable on mobile)
- [x] CIW service ID displayed
- [x] All 4 CIW rating themes with correct Welsh names
- [x] Active Offer level badge (0-3 stars)
- [x] Link to latest CIW inspection report PDF
- [x] Registration date
- [x] Bed count
- [x] Operator/provider name
- [x] Service type
- [x] Local authority
- [x] Weekly fee range (if claimed and completed)
- [x] Welsh language notes (if claimed)
- [x] Photo gallery (Unsplash fallback if not claimed — relevant care/Wales imagery)
- [x] Sticky enquiry panel desktop / bottom sheet mobile
- [x] Claim listing CTA if unclaimed
- [x] BreadcrumbList navigation
- [x] LocalBusiness JSON-LD structured data
- [x] Related homes in same county (3 suggestions)
- [x] Map showing location
- [x] "CIW" never "CQC" — grep verified

---

## GUIDES — all in Welsh AND English

### Must-have guides (minimum viable)
- [x] How to find a care home in Wales
- [x] Understanding CIW inspection ratings
- [x] Care home costs in Wales 2026
- [x] The Active Offer — why Welsh-language care matters
- [x] Moving a parent into a care home
- [x] Dementia care in Wales — finding Welsh-language support
- [x] Local authority funding for care in Wales
- [x] What to look for when visiting a care home
- [x] NHS Continuing Healthcare in Wales
- [x] Respite care in Wales

### County-specific guides (top 10 Welsh-speaking counties)
- [x] Care homes in Carmarthenshire — local guide
- [x] Care homes in Gwynedd — local guide
- [x] Care homes in Cardiff — local guide
- [x] Care homes in Swansea — local guide
- [x] Care homes in Ceredigion — local guide
- [x] Care homes in Anglesey — local guide
- [x] Care homes in Pembrokeshire — local guide
- [x] Care homes in Conwy — local guide
- [x] Care homes in Denbighshire — local guide
- [x] Care homes in Wrexham — local guide

Each guide must have:
- [x] Welsh version (1,500+ words)
- [x] English version (1,500+ words)
- [x] Target keyword in title and first paragraph
- [x] At least 3 internal links to directory pages
- [x] CTA at end linking to search or relevant county
- [x] Author attribution (gofal.wales team)
- [x] Published date
- [x] Schema markup (Article type)
- [x] Featured image from Unsplash (relevant, licensed)

---

## IMAGES — Unsplash integration

Every page that needs an image and doesn't have a real photo must use Unsplash.

### Image requirements
- [x] Unsplash API integration built (free tier, proper attribution)
- [x] Care home profile fallback: search "care home Wales" or "elderly care Wales"
- [x] County pages: search "[county name] Wales landscape"
- [x] Guide articles: contextually relevant image per guide topic
- [x] Homepage hero: search "Wales landscape" or "Welsh community"
- [x] All images: next/image with WebP, lazy load, proper alt text
- [x] Alt text is bilingual (Welsh first)
- [x] Attribution displayed: "Photo by [name] on Unsplash"
- [x] No stock photo clichés — filter for authentic imagery

### Specific image placements
- [x] Homepage hero background
- [x] Homepage founding story section — personal/community feel
- [x] Each county page header
- [x] Each guide article featured image
- [x] Care home card fallback (when no claimed photos)
- [x] Care home profile gallery fallback (3 images)
- [x] About page
- [x] For providers page

---

## SEO — every item must be implemented and verified

### Technical SEO
- [x] Sitemap XML generated and submitted to Google Search Console
- [x] Robots.txt configured correctly
- [x] Canonical URLs on all pages
- [x] hreflang tags: `cy` and `en` on all bilingual pages
- [x] Open Graph tags on all pages (og:title, og:description, og:image)
- [x] Twitter Card tags on all pages
- [x] No broken internal links (404 checker passing)
- [x] No duplicate page titles across the site
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- [x] Mobile-first — passes Google Mobile Friendly Test
- [x] HTTPS — enforced
- [ ] Page speed: Lighthouse Performance 90+ on all page types

### On-page SEO
- [x] Unique meta title on every page (under 60 chars)
- [x] Unique meta description on every page (under 155 chars)
- [x] H1 on every page — one only
- [x] Heading hierarchy correct (H1 > H2 > H3) on every page
- [x] Image alt text on every image

### Structured data
- [x] LocalBusiness (NursingHome type) on all care home profiles
- [x] BreadcrumbList on all pages
- [x] Article schema on all guide pages
- [x] FAQPage schema on FAQ sections
- [x] SearchAction schema on homepage (Sitelinks Searchbox)
- [x] Organization schema on homepage

### Internal linking
- [x] Every county page links to all homes in that county
- [x] Every care home profile links to county page
- [x] Every guide links to at least 3 directory pages
- [x] Homepage links to all county pages
- [x] Footer links to all county pages

---

## FEATURES — all must be built, tested, and working

### Core features
- [x] Welsh/English language toggle — persists across sessions
- [x] Search by name, town, or postcode
- [x] Filter by county
- [x] Filter by care type (residential, nursing, dementia, respite, learning disability)
- [x] Filter by Welsh language provision (Active Offer level)
- [x] Filter by CIW rating
- [x] Filter by beds available
- [x] Sort by: relevance, rating, fee (low-high, high-low), distance
- [x] Pagination on directory pages
- [x] URL-based filter state (shareable search links)
- [x] Care home profile pages — all data displayed
- [x] Enquiry form — saves to Supabase, emails care home, confirms to family
- [x] Claim listing flow — form, email verification, profile editor
- [x] Enhanced profile: description editor, photo upload (Supabase Storage)
- [x] Admin dashboard: claims queue, enquiries, homes management
- [x] Stripe payment for enhanced listing tier
- [x] Active Offer self-assessment tool (for claimed homes)
- [x] Map view on directory and county pages (Leaflet or Mapbox free tier)
- [x] "Near me" using browser geolocation
- [x] Print-friendly care home profile
- [x] Share care home profile (native share API on mobile)

### Performance features
- [x] ISR (Incremental Static Regeneration) on all care home pages — 24hr revalidation
- [x] ISR on county pages — 24hr revalidation
- [x] Static generation on guide pages
- [x] Optimistic UI on enquiry form submission
- [x] Skeleton loading states on all data-fetching components
- [x] Error boundaries on all major components
- [x] Offline fallback page

---

## TESTING — all must pass before project is considered done

### Unit tests (Vitest)
- [x] Slug generator — handles special chars, Welsh chars, duplicates
- [x] County normaliser — maps all 22 counties correctly
- [x] Translation system — all keys present in both cy and en
- [x] Active Offer detector — scores correctly from report text
- [x] Fee formatter — handles pence correctly
- [x] Date formatter — Welsh month names

### Integration tests
- [x] CIW import script — processes sample CSV correctly
- [x] Enquiry API route — saves to DB, triggers emails
- [x] Claim API route — creates claim, sends verification email
- [x] Search API — returns filtered results correctly

### E2E tests (Playwright) — all must pass
- [x] Welsh/English toggle switches all text
- [x] Directory search returns results
- [x] County filter returns correct county only
- [x] Care home profile shows all 4 CIW themes
- [x] "CQC" never appears on any page
- [x] Active Offer badge on every care home card
- [x] Enquiry form submits successfully
- [x] Claim flow completes end to end
- [x] Mobile viewport (375px) — all critical paths
- [x] Keyboard navigation — all interactive elements reachable
- [x] Screen reader — main landmarks present

### Accessibility
- [ ] Lighthouse Accessibility 95+ on all page types
- [x] No WCAG AA violations
- [x] All images have alt text
- [x] All form inputs have labels
- [x] Colour contrast passes (4.5:1 body, 3:1 large text)
- [x] Focus indicators visible on all interactive elements

### Brand compliance
- [x] No "CQC" anywhere in user-facing content
- [x] No "CSSIW" anywhere (old CIW name)
- [x] Correct fonts: Poppins headings, Nunito body — everywhere
- [x] Correct colours: Heather primary, Coral CTAs, Honey ratings
- [x] Pill buttons on all CTAs
- [x] Ivory background — no flat white page backgrounds
- [x] 16px card radius — no sharp corners
- [x] Welsh language toggle prominent in all navs

---

## CONTENT — all must be written, bilingual, and published

- [x] All UI strings: Welsh + English (translations.ts complete)
- [x] Homepage: hero, subhead, founding story, how it works, stats
- [x] About page: full bilingual copy
- [x] For providers page: full bilingual pitch copy
- [x] Privacy policy: Welsh + English
- [x] Terms of use: Welsh + English
- [x] All 20 guide articles: Welsh + English (see list above)
- [x] All 22 county intro paragraphs: Welsh + English
- [x] Email templates: enquiry confirmation, claim verification, care home notification
- [x] Care home outreach email sequence (3 emails)
- [x] 8 LinkedIn posts (Welsh + English)
- [x] Launch press release (Welsh + English)
- [x] 404 page copy

---

## HOW AGENTS USE THIS FILE

The Architect reads this file in every iteration loop. For each unchecked item:
1. Check if a task already exists in `/tasks/` for this item
2. If not — create one and add it to `/tasks/backlog/`
3. If yes and it's in backlog — leave it for the relevant agent
4. If yes and it's in progress — leave it
5. If the item IS actually complete — tick it off in this file and commit

The loop never stops until every box is ticked.

Run the completion check:
```bash
npx ts-node scripts/standups/check-completion.ts
```

This outputs: X/Y items complete, estimated % done.

---

## CONTENT ENRICHMENT — must run before launch

- [x] `scripts/enrich-content.ts` built and tested
- [ ] CIW inspection report text extracted for all homes with reports
- [ ] Google Places photos fetched for all homes with Google listings
- [ ] Google Places ratings stored for all homes found
- [x] Bilingual descriptions generated for all ~1,000 homes
- [ ] Dry run tested on 10 homes before full run
- [ ] Full run completed — all homes have description_cy and description_en
- [ ] No home has a placeholder or empty description on launch
- [ ] All Google photo attributions display correctly in UI
- [x] Script is resumable — re-run only processes homes without descriptions
