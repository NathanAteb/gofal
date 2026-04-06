---
id: 001
title: Next.js 15 project setup with Cartref brand tokens
department: ARCHITECT
priority: P1
status: backlog
assigned: unassigned
created: 2026-04-07
branch: feature/project-setup
---

## What
Initialise the Next.js 15 App Router project with TypeScript, Tailwind CSS configured with the Cartref brand tokens, and Google Fonts (Poppins + Nunito) loaded via next/font.

## Why
Nothing else can start until the foundation exists.

## Acceptance criteria
- [ ] `npm run build` passes clean
- [ ] `npm run typecheck` passes clean
- [ ] Tailwind config includes all Cartref colour tokens from BRAND.md
- [ ] Poppins and Nunito loaded via next/font — no external requests
- [ ] Ivory #FBF7F3 as default page background (not white)
- [ ] Basic folder structure matches agents/ARCHITECT.md project structure
- [ ] Deployed to Vercel and live at gofal.wales preview URL

## Notes
Read agents/BRAND.md before writing a single line of Tailwind config.
