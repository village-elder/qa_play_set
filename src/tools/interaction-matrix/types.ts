export interface FeatureDraft {
  id: string
  name: string
}

export type CellState = 'untested' | 'tested' | 'na'

const CELL_STATE_ORDER: CellState[] = ['untested', 'tested', 'na']

export function nextCellState(state: CellState | undefined): CellState {
  const index = CELL_STATE_ORDER.indexOf(state ?? 'untested')
  return CELL_STATE_ORDER[(index + 1) % CELL_STATE_ORDER.length]
}

export function createId(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** Order-independent key for a feature pair, regardless of row/column order. */
export function pairKey(idA: string, idB: string): string {
  return idA < idB ? `${idA}|${idB}` : `${idB}|${idA}`
}

export function defaultFeatures(): FeatureDraft[] {
  return [
    { id: createId(), name: 'Кошик' },
    { id: createId(), name: 'Промокоди' },
    { id: createId(), name: 'Оплата карткою' },
    { id: createId(), name: 'Push-сповіщення' },
    { id: createId(), name: 'Експорт у PDF' },
  ]
}

export function emptyFeatures(): FeatureDraft[] {
  return [
    { id: createId(), name: '' },
    { id: createId(), name: '' },
  ]
}
