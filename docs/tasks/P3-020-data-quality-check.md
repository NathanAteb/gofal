---
id: 020
title: Weekly data quality check script
department: DATA
priority: P3
status: backlog
assigned: unassigned
created: 2026-04-07
branch: data/quality-check-script
---

## What
Build the data quality check script that runs weekly and reports on data issues across the care homes database.

## Acceptance criteria
- [ ] Checks all items listed in agents/DATA_AGENT.md quality checks section
- [ ] Creates GitHub issues for any new problems found
- [ ] Commits report to /reports/data/YYYY-MM-DD.md
- [ ] Can be run manually: npx ts-node scripts/data-quality-check.ts
- [ ] Outputs summary to console
- [ ] Safe to run against production

## Related tasks
- Depends on: #002, #003
