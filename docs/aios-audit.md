# AIOS Audit — gofal.wales
**Date:** 2026-04-20
**Auditor:** Claude Code (Opus 4.6)
**Workspace:** /Users/nathanbowen/Downloads/gofal
**Branch:** feat/enhanced-profile-page

---

## 1. Context Layer Audit

### What business context currently exists

| Asset | Location | Quality |
|-------|----------|---------|
| Master project brief | `/CLAUDE.md` | Excellent — full stack, schema, brand, mission, env vars |
| Definition of Done | `/DEFINITION_OF_DONE.md` | Excellent — 326-line checklist, ~95% ticked |
| Brand system | `/docs/agents/BRAND.md` | Excellent — full colour palette, typography, component patterns |
| Brand guardian SOP | `/docs/agents/BRAND_GUARDIAN.md` | Good — enforcement rules |
| Content voice guide | `/docs/agents/CONTENT_WRITER.md` | Excellent — ICP, tone, Welsh register rules, emotional context |
| SEO strategy | `/docs/agents/SEO_STRATEGIST.md` | Excellent — keyword tiers, competitor analysis, meta templates |
| Data pipeline SOP | `/docs/agents/DATA_AGENT.md` | Excellent — CIW import, scraper, quality checks |
| Architecture SOP | `/docs/agents/ARCHITECT.md` | Good — infrastructure and workflow |
| QA SOP | `/docs/agents/QA_AGENT.md` | Good — test strategy, Lighthouse targets |
| Task backlog | `/docs/tasks/` | Good — 23 task files, prioritised P1-P3 |
| Profile audit | `/reports/profile-audit/2026-04-16.md` | Excellent — brutal honesty about seed data |
| Marketing content | `/src/content/marketing/` | Good — LinkedIn posts, outreach emails, press release |

### What's missing

| Gap | Impact |
|-----|--------|
| **ICP document** — no standalone Ideal Customer Profile for care homes (providers) or families (consumers) | Medium — buried in Content Writer doc but not formalised |
| **Revenue model doc** — pricing tiers mentioned but no unit economics, CAC, LTV, churn targets | High — no financial model accessible to AI |
| **Competitor tracking** — SEO doc has competitors but no live monitoring or data | Medium |
| **Sales playbook** — outreach emails exist but no pipeline stages, follow-up cadence, objection handling | High — the Ateb upsell path is undocumented |
| **Analytics dashboard spec** — Vercel Analytics installed but no KPI definitions | High |
| **Incident/on-call runbook** — no ops documentation for production issues | Medium |
| **Welsh language QA checklist** — referenced in Content Writer but no standalone artefact | Low |
| **Roadmap / OKRs** — no quarterly goals or feature roadmap | Medium |
| **Meeting notes / decision log** — no record of strategic decisions | Medium |
| **Customer research** — no user interviews, survey data, or feedback loops | High |

### Fresh Session Score: **7/10**

A fresh Claude Code session gets an excellent understanding of the *product* (what to build and how). It gets almost zero understanding of the *business* (revenue targets, sales pipeline, customer feedback, strategic priorities beyond "build the directory"). The CLAUDE.md is outstanding for code agents but doesn't equip an AI to make business decisions.

---

## 2. Data Layer Audit

### Connected data sources

