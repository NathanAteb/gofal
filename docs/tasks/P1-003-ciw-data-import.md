---
id: 003
title: CIW initial data import script
department: DATA
priority: P1
status: backlog
assigned: unassigned
created: 2026-04-07
branch: data/ciw-initial-import
---

## What
Build the ciw-import.ts script that reads the CIW dataset CSV/JSON, normalises it, geocodes postcodes, and upserts into Supabase.

## Acceptance criteria
- [ ] Script reads CSV from /data/ciw/raw/
- [ ] All field mappings from agents/DATA_AGENT.md implemented
- [ ] County names normalised using the countyMap
- [ ] Slugs generated for all homes (no duplicates)
- [ ] Postcodes geocoded via postcodes.io
- [ ] Upserts to Supabase — no deletes
- [ ] Import errors logged to /data/ciw/import-errors/
- [ ] Summary report printed on completion
- [ ] Script is safe to re-run (idempotent)

## Notes
Email CIWInformation@gov.wales to request dataset if not already received.
Depends on: #002 (Supabase must exist)

## Related tasks
- Depends on: #002
- Blocks: #005, #006
