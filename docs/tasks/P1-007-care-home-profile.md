---
id: 007
title: Individual care home profile page
department: ARCHITECT
priority: P1
status: backlog
assigned: unassigned
created: 2026-04-07
branch: feature/care-home-profile
---

## What
Build the care home profile page at /cartrefi-gofal/[county]/[town]/[slug].

## Acceptance criteria
- [ ] All 4 CIW rating themes displayed clearly (Wellbeing, Care & Support, Leadership, Environment)
- [ ] Active Offer level with star badges
- [ ] Link to CIW inspection report PDF
- [ ] Claim listing CTA if is_claimed=false
- [ ] Sticky enquiry panel (desktop) / bottom sheet (mobile)
- [ ] Photo gallery if photos exist
- [ ] Fee range displayed
- [ ] LocalBusiness JSON-LD structured data
- [ ] Breadcrumb: gofal.wales > [County] > [Town] > [Home Name]
- [ ] "CIW" not "CQC" everywhere — run grep before PR

## Related tasks
- Depends on: #002, #003, #004, #006
