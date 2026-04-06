# gofal.wales — Autonomous Build System
## Everything you need. Drop it in your repo and go on holiday.

---

## What this is

A complete autonomous build system for gofal.wales — Wales' first Welsh-language care home directory. One Claude Code session runs on your Mac Mini while you're away and builds the entire product without you touching it.

---

## File structure — drop everything into your repo root

```
your-repo/
│
├── CLAUDE.md                    ← Master brief (Claude reads this first)
├── DEFINITION_OF_DONE.md        ← Complete finish line — every page, feature, test
├── TASKS.md                     ← Task system documentation
├── STANDUPS.md                  ← Standup system documentation
├── STATUS.md                    ← Auto-updated build progress (created at runtime)
│
├── .claude-prompt.md            ← The single prompt that drives the whole session
├── gofal-build.sh               ← The shell script that keeps Claude running
│
├── agents/
│   ├── ARCHITECT.md             ← Full-stack engineer brief
│   ├── SEO_STRATEGIST.md        ← SEO brief
│   ├── CONTENT_WRITER.md        ← Bilingual copywriter brief
│   ├── BRAND_GUARDIAN.md        ← Design system + PR brief
│   ├── DATA_AGENT.md            ← CIW pipeline brief
│   ├── QA_AGENT.md              ← Testing brief
│   └── BRAND.md                 ← Cartref brand system (colours, fonts, rules)
│
├── tasks/
│   ├── backlog/                 ← 20 starter tasks, auto-generated thereafter
│   ├── in-progress/             ← Currently being worked on
│   └── done/                    ← Completed and merged
│
├── .github/
│   └── workflows/
│       ├── standup-morning.yml  ← 9am UTC standup
│       ├── standup-afternoon.yml← 4pm UTC standup
│       ├── morning-report.yml   ← 7:30am UTC email to Nathan
│       └── iteration-loop.yml   ← Hourly backup loop (if Claude Code session dies)
│
├── scripts/
│   ├── standups/
│   │   ├── run-standup.ts       ← Writes standup files for all agents
│   │   ├── send-morning-report.ts← Compiles and emails daily report
│   │   ├── iteration-loop.ts    ← Backup autonomous loop
│   │   └── check-completion.ts  ← Progress checker (run anytime)
│   └── setup/
│       ├── setup-mac-mini.sh    ← One-time Mac Mini setup script
│       ├── GITHUB_SECRETS.md    ← What secrets to add to GitHub
│       └── PRE_HOLIDAY_CHECKLIST.md ← Everything to do before leaving
│
├── standups/                    ← Auto-created standup files
├── reports/                     ← Daily reports, weekly summaries
├── logs/                        ← Claude Code session logs
├── inbox/                       ← Cross-agent messages (not used in solo mode)
└── content/                     ← Auto-created content (guides, copy, emails)
```

---

## Setup — do this before you leave

### 1. Run the setup script on your Mac Mini
```bash
bash scripts/setup/setup-mac-mini.sh
```

This installs everything: Homebrew, Node, Claude Code, tmux, Tailscale, GitHub CLI, and configures sleep settings.

### 2. Fill in your environment variables
```bash
nano .env.local
```
Fill in all the values. See `scripts/setup/GITHUB_SECRETS.md` for where to get each one.

### 3. Add GitHub secrets
Go to: your-repo → Settings → Secrets → Actions
Add everything in `scripts/setup/GITHUB_SECRETS.md`

### 4. Set spending limits
- Anthropic API: $50/month hard limit at console.anthropic.com
- Vercel: set a spend cap at vercel.com

### 5. Start the build
```bash
cd ~/gofalcymru
tmux new-session -d -s gofal './gofal-build.sh'
tmux attach -t gofal   # watch for a few minutes
# Ctrl+B then D to detach
```

### 6. Complete the pre-holiday checklist
Read `scripts/setup/PRE_HOLIDAY_CHECKLIST.md` and tick every box.

---

## Daily rhythm once running

| Time (UTC) | What happens |
|------------|-------------|
| All day | Claude Code session builds, commits, PRs, merges in tmux |
| 07:30 | Morning report emailed to Nathan |
| 09:00 | All agents write morning standup (GitHub Actions) |
| 16:00 | All agents write afternoon standup (GitHub Actions) |

---

## Remote access from your phone

```bash
# Install Tailscale on phone
# SSH in via Termius or similar

ssh you@[tailscale-ip]
tmux attach -t gofal     # see what Claude is doing right now
```

---

## Control commands

```bash
# Pause the build
touch ~/gofalcymru/.paused

# Resume
rm ~/gofalcymru/.paused

# Check progress
cd ~/gofalcymru
npx ts-node scripts/standups/check-completion.ts

# Restart if session died
tmux new-session -d -s gofal './gofal-build.sh'
```

---

## How it knows when it's done

`DEFINITION_OF_DONE.md` lists every single item that must be complete:
- Every page (core pages, all 22 county pages, ~1,000 care home profiles)
- All 20 guide articles in Welsh and English
- Unsplash images throughout
- Full SEO (technical, on-page, structured data, sitemaps)
- All features (search, filters, maps, claim flow, Stripe, admin)
- Complete test suite (unit, E2E, accessibility, brand compliance)
- All content (UI strings, emails, LinkedIn posts, press release)

When every box is ticked, Claude Code sends you a completion email and stops.

---

## Architecture

```
Mac Mini
└── tmux session: gofal
    └── gofal-build.sh (restart loop)
        └── claude --print ".claude-prompt.md"
            └── Reads CLAUDE.md + all agent files
            └── Picks tasks from tasks/backlog/
            └── Builds, commits, PRs, merges
            └── Ticks DEFINITION_OF_DONE.md
            └── Loops until 100% complete

GitHub Actions (runs in cloud, independent of Mac Mini)
├── 07:30 UTC — morning-report.yml → email to Nathan
├── 09:00 UTC — standup-morning.yml → all agents write updates
└── 16:00 UTC — standup-afternoon.yml → all agents write updates
```

---

Mae gofal yn iawn. Go on holiday.
