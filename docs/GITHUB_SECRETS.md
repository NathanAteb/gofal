# GitHub Secrets Setup Guide

Add these secrets to your GitHub repo before leaving.
Settings → Secrets and variables → Actions → New repository secret

---

## Required secrets

| Secret name | Where to get it | Notes |
|-------------|-----------------|-------|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys | Powers the standup and report scripts |
| `RESEND_API_KEY` | resend.com → API Keys | Sends morning reports to Nathan |
| `NATHAN_EMAIL` | Your email address | Where reports land |
| `SUPABASE_URL` | Supabase dashboard → Settings → API | Your project URL |
| `SUPABASE_SERVICE_KEY` | Supabase dashboard → Settings → API | Service role key (not anon) |
| `UNSPLASH_ACCESS_KEY` | unsplash.com/developers | Free tier, 50 req/hour |
| `GOOGLE_PLACES_API_KEY` | console.cloud.google.com → APIs & Services → Credentials | Free $200/month credit — plenty for 1,000 homes |
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions | No setup needed |

## Optional but recommended

| Secret name | Where to get it | Notes |
|-------------|-----------------|-------|
| `SENTRY_DSN` | sentry.io → Project → Settings | Error monitoring |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com | Only needed for payment features |

---

## Spending limits to set before leaving

### Anthropic API
console.anthropic.com → Settings → Billing → Usage limits
- Set monthly hard limit: $50
- Set soft limit alert at: $30

### Vercel
vercel.com → Settings → Billing
- Set spend limit if on Pro plan

### Resend
resend.com — free tier = 3,000 emails/month
Should be plenty for reports and transactional emails

### Unsplash
Free tier = 50 requests/hour, 5,000/month
No payment needed at this scale

---

## Verify secrets are set

After adding all secrets, run this workflow manually:
Actions → Morning Report → Run workflow

If you receive an email, everything is working.

## Added: Google Places API

| Secret name | Where to get it | Notes |
|-------------|-----------------|-------|
| `GOOGLE_PLACES_API_KEY` | console.cloud.google.com → APIs → Places API | Free tier: $200 credit/month. Enable "Places API" in the console. Covers full ~1,000 home enrichment easily. |

## New env var for .env.local
GOOGLE_PLACES_API_KEY=
