---
id: 008
title: Enquiry form and email notification
department: ARCHITECT
priority: P1
status: backlog
assigned: unassigned
created: 2026-04-07
branch: feature/enquiry-form
---

## What
Build the enquiry form on care home profile pages. On submission: save to Supabase, email the care home, send confirmation to the family.

## Acceptance criteria
- [ ] Form fields: name, email, phone, care type, timeline, welsh_speaker checkbox, message
- [ ] Validates all required fields before submission
- [ ] POST /api/enquiries saves to Supabase
- [ ] Email to care home via Resend (if email exists)
- [ ] Confirmation email to family via Resend
- [ ] Success state shown after submit
- [ ] Welsh language version of all labels and messages
- [ ] Rate limiting: max 3 submissions per IP per hour

## Related tasks
- Depends on: #002, #007
