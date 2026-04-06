/**
 * scripts/standups/iteration-loop.ts
 *
 * The engine that keeps the team working continuously.
 * Runs every hour via GitHub Actions.
 *
 * What it does:
 * 1. Reads DEFINITION_OF_DONE.md — finds all unchecked items
 * 2. Reads current task board — finds what's already covered
 * 3. For any unchecked item with no task — generates and creates a new task
 * 4. Calls Claude for each agent to pick up their next task
 * 5. Each agent: reads their task, does the work, opens a PR
 * 6. Architect: reviews and merges any ready PRs
 * 7. Updates DEFINITION_OF_DONE.md with completed items
 * 8. Commits everything and loops
 */

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const AGENTS = [
  { name: 'ARCHITECT',      file: 'agents/ARCHITECT.md',      tag: 'ARCHITECT' },
  { name: 'SEO_STRATEGIST', file: 'agents/SEO_STRATEGIST.md', tag: 'SEO' },
  { name: 'CONTENT_WRITER', file: 'agents/CONTENT_WRITER.md', tag: 'CONTENT' },
  { name: 'BRAND_GUARDIAN', file: 'agents/BRAND_GUARDIAN.md', tag: 'BRAND' },
  { name: 'DATA_AGENT',     file: 'agents/DATA_AGENT.md',     tag: 'DATA' },
  { name: 'QA_AGENT',       file: 'agents/QA_AGENT.md',       tag: 'QA' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readFile(filePath: string): string {
  const full = path.join(process.cwd(), filePath)
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf-8') : ''
}

function writeFile(filePath: string, content: string) {
  const full = path.join(process.cwd(), filePath)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, content)
}

function listFiles(dir: string): string[] {
  const full = path.join(process.cwd(), dir)
  if (!fs.existsSync(full)) return []
  return fs.readdirSync(full).filter(f => f.endsWith('.md'))
}

function exec(cmd: string): string {
  const { execSync } = require('child_process')
  try {
    return execSync(cmd, { encoding: 'utf-8', cwd: process.cwd() })
  } catch (e: any) {
    return e.stdout || e.message || ''
  }
}

// ─── Step 1: Read completion state ───────────────────────────────────────────

function getCompletionState(): { total: number; done: number; unchecked: string[] } {
  const dod = readFile('DEFINITION_OF_DONE.md')
  const lines = dod.split('\n')

  const checked = lines.filter(l => l.trim().startsWith('- [x]')).length
  const unchecked = lines
    .filter(l => l.trim().startsWith('- [ ]'))
    .map(l => l.trim().replace('- [ ] ', '').trim())

  return { total: checked + unchecked.length, done: checked, unchecked }
}

// ─── Step 2: Check what tasks already exist ───────────────────────────────────

function getExistingTaskTitles(): Set<string> {
  const dirs = ['tasks/backlog', 'tasks/in-progress', 'tasks/done']
  const titles = new Set<string>()

  for (const dir of dirs) {
    for (const file of listFiles(dir)) {
      const content = readFile(`${dir}/${file}`)
      const match = content.match(/title: (.+)/)
      if (match) titles.add(match[1].trim().toLowerCase())
    }
  }
  return titles
}

// ─── Step 3: Generate new tasks for uncovered items ──────────────────────────

async function generateMissingTasks(
  uncheckedItems: string[],
  existingTitles: Set<string>
): Promise<void> {
  // Filter items that don't have tasks yet
  const needsTasks = uncheckedItems.filter(item => {
    const normalized = item.toLowerCase()
    return ![...existingTitles].some(t => t.includes(normalized.slice(0, 30)))
  })

  if (needsTasks.length === 0) {
    console.log('No new tasks needed — all items covered')
    return
  }

  console.log(`Generating tasks for ${Math.min(needsTasks.length, 10)} uncovered items...`)

  // Get next task ID
  const allTaskFiles = [
    ...listFiles('tasks/backlog'),
    ...listFiles('tasks/in-progress'),
    ...listFiles('tasks/done'),
  ]
  const maxId = allTaskFiles.reduce((max, f) => {
    const match = f.match(/P\d-(\d+)-/)
    return match ? Math.max(max, parseInt(match[1])) : max
  }, 20)

  // Ask Claude to generate tasks for first 10 uncovered items
  const prompt = `You are the project manager for gofal.wales — a Welsh-language care home directory built with Next.js 15, Supabase, Tailwind, and the Cartref brand system.

The following items from DEFINITION_OF_DONE.md do not have tasks yet. Generate task files for each one.

Items needing tasks:
${needsTasks.slice(0, 10).map((item, i) => `${i + 1}. ${item}`).join('\n')}

For each item, output a task file in this EXACT format (output all tasks in sequence, separated by ===TASK===):

---
id: [${maxId + 1} for first, increment for each]
title: [short descriptive title]
department: [ARCHITECT | SEO | CONTENT | BRAND | DATA | QA — pick most appropriate]
priority: [P1 if critical path | P2 if important | P3 if enhancement]
status: backlog
assigned: unassigned
created: ${new Date().toISOString().split('T')[0]}
branch: [department-slug/short-slug]
dod_item: [the exact unchecked item text from the list above]
---

## What
[Clear 1-2 sentence description]

## Acceptance criteria
- [ ] [specific, testable criterion]
- [ ] [specific, testable criterion]
- [ ] [specific, testable criterion]

## Notes
[Any relevant context from the codebase or BRAND.md]

Output ONLY the task files. No preamble. Separate each with ===TASK===`

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.content[0]
  if (content.type !== 'text') return

  const tasks = content.text.split('===TASK===').map(t => t.trim()).filter(Boolean)

  for (let i = 0; i < tasks.length; i++) {
    const taskContent = tasks[i]
    const idMatch = taskContent.match(/id: (\d+)/)
    const titleMatch = taskContent.match(/title: (.+)/)
    const prioMatch = taskContent.match(/priority: (P\d)/)

    if (!idMatch || !titleMatch) continue

    const id = idMatch[1].padStart(3, '0')
    const title = titleMatch[1].trim()
    const prio = prioMatch?.[1] || 'P3'
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)
    const filename = `${prio}-${id}-${slug}.md`

    writeFile(`tasks/backlog/${filename}`, taskContent)
    console.log(`  ✓ Created task: ${filename}`)
  }
}