| Source | Integration | Status | Location |
|--------|------------|--------|----------|
| **Supabase (PostgreSQL)** | Direct client (`@supabase/supabase-js`, `@supabase/ssr`) | Active | `src/lib/supabase/client.ts`, `server.ts` |
| — `care_homes` table | ~245 records (SEED DATA — not real CIW) | Populated but fake | `supabase/migrations/001_initial_schema.sql` |
| — `care_home_profiles` table | 1:1 with care_homes | Populated but templated | Same migration |
| — `enquiries` table | Stores family enquiries | Schema ready, no real data | Same |
| — `claims` table | Stores listing claims | Schema ready, no real data | Same |
| **Stripe** | Checkout + webhook handler | Configured | `src/app/api/stripe/checkout/route.ts`, `webhook/route.ts` |
| **Resend (email)** | Transactional emails (enquiry, claim, contact) | Configured | `src/app/api/enquiry/route.ts`, `claim/route.ts`, `contact/route.ts` |
| **Unsplash** | Image fallbacks for care homes | Active | `src/lib/utils/unsplash.ts` |
| **Vercel Analytics** | Page views | Installed (`@vercel/analytics`) | Package dependency |
| **Sentry** | Error monitoring | Installed but NOT configured | `@sentry/nextjs` in package.json, no instrumentation |
| **Leaflet/OpenStreetMap** | Maps | Active | `src/components/maps/` |
| **CIW CSV exports** | Manual import | Script exists, data is seed | `data/ciw-export.csv`, `scripts/import-ciw-data.ts` |
| **postcodes.io** | Geocoding | Script exists | `scripts/geocode-postcodes.ts` |
| **Google Places** | Enrichment (phone, website, photos) | Script exists | `scripts/enrich-google.ts` |
| **Supabase MCP** | Claude Code database access | Active | `.mcp.json` |
| **Motion MCP** | Animation development | Active | `.mcp.json` |
| **Fireflies MCP** | Meeting transcripts | Available (Claude Code tool) | MCP server config |

### Data NOT connected (should be for full AIOS)

| Data Source | Why It Matters | Priority |
|-------------|---------------|----------|
| **Google Analytics / Search Console** | Traffic, conversions, keyword rankings — the core growth metrics | Critical |
| **Stripe dashboard data** | Revenue, MRR, churn, payment failures — financial health | Critical |
| **CRM / sales pipeline** | Which care homes are in outreach, who's responded, conversion rates | Critical |
| **Fireflies transcripts** (connected to MCP but not to codebase) | Meeting insights, sales call analysis, action items | High |
| **Google Sheets** (mentioned in your image) | P&L, marketing KPIs, bookings — business intelligence | High |
| **Email analytics (Resend)** | Open rates, bounce rates on outreach emails | High |
| **CIW live API / RSS** | Real-time inspection updates instead of manual CSV | High |
| **Social media metrics** | LinkedIn post performance, engagement | Medium |
| **Hotjar / session recordings** | User behaviour on the site | Medium |
| **Calendly / booking data** | Demo bookings for Ateb upsell | Medium |
| **Skool** (mentioned in your image) | Community engagement metrics | Medium |
| **Bitly** (mentioned in your image) | Link tracking, campaign attribution | Low |
| **YouTube** (mentioned in your image) | Channel analytics, content performance | Low |

---

## 3. Intelligence Layer Audit

### Where AI currently does reasoning

| Instance | Location | Type | Notes |
|----------|----------|------|-------|
| **Content enrichment** — template-based description generation | `scripts/enrich-content.ts` | String templating (NOT AI) | Generates descriptions from data fields. No LLM call. |
| **Active Offer detection** — keyword matching in report text | `src/lib/utils/active-offer.ts` | Rule-based scoring | Pattern matching against keyword lists. Not ML. |
| **Agent SOPs** — 6 agent role definitions | `docs/agents/*.md` | Prompt engineering for Claude Code | Excellent prompts but only used when a human starts a session |

### Verdict: ZERO live AI reasoning in the production application

There are no Claude API calls, no OpenAI calls, no LLM integrations, no prompt templates in the application code. The `enrich-content.ts` script uses string templates, not AI generation. The agent SOPs are instructions for Claude Code sessions, not autonomous systems.

### Where AI reasoning SHOULD exist

