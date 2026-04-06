---
id: 022
title: Database migration for content enrichment columns
department: DATA
priority: P1
status: backlog
assigned: unassigned
created: 2026-04-07
branch: data/migration-005-enrichment-columns
---

## What
Add the columns needed by the content enrichment pipeline to the care_homes table.

## Acceptance criteria
- [ ] Migration file: supabase/migrations/005_enrichment_columns.sql
- [ ] Adds: google_place_id text, google_rating decimal, google_review_count integer, google_photos text[], enrichment_status text default 'pending', enrichment_date timestamptz
- [ ] Migration runs cleanly on existing data
- [ ] Supabase Storage bucket 'photos' created with public access policy

## SQL
ALTER TABLE care_homes
  ADD COLUMN IF NOT EXISTS google_place_id text,
  ADD COLUMN IF NOT EXISTS google_rating decimal,
  ADD COLUMN IF NOT EXISTS google_review_count integer,
  ADD COLUMN IF NOT EXISTS google_photos text[],
  ADD COLUMN IF NOT EXISTS enrichment_status text default 'pending',
  ADD COLUMN IF NOT EXISTS enrichment_date timestamptz;

## Notes
Must run BEFORE enrich-content.ts is executed.
Depends on: #002 (base schema)
Blocks: #021 (enrichment pipeline)