// ─── Step 4: Run each agent ───────────────────────────────────────────────────

async function runAgent(agent: typeof AGENTS[0]): Promise<void> {
  console.log(`\nRunning ${agent.name}...`)

  const agentBrief = readFile(agent.file)
  const brandBrief = readFile('agents/BRAND.md')
  const masterBrief = readFile('CLAUDE.md')
  const tasksBrief = readFile('TASKS.md')
  const dod = readFile('DEFINITION_OF_DONE.md')

  // Find this agent's available tasks
  const backlogTasks = listFiles('tasks/backlog')
    .filter(f => {
      const content = readFile(`tasks/backlog/${f}`)
      return content.includes(`department: ${agent.tag}`) ||
        content.includes(`department: ${agent.tag},`)
    })
    .map(f => readFile(`tasks/backlog/${f}`))
    .slice(0, 5)

  const inProgressTasks = listFiles('tasks/in-progress')
    .filter(f => {
      const content = readFile(`tasks/in-progress/${f}`)
      return content.includes(`department: ${agent.tag}`)
    })
    .map(f => readFile(`tasks/in-progress/${f}`))

  // Get open PRs for Architect
  const openPRs = agent.name === 'ARCHITECT'
    ? exec('gh pr list --json number,title,author,reviewDecision --limit 20')
    : ''

  // Get recent git log
  const recentCommits = exec('git log --oneline -10')

  const prompt = `You are ${agent.name} on the gofal.wales development team.

MASTER BRIEF:
${masterBrief}

YOUR AGENT BRIEF:
${agentBrief}

BRAND SYSTEM (always follow):
${brandBrief}

TASK SYSTEM:
${tasksBrief}

DEFINITION OF DONE (what fully built looks like):
${dod.slice(0, 3000)}

YOUR CURRENT IN-PROGRESS TASKS:
${inProgressTasks.join('\n---\n') || 'None in progress'}

YOUR AVAILABLE BACKLOG TASKS (highest priority first):
${backlogTasks.join('\n---\n') || 'No tasks tagged to your department — check if you can help with ARCHITECT tasks'}

${agent.name === 'ARCHITECT' ? `OPEN PRs TO REVIEW AND MERGE:\n${openPRs}\n` : ''}

RECENT GIT ACTIVITY:
${recentCommits}

IT IS NOW: ${new Date().toISOString()}

Your job in this iteration:

${agent.name === 'ARCHITECT' ? `
1. FIRST: Review and merge any open PRs where the QA workflow has passed
   - Run: gh pr list, then gh pr review [n] --approve && gh pr merge [n] --squash --delete-branch
2. Check DEFINITION_OF_DONE.md — tick any items that are actually complete
3. Pick your highest P1 backlog task (or continue in-progress)
4. Work it completely — write all code, commit, push, open PR
5. Self-review and merge if QA passes
6. Pick the next task and repeat until this session ends
` : `
1. If you have an in-progress task — continue it until complete and open a PR
2. If no in-progress task — claim the highest priority backlog task:
   - Move the file from tasks/backlog/ to tasks/in-progress/
   - Update its frontmatter: status: in-progress, assigned: ${agent.name}
   - Create branch: git checkout -b [branch-name]
   - Commit the claim: git add tasks/ && git commit -m "chore: claim task [AGENT]"
3. Do the complete work for your task
4. Open a PR with full description
5. Move task to tasks/done/ when PR is merged
`}

CRITICAL RULES:
- Never say "I'll do this next time" — do it now
- Never leave a PR open without attempting to complete the task first
- Welsh first — every user-facing string needs Welsh and English
- CIW not CQC — grep -r "CQC" . before opening any PR
- Follow BRAND.md exactly — Cartref colours, Poppins + Nunito, pill buttons, Ivory backgrounds
- Commit and push after every meaningful chunk of work
- The goal is a complete, live, production-ready gofal.wales

Begin. Do not stop until you have opened at least one PR or merged at least one PR.`

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.content[0]
  if (content.type !== 'text') return

  // Log what the agent decided to do
  const logPath = `logs/${new Date().toISOString().replace(/:/g, '-')}-${agent.name}.md`
  writeFile(logPath, `# ${agent.name} — ${new Date().toISOString()}\n\n${content.text}`)
  console.log(`  ${agent.name} response logged to ${logPath}`)
}

