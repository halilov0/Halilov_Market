import { useEffect, useState } from 'react'
import { api, type Category, type CategoryUpsert } from '../api'

const emptyDraft: CategoryUpsert = { slug: '', nameHe: '', parentId: null, sortOrder: 0 }

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState<CategoryUpsert>(emptyDraft)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  function load() {
    setError(null)
    api<Category[]>('/api/categories').then(setCategories).catch(e => setError(e.message))
  }
  useEffect(load, [])

  function startCreate() { setEditing(null); setCreating(true); setDraft(emptyDraft); setError(null) }
  function startEdit(c: Category) {
    setCreating(false); setEditing(c)
    setDraft({ slug: c.slug, nameHe: c.nameHe, parentId: c.parentId, sortOrder: c.sortOrder })
    setError(null)
  }
  function cancel() { setEditing(null); setCreating(false); setError(null) }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(null)
    try {
      if (editing) {
        await api(`/api/admin/catalog/categories/${editing.id}`, { method: 'PUT', body: JSON.stringify(draft) })
      } else {
        await api('/api/admin/catalog/categories', { method: 'POST', body: JSON.stringify(draft) })
      }
      cancel(); load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה')
    } finally {
      setBusy(false)
    }
  }

  async function remove(c: Category) {
    if (!confirm(`למחוק "${c.nameHe}"? מוצרים שמשויכים יישארו ללא קטגוריה.`)) return
    try {
      await api(`/api/admin/catalog/categories/${c.id}`, { method: 'DELETE' })
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '1rem' }}>
        <h1 style={{ margin: 0 }}>קטגוריות</h1>
        {!creating && !editing && <button onClick={startCreate}>+ קטגוריה חדשה</button>}
      </div>

      {error && <div className="error">{error}</div>}

      {(creating || editing) && (
        <form onSubmit={save} className="card" style={{ marginBlockEnd: '1rem', display: 'grid', gap: '0.5rem' }}>
          <h3 style={{ marginBlockStart: 0 }}>{editing ? `עריכת ${editing.nameHe}` : 'קטגוריה חדשה'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <label>Slug<input required value={draft.slug} onChange={e => setDraft({ ...draft, slug: e.target.value })} /></label>
            <label>שם<input required value={draft.nameHe} onChange={e => setDraft({ ...draft, nameHe: e.target.value })} /></label>
            <label>סדר<input type="number" min={0} value={draft.sortOrder}
                            onChange={e => setDraft({ ...draft, sortOrder: Number(e.target.value) })} /></label>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={busy}>{busy ? 'שומר…' : 'שמירה'}</button>
            <button type="button" className="secondary" onClick={cancel}>ביטול</button>
          </div>
        </form>
      )}

      <table>
        <thead><tr><th>סדר</th><th>שם</th><th>Slug</th><th></th></tr></thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td>{c.sortOrder}</td>
              <td>{c.nameHe}</td>
              <td>{c.slug}</td>
              <td style={{ display: 'flex', gap: '0.35rem' }}>
                <button className="secondary" onClick={() => startEdit(c)}>עריכה</button>
                <button className="danger" onClick={() => remove(c)}>מחיקה</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
