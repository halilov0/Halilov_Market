import { useEffect, useState } from 'react'
import { api, formatPrice, type Category, type Product, type ProductUpsert } from '../api'

const emptyDraft: ProductUpsert = {
  sku: '', slug: '', nameHe: '', descriptionHe: '',
  categoryId: null, priceAgorot: 0, stockQty: 0, imageUrl: '', active: true,
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState<ProductUpsert>(emptyDraft)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  function load() {
    setError(null)
    Promise.all([
      api<{ content: Product[] }>('/api/products?size=200'),
      api<Category[]>('/api/categories'),
    ])
      .then(([p, c]) => { setProducts(p.content); setCategories(c) })
      .catch(e => setError(e.message))
  }
  useEffect(load, [])

  function startCreate() {
    setEditing(null)
    setCreating(true)
    setDraft(emptyDraft)
    setError(null)
  }
  function startEdit(p: Product) {
    setCreating(false)
    setEditing(p)
    setDraft({
      sku: p.sku, slug: p.slug, nameHe: p.nameHe,
      descriptionHe: p.descriptionHe ?? '',
      categoryId: p.categoryId, priceAgorot: p.priceAgorot, stockQty: p.stockQty,
      imageUrl: p.imageUrl ?? '', active: p.active,
    })
    setError(null)
  }
  function cancel() { setEditing(null); setCreating(false); setError(null) }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (editing) {
        await api(`/api/admin/catalog/products/${editing.id}`, {
          method: 'PUT', body: JSON.stringify(draft),
        })
      } else {
        await api('/api/admin/catalog/products', {
          method: 'POST', body: JSON.stringify(draft),
        })
      }
      cancel()
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה')
    } finally {
      setBusy(false)
    }
  }

  async function remove(p: Product) {
    if (!confirm(`למחוק את "${p.nameHe}"?`)) return
    setError(null)
    try {
      await api(`/api/admin/catalog/products/${p.id}`, { method: 'DELETE' })
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '1rem' }}>
        <h1 style={{ margin: 0 }}>מוצרים</h1>
        {!creating && !editing && <button onClick={startCreate}>+ מוצר חדש</button>}
      </div>

      {error && <div className="error">{error}</div>}

      {(creating || editing) && (
        <form onSubmit={save} className="card" style={{ marginBlockEnd: '1rem', display: 'grid', gap: '0.5rem' }}>
          <h3 style={{ marginBlockStart: 0 }}>{editing ? `עריכת ${editing.nameHe}` : 'מוצר חדש'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <label>מק"ט<input required value={draft.sku} onChange={e => setDraft({ ...draft, sku: e.target.value })} /></label>
            <label>Slug<input required value={draft.slug} onChange={e => setDraft({ ...draft, slug: e.target.value })} /></label>
          </div>
          <label>שם<input required value={draft.nameHe} onChange={e => setDraft({ ...draft, nameHe: e.target.value })} /></label>
          <label>תיאור
            <textarea rows={3} value={draft.descriptionHe ?? ''} onChange={e => setDraft({ ...draft, descriptionHe: e.target.value })} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <label>קטגוריה
              <select
                value={draft.categoryId ?? ''}
                onChange={e => setDraft({ ...draft, categoryId: e.target.value ? Number(e.target.value) : null })}
              >
                <option value="">— ללא —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nameHe}</option>)}
              </select>
            </label>
            <label>מחיר (אגורות)
              <input type="number" min={0} required value={draft.priceAgorot}
                     onChange={e => setDraft({ ...draft, priceAgorot: Number(e.target.value) })} />
            </label>
            <label>מלאי
              <input type="number" min={0} required value={draft.stockQty}
                     onChange={e => setDraft({ ...draft, stockQty: Number(e.target.value) })} />
            </label>
          </div>
          <label>URL תמונה
            <input value={draft.imageUrl ?? ''} onChange={e => setDraft({ ...draft, imageUrl: e.target.value })} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
            <input type="checkbox" style={{ width: 'auto' }} checked={draft.active}
                   onChange={e => setDraft({ ...draft, active: e.target.checked })} />
            פעיל
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={busy}>{busy ? 'שומר…' : 'שמירה'}</button>
            <button type="button" className="secondary" onClick={cancel}>ביטול</button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>מק"ט</th><th>שם</th><th>קטגוריה</th><th>מחיר</th><th>מלאי</th><th>פעיל</th><th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.nameHe}</td>
              <td>{categories.find(c => c.id === p.categoryId)?.nameHe ?? '—'}</td>
              <td>{formatPrice(p.priceAgorot)}</td>
              <td style={{ color: p.stockQty < 10 ? 'var(--warning)' : undefined }}>{p.stockQty}</td>
              <td>{p.active ? '✓' : '—'}</td>
              <td style={{ display: 'flex', gap: '0.35rem' }}>
                <button className="secondary" onClick={() => startEdit(p)}>עריכה</button>
                <button className="danger" onClick={() => remove(p)}>מחיקה</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