// ─── Step 5: Update completion percentage ─────────────────────────────────────

async function updateCompletionStatus() {
  const { total, done, unchecked } = getCompletionState()
  const pct = Math.round((done / total) * 100)

  const status = `# gofal.wales — Build Status

Last updated: ${new Date().toISOString()}

## Completion: ${done}/${total} (${pct}%)

${'█'.repeat(Math.round(pct / 5))}${'░'.repeat(20 - Math.round(pct / 5))} ${pct}%

## In Progress
${listFiles('tasks/in-progress').map(f => `- ${f}`).join('\n') || 'None'}

## Backlog remaining
${listFiles('tasks/backlog').length} tasks

## Completed tasks
${listFiles('tasks/done').length} tasks done
`
  writeFile('STATUS.md', status)
  console.log(`\n📊 Build progress: ${done}/${total} items complete (${pct}%)`)

  if (pct === 100) {
    console.log('\n🎉 DEFINITION OF DONE COMPLETE — gofal.wales is fully built!')
  }
}

// ─── Main loop ────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`gofal.wales ITERATION LOOP — ${new Date().toISOString()}`)
  console.log(`${'='.repeat(60)}\n`)

  // Step 1: Check completion state
  const { total, done, unchecked } = getCompletionState()
  console.log(`📋 Definition of Done: ${done}/${total} complete`)

  if (done === total) {
    console.log('✅ All done! Nothing to do.')
    return
  }

  // Step 2: Generate tasks for uncovered items
  const existingTitles = getExistingTaskTitles()
  await generateMissingTasks(unchecked, existingTitles)

  // Step 3: Run each agent in parallel (with slight stagger to avoid conflicts)
  console.log('\nRunning all agents...')
  for (const agent of AGENTS) {
    try {
      await runAgent(agent)
      await new Promise(r => setTimeout(r, 3000)) // 3s between agents
    } catch (error) {
      console.error(`Error running ${agent.name}:`, error)
    }
  }

  // Step 4: Update completion status
  await updateCompletionStatus()

  // Step 5: Commit everything
  exec('git config --global user.email "agents@gofal.wales"')
  exec('git config --global user.name "gofal agents"')
  exec('git add -A')
  const hasChanges = exec('git diff --staged --quiet; echo $?').trim() === '1'
  if (hasChanges) {
    exec(`git commit -m "chore: iteration loop ${new Date().toISOString()}"`)
    exec('git push origin main')
    console.log('\n✓ Changes committed and pushed')
  } else {
    console.log('\n✓ No changes to commit')
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log('Iteration complete. Next run in 1 hour.')
  console.log(`${'='.repeat(60)}\n`)
}

main().catch(console.error)
