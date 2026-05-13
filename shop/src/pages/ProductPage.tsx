import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, formatPrice, type Product, type Category } from '../api'
import { useCart } from '../cart/cartStore'
import { Icon } from '../components/Icon'
import { Footer } from '../components/Footer'
import { comingSoon } from '../components/Toast'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const add = useCart(s => s.add)
  const nav = useNavigate()

  useEffect(() => {
    if (!slug) return
    setError(null)
    setProduct(null)
    api<Product>(`/api/products/${slug}`)
      .then(setProduct)
      .catch(e => setError(e.message))
  }, [slug])

  useEffect(() => {
    api<Category[]>('/api/categories').then(setCategories).catch(() => {})
  }, [])

  if (error) return <div className="hm-page"><div className="hm-error">{error}</div></div>
  if (!product) return <div className="hm-page"><p style={{ color: 'var(--ink-3)' }}>טוען…</p></div>

  const categoryName = product.categoryId != null
    ? categories.find(c => c.id === product.categoryId)?.nameHe
    : undefined

  const outOfStock = product.stockQty <= 0
  const lineTotal = product.priceAgorot * quantity

  return (
    <>
      <div className="hm-page">
        <div className="hm-crumb">
          <Link to="/" style={{ color: 'var(--ink-3)' }}>קטלוג</Link>
          {categoryName && (
            <>
              <span className="sep">›</span>
              <span>{categoryName}</span>
            </>
          )}
          <span className="sep">›</span>
          <span style={{ color: 'var(--ink)' }}>{product.nameHe}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 36 }}>
          {/* gallery */}
          <div>
            <div style={{
              aspectRatio: '1/1', borderRadius: 'var(--r-xl)',
              background: 'var(--card)', border: '1px solid var(--line)',
              position: 'relative', overflow: 'hidden',
              display: 'grid', placeItems: 'center',
            }}>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.nameHe}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 24 }}
                />
              ) : (
                <>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'repeating-linear-gradient(135deg, transparent 0 18px, rgba(26,22,18,.025) 18px 19px)',
                  }} />
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '0.2em',
                    color: 'var(--ink-3)', background: 'var(--paper)',
                    padding: '10px 18px', border: '1px solid var(--line)',
                    borderRadius: 'var(--r-pill)', textTransform: 'uppercase',
                  }}>{product.sku}</span>
                </>
              )}
            </div>
          </div>

          {/* info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div className="hm-meta" style={{
                textTransform: 'uppercase', letterSpacing: '0.16em',
                color: 'var(--terracotta)', fontFamily: 'var(--mono)',
              }}>
                {categoryName ? `${categoryName} · ` : ''}{product.sku}
              </div>
              <h1 style={{ fontSize: 46, marginTop: 8 }}>{product.nameHe}</h1>
            </div>

            {product.descriptionHe && (
              <p style={{ color: 'var(--ink-2)', lineHeight: 1.65 }}>{product.descriptionHe}</p>
            )}

            <div style={{
              padding: '16px 18px', background: 'var(--paper-2)',
              borderRadius: 'var(--r-md)', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div className="hm-meta">מחיר ליחידה</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 34, fontWeight: 500 }}>
                    {formatPrice(product.priceAgorot)}
                  </span>
                  <span className="hm-meta">/ יחידה</span>
                </div>
              </div>
              <div style={{ textAlign: 'start' }}>
                {outOfStock ? (
                  <span className="hm-badge hm-badge-out">אזל מהמלאי</span>
                ) : (
                  <span className="hm-badge hm-badge-leaf">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--leaf)' }} />
                    במלאי · {product.stockQty} יח׳
                  </span>
                )}
                <div className="hm-meta" style={{ marginTop: 6 }}>משלוח חינם מעל ₪150</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: '1px solid var(--line)', borderRadius: 'var(--r-pill)',
                background: 'var(--card)', overflow: 'hidden',
              }}>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  style={{ width: 42, height: 44, background: 'none', border: 'none' }}
                >
                  <Icon name="minus" size={16} />
                </button>
                <span className="mono" style={{ padding: '0 14px', fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(Math.min(99, product.stockQty), q + 1))}
                  disabled={quantity >= Math.min(99, product.stockQty)}
                  style={{ width: 42, height: 44, background: 'none', border: 'none' }}
                >
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <button
                className="hm-btn hm-btn-primary hm-btn-lg"
                style={{ flex: 1, justifyContent: 'center' }}
                disabled={outOfStock}
                onClick={() => add(product, quantity)}
              >
                <Icon name="bag" size={16} /> הוספה לסל · {formatPrice(lineTotal)}
              </button>
              <button
                className="hm-icon-btn"
                style={{ width: 48, height: 48 }}
                onClick={() => comingSoon('מועדפים')}
                aria-label="הוסף למועדפים"
              >
                <Icon name="heart" />
              </button>
            </div>

            <button
              className="hm-btn hm-btn-ghost"
              style={{ justifyContent: 'center' }}
              disabled={outOfStock}
              onClick={() => { add(product, quantity); nav('/cart') }}
            >
              קנייה מהירה
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {([
                ['truck',  'משלוח חינם',    'מעל ₪150 · עד 2 ימי עסקים'],
                ['leaf',   'איכות מובטחת', 'החזר מלא אם לא מרוצים'],
                ['secure', 'תשלום מאובטח',  'Grow/Meshulam · PCI'],
              ] as const).map(([i, t, s]) => (
                <div key={i} style={{
                  padding: 12, borderRadius: 'var(--r-md)',
                  background: 'var(--card)', border: '1px solid var(--line)',
                }}>
                  <div style={{ color: 'var(--olive-2)', marginBottom: 6 }}>
                    <Icon name={i} size={18} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{t}</div>
                  <div className="hm-meta" style={{ fontSize: 11.5 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
