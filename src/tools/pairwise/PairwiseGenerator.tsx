import { useEffect, useRef, useState } from 'react'
import { buildCsv, buildMarkdownTable } from './export'
import { generatePairwise, type PairwiseResult } from './generatePairwise'
import {
  createId,
  defaultParameters,
  emptyParameters,
  parseValues,
  type ParameterDraft,
} from './types'
import './PairwiseGenerator.css'

const STORAGE_KEY = 'qa-toolkit:pairwise-generator'

function loadInitialParameters(): ParameterDraft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultParameters()
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return defaultParameters()
  } catch {
    return defaultParameters()
  }
}

export default function PairwiseGenerator() {
  const [parameters, setParameters] = useState<ParameterDraft[]>(loadInitialParameters)
  const [result, setResult] = useState<PairwiseResult | null>(null)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')
  const copyTimeout = useRef<number | undefined>(undefined)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parameters))
  }, [parameters])

  useEffect(() => () => window.clearTimeout(copyTimeout.current), [])

  const validParameters = parameters
    .map((p) => ({ name: p.name.trim(), values: parseValues(p.valuesText) }))
    .filter((p) => p.name && p.values.length > 0)

  const canGenerate = validParameters.length >= 2

  function updateParameter(id: string, patch: Partial<ParameterDraft>) {
    setParameters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    )
    setResult(null)
  }

  function addParameter() {
    setParameters((prev) => [...prev, { id: createId(), name: '', valuesText: '' }])
  }

  function removeParameter(id: string) {
    setParameters((prev) => prev.filter((p) => p.id !== id))
    setResult(null)
  }

  function handleReset() {
    if (
      !window.confirm('Почати новий набір параметрів? Поточні дані буде втрачено.')
    ) {
      return
    }
    setParameters(emptyParameters())
    setResult(null)
  }

  function handleGenerate() {
    setResult(generatePairwise(validParameters))
  }

  async function handleCopy(format: 'csv' | 'markdown') {
    if (!result) return
    const text = format === 'csv' ? buildCsv(result) : buildMarkdownTable(result)
    await navigator.clipboard.writeText(text)
    setCopyStatus('copied')
    window.clearTimeout(copyTimeout.current)
    copyTimeout.current = window.setTimeout(() => setCopyStatus('idle'), 2000)
  }

  function handleDownloadCsv() {
    if (!result) return
    const blob = new Blob([buildCsv(result)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pairwise-test-cases.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="pairwise-generator">
      <section className="pairwise-section">
        <h2>Параметри</h2>
        <div className="parameter-list">
          {parameters.map((param) => (
            <div key={param.id} className="parameter-row">
              <input
                className="parameter-name"
                value={param.name}
                onChange={(e) => updateParameter(param.id, { name: e.target.value })}
                placeholder="Назва параметра"
              />
              <input
                className="parameter-values"
                value={param.valuesText}
                onChange={(e) =>
                  updateParameter(param.id, { valuesText: e.target.value })
                }
                placeholder="Значення через кому"
              />
              <button
                type="button"
                className="icon-button"
                aria-label="Видалити параметр"
                onClick={() => removeParameter(param.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="parameter-list-actions">
          <button type="button" className="ghost" onClick={addParameter}>
            + Додати параметр
          </button>
          <button type="button" className="ghost" onClick={handleReset}>
            Новий набір параметрів
          </button>
        </div>
      </section>

      <section className="pairwise-actions">
        <button
          type="button"
          className="primary"
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          Згенерувати комбінації
        </button>
        {!canGenerate && (
          <span className="section-hint">
            Потрібно щонайменше 2 параметри, кожен з хоча б одним значенням.
          </span>
        )}
      </section>

      {result && (
        <section className="pairwise-section">
          <h2>Результат</h2>
          <p className="result-summary">
            {result.testCases.length} тест-кейсів замість{' '}
            {result.fullCombinationCount} (усіх комбінацій) — охоплено{' '}
            {result.pairsCovered}/{result.totalPairs} попарних поєднань.
          </p>

          <div className="table-scroll">
            <table className="pairwise-table">
              <thead>
                <tr>
                  <th>#</th>
                  {result.parameterNames.map((name) => (
                    <th key={name}>{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.testCases.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {row.map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pairwise-actions">
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
