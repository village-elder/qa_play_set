import { useEffect, useRef, useState } from 'react'
import { buildCsv, buildMarkdownTable, buildPairRows } from './export'
import {
  createId,
  defaultFeatures,
  emptyFeatures,
  nextCellState,
  pairKey,
  type CellState,
  type FeatureDraft,
} from './types'
import './InteractionMatrix.css'

const STORAGE_KEY = 'qa-toolkit:interaction-matrix'

interface StoredState {
  features: FeatureDraft[]
  cells: Record<string, CellState>
}

function loadInitialState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { features: defaultFeatures(), cells: {} }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed.features) && parsed.features.length > 0) {
      return { features: parsed.features, cells: parsed.cells ?? {} }
    }
    return { features: defaultFeatures(), cells: {} }
  } catch {
    return { features: defaultFeatures(), cells: {} }
  }
}

const CELL_LABEL: Record<CellState, string> = {
  untested: '',
  tested: '✓',
  na: '—',
}

const CELL_STATE_TITLE: Record<CellState, string> = {
  untested: 'не перевірено',
  tested: 'перевірено',
  na: 'не стосується одна одної (N/A)',
}

export default function InteractionMatrix() {
  const initial = useRef<StoredState | null>(null)
  if (initial.current === null) initial.current = loadInitialState()

  const [features, setFeatures] = useState<FeatureDraft[]>(initial.current.features)
  const [cells, setCells] = useState<Record<string, CellState>>(initial.current.cells)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')
  const copyTimeout = useRef<number | undefined>(undefined)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ features, cells }))
  }, [features, cells])

  useEffect(() => () => window.clearTimeout(copyTimeout.current), [])

  function updateFeatureName(id: string, name: string) {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)))
  }

  function addFeature() {
    setFeatures((prev) => [...prev, { id: createId(), name: '' }])
  }

  function removeFeature(id: string) {
    setFeatures((prev) => prev.filter((f) => f.id !== id))
  }

  function handleReset() {
    if (!window.confirm('Почати новий список фічей? Поточні дані буде втрачено.')) {
      return
    }
    setFeatures(emptyFeatures())
    setCells({})
  }

  function cycleCell(idA: string, idB: string) {
    const key = pairKey(idA, idB)
    setCells((prev) => ({ ...prev, [key]: nextCellState(prev[key]) }))
  }

  const namedFeatures = features.filter((f) => f.name.trim())
  const rowFeatures = namedFeatures.slice(1)
  const columnFeatures = namedFeatures.slice(0, -1)
  const pairRows = buildPairRows(namedFeatures, cells)
  const testedCount = pairRows.filter((r) => r.state === 'tested').length
  const naCount = pairRows.filter((r) => r.state === 'na').length
  const untestedCount = pairRows.length - testedCount - naCount
  const applicableCount = pairRows.length - naCount

  async function handleCopy(format: 'csv' | 'markdown') {
    const text = format === 'csv' ? buildCsv(pairRows) : buildMarkdownTable(pairRows)
    await navigator.clipboard.writeText(text)
    setCopyStatus('copied')
    window.clearTimeout(copyTimeout.current)
    copyTimeout.current = window.setTimeout(() => setCopyStatus('idle'), 2000)
  }

  function handleDownloadCsv() {
    const blob = new Blob([buildCsv(pairRows)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'interaction-matrix.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="interaction-matrix">
      <section className="matrix-section">
        <h2>Фічі</h2>
        <div className="feature-list">
          {features.map((feature) => (
            <div key={feature.id} className="feature-row">
              <input
                value={feature.name}
                onChange={(e) => updateFeatureName(feature.id, e.target.value)}
                placeholder="Назва фічі"
              />
              <button
                type="button"
                className="icon-button"
                aria-label="Видалити фічу"
                onClick={() => removeFeature(feature.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="feature-list-actions">
          <button type="button" className="ghost" onClick={addFeature}>
            + Додати фічу
          </button>
          <button type="button" className="ghost" onClick={handleReset}>
            Новий список фічей
          </button>
        </div>
      </section>

      {namedFeatures.length < 2 ? (
        <p className="section-hint">
          Додай щонайменше 2 фічі з назвами, щоб побачити матрицю перетинів.
        </p>
      ) : (
        <section className="matrix-section">
          <h2>Матриця перетинів</h2>
          <p className="section-hint">
            Клікай на клітинку, щоб перемкнути стан: не перевірено → перевірено
            → не стосується одна одної (N/A) → знову не перевірено.
          </p>

          <div className="table-scroll">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th />
                  {columnFeatures.map((feature) => (
                    <th key={feature.id}>{feature.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowFeatures.map((rowFeature, rowIndex) => (
                  <tr key={rowFeature.id}>
                    <th scope="row">{rowFeature.name}</th>
                    {columnFeatures.map((colFeature, colIndex) => {
                      if (colIndex > rowIndex) {
                        return <td key={colFeature.id} className="cell-blank" />
                      }
                      const state = cells[pairKey(rowFeature.id, colFeature.id)] ?? 'untested'
                      return (
                        <td key={colFeature.id} className="cell-wrap">
                          <button
                            type="button"
                            className={`cell cell-${state}`}
                            onClick={() => cycleCell(rowFeature.id, colFeature.id)}
                            title={`${colFeature.name} × ${rowFeature.name}: ${CELL_STATE_TITLE[state]}`}
                          >
                            {CELL_LABEL[state]}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="result-summary">
            {testedCount}/{applicableCount} застосовних пар перевірено, {untestedCount}{' '}
            ще не перевірено
            {naCount > 0 &&
              ` (${naCount} позначено як N/A — не враховуються в покритті)`}
            .
          </p>

          <div className="matrix-actions">
            <button type="button" onClick={() => handleCopy('csv')}>
              {copyStatus === 'copied' ? 'Скопійовано ✓' : 'Копіювати як CSV'}
            </button>
            <button type="button" onClick={() => handleCopy('markdown')}>
              Копіювати як Markdown
            </button>
            <button type="button" onClick={handleDownloadCsv}>
              Завантажити .csv
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
