/**
 * scripts/standups/check-completion.ts
 *
 * Run anytime to see overall build progress:
 * npx ts-node scripts/standups/check-completion.ts
 */

import fs from 'fs'
import path from 'path'

const dodPath = path.join(process.cwd(), 'DEFINITION_OF_DONE.md')
const dod = fs.readFileSync(dodPath, 'utf-8')
const lines = dod.split('\n')

const checked = lines.filter(l => l.trim().startsWith('- [x]'))
const unchecked = lines.filter(l => l.trim().startsWith('- [ ]'))
const total = checked.length + unchecked.length
const pct = Math.round((checked.length / total) * 100)

// Task board
const readDir = (dir: string) => {
  const full = path.join(process.cwd(), 'tasks', dir)
  if (!fs.existsSync(full)) return []
  return fs.readdirSync(full).filter(f => f.endsWith('.md'))
}

const backlog = readDir('backlog')
const inProgress = readDir('in-progress')
const done = readDir('done')

// Section breakdown
const sections: Record<string, { checked: number; total: number }> = {}
let currentSection = 'General'

for (const line of lines) {
  if (line.startsWith('## ')) {
    currentSection = line.replace('## ', '').replace('—', '-').trim()
    sections[currentSection] = { checked: 0, total: 0 }
  }
  if (line.trim().startsWith('- [x]')) {
    if (!sections[currentSection]) sections[currentSection] = { checked: 0, total: 0 }
    sections[currentSection].checked++
    sections[currentSection].total++
  }
  if (line.trim().startsWith('- [ ]')) {
    if (!sections[currentSection]) sections[currentSection] = { checked: 0, total: 0 }
    sections[currentSection].total++
  }
}

console.log('\n' + '═'.repeat(60))
console.log('  gofal.wales — Build Progress')
console.log('═'.repeat(60))
console.log()
console.log(`  Overall: ${checked.length}/${total} items complete (${pct}%)`)
console.log()

const bar = '█'.repeat(Math.round(pct / 2)) + '░'.repeat(50 - Math.round(pct / 2))
console.log(`  [${bar}]`)
console.log()
console.log('─'.repeat(60))
console.log('  By section:')
console.log()

for (const [section, { checked: c, total: t }] of Object.entries(sections)) {
  if (t === 0) continue
  const sectionPct = Math.round((c / t) * 100)
  const sectionBar = '█'.repeat(Math.round(sectionPct / 5)) + '░'.repeat(20 - Math.round(sectionPct / 5))
  const status = c === t ? '✅' : c === 0 ? '⬜' : '🔄'
  console.log(`  ${status} ${section.slice(0, 35).padEnd(35)} [${sectionBar}] ${sectionPct}%`)
}

console.log()
console.log('─'.repeat(60))
console.log('  Task board:')
console.log()
console.log(`  📋 Backlog:     ${backlog.length} tasks`)
console.log(`  🔄 In progress: ${inProgress.length} tasks`)
console.log(`  ✅ Done:        ${done.length} tasks`)
console.log()

if (inProgress.length > 0) {
  console.log('  Currently in progress:')
  for (const f of inProgress) {
    const content = fs.readFileSync(path.join(process.cwd(), 'tasks', 'in-progress', f), 'utf-8')
    const title = content.match(/title: (.+)/)?.[1] || f
    const dept = content.match(/department: (.+)/)?.[1] || '?'
    console.log(`  • [${dept}] ${title}`)
  }
  console.log()
}

if (pct === 100) {
  console.log('  🎉 COMPLETE — gofal.wales is fully built!')
} else {
  console.log(`  ${total - checked.length} items remaining to complete.`)
  console.log(`  Estimated completion at current rate: check GitHub Actions logs.`)
}

console.log('\n' + '═'.repeat(60) + '\n')
