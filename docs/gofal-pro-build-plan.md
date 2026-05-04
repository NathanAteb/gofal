# Gofal Pro — Build Plan

Productised paid tier of gofal.wales. **£99/month, no setup fee.** Time-box: 10 working days end to end.

This doc tracks what's done and what's next. Update as you ship.

---

## Day 1-2 — Schema + renderer · DONE

- [x] Migration `006_gofal_pro_tables.sql` — four tables (`gofal_subscriptions`, `gofal_page_content`, `gofal_page_photos`, `gofal_contact_submissions`), RLS, indexes
- [x] Applied to Supabase
- [x] Auto-population library at `src/lib/gofal/auto-populate.ts` — bilingual deterministic templates from CIW data, no LLM at runtime
- [x] `ProPage` component at `src/components/gofal-pro/ProPage.tsx` — fixed template, EN/CY toggle (Welsh-first default), all sections per spec including SoP and compliance placeholders
- [x] Tier-aware rendering wired into existing `/cartrefi-gofal/[slug]` route — Pro subscription renders `ProPage`, free tier falls through to existing `CareHomeProfile`
- [x] `/upgrade/[slug]` landing page — free vs Pro at £99/mo, FAQ, Cartrefi-branded
- [x] API route stubs:
  - `/api/gofal/contact-form` — POST handler with Resend forwarding (live)
  - `/api/gofal/subscribe` — Stripe webhook scaffold (returns 501 until Day 3)
  - `/api/gofal/welsh-verify-request` — admin queue (live)

## Day 3-4 — Stripe + subscription flow

- [ ] Create Stripe product "Gofal Pro" at £99/mo GBP, recurring monthly, no trial, no setup fee, UK VAT inclusive
- [ ] `STRIPE_GOFAL_PRO_PRICE_ID` added to env (gated to NEXT_PUBLIC_ where needed for client checkout)
- [ ] Implement `/api/stripe/checkout/gofal-pro` POST — creates Stripe Checkout Session with `client_reference_id = ciw_service_id`, `success_url = /onboarding/welcome?slug={slug}`, `cancel_url = /upgrade/{slug}`
- [ ] Implement `/checkout/[slug]` page — calls the checkout API and redirects to Stripe-hosted checkout (do not build our own card form)
- [ ] Replace 501 stub in `/api/gofal/subscribe`:
  - Verify Stripe signature using `STRIPE_WEBHOOK_SECRET`
  - On `checkout.session.completed`: insert `gofal_subscriptions` row with `tier='pro'`, `pro_started_at=NOW()`, `pro_subscription_id=session.subscription`. Seed `gofal_page_content` with auto-populated copy (call `autoHeroIntro` and `autoServicesDescription` from `auto-populate.ts`).
  - On `customer.subscription.updated`: update tier/status if needed
  - On `customer.subscription.deleted`: set `status='cancelled'`
  - On `invoice.payment_failed`: set `status='paused'`, send recovery email
