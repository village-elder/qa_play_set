import { useEffect, useRef, useState } from 'react'
import { FOCUS_AREAS } from './focusAreas'
import LogSection from './LogSection'
import { buildMarkdown } from './markdown'
import {
  createId,
  defaultCharterState,
  RESULT_LABELS,
  type CharterState,
  type SessionResult,
} from './types'
import './CharterBuilder.css'

const STORAGE_KEY = 'qa-toolkit:charter-builder'
const TIMEBOX_PRESETS = [30, 60, 90, 120]

function loadInitialState(): CharterState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultCharterState()
    return { ...defaultCharterState(), ...JSON.parse(raw) }
  } catch {
    return defaultCharterState()
  }
}

export default function CharterBuilder() {
  const [state, setState] = useState<CharterState>(loadInitialState)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')
  const [newChecklistText, setNewChecklistText] = useState('')
  const copyTimeout = useRef<number | undefined>(undefined)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => () => window.clearTimeout(copyTimeout.current), [])

  function update<K extends keyof CharterState>(key: K, value: CharterState[K]) {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  function toggleFocusArea(areaId: string) {
    setState((prev) => {
      const isSelected = prev.focusAreaIds.includes(areaId)
      if (isSelected) {
        return {
          ...prev,
          focusAreaIds: prev.focusAreaIds.filter((id) => id !== areaId),
          checklist: prev.checklist.filter(
            (item) => item.origin !== areaId || item.checked,
          ),
        }
      }
      const area = FOCUS_AREAS.find((a) => a.id === areaId)
      const existingTexts = new Set(prev.checklist.map((item) => item.text))
      const newItems = (area?.questions ?? [])
        .filter((question) => !existingTexts.has(question))
        .map((question) => ({
          id: createId(),
          text: question,
          checked: false,
          origin: areaId,
        }))
      return {
        ...prev,
        focusAreaIds: [...prev.focusAreaIds, areaId],
        checklist: [...prev.checklist, ...newItems],
      }
    })
  }

  function addChecklistItem() {
    const text = newChecklistText.trim()
    if (!text) return
    setState((prev) => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { id: createId(), text, checked: false, origin: 'custom' },
      ],
    }))
    setNewChecklistText('')
  }

  function toggleChecklistItem(id: string) {
    setState((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    }))
  }

  function removeChecklistItem(id: string) {
    setState((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((item) => item.id !== id),
    }))
  }

  function addLogEntry(field: 'bugs' | 'questions' | 'ideas', text: string) {
    setState((prev) => ({
      ...prev,
      [field]: [...prev[field], { id: createId(), text }],
    }))
  }

  function removeLogEntry(field: 'bugs' | 'questions' | 'ideas', id: string) {
    setState((prev) => ({
      ...prev,
      [field]: prev[field].filter((entry) => entry.id !== id),
    }))
  }

  function handleNewCharter() {
    if (!window.confirm('Почати новий чартер? Поточні дані буде втрачено.')) {
      return
    }
    setState(defaultCharterState())
  }

  async function handleCopyMarkdown() {
    const markdown = buildMarkdown(state)
    await navigator.clipboard.writeText(markdown)
    setCopyStatus('copied')
    window.clearTimeout(copyTimeout.current)
    copyTimeout.current = window.setTimeout(() => setCopyStatus('idle'), 2000)
  }

  function handleDownloadMarkdown() {
    const markdown = buildMarkdown(state)
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const fileSlug = state.target.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'charter'
    link.href = url
    link.download = `${fileSlug}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const checkedCount = state.checklist.filter((item) => item.checked).length

  return (
    <div className="charter-builder">
      <section className="charter-section">
        <h2>Місія сесії</h2>
        <div className="field-grid">
          <label className="field">
            <span>Дослідити (область / функціонал)</span>
            <input
              value={state.target}
              onChange={(e) => update('target', e.target.value)}
              placeholder="напр. Форма оформлення замовлення"
            />
          </label>
          <label className="field">
            <span>Використовуючи ресурси</span>
            <input
              value={state.resources}
              onChange={(e) => update('resources', e.target.value)}
              placeholder="напр. тестові акаунти, документація API"
            />
          </label>
          <label className="field field-wide">
            <span>Щоб дізнатись</span>
            <input
              value={state.discover}
              onChange={(e) => update('discover', e.target.value)}
              placeholder="напр. чи витримує форма нестабільні дані про доставку"
            />
          </label>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>Тестувальник</span>
            <input
              value={state.tester}
              onChange={(e) => update('tester', e.target.value)}
            />
          </label>
          <label className="field">
            <span>Дата</span>
            <input
              type="date"
              value={state.date}
              onChange={(e) => update('date', e.target.value)}
            />
          </label>
          <label className="field">
            <span>Тайм-бокс, хв</span>
            <div className="timebox-row">
              <input
                type="number"
                min={5}
                step={5}
                value={state.timeboxMinutes}
                onChange={(e) => update('timeboxMinutes', Number(e.target.value))}
              />
              <div className="preset-buttons">
                {TIMEBOX_PRESETS.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    className={
                      state.timeboxMinutes === minutes ? 'preset active' : 'preset'
                    }
                    onClick={() => update('timeboxMinutes', minutes)}
                  >
                    {minutes}
                  </button>
                ))}
              </div>
            </div>
          </label>
        </div>
      </section>

      <section className="charter-section">
        <h2>Фокус сесії</h2>
        <p className="section-hint">
          Обери напрямки — до чекліста додадуться підказки-евристики. Пункти можна
          редагувати вручну нижче.
        </p>
        <div className="focus-tags">
          {FOCUS_AREAS.map((area) => (
            <button
              key={area.id}
              type="button"
              className={
                state.focusAreaIds.includes(area.id) ? 'tag active' : 'tag'
              }
              onClick={() => toggleFocusArea(area.id)}
            >
              {area.label}
            </button>
          ))}
        </div>
      </section>

      <section className="charter-section">
        <h2>
          Чекліст{' '}
          <span className="log-count">
            ({checkedCount}/{state.checklist.length})
          </span>
        </h2>
        {state.checklist.length > 0 && (
          <ul className="checklist">
            {state.checklist.map((item) => (
              <li key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                  />
                  <span className={item.checked ? 'checked' : ''}>
                    {item.text}
                  </span>
                </label>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Видалити пункт"
                  onClick={() => removeChecklistItem(item.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="log-input-row">
          <input
            value={newChecklistText}
            onChange={(e) => setNewChecklistText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addChecklistItem()
              }
            }}
            placeholder="Свій пункт чекліста"
          />
          <button
            type="button"
            onClick={addChecklistItem}
            disabled={!newChecklistText.trim()}
          >
            Додати
          </button>
        </div>
      </section>

      <section className="charter-section">
        <h2>Під час сесії</h2>
        <div className="log-grid">
          <LogSection
            title="Знайдені баги"
            placeholder="Опиши баг і кроки відтворення"
            entries={state.bugs}
            onAdd={(text) => addLogEntry('bugs', text)}
            onRemove={(id) => removeLogEntry('bugs', id)}
          />
          <LogSection
            title="Питання, що виникли"
            placeholder="Незрозуміла поведінка чи потребує уточнення"
            entries={state.questions}
            onAdd={(text) => addLogEntry('questions', text)}
            onRemove={(id) => removeLogEntry('questions', id)}
          />
          <LogSection
            title="Нові ідеї для тестування"
            placeholder="Що варто дослідити в наступній сесії"
            entries={state.ideas}
            onAdd={(text) => addLogEntry('ideas', text)}
            onRemove={(id) => removeLogEntry('ideas', id)}
          />
        </div>
      </section>

      <section className="charter-section">
        <h2>Підсумок сесії</h2>
        <div className="field-grid">
          <label className="field">
            <span>Результат</span>
            <select
              value={state.result}
              onChange={(e) => update('result', e.target.value as SessionResult)}
            >
              {Object.entries(RESULT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Фактичний час, хв</span>
            <input
              value={state.actualMinutes}
              onChange={(e) => update('actualMinutes', e.target.value)}
              inputMode="numeric"
            />
          </label>
        </div>
        <label className="field field-wide">
          <span>Загальні нотатки</span>
          <textarea
            value={state.summaryNotes}
            onChange={(e) => update('summaryNotes', e.target.value)}
            rows={4}
            placeholder="Враження від сесії, ризики, рекомендації"
          />
        </label>
      </section>

      <section className="charter-actions">
        <button type="button" className="primary" onClick={handleCopyMarkdown}>
          {copyStatus === 'copied' ? 'Скопійовано ✓' : 'Копіювати як Markdown'}
        </button>
        <button type="button" onClick={handleDownloadMarkdown}>
          Завантажити .md
        </button>
        <button type="button" className="ghost" onClick={handleNewCharter}>
          Новий чартер
        </button>
      </section>
    </div>
  )
}
