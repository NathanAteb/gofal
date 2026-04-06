/**
 * scripts/standups/run-standup.ts
 *
 * Runs at 9am (am) and 4pm (pm) UTC via GitHub Actions.
 * For each agent, calls the Claude API with the agent's full context
 * and asks them to write their standup update.
 * Saves each agent's standup to /standups/YYYY-MM-DD-[am|pm]/[AGENT].md
 */

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SLOT = process.env.STANDUP_SLOT as 'am' | 'pm' // set by GitHub Actions
const TODAY = new Date().toISOString().split('T')[0]
const STANDUP_DIR = path.join(process.cwd(), 'standups', `${TODAY}-${SLOT}`)

const AGENTS = [
  { name: 'ARCHITECT',      file: 'agents/ARCHITECT.md',      tag: 'ARCHITECT' },
  { name: 'SEO_STRATEGIST', file: 'agents/SEO_STRATEGIST.md', tag: 'SEO' },
  { name: 'CONTENT_WRITER', file: 'agents/CONTENT_WRITER.md', tag: 'CONTENT' },
  { name: 'BRAND_GUARDIAN', file: 'agents/BRAND_GUARDIAN.md', tag: 'BRAND' },
  { name: 'DATA_AGENT',     file: 'agents/DATA_AGENT.md',     tag: 'DATA' },
  { name: 'QA_AGENT',       file: 'agents/QA_AGENT.md',       tag: 'QA' },
]

async function getTaskContext(departmentTag: string): Promise<string> {
  const backlogDir = path.join(process.cwd(), 'tasks', 'backlog')
  const inProgressDir = path.join(process.cwd(), 'tasks', 'in-progress')
  const doneDir = path.join(process.cwd(), 'tasks', 'done')

  const readTaskFiles = (dir: string, tag: string) => {
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(f => fs.readFileSync(path.join(dir, f), 'utf-8'))
      .filter(content => content.includes(`department: ${tag}`))
  }

  const backlog = readTaskFiles(backlogDir, departmentTag)
  const inProgress = readTaskFiles(inProgressDir, departmentTag)
  const recentDone = readTaskFiles(doneDir, departmentTag).slice(-3)

  return `
TASKS IN PROGRESS (${departmentTag}):
${inProgress.length ? inProgress.join('\n---\n') : 'None currently in progress'}

BACKLOG (${departmentTag}) — next up:
${backlog.slice(0, 5).join('\n---\n') || 'Backlog empty'}

RECENTLY COMPLETED (${departmentTag}):
${recentDone.length ? recentDone.join('\n---\n') : 'None yet'}
`
}

async function getPreviousStandup(agentName: string): Promise<string> {
  // Find the most recent standup file for this agent
  const standupRoot = path.join(process.cwd(), 'standups')
  if (!fs.existsSync(standupRoot)) return 'No previous standup found.'

  const slots = fs.readdirSync(standupRoot)
    .filter(d => d !== `${TODAY}-${SLOT}`)
    .sort()
    .reverse()

  for (const slot of slots) {
    const agentFile = path.join(standupRoot, slot, `${agentName}.md`)
    if (fs.existsSync(agentFile)) {
      return fs.readFileSync(agentFile, 'utf-8')
    }
  }
  return 'No previous standup found.'
}

async function getOpenPRs(): Promise<string> {
  try {
    const { execSync } = await import('child_process')
    const result = execSync(
      `gh pr list --json number,title,author,createdAt,labels --limit 20`,
      { encoding: 'utf-8' }
    )
    const prs = JSON.parse(result)
    if (!prs.length) return 'No open PRs.'
    return prs.map((pr: any) =>
      `PR #${pr.number}: ${pr.title} (opened by ${pr.author.login})`
    ).join('\n')
  } catch {
    return 'Unable to fetch PRs.'
  }
}

async function runStandupForAgent(agent: typeof AGENTS[0]) {
  console.log(`Running ${SLOT} standup for ${agent.name}...`)

  // Read agent's own CLAUDE.md
  const agentBrief = fs.existsSync(agent.file)
    ? fs.readFileSync(agent.file, 'utf-8')
    : 'Agent brief not found.'

  const brandBrief = fs.existsSync('agents/BRAND.md')
    ? fs.readFileSync('agents/BRAND.md', 'utf-8')
    : ''

  const masterBrief = fs.existsSync('CLAUDE.md')
    ? fs.readFileSync('CLAUDE.md', 'utf-8')
    : ''

  const taskContext = await getTaskContext(agent.tag)
  const previousStandup = await getPreviousStandup(agent.name)
  const openPRs = agent.name === 'ARCHITECT' ? await getOpenPRs() : ''

  const slotLabel = SLOT === 'am' ? 'morning (9am)' : 'afternoon (4pm)'

  const prompt = `You are ${agent.name} on the gofal.wales agent team. It is ${slotLabel} standup time on ${TODAY}.

Your role and responsibilities:
${agentBrief}

Your current tasks:
${taskContext}

Your previous standup:
${previousStandup}

${agent.name === 'ARCHITECT' ? `Open PRs needing your attention:\n${openPRs}\n` : ''}

Write your standup update in this exact markdown format:

---
agent: ${agent.name}
date: ${TODAY}
slot: ${SLOT}
---

## Done since last standup
[List specific tasks, PRs, or outputs completed. Be concrete — name files, PR numbers, task IDs. If nothing done since last standup, say so honestly.]

## In progress right now
[List what you are actively working on with task IDs and current status]

## Blocked on anything?
[List any blockers, or write "Nothing blocked"]

## Plan for next standup
[List 2-4 specific things you will complete before the next standup. Be realistic.]

${agent.name === 'ARCHITECT' ? `## PRs to review and merge\n[List any open PRs you will review before next standup]\n` : '## PRs opened\n[List any PRs you have opened that need Architect review]\n'}

Be honest and specific. This goes directly to Nathan. Do not pad it out. If nothing was done, say nothing was done and explain why. Write in first person as the ${agent.name}.`

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  return content.text
}

async function main() {
  // Create standup directory
  fs.mkdirSync(STANDUP_DIR, { recursive: true })

  console.log(`\n=== gofal.wales ${SLOT.toUpperCase()} Standup — ${TODAY} ===\n`)

  for (const agent of AGENTS) {
    try {
      const standup = await runStandupForAgent(agent)
      const outputPath = path.join(STANDUP_DIR, `${agent.name}.md`)
      fs.writeFileSync(outputPath, standup)
      console.log(`✓ ${agent.name} standup written`)
    } catch (error) {
      console.error(`✗ ${agent.name} standup failed:`, error)
      // Write an error standup so the report can still compile
      const errorStandup = `---
agent: ${agent.name}
date: ${TODAY}
slot: ${SLOT}
---

## Done since last standup
Error: Could not generate standup — ${error}

## In progress right now
Unknown

## Blocked on anything?
Standup script error

## Plan for next standup
Retry
`
      fs.writeFileSync(path.join(STANDUP_DIR, `${agent.name}.md`), errorStandup)
    }

    // Small delay between API calls
    await new Promise(r => setTimeout(r, 2000))
  }

  console.log(`\n✓ All standups written to ${STANDUP_DIR}\n`)
}

main().catch(console.error)
