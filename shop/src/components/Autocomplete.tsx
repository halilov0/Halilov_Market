import { useEffect, useRef, useState } from 'react'
import { api } from '../api'

type Props = {
  label: string
  value: string
  onChange: (v: string) => void
  fetchSuggestions: (q: string) => Promise<string[]>
  /** When this changes, current suggestions are reset (e.g. city changed → reset street). */
  resetKey?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  /** Minimum chars before fetching. 0 = fetch even on empty (browse-all mode). Default 0. */
  minChars?: number
  /** Field-level validation error to render below the input. */
  error?: string | null
  onBlur?: () => void
}

const DEBOUNCE_MS = 180

export function Autocomplete({
  label, value, onChange, fetchSuggestions,
  resetKey, required, placeholder, disabled,
  minChars = 0, error, onBlur,
}: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const wrapRef = useRef<HTMLDivElement>(null)
  const skipNextFetch = useRef(false)
  const reqId = useRef(0)

  useEffect(() => {
    setSuggestions([]); setOpen(false); setHighlight(-1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  useEffect(() => {
    if (skipNextFetch.current) { skipNextFetch.current = false; return }
    if (disabled) { setSuggestions([]); setOpen(false); return }
    const q = value.trim()
    if (q.length < minChars) { setSuggestions([]); setOpen(false); return }
    const myReq = ++reqId.current
    setLoading(true)
    const t = window.setTimeout(async () => {
      try {
        const res = await fetchSuggestions(q)
        if (reqId.current !== myReq) return
        setSuggestions(res)
      } catch {
        if (reqId.current !== myReq) return
        setSuggestions([])
      } finally {
        if (reqId.current === myReq) setLoading(false)
      }
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, resetKey, disabled])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function pick(s: string) {
    skipNextFetch.current = true
    onChange(s)
    setOpen(false)
    setHighlight(-1)
  }

  async function onFocus() {
    if (disabled) return
    if (suggestions.length > 0) { setOpen(true); return }
    if (value.trim().length >= minChars) {
      // Trigger the same fetch path as typing, so an empty-q focus loads the full list.
      setLoading(true)
      try {
        const res = await fetchSuggestions(value.trim())
        setSuggestions(res)
        setOpen(res.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setOpen(true); setHighlight(0); e.preventDefault()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      setHighlight(h => Math.min(h + 1, suggestions.length - 1)); e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      setHighlight(h => Math.max(h - 1, 0)); e.preventDefault()
    } else if (e.key === 'Enter') {
      if (highlight >= 0) { pick(suggestions[highlight]); e.preventDefault() }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="hm-field" ref={wrapRef} style={{ position: 'relative' }}>
      <label>{label}</label>
      <input
        className={`hm-input ${error ? 'has-error' : ''}`}
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
      {open && suggestions.length > 0 && (
        <ul className="cls-ac-list" role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s}
              role="option"
              aria-selected={i === highlight}
              className={i === highlight ? 'active' : ''}
              onMouseDown={e => { e.preventDefault(); pick(s) }}
              onMouseEnter={() => setHighlight(i)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      {loading && (
        <div className="cls-ac-loading">…</div>
      )}
      {error && <div className="cls-ac-err">{error}</div>}
    </div>
  )
}

// Convenience fetchers wired to the backend places API.
export async function fetchCities(q: string): Promise<string[]> {
  const params = new URLSearchParams({ limit: '50' })
  if (q) params.set('q', q)
  return api<string[]>(`/api/places/cities?${params.toString()}`)
}

export async function fetchStreets(city: string, q: string): Promise<string[]> {
  const params = new URLSearchParams({ city, limit: '50' })
  if (q) params.set('q', q)
  return api<string[]>(`/api/places/streets?${params.toString()}`)
}
