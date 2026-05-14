import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, type Category, type Page, type Product } from '../api'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { Footer } from '../components/Footer'
import { Icon } from '../components/Icon'
import { comingSoon } from '../components/Toast'

export function CatalogPage() {
  const [searchParams] = useSearchParams()
  const q = (searchParams.get('q') ?? '').trim()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<Category[]>('/api/categories').then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('size', '50')
    if (categoryId) params.set('categoryId', String(categoryId))
    if (q) params.set('q', q)
    api<Page<Product>>(`/api/products?${params.toString()}`)
      .then(p => setProducts(p.content))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [categoryId, q])

  const categoryNameById = useMemo(() => {
    const m = new Map<number, string>()
    categories.forEach(c => m.set(c.id, c.nameHe))
    return m
  }, [categories])

  return (
    <>
      <div className="hm-page">
        {!q && <Hero />}

        <div className="hm-section-head">
          <div>
            <div className="label">{q ? 'תוצאות חיפוש' : 'קטלוג · 2026'}</div>
            <h2 style={{ marginTop: 6 }}>{q ? `חיפוש: "${q}"` : 'נבחר השבוע'}</h2>
          </div>
          <div className="hm-meta">
            {!loading && `מציג ${products.length} מוצרים${q ? '' : ' · ממוין לפי חדש'}`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
          <div className="hm-chips" style={{ flex: 1 }}>
            <button
              className={`hm-chip ${categoryId === null ? 'active' : ''}`}
              onClick={() => setCategoryId(null)}
            >
              הכול
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                className={`hm-chip ${categoryId === c.id ? 'active' : ''}`}
                onClick={() => setCategoryId(c.id)}
              >
                {c.nameHe}
              </button>
            ))}
          </div>
          <button
            onClick={() => comingSoon('מיון')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              border: '1px solid var(--line)', borderRadius: 'var(--r-pill)',
              padding: '8px 14px', background: 'var(--card)', fontSize: 13,
            }}
          >
            <span style={{ color: 'var(--ink-3)' }}>מיון:</span>
            <strong>חדש קודם</strong>
            <Icon name="chev" size={14} />
          </button>
        </div>

        {error && <div className="hm-error" style={{ marginBottom: 14 }}>{error}</div>}
        {loading && <p style={{ color: 'var(--ink-3)' }}>טוען…</p>}

        <div className="hm-catalog-grid">
          {products.map(p => (
            <ProductCard
              key={p.id}
              p={p}
              categoryName={p.categoryId != null ? categoryNameById.get(p.categoryId) : undefined}
            />
          ))}
        </div>

        {!loading && products.length === 0 && (
          <p style={{ marginTop: 24, color: 'var(--ink-3)' }}>אין מוצרים להצגה.</p>
        )}

        {/* trust strip */}
        <div className="hm-three-col" style={{
          marginTop: 36, padding: '22px 28px',
          background: 'var(--card)', border: '1px solid var(--line)',
          borderRadius: 'var(--r-lg)',
        }}>
          {([
            ['truck', 'משלוח באותו יום', 'הזמנה עד 11:00 — מגיע עד הערב.'],
            ['leaf',  'איכות מובטחת',     'החזר מלא אם לא מרוצים מהמוצר.'],
            ['secure','תשלום מוגן',       'Grow/Meshulam · PCI Compliant.'],
          ] as const).map(([i, t, s]) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'var(--olive-soft)', color: 'var(--olive-2)',
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <Icon name={i} size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{t}</div>
                <div className="hm-meta">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
