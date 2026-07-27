import { useState, type KeyboardEvent } from 'react'
import type { LogEntry } from './types'

interface LogSectionProps {
  title: string
  placeholder: string
  entries: LogEntry[]
  onAdd: (text: string) => void
  onRemove: (id: string) => void
}

export default function LogSection({
  title,
  placeholder,
  entries,
  onAdd,
  onRemove,
}: LogSectionProps) {
  const [draft, setDraft] = useState('')

  function submit() {
    const text = draft.trim()
    if (!text) return
    onAdd(text)
    setDraft('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div className="log-section">
      <h3>
        {title} <span className="log-count">({entries.length})</span>
      </h3>
      {entries.length > 0 && (
        <ul className="log-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <span>{entry.text}</span>
              <button
                type="button"
                className="icon-button"
                aria-label="Видалити запис"
                onClick={() => onRemove(entry.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="log-input-row">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
        />
        <button type="button" onClick={submit} disabled={!draft.trim()}>
          Додати
        </button>
      </div>
    </div>
  )
}
