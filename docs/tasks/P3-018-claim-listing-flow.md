---
id: 018
title: Claim listing flow for care home managers
department: ARCHITECT
priority: P3
status: backlog
assigned: unassigned
created: 2026-04-07
branch: feature/claim-listing
---

## What
Build the flow that allows care home managers to claim their free listing: form submission, email verification, profile editor.

## Acceptance criteria
- [ ] "Claim your free listing" CTA on unclaimed care home profiles
- [ ] Claim form: name, email, role at care home
- [ ] POST /api/claims saves claim + sends verification email
- [ ] Verification link at /hawlio/verify/[token]
- [ ] On verify: mark care_home is_claimed=true, create auth user
- [ ] Profile editor: description (Welsh + English), photos upload, services, fees, welsh language notes
- [ ] Supabase Storage for photo uploads
- [ ] Admin dashboard shows pending claims

## Related tasks
- Depends on: #002, #007, #008
