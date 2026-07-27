import { FOCUS_AREAS } from './focusAreas'
import { RESULT_LABELS, type CharterState } from './types'

export function buildMarkdown(state: CharterState): string {
  const lines: string[] = []

  lines.push(`# Charter: ${state.target || '(без назви)'}`)
  lines.push('')
  lines.push(
    `**Дослідити** ${state.target || '—'} **з ресурсами** ${
      state.resources || '—'
    } **щоб дізнатись** ${state.discover || '—'}`,
  )
  lines.push('')
  lines.push(`- Тестувальник: ${state.tester || '—'}`)
  lines.push(`- Дата: ${state.date || '—'}`)
  lines.push(`- Тайм-бокс: ${state.timeboxMinutes} хв`)
  if (state.focusAreaIds.length > 0) {
    const labels = state.focusAreaIds
      .map((id) => FOCUS_AREAS.find((area) => area.id === id)?.label ?? id)
      .join(', ')
    lines.push(`- Фокус: ${labels}`)
  }
  lines.push('')

  if (state.checklist.length > 0) {
    lines.push('## Чекліст')
    for (const item of state.checklist) {
      lines.push(`- [${item.checked ? 'x' : ' '}] ${item.text}`)
    }
    lines.push('')
  }

  lines.push('## Знайдені баги')
  lines.push(...logSectionLines(state.bugs))
  lines.push('')

  lines.push('## Питання, що виникли')
  lines.push(...logSectionLines(state.questions))
  lines.push('')

  lines.push('## Нові ідеї для тестування')
  lines.push(...logSectionLines(state.ideas))
  lines.push('')

  lines.push('## Підсумок сесії')
  lines.push(`- Результат: ${RESULT_LABELS[state.result]}`)
  lines.push(`- Фактичний час: ${state.actualMinutes || '—'} хв`)
  if (state.summaryNotes.trim()) {
    lines.push('')
    lines.push(state.summaryNotes.trim())
  }

  return lines.join('\n')
}

function logSectionLines(entries: { text: string }[]): string[] {
  if (entries.length === 0) {
    return ['_немає записів_']
  }
  return entries.map((entry) => `- ${entry.text}`)
}
