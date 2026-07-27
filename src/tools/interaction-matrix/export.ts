import { pairKey, type CellState, type FeatureDraft } from './types'

const STATE_LABELS: Record<CellState, string> = {
  untested: 'не перевірено',
  tested: 'перевірено',
  na: 'N/A',
}

export interface PairRow {
  a: string
  b: string
  state: CellState
}

export function buildPairRows(
  features: FeatureDraft[],
  cells: Record<string, CellState>,
): PairRow[] {
  const rows: PairRow[] = []
  for (let i = 1; i < features.length; i++) {
    for (let j = 0; j < i; j++) {
      const state = cells[pairKey(features[i].id, features[j].id)] ?? 'untested'
      rows.push({ a: features[j].name, b: features[i].name, state })
    }
  }
  return rows
}

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function buildCsv(rows: PairRow[]): string {
  const lines = ['Фіча A,Фіча B,Статус']
  for (const row of rows) {
    lines.push([row.a, row.b, STATE_LABELS[row.state]].map(escapeCsvCell).join(','))
  }
  return lines.join('\n')
}

export function buildMarkdownTable(rows: PairRow[]): string {
  const lines = ['| Фіча A | Фіча B | Статус |', '| --- | --- | --- |']
  for (const row of rows) {
    lines.push(`| ${row.a} | ${row.b} | ${STATE_LABELS[row.state]} |`)
  }
  return lines.join('\n')
}
