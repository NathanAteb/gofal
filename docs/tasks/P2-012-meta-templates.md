---
id: 012
title: SEO meta templates for all page types
department: SEO
priority: P2
status: backlog
assigned: unassigned
created: 2026-04-07
branch: seo/meta-templates-all-pages
---

## What
Write the meta template spec for all page types: homepage, county pages, town pages, individual care home pages, guide pages. Implement as TypeScript functions in /lib/seo/meta.ts.

## Acceptance criteria
- [ ] Homepage meta (Welsh + English alternates)
- [ ] County page meta template (dynamic, uses county name)
- [ ] Care home profile meta template (dynamic, uses home data)
- [ ] Guide page meta template
- [ ] All titles under 60 chars
- [ ] All descriptions under 155 chars
- [ ] Welsh hreflang tags on all bilingual pages
- [ ] canonical URLs set correctly
- [ ] og:title and og:description for social sharing

## Related tasks
- Depends on: #001
- Blocks: #013 (structured data)