| Capability | Description | Impact | Effort |
|------------|-------------|--------|--------|
| **Daily business briefing** | AI reads Supabase (enquiries, claims, traffic), Stripe (revenue), email (opens/bounces), and produces a morning briefing for Nathan | High | 8h |
| **Enquiry quality scoring** | Score incoming enquiries by likelihood to convert (timeline, care type, location match) | High | 4h |
| **Care home description generation** | Replace template strings with LLM-generated bilingual descriptions using real CIW data | High | 6h |
| **Outreach email personalisation** | Generate personalised outreach emails per care home using their CIW data, Active Offer level, location | High | 6h |
| **Weekly SEO analysis** | AI reads Search Console data, identifies keyword movements, suggests content priorities | Medium | 8h |
| **Anomaly detection** | Flag unusual patterns: traffic drops, enquiry spikes, rating changes, failed payments | Medium | 6h |
| **Sales call prep** | Before a care home demo call, AI pulls CIW data, Google reviews, competitor analysis, and generates a briefing doc | Medium | 8h |
| **Content calendar generation** | AI analyses trending care topics, seasonal patterns, and generates monthly content plans | Medium | 4h |
| **Welsh translation QA** | AI reviews Welsh content for mutation errors, register inconsistencies, Google Translate artifacts | Medium | 6h |
| **Churn prediction** | Identify claimed listings likely to downgrade based on engagement patterns | Low | 12h |

---

## 4. Automation Layer Audit

### Currently automated (end-to-end, no human intervention)

| Automation | Trigger | Action | Status |
|------------|---------|--------|--------|
| **Enquiry email notification** | Family submits enquiry form | Save to Supabase → email care home → confirm to family | Working |
| **Claim verification email** | Provider submits claim form | Generate token → send verification email | Working |
| **Stripe webhook → tier upgrade** | `checkout.session.completed` event | Update `listing_tier` and `is_featured` in Supabase | Working |
| **ISR page regeneration** | 24-hour timer | Next.js revalidates care home and county pages | Working |
| **Vercel deployment** | Git push to main | Build + deploy on Vercel | Working |

### NOT automated (specified in SOPs but not implemented)

| Automation | Specified In | Status |
|------------|-------------|--------|
| **Weekly CIW ratings scraper** | `docs/agents/DATA_AGENT.md` | Script exists (`scripts/scrape-ciw.ts`) but NO GitHub Actions workflow file found |
| **Weekly data quality check** | `docs/agents/DATA_AGENT.md` | Script spec exists but no cron/workflow |
| **Weekly SEO report** | `docs/agents/SEO_STRATEGIST.md` | Specified but not built |
| **DOD completion check** | `DEFINITION_OF_DONE.md` | Script referenced (`scripts/standups/check-completion.ts`) but not scheduled |
| **Outreach email sequences** | `src/content/marketing/outreach-emails.ts` | Templates exist but no sending automation |
| **Backlink monitoring** | `docs/agents/SEO_STRATEGIST.md` | CSV format defined, not automated |

### Top 5 manual tasks that should be automated

| # | Task | Current State | Automation Approach | Effort |
|---|------|--------------|---------------------|--------|
| 1 | **CIW data refresh** | Manual CSV download + script run | GitHub Actions cron → scrape CIW → upsert Supabase | 6h |
| 2 | **Outreach email sequences** | Copy/paste templates manually | Resend + Supabase trigger: new listing → 3-email drip over 14 days | 8h |
| 3 | **Daily KPI snapshot** | Nathan checks dashboards manually | Cron job → query Supabase + Stripe + Vercel → post to Slack/email | 6h |
| 4 | **SEO monitoring** | Manual Search Console checks | API pull → compare week-over-week → alert on drops | 8h |
| 5 | **Claim follow-up** | No follow-up after verification email | If no claim verification in 48h → send reminder. If claimed but no profile edit in 7d → send prompt | 4h |

---

## 5. AIOS Readiness Score

### Overall: **28/100**

