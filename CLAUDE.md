# gofal.wales — Master Project Brief

Wales' first Welsh-language care home directory and marketplace.

**Owner:** Nathan (Ateb AI, Llanelli)
**Stack:** Next.js 15 + Supabase + Vercel + Tailwind
**Domain:** gofal.wales
**Brand:** Cartref — heather purple, coral, honey, Poppins + Nunito

---

## YOU ARE THE ENTIRE AGENT TEAM

You operate as all 6 agents in one session. You have the full knowledge of:
- The Architect (code, infrastructure, git, merges)
- The SEO Strategist (keywords, meta, structured data, sitemaps)
- The Content Writer (Welsh + English copy, guides, UI strings)
- The Brand Guardian (design system, Cartref brand compliance)
- The Data Agent (CIW pipeline, database, geocoding)
- The QA Agent (tests, Lighthouse, accessibility, bug reports)

Apply the right expertise for each task. Switch roles fluidly. Never half-do anything.

---

## YOUR OPERATING LOOP — NEVER STOP

```
1. git pull origin main
2. Read DEFINITION_OF_DONE.md — find unchecked items
3. Read tasks/backlog/ — find highest P1 unclaimed task
4. If no P1 tasks exist — generate new tasks from unchecked DOD items
5. Claim the task (move to tasks/in-progress/, update frontmatter)
6. Create branch: git checkout -b [branch-name]
7. Do the complete work — every file, every string, every test
8. Commit frequently: git add -A && git commit -m "..."
9. Push: git push origin [branch]
10. Open PR: gh pr create --title "..." --body "..." --base main
11. Run checks: npm run build && npm run typecheck && npm run lint
12. Merge: gh pr merge --squash --delete-branch
13. Move task to tasks/done/, tick item in DEFINITION_OF_DONE.md
14. git checkout main && git pull origin main
15. Go to step 2. Never stop.
```

The loop ends only when every box in DEFINITION_OF_DONE.md is ticked.

---

## CRITICAL RULES — APPLY ALWAYS

- **Welsh first** — every user-facing string needs Welsh (default) and English
- **CIW not CQC** — run `grep -rn "CQC" app/ components/ content/` before every PR
- **Cartref brand** — read agents/BRAND.md before touching any UI
- **Never commit to main directly** — always branch → PR → merge
- **Conventional commits** — feat: fix: content: seo: data: brand: qa: chore:
- **Pull before push** — always `git pull --rebase origin main` before pushing
- **Test before merge** — `npm run build` must pass. No exceptions.
- **Lottie is the UX reference** — match their layout and UX patterns with our brand

---

## TECH STACK

```
Frontend:    Next.js 15 (App Router) + TypeScript
Styling:     Tailwind CSS
Database:    Supabase (PostgreSQL)
Auth:        Supabase Auth
Deployment:  Vercel
Email:       Resend
Payments:    Stripe
Images:      Unsplash API (free tier, attribution required)
Maps:        Leaflet (free, open source)
Testing:     Vitest + Playwright
Monitoring:  Sentry
Analytics:   Vercel Analytics
```

---

## BRAND SYSTEM (Cartref)

```
Primary:    Heather    #7B5B7E  — nav, links, headings
Primary DK: Bramble    #4A2F4E  — dark sections, footer
Primary LT: Lavender   #A68AAB  — hover states
Secondary:  Coral      #D4806A  — ALL CTAs and buttons
Accent:     Honey      #E5AD3E  — ratings, stars, AO badges
Background: Ivory      #FBF7F3  — page background (NEVER white)
Surface:    White      #FFFFFF  — cards only
Text:       Dusk       #2C2430  — all body text
Border:     Blush      #DDD4CE  — card borders

Fonts:      Poppins 700 (headings) + Nunito 400/600/700 (body)
Radius:     Pill (9999px) buttons · 16px cards · 24px containers
Shadow:     0 2px 12px rgba(44,36,48,0.08)
```

---

## DATABASE SCHEMA

```sql
care_homes: id, ciw_service_id, name, name_cy, address_line_1,
  address_line_2, town, county, postcode, phone, email, website,
  lat, lng, service_type, operator_name, registered_manager,
  registration_date, bed_count, local_authority,
  ciw_rating_wellbeing, ciw_rating_care_support,
  ciw_rating_leadership, ciw_rating_environment,
  ciw_last_inspected, ciw_report_url, active_offer_level(0-3),
  active_offer_verified, is_claimed, is_active, is_featured,
  listing_tier(free/enhanced/featured), slug, created_at, updated_at

care_home_profiles: id, care_home_id, description, description_cy,
  photos[], video_url, services[], amenities[], welsh_language_notes,
  weekly_fee_from, weekly_fee_to, accepts_local_authority, updated_at

enquiries: id, care_home_id, family_name, family_email, family_phone,
  care_needed_for, care_type, timeline, welsh_speaker, message,
  status(new/sent/responded/converted), created_at

claims: id, care_home_id, claimant_name, claimant_email,
  claimant_role, verification_token, verified, created_at
```

---

## WELSH COUNTIES (all 22)

Anglesey/Ynys Môn, Blaenau Gwent, Bridgend/Pen-y-bont,
Caerphilly/Caerffili, Cardiff/Caerdydd, Carmarthenshire/Sir Gaerfyrddin,
Ceredigion, Conwy, Denbighshire/Sir Ddinbych, Flintshire/Sir y Fflint,
Gwynedd, Merthyr Tydfil, Monmouthshire/Sir Fynwy,
Neath Port Talbot/Castell-nedd, Newport/Casnewydd,
Pembrokeshire/Sir Benfro, Powys, Rhondda Cynon Taf,
Swansea/Abertawe, Torfaen, Vale of Glamorgan/Bro Morgannwg,
Wrexham/Wrecsam

---

## ENVIRONMENT VARIABLES NEEDED

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL=agents@gofal.wales
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
UNSPLASH_ACCESS_KEY
SENTRY_DSN
NEXT_PUBLIC_SENTRY_DSN
NATHAN_EMAIL
```

---

## THE MISSION

gofal.wales is the Trojan horse for Ateb voice agents.
Directory brings care homes in → Ateb pitch closes the deal.
Every claimed listing = warm prospect at £300-500/month.

Build it like Lottie. Brand it like Cartref. Make it Welsh.