- [ ] Add Stripe webhook endpoint to Stripe dashboard pointing at `/api/gofal/subscribe` (or `/api/stripe/webhook` if there's an existing dispatcher — check the Ateb code first)
- [ ] Welcome email via Resend on subscription create — bilingual, includes login link, what to do next, support contact
- [ ] Decide: same Stripe account as Ateb or separate? Spec says "use existing Ateb Stripe if architecturally clean, else separate". Recommendation: same account, separate Product/Price IDs. Easier reconciliation, single VAT setup.

## Day 5-6 — Customer dashboard

- [ ] Wire Clerk auth (reuse Ateb Clerk instance per spec — Clerk env vars, middleware matcher includes `/dashboard/*`)
- [ ] After Stripe checkout, link the Clerk user.id to the subscription via a `claimed_by_clerk_id` column (add migration `007_gofal_clerk_link.sql`)
- [ ] `/dashboard` — index page with subscription overview + tabs
- [ ] `/dashboard/page-content` — form-based editor for hero, services description, contact details, opening/visiting hours (server actions; no client-side state library needed)
- [ ] `/dashboard/photos` — Supabase Storage upload, max 10 photos, max 5MB each, drag-to-reorder for `display_order`. Bucket: `gofal-photos`, public-read with size enforcement at upload time
- [ ] `/dashboard/enquiries` — list of `gofal_contact_submissions` rows, mark as actioned, search by date
- [ ] `/dashboard/billing` — Stripe Customer Portal redirect for plan management (don't reimplement)
- [ ] RLS policy update: customer can read+write their own `gofal_page_content`, `gofal_page_photos` rows when authenticated as the linked Clerk user

## Day 7 — Onboarding + Welsh-medium flow

- [ ] `/onboarding/welcome` — three-step optional flow, customer can skip
  1. Confirm contact details (pre-filled from CIW, editable)
  2. Upload logo + min 3 photos (skippable, min is soft)
  3. Welsh-medium status (Yes / No / Some shifts only / I'll decide later)
- [ ] **Critical: do not block.** If customer hits `/dashboard` after Stripe success without completing onboarding, the page is already live with auto-populated content. Onboarding is enrichment, not gating.
- [ ] If "Yes" or "Some shifts only", show the deployment-notes textarea and POST `/api/gofal/welsh-verify-request`
- [ ] Welsh-medium badge appears on the Pro page as soon as `welsh_medium_declared=true` (says "Welsh-speaking staff available")
- [ ] "Verified" tooltip text only appears once `welsh_medium_verified_at` is set (manual SQL update by Nathan/Andrew after a verification call)

## Day 8 — Custom subdomain + custom domain

- [ ] Wildcard DNS: add `*.gofal.wales` CNAME at the registrar pointing to the Vercel production deployment
- [ ] Add `*.gofal.wales` as a wildcard domain in the Vercel project settings
- [ ] Middleware at `src/middleware.ts` — extract subdomain from host header. If subdomain matches a `custom_subdomain` in `gofal_subscriptions`, rewrite the request to `/cartrefi-gofal/{slug}` while preserving the host so canonical URLs render right
- [ ] Custom domain attachment via Vercel REST API:
  - `POST /api/gofal/custom-domain` — adds `custom_domain` to subscription, calls Vercel Domains API to attach to the project, returns DNS instructions to the customer
  - `GET /api/gofal/custom-domain/[id]/status` — polls Vercel for SSL provisioning state
- [ ] DNS instructions email template — CNAME at customer's registrar pointing to `cname.vercel-dns.com`

## Day 9-10 — Polish, smoke test, internal QA

- [ ] **Five smoke-test scenarios** (per spec):
  1. Welsh-named single-site care home — bilingual render, badge available, custom subdomain works
  2. English-named multi-site nursing home — render, contact form delivers, no Welsh overclaim
  3. Domiciliary service — no bed-count copy, services scoped right
  4. Customer skips onboarding — page live in 60s with CIW-only content, no broken sections
  5. Customer edits everything — changes persist, EN/CY independent, photos upload + reorder
- [ ] Lighthouse audit — Pro page must score ≥90 on Performance, Accessibility, SEO on mobile
- [ ] Welsh copy linguistic review — get a Welsh speaker to validate `auto-populate.ts` strings before launch
- [ ] Open-graph and Twitter card meta tags on Pro pages (use the customer's logo or first photo)
- [ ] `robots.txt` — confirm Pro pages and `/upgrade/*` are indexable; `/dashboard/*` and `/onboarding/*` are noindex
- [ ] Sitemap entry generation — Pro custom-subdomain pages need their own sitemap entries (Google won't auto-discover wildcard subdomains)

---

## Phase-2 (post-launch, do NOT build in v1)

- Multi-site bulk subscription (one operator paying for 12 sites under one account) — wait for first multi-site customer to ask
- Per-customer analytics dashboard (page visits, enquiry conversion) — wait for customer signal
- Custom CSS / theme editor — locked to gofal palette + optional `primary_colour` override only
- Reviews / testimonials section — UK regulatory minefield, needs legal advice first
- Cross-pitching Ateb Care from Pro pages — funnel is one-way for now: gofal claim → Pro → email nurture → Nathan-direct Ateb Care pitch

---

## Strategic discipline checks (re-read before every PR)

- [ ] This is **a tier of gofal.wales**, not a website service. If the build drifts toward bespoke design, stop and revert.
- [ ] **Auto-population from CIW is the leverage.** Every customer-editable field has a sensible auto-populated default. Page is shippable from CIW data alone.
- [ ] **Welsh-medium badge says "staff available"**, not "AI speaks Welsh" or "Welsh-medium service" (the latter has a regulatory definition). Keep the discipline.
- [ ] **No new brand.** "Gofal Pro" is a tier. No new logos, palette, or marketing site.
- [ ] **No annual prepayment discount in v1.** Monthly only. Test PMF before optimising retention pricing.
- [ ] **No bundling Llais (Welsh voice)** into Pro. Llais is Ateb Care infrastructure, separate roadmap.
- [ ] **30-minute QA per customer cap.** If the build drifts to per-customer manual work, stop.

---

## Pricing reference (for copy)

- **Gofal Pro:** £99/month, GBP, monthly billing, no setup fee, no annual discount, cancel any time, VAT applicable
- **Free tier:** £0 forever, default for every CIW-registered service
- **NOT yet:** Pro Plus or any higher tier — defer

---

## Wave 1 outreach prospect list

After launch, run outreach against the **176-strong single-site no-website Wave 1 list** already in the data — see `reports/care-services-no-website-2026-05-04.csv`, filter `Operator's total sites = 1` and `Service type = Care Home Service`.