| Layer | Score | Max | Notes |
|-------|-------|-----|-------|
| **Context** | 18 | 25 | Excellent product context (CLAUDE.md, agent SOPs, brand system). Missing: business strategy, financials, customer data, decision log. |
| **Data** | 8 | 25 | Supabase schema is solid but populated with seed data. Stripe/Resend configured but no analytics pipeline. No external data feeds connected. No unified data layer. |
| **Intelligence** | 0 | 25 | Zero AI reasoning in production. No Claude API calls, no prompt templates, no scoring, no analysis, no generation. The agent SOPs are brilliant but inert — they only work when a human starts a Claude Code session. |
| **Automation** | 2 | 25 | 5 basic automations working (email triggers, webhook, ISR, CI/CD). But no cron jobs, no scheduled tasks, no autonomous workflows, no monitoring, no alerting. The "never stop" loop in CLAUDE.md is aspirational, not implemented. |

### Score breakdown rationale

**Context (18/25):** The documentation is genuinely excellent for its purpose — guiding Claude Code to build the product. But an AIOS needs business context too: revenue targets, customer segments, sales pipeline stages, competitive intelligence feeds. The ICP is buried in a content writer doc. There's no financial model. No decision log.

**Data (8/25):** The database schema is well-designed and the Supabase integration is clean. But: (a) all data is fake seed data, (b) no analytics pipeline exists, (c) Stripe data stays in Stripe, (d) email metrics stay in Resend, (e) no CRM, (f) no way for AI to access a unified view of business health. You have MCP connections to Fireflies and Supabase, but they're not feeding into any intelligence layer.

**Intelligence (0/25):** This is the biggest gap. There is literally no AI reasoning happening autonomously. The `enrich-content.ts` uses string concatenation, not LLM generation. The agent SOPs describe what AI *should* do but none of it runs without a human sitting in a Claude Code session typing commands.

**Automation (2/25):** The 5 existing automations are table-stakes web app features (send email on form submit, process webhook). None of the SOP-specified automations (weekly scraper, data quality checks, SEO reports) are actually deployed. There's no cron, no scheduled functions, no event-driven workflows beyond the Stripe webhook.

---

## 6. Build Plan — Path to AIOS

### Phase 1: Data Foundation (Week 1) — Prerequisite for everything else

| # | Task | Effort | Impact | Dependencies |
|---|------|--------|--------|-------------|
| 1.1 | **Import real CIW data** — replace all 245 seed records with real care home data from CIW register | 4h | Critical | CIW CSV (already have `data/ciw-export.csv`) |
| 1.2 | **Run geocoding** on real postcodes via postcodes.io | 2h | High | 1.1 |
| 1.3 | **Run Google Places enrichment** — phone, website, photos, ratings for all homes | 4h | High | 1.1 |
| 1.4 | **Generate real descriptions** with Claude API — bilingual, using actual CIW inspection data | 6h | High | 1.1 |
| 1.5 | **Activate Sentry** — instrument error monitoring (package already installed) | 1h | Medium | None |

### Phase 2: Intelligence Layer (Week 2) — Make AI do reasoning

| # | Task | Effort | Impact | Dependencies |
|---|------|--------|--------|-------------|
| 2.1 | **Add Claude API integration** — create `src/lib/ai/claude.ts` with reusable client, rate limiting, cost tracking | 3h | Critical | Anthropic API key |
| 2.2 | **Enquiry scoring** — when enquiry comes in, Claude scores it 1-10 for conversion likelihood, adds score to DB | 4h | High | 2.1 |
| 2.3 | **Outreach email personalisation** — generate custom email per care home using their CIW profile | 6h | High | 2.1, 1.1 |
| 2.4 | **Daily briefing generator** — Supabase Edge Function runs at 7am, queries all data sources, generates markdown briefing, emails Nathan | 8h | High | 2.1 |
| 2.5 | **Welsh content QA agent** — Claude reviews Welsh text for mutation errors on content changes | 4h | Medium | 2.1 |

