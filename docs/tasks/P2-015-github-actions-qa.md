---
id: 015
title: GitHub Actions QA workflow — runs on every PR
department: QA
priority: P2
status: backlog
assigned: unassigned
created: 2026-04-07
branch: qa/github-actions-workflow
---

## What
Set up the GitHub Actions workflow that runs build, typecheck, lint, unit tests, and Lighthouse on every PR. The Architect cannot merge until this passes.

## Acceptance criteria
- [ ] Workflow triggers on all pull_request events
- [ ] Steps: checkout, node setup, npm ci, build, typecheck, lint, test:unit
- [ ] Lighthouse CI runs against preview URL
- [ ] Lighthouse thresholds: performance 90+, accessibility 95+
- [ ] Workflow badge in README
- [ ] Fails loudly with clear error messages

## Related tasks
- Depends on: #001
