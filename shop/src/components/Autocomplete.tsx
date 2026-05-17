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
  minChars?: number
}

const DEBOUNCE_MS = 200

export function Autocomplete({
  label, value, onChange, fetchSuggestions,
  resetKey, required, placeholder, disabled, minChars = 1,
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
    const q = value.trim()
    if (q.length < minChars) { setSuggestions([]); setOpen(false); return }
    const myReq = ++reqId.current
    setLoading(true)
    const t = window.setTimeout(async () => {
      try {
        const res = await fetchSuggestions(q)
        if (reqId.current !== myReq) return
        setSuggestions(res)
        setOpen(res.length > 0)
        setHighlight(-1)
      } catch {
        if (reqId.current !== myReq) return
        setSuggestions([])
        setOpen(false)
      } finally {
        if (reqId.current === myReq) setLoading(false)
      }
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, resetKey])

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
        className="hm-input"
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        onChange={e => onChange(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
        onKeyDown={onKeyDown}
      />
      {open && (
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
      {loading && value.trim().length >= minChars && (
        <div className="cls-ac-loading">…</div>
      )}
    </div>
  )
}

// Convenience fetchers wired to the backend places API.
export async function fetchCities(q: string): Promise<string[]> {
  return api<string[]>(`/api/places/cities?q=${encodeURIComponent(q)}&limit=10`)
}

export async function fetchStreets(city: string, q: string): Promise<string[]> {
  const params = new URLSearchParams({ city, limit: '10' })
  if (q) params.set('q', q)
  return api<string[]>(`/api/places/streets?${params.toString()}`)
}