### Phase 3: Automation Layer (Week 3) — Make things run without humans

| # | Task | Effort | Impact | Dependencies |
|---|------|--------|--------|-------------|
| 3.1 | **Weekly CIW scraper** — deploy as Supabase Edge Function or GitHub Actions cron | 6h | High | 1.1 |
| 3.2 | **Outreach drip sequence** — new listing → automated 3-email sequence over 14 days via Resend | 8h | High | 2.3 |
| 3.3 | **Claim follow-up automation** — reminder emails at 48h and 7d if no action | 4h | High | None |
| 3.4 | **KPI snapshot cron** — daily query of Supabase + Stripe → store metrics → email digest | 6h | Medium | Stripe API access |
| 3.5 | **SEO monitoring** — weekly Search Console API pull → trend analysis → alert on drops | 8h | Medium | Search Console API |

### Phase 4: Context Enhancement (Week 4) — Feed the brain

| # | Task | Effort | Impact | Dependencies |
|---|------|--------|--------|-------------|
| 4.1 | **Business context doc** — create `/docs/business/` with ICP, revenue model, unit economics, sales playbook | 4h | High | Nathan input |
| 4.2 | **Connect Fireflies** — pipe meeting transcripts into Supabase, extract action items with Claude | 6h | Medium | Fireflies MCP |
| 4.3 | **Connect Google Sheets** — sync P&L and marketing KPIs into queryable format | 4h | Medium | Google Sheets API |
| 4.4 | **Decision log** — create `/docs/decisions/` for ADRs (Architecture Decision Records) and strategic decisions | 2h | Medium | None |
| 4.5 | **Competitive monitoring** — weekly scrape of Lottie/carehome.co.uk Welsh pages, diff report | 6h | Low | None |

### Phase 5: Full AIOS Loop (Week 5-6) — Autonomous operations

| # | Task | Effort | Impact | Dependencies |
|---|------|--------|--------|-------------|
| 5.1 | **Unified dashboard API** — single endpoint returning all business metrics (Supabase + Stripe + Vercel + Resend) | 8h | High | All Phase 3 |
| 5.2 | **Weekly strategic briefing** — AI analyses all data, identifies trends, recommends next actions | 8h | High | 5.1, 2.1 |
| 5.3 | **Anomaly alerting** — real-time detection of traffic drops, enquiry spikes, payment failures | 6h | High | 5.1 |
| 5.4 | **Autonomous content generation** — AI identifies content gaps from search data, generates briefs, drafts articles | 12h | Medium | 3.5, 2.1 |
| 5.5 | **Sales pipeline automation** — track outreach → claim → upgrade → Ateb upsell as a full funnel with AI-generated next actions | 12h | High | 3.2, 2.2 |

---

## Summary

### What you have
- A beautifully built Next.js product with excellent documentation
- 6 detailed agent SOPs that are among the best prompt engineering I've seen
- Clean Supabase schema, Stripe integration, email infrastructure
- Comprehensive brand system and bilingual content

### What you don't have
- Real data (everything is seed/fake)
- Any AI reasoning in production (zero Claude API calls)
- Any scheduled automation (no crons, no background jobs)
- Business intelligence (no analytics pipeline, no KPI tracking)
- Connected external data sources (Stripe/Resend/Analytics data stays siloed)

### The gap in one sentence
**You've built a production-quality shell with world-class documentation, but there is no intelligence, no real data, and no automation running inside it.**

### Fastest path to value
1. Import real CIW data (4h) — this unblocks everything
2. Add Claude API client (3h) — this enables the intelligence layer
3. Deploy daily briefing (8h) — this gives Nathan immediate daily value
4. Deploy outreach drip (8h) — this starts the revenue engine

**Total to reach "minimum viable AIOS": ~23 hours of focused work.**

After that, each additional capability (scoring, monitoring, strategic analysis) is additive and can be built incrementally. The architecture is already clean enough to support all of it.
