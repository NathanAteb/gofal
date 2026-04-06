/**
 * scripts/standups/send-morning-report.ts
 *
 * Runs at 7:30am UTC via GitHub Actions.
 * Reads all standup files from the past 24 hours.
 * Reads current task board state.
 * Compiles a morning report and emails it to Nathan via Resend.
 * Also commits the report to /reports/daily/YYYY-MM-DD.md
 */

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const resend = new Resend(process.env.RESEND_API_KEY)

const TODAY = new Date().toISOString().split('T')[0]
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split('T')[0]

const AGENT_DISPLAY_NAMES: Record<string, string> = {
  ARCHITECT: 'The Architect',
  SEO_STRATEGIST: 'SEO Strategist',
  CONTENT_WRITER: 'Content Writer',
  BRAND_GUARDIAN: 'Brand Guardian',
  DATA_AGENT: 'Data Agent',
  QA_AGENT: 'QA Agent',
}

function readStandupFiles(date: string, slot: 'am' | 'pm'): Record<string, string> {
  const dir = path.join(process.cwd(), 'standups', `${date}-${slot}`)
  if (!fs.existsSync(dir)) return {}

  const result: Record<string, string> = {}
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const agentName = file.replace('.md', '')
    result[agentName] = fs.readFileSync(path.join(dir, file), 'utf-8')
  }
  return result
}

function getTaskBoardSnapshot(): string {
  const readDir = (dir: string) => {
    const fullPath = path.join(process.cwd(), 'tasks', dir)
    if (!fs.existsSync(fullPath)) return []
    return fs.readdirSync(fullPath)
      .filter(f => f.endsWith('.md'))
      .map(f => {
        const content = fs.readFileSync(path.join(fullPath, f), 'utf-8')
        const titleMatch = content.match(/title: (.+)/)
        const deptMatch = content.match(/department: (.+)/)
        const prioMatch = content.match(/priority: (.+)/)
        return {
          file: f,
          title: titleMatch?.[1] || f,
          dept: deptMatch?.[1] || '?',
          prio: prioMatch?.[1] || '?',
        }
      })
  }

  const backlog = readDir('backlog')
  const inProgress = readDir('in-progress')
  const done = readDir('done')

  const formatList = (items: any[]) =>
    items.map(t => `  • [${t.prio}] ${t.title} [${t.dept}]`).join('\n') || '  None'

  return `TASK BOARD
  In Progress (${inProgress.length}):
${formatList(inProgress)}

  Backlog — next up (${backlog.length} total):
${formatList(backlog.slice(0, 8))}

  Completed total: ${done.length} tasks`
}

function getOpenPRs(): string {
  try {
    const { execSync } = require('child_process')
    const result = execSync(
      `gh pr list --json number,title,author,createdAt --limit 20`,
      { encoding: 'utf-8' }
    )
    const prs = JSON.parse(result)
    if (!prs.length) return 'No open PRs waiting.'
    return prs.map((pr: any) => {
      const age = Math.round((Date.now() - new Date(pr.createdAt).getTime()) / 3600000)
      return `  • PR #${pr.number}: ${pr.title} — open ${age}h`
    }).join('\n')
  } catch {
    return 'Unable to fetch PR list.'
  }
}

async function compileReport(
  yesterdayPM: Record<string, string>,
  todayAM: Record<string, string>
): Promise<string> {

  const taskBoard = getTaskBoardSnapshot()
  const openPRs = getOpenPRs()

  // Compile all standup content into a summary prompt
  const standupContent = Object.entries({ ...yesterdayPM, ...todayAM })
    .map(([agent, content]) => `=== ${AGENT_DISPLAY_NAMES[agent] || agent} ===\n${content}`)
    .join('\n\n')

  const prompt = `You are compiling the daily morning report for Nathan, the founder of gofal.wales.

Nathan runs an AI agent team building gofal.wales — Wales' first Welsh-language care home directory.
He is a busy founder who needs a clear, honest, no-fluff summary of what got done and what is planned.

Here are the agent standups from yesterday afternoon and this morning:

${standupContent}

Current task board:
${taskBoard}

Open PRs needing Architect review:
${openPRs}

Write the daily report for Nathan. Format it as a clean, scannable email. Use plain text — no markdown headers with # symbols, just bold section labels in CAPS. Be specific and honest. If agents haven't done much, say so plainly. Nathan values truth over positive spin.

The report should cover:
1. A one-line summary of overall progress
2. What each agent completed in the last 24 hours (specific task IDs, PR numbers, files created)
3. What each agent is working on today
4. Any PRs that need Nathan's attention or Architect review
5. Any blockers across the team
6. The task board snapshot
7. One sentence on what today's focus should be

Keep it tight. Nathan reads this at 7:30am with a coffee. It should take under 2 minutes to read.`

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  return content.text
}

async function main() {
  console.log(`\n=== Compiling Morning Report for ${TODAY} ===\n`)

  // Read yesterday's PM standup and today's AM standup
  const yesterdayPM = readStandupFiles(YESTERDAY, 'pm')
  const todayAM = readStandupFiles(TODAY, 'am')

  const allStandups = { ...yesterdayPM, ...todayAM }
  if (Object.keys(allStandups).length === 0) {
    console.log('No standup files found — skipping report')
    return
  }

  console.log(`Found standups: ${Object.keys(allStandups).join(', ')}`)

  // Compile the report
  const reportText = await compileReport(yesterdayPM, todayAM)

  // Save report to repo
  const reportDir = path.join(process.cwd(), 'reports', 'daily')
  fs.mkdirSync(reportDir, { recursive: true })
  const reportPath = path.join(reportDir, `${TODAY}.md`)
  fs.writeFileSync(reportPath, `# gofal.wales Daily Report — ${TODAY}\n\n${reportText}`)
  console.log(`✓ Report saved to ${reportPath}`)

  // Send email to Nathan
  const nathanEmail = process.env.NATHAN_EMAIL
  if (!nathanEmail) {
    console.log('NATHAN_EMAIL not set — skipping email send')
    return
  }

  const { data, error } = await resend.emails.send({
    from: 'gofal agents <agents@gofal.wales>',
    to: nathanEmail,
    subject: `gofal.wales — Daily Report ${TODAY}`,
    text: reportText,
    html: `<pre style="font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.6; max-width: 640px; white-space: pre-wrap;">${reportText}</pre>`,
  })

  if (error) {
    console.error('Email send failed:', error)
  } else {
    console.log(`✓ Report emailed to ${nathanEmail} (id: ${data?.id})`)
  }
}

main().catch(console.error)
