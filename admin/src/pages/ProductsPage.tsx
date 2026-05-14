import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, formatPrice, type Category, type Product, type ProductUpsert } from '../api'
import { Field } from '../components/Field'
import { Icon } from '../components/Icon'
import { comingSoon } from '../components/Toast'

const emptyDraft: ProductUpsert = {
  sku: '', slug: '', nameHe: '', descriptionHe: '',
  categoryId: null, priceAgorot: 0, stockQty: 0, imageUrl: '', active: true,
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState<ProductUpsert>(emptyDraft)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [query, setQuery] = useState(urlQuery)

  useEffect(() => { setQuery(urlQuery) }, [urlQuery])

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(p =>
      p.nameHe.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    )
  }, [products, query])

  const updateQuery = (v: string) => {
    setQuery(v)
    const next = new URLSearchParams(searchParams)
    if (v.trim()) next.set('q', v.trim())
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

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
    setEditing(null); setCreating(true); setDraft(emptyDraft); setError(null)
  }

  function startEdit(p: Product) {
    setCreating(false); setEditing(p)
    setDraft({
      sku: p.sku, slug: p.slug, nameHe: p.nameHe,
      descriptionHe: p.descriptionHe ?? '',
      categoryId: p.categoryId, priceAgorot: p.priceAgorot, stockQty: p.stockQty,
      imageUrl: p.imageUrl ?? '', active: p.active,
    })
    setError(null)
  }

  function cancel() { setEditing(null); setCreating(false); setError(null) }

  async function uploadImage(file: File) {
    setError(null); setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await api<{ url: string }>('/api/admin/media/products', { method: 'POST', body: form })
      setDraft(d => ({ ...d, imageUrl: res.url }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה בהעלאה')
    } finally {
      setUploading(false)
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(null)
    try {
      if (editing) {
        await api(`/api/admin/catalog/products/${editing.id}`, { method: 'PUT', body: JSON.stringify(draft) })
      } else {
        await api('/api/admin/catalog/products', { method: 'POST', body: JSON.stringify(draft) })
      }
      cancel(); load()
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

  const isEditing = creating || editing
  const lowStockCount = products.filter(p => p.stockQty < 10 && p.active).length

  if (isEditing) {
    return (
      <form onSubmit={save}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
          <div>
            <a onClick={cancel} className="hm-meta" style={{ fontFamily: 'var(--mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
              ← חזרה למוצרים
            </a>
            <h1 style={{ marginTop: 4 }}>{editing ? 'עריכת מוצר' : 'מוצר חדש'}</h1>
            <div className="sub">{editing ? editing.nameHe : 'הוסף מוצר חדש לקטלוג'}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="hm-btn hm-btn-quiet" onClick={cancel}>ביטול</button>
            <button type="submit" className="hm-btn hm-btn-primary" disabled={busy || uploading}>
              {busy ? 'שומר…' : 'שמירה'}
            </button>
          </div>
        </div>

        {error && <div className="hm-error" style={{ marginBottom: 14 }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="adm-card">
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18, marginBottom: 14 }}>פרטים בסיסיים</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <Field label="שם המוצר" required value={draft.nameHe} onChange={e => setDraft({ ...draft, nameHe: e.target.value })} />
                <Field label="תיאור" multiline rows={3} value={draft.descriptionHe ?? ''} onChange={e => setDraft({ ...draft, descriptionHe: e.target.value })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="מק״ט" required mono value={draft.sku} onChange={e => setDraft({ ...draft, sku: e.target.value })} />
                  <Field label="Slug (אנגלית)" required mono value={draft.slug} onChange={e => setDraft({ ...draft, slug: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="adm-card">
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18, marginBottom: 14 }}>תמונה</h3>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{
                  width: 160, height: 160, borderRadius: 'var(--r-md)',
                  background: 'var(--paper-2)',
                  border: '1px solid var(--line)',
                  display: 'grid', placeItems: 'center', overflow: 'hidden',
                }}>
                  {draft.imageUrl ? (
                    <img src={draft.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      אין תמונה
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label className="hm-btn hm-btn-quiet" style={{ width: 'fit-content', cursor: uploading ? 'wait' : 'pointer' }}>
                    <Icon name="upload" size={14} />
                    {uploading ? 'מעלה…' : draft.imageUrl ? 'החלפת תמונה' : '+ העלאה'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading}
                           onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = '' }}
                           style={{ display: 'none' }} />
                  </label>
                  {draft.imageUrl && (
                    <button type="button" className="hm-btn hm-btn-ghost" style={{ width: 'fit-content' }}
                            onClick={() => setDraft(d => ({ ...d, imageUrl: '' }))}>
                      <Icon name="trash" size={14} /> הסרת תמונה
                    </button>
                  )}
                  <div className="hm-meta" style={{ fontSize: 11.5 }}>
                    JPG / PNG / WebP · מקסימום 10MB · מותאם אוטומטית ל-1200px
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14, height: 'fit-content' }}>
            <div className="adm-card">
              <div className="hm-label" style={{ marginBottom: 10 }}>סטטוס</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={e => setDraft({ ...draft, active: e.target.checked })}
                />
                <span>{draft.active ? 'פעיל בקטלוג' : 'מוסתר'}</span>
              </label>
            </div>

            <div className="adm-card">
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, marginBottom: 12 }}>תמחור ומלאי</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                <Field label="מחיר (אגורות)" type="number" min={0} required mono
                       value={draft.priceAgorot}
                       onChange={e => setDraft({ ...draft, priceAgorot: Number(e.target.value) })} />
                <Field label="מלאי" type="number" min={0} required mono
                       value={draft.stockQty}
                       onChange={e => setDraft({ ...draft, stockQty: Number(e.target.value) })} />
              </div>
            </div>

            <div className="adm-card">
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, marginBottom: 12 }}>ארגון</h3>
              <div className="hm-field">
                <label>קטגוריה</label>
                <select className="hm-input"
                        value={draft.categoryId ?? ''}
                        onChange={e => setDraft({ ...draft, categoryId: e.target.value ? Number(e.target.value) : null })}>
                  <option value="">— ללא —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nameHe}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
        <div>
          <h1>מוצרים</h1>
          <div className="sub">
            {products.filter(p => p.active).length} פעילים
            {lowStockCount > 0 && ` · ${lowStockCount} במלאי נמוך`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="hm-btn hm-btn-quiet" onClick={() => comingSoon('ייבוא CSV')}>ייבוא CSV</button>
          <button className="hm-btn hm-btn-primary" onClick={startCreate}>+ מוצר חדש</button>
        </div>
      </div>

      {error && <div className="hm-error" style={{ marginBottom: 14 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--card)', border: '1px solid var(--line)',
          borderRadius: 'var(--r-pill)', padding: '6px 14px',
          width: 280, color: 'var(--ink-3)',
        }}>
          <Icon name="search" size={14} />
          <input
            type="search"
            value={query}
            onChange={e => updateQuery(e.target.value)}
            placeholder="חפש מק״ט, שם מוצר…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, color: 'var(--ink)', minWidth: 0, fontFamily: 'inherit',
            }}
          />
        </div>
        {query.trim() && (
          <span className="hm-meta" style={{ fontSize: 12 }}>
            {filteredProducts.length} מתוך {products.length}
          </span>
        )}
      </div>

      <table className="adm-table">
        <thead>
          <tr>
            <th style={{ width: 56 }}></th>
            <th>שם</th>
            <th>מק״ט</th>
            <th>קטגוריה</th>
            <th style={{ textAlign: 'start' }}>מחיר</th>
            <th>מלאי</th>
            <th>סטטוס</th>
            <th style={{ width: 140 }}></th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => {
            const lowStock = p.stockQty < 10
            const outOfStock = p.stockQty <= 0
            return (
              <tr key={p.id}>
                <td>
                  <div style={{
                    width: 42, height: 42, borderRadius: 'var(--r-sm)',
                    background: 'var(--paper-2)', display: 'grid', placeItems: 'center',
                    overflow: 'hidden',
                  }}>
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      : <span className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>—</span>}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{p.nameHe}</div>
                  {p.descriptionHe && <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{p.descriptionHe}</div>}
                </td>
                <td className="num">{p.sku}</td>
                <td>
                  <span className="hm-chip" style={{ padding: '3px 10px', fontSize: 11.5 }}>
                    {categories.find(c => c.id === p.categoryId)?.nameHe ?? '—'}
                  </span>
                </td>
                <td className="num" style={{ textAlign: 'start', fontWeight: 600 }}>{formatPrice(p.priceAgorot)}</td>
                <td className="num" style={{ color: outOfStock ? 'var(--berry)' : lowStock ? 'var(--terracotta)' : 'var(--ink)' }}>
                  {p.stockQty}{lowStock && !outOfStock && ' ⚠'}
                </td>
                <td>
                  <span className={`hm-status ${p.active ? 'hm-status-paid' : 'hm-status-cancelled'}`} style={{ textTransform: 'none' }}>
                    {p.active ? 'פעיל' : 'מוסתר'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: 6 }}>
                  <button className="hm-btn hm-btn-quiet" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => startEdit(p)}>עריכה</button>
                  <button className="hm-icon-btn" style={{ width: 28, height: 28 }} onClick={() => remove(p)} aria-label="מחיקה">
                    <Icon name="trash" size={14} />
                  </button>
                </td>
              </tr>
            )
          })}
          {filteredProducts.length === 0 && (
            <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--ink-3)', padding: 30 }}>
              {query.trim() ? `אין תוצאות עבור "${query.trim()}".` : 'אין מוצרים. לחצו "מוצר חדש".'}
            </td></tr>
          )}
        </tbody>
      </table>
    </>
  )
}
