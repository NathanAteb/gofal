---
id: 002
title: Supabase project setup and initial schema migration
department: ARCHITECT
priority: P1
status: backlog
assigned: unassigned
created: 2026-04-07
branch: data/migration-001-initial-schema
---

## What
Create the Supabase project and run migration 001 — the full care_homes, care_home_profiles, enquiries, and claims schema.

## Acceptance criteria
- [ ] Supabase project created
- [ ] Migration 001 runs cleanly
- [ ] All 4 tables exist with correct columns
- [ ] RLS policies set (public read on care_homes, authenticated write)
- [ ] SUPABASE_URL and SUPABASE_ANON_KEY added to Vercel env vars
- [ ] Supabase client initialised in /lib/supabase/client.ts and server.ts

## Related tasks
- Blocks: #003, #005, #008
