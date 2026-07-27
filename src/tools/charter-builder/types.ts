export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
  origin: string // focus area id, or 'custom'
}

export interface LogEntry {
  id: string
  text: string
}

export type SessionResult = 'not-started' | 'passed' | 'passed-with-issues' | 'blocked'

export interface CharterState {
  target: string
  resources: string
  discover: string
  tester: string
  date: string
  timeboxMinutes: number
  focusAreaIds: string[]
  checklist: ChecklistItem[]
  bugs: LogEntry[]
  questions: LogEntry[]
  ideas: LogEntry[]
  result: SessionResult
  actualMinutes: string
  summaryNotes: string
}

export const RESULT_LABELS: Record<SessionResult, string> = {
  'not-started': 'Не розпочато',
  passed: 'Пройдено без зауважень',
  'passed-with-issues': 'Пройдено із зауваженнями',
  blocked: 'Заблоковано',
}

export function createId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function defaultCharterState(): CharterState {
  return {
    target: '',
    resources: '',
    discover: '',
    tester: '',
    date: new Date().toISOString().slice(0, 10),
    timeboxMinutes: 60,
    focusAreaIds: [],
    checklist: [],
    bugs: [],
    questions: [],
    ideas: [],
    result: 'not-started',
    actualMinutes: '',
    summaryNotes: '',
  }
}
