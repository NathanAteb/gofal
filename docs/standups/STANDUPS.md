# gofal.wales — Standup & Reporting System

Two standups a day. One morning report to Nathan. All automated.

---

## Schedule

| Time | Event |
|------|-------|
| 09:00 UTC | Morning standup — all agents write updates |
| 16:00 UTC | Afternoon standup — all agents write updates |
| 07:30 UTC | Morning report compiled and sent to Nathan |

The 07:30 report covers the previous day's afternoon standup + overnight work, and each agent's plan for the day ahead.

---

## How standups work

Every agent writes to `/standups/YYYY-MM-DD-[am|pm]/[AGENT].md` at each standup.

GitHub Actions triggers the standup at 09:00 and 16:00 UTC. It runs a script that:
1. Creates the standup folder for the current slot
2. Triggers each agent to write their update
3. Commits the standup files to main

The morning report script runs at 07:30 UTC. It:
1. Reads all standup files from the previous 24 hours
2. Reads the current task backlog and in-progress states
3. Compiles everything into a single report
4. Sends it to Nathan via email (Resend) and commits it to /reports/daily/

---

## Standup file format

Each agent writes their own standup using this template:

```markdown
---
agent: [AGENT_NAME]
date: YYYY-MM-DD
slot: am | pm
---

## Done since last standup
- [specific task or PR completed]
- [specific task or PR completed]

## In progress right now
- Task #[id]: [title] — [brief status]

## Blocked on anything?
- [blocker or "Nothing blocked"]

## Plan for next standup
- [specific next action]
- [specific next action]

## PRs needing Architect review
- PR #[number]: [title]
```

---

## Standup folder structure

```
standups/
  2026-04-07-am/
    ARCHITECT.md
    SEO_STRATEGIST.md
    CONTENT_WRITER.md
    BRAND_GUARDIAN.md
    DATA_AGENT.md
    QA_AGENT.md
  2026-04-07-pm/
    ARCHITECT.md
    SEO_STRATEGIST.md
    ...
```

---

## Morning report format

The compiled morning report sent to Nathan:

```
Subject: gofal.wales — Daily Report [DATE]

Good morning Nathan.

Here is what the team did yesterday and what is planned for today.

---

TASKS STATUS
Total in backlog: X
In progress: X
Completed yesterday: X
Total done: X

---

YESTERDAY — WHAT GOT DONE

[Architect] ...
[SEO Strategist] ...
[Content Writer] ...
[Brand Guardian] ...
[Data Agent] ...
[QA Agent] ...

---

TODAY — WHAT IS PLANNED

[Architect] ...
[SEO Strategist] ...
...

---

PRs WAITING FOR YOUR ATTENTION (if any)
- PR #X: [title] — [agent] opened [X hours] ago

---

BLOCKERS
[Any blockers raised across all agents]

---

TASK BOARD SNAPSHOT
IN PROGRESS:
- #[id] [title] [AGENT] P[1|2|3]
- ...

BACKLOG (next up):
- #[id] [title] [AGENT] P[1|2|3]
- ...

---

Full detail at: github.com/[org]/gofal-cymru/tree/main/standups/[date]
```
