export interface ParameterDraft {
  id: string
  name: string
  valuesText: string
}

export function createId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function parseValues(valuesText: string): string[] {
  const seen = new Set<string>()
  const values: string[] = []
  for (const raw of valuesText.split(',')) {
    const value = raw.trim()
    if (!value || seen.has(value)) continue
    seen.add(value)
    values.push(value)
  }
  return values
}

export function defaultParameters(): ParameterDraft[] {
  return [
    { id: createId(), name: 'Браузер', valuesText: 'Chrome, Firefox, Safari, Edge' },
    { id: createId(), name: 'ОС', valuesText: 'Windows, macOS, Linux' },
    { id: createId(), name: 'Мова', valuesText: 'UA, EN' },
    { id: createId(), name: 'Тип акаунту', valuesText: 'Free, Pro, Enterprise' },
  ]
}

export function emptyParameters(): ParameterDraft[] {
  return [
    { id: createId(), name: '', valuesText: '' },
    { id: createId(), name: '', valuesText: '' },
  ]
}
