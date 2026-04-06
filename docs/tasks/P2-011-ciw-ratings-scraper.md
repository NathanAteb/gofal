---
id: 011
title: Weekly CIW ratings scraper via GitHub Actions
department: DATA
priority: P2
status: backlog
assigned: unassigned
created: 2026-04-07
branch: data/ciw-ratings-scraper
---

## What
Build the weekly automated scraper that checks CIW service pages, extracts the 4 theme ratings, and updates Supabase. Set up GitHub Actions cron job.

## Acceptance criteria
- [ ] Scraper hits each care home's CIW directory page
- [ ] Extracts all 4 rating themes correctly
- [ ] Respects 1 req/2 sec rate limit
- [ ] Logs rating changes to /data/ciw/rating-changes/
- [ ] Creates GitHub issue for any 404 homes
- [ ] GitHub Actions workflow runs every Monday 6am UTC
- [ ] Manual trigger available via workflow_dispatch
- [ ] Dry-run mode available (--dry-run flag)

## Related tasks
- Depends on: #002, #003
