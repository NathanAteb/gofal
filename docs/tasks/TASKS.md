# gofal.wales — Agent Task System

One codebase. Five agents. One task queue.

Every agent reads this file first. Then reads their own CLAUDE.md. Then checks `/tasks/backlog/` for tasks tagged to their department.

---

## How it works

Tasks live as markdown files in `/tasks/`. Each agent:
1. Reads `TASKS.md` (this file)
2. Reads their own `agents/[AGENT].md`
3. Scans `/tasks/backlog/` for tasks matching their department tag
4. Claims the highest-priority unclaimed task
5. Moves it to `/tasks/in-progress/`
6. Does the work
7. Opens a PR
8. Moves the task to `/tasks/done/`

The Architect also reviews and merges all PRs as they come in.

---

## Task file format

Every task is a markdown file named `[PRIORITY]-[ID]-[slug].md`:

```
/tasks/backlog/P1-042-ciw-ratings-scraper.md
/tasks/backlog/P2-043-county-page-carmarthenshire.md
/tasks/in-progress/P1-041-search-filters.md
/tasks/done/P1-040-homepage-hero.md
```

**Priority:**
- `P1` — Must do this week
- `P2` — Do this sprint
- `P3` — Backlog, do when capacity allows

**Task file template:**
```markdown
---
id: 042
title: Build CIW ratings scraper
department: DATA
priority: P1
status: backlog
assigned: unassigned
created: 2026-04-07
branch: data/ciw-ratings-scraper
---

## What
[Clear description of what needs to be done]

## Why
[Why this matters to the product]

## Acceptance criteria
- [ ] [Specific thing that must be true when done]
- [ ] [Another thing]
- [ ] [Another thing]

## Notes
[Any additional context, links, or references]

## Related tasks
- Depends on: #[id]
- Blocks: #[id]
```

---

## Department tags

| Tag | Agent |
|-----|-------|
| `ARCHITECT` | The Architect |
| `SEO` | The SEO Strategist |
| `CONTENT` | The Content Writer |
| `BRAND` | The Brand Guardian |
| `DATA` | The Data Agent |
| `QA` | The QA Agent |

Some tasks have multiple tags — any matching agent can pick them up.

---

## Claiming a task

When you start a task:

```bash
# Move from backlog to in-progress
mv tasks/backlog/P1-042-ciw-ratings-scraper.md tasks/in-progress/

# Update the frontmatter
# status: backlog → in-progress
# assigned: unassigned → [your agent name]

# Commit the claim
git add tasks/
git commit -m "chore: claim task #042 ciw-ratings-scraper [DATA]"
git push origin main
```

---

## Completing a task

When your PR is merged:

```bash
# Move to done
mv tasks/in-progress/P1-042-ciw-ratings-scraper.md tasks/done/

# Update frontmatter
# status: in-progress → done
# Add: completed: 2026-04-09
# Add: pr: 42

git add tasks/
git commit -m "chore: complete task #042 ciw-ratings-scraper [DATA]"
git push origin main
```

---

## Task priority rules

- Always work P1 before P2 before P3
- Never have more than 2 tasks in-progress per agent at once
- If a task is blocked, leave a comment in the task file and move to the next available task
- If you discover a new task while working, add it to `/tasks/backlog/` immediately

---

## How the Architect manages flow

At the start of every session, The Architect:

```bash
# Check open PRs
gh pr list

# Check what's in progress
ls tasks/in-progress/

# Review backlog and reprioritise if needed
ls tasks/backlog/

# Add new tasks if needed
# Merge any complete PRs
```
