import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatPrice, type Category, type Page, type Product } from '../api'

export function CatalogPage() {
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
    const qs = categoryId ? `?categoryId=${categoryId}&size=50` : '?size=50'
    api<Page<Product>>(`/api/products${qs}`)
      .then(p => setProducts(p.content))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [categoryId])

  return (
    <div className="container">
      <h1 style={{ marginBlockStart: 0 }}>קטלוג מוצרים</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBlock: '1rem' }}>
        <button
          className={categoryId === null ? '' : 'secondary'}
          onClick={() => setCategoryId(null)}
        >
          הכול
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            className={categoryId === c.id ? '' : 'secondary'}
            onClick={() => setCategoryId(c.id)}
          >
            {c.nameHe}
          </button>
        ))}
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <p>טוען…</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {products.map(p => (
          <Link
            key={p.id}
            to={`/p/${p.slug}`}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1rem',
              boxShadow: 'var(--shadow)',
              color: 'inherit',
            }}
          >
            <div style={{ height: 140, background: '#f3f4f6', borderRadius: 'var(--radius)', marginBlockEnd: '0.75rem' }} />
            <div style={{ fontWeight: 600, marginBlockEnd: '0.25rem' }}>{p.nameHe}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBlockEnd: '0.5rem' }}>
              {p.descriptionHe}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: 'var(--primary)' }}>{formatPrice(p.priceAgorot)}</strong>
              <span style={{ color: p.stockQty > 0 ? 'var(--muted)' : 'var(--danger)', fontSize: '0.85rem' }}>
                {p.stockQty > 0 ? `במלאי` : 'אזל'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {!loading && products.length === 0 && <p>אין מוצרים להצגה.</p>}
    </div>
  )
}
