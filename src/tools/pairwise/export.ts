import type { PairwiseResult } from './generatePairwise'

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function buildCsv(result: PairwiseResult): string {
  const lines = [result.parameterNames.map(escapeCsvCell).join(',')]
  for (const row of result.testCases) {
    lines.push(row.map(escapeCsvCell).join(','))
  }
  return lines.join('\n')
}

export function buildMarkdownTable(result: PairwiseResult): string {
  const lines = [
    `| ${result.parameterNames.join(' | ')} |`,
    `| ${result.parameterNames.map(() => '---').join(' | ')} |`,
  ]
  for (const row of result.testCases) {
    lines.push(`| ${row.join(' | ')} |`)
  }
  return lines.join('\n')
}
