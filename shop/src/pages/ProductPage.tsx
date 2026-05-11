import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, formatPrice, type Product } from '../api'
import { useCart } from '../cart/cartStore'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
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

  if (error) return <div className="container"><div className="error">{error}</div></div>
  if (!product) return <div className="container"><p>טוען…</p></div>

  return (
    <div className="container">
      <p><Link to="/">← חזרה לקטלוג</Link></p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ height: 320, background: '#f3f4f6', borderRadius: 'var(--radius)' }} />
        <div>
          <h1 style={{ marginBlockStart: 0 }}>{product.nameHe}</h1>
          <p style={{ color: 'var(--muted)' }}>{product.descriptionHe}</p>
          <div style={{ fontSize: '1.6rem', color: 'var(--primary)', fontWeight: 700, marginBlock: '1rem' }}>
            {formatPrice(product.priceAgorot)}
          </div>
          <div style={{ marginBlockEnd: '1rem', color: product.stockQty > 0 ? 'var(--muted)' : 'var(--danger)' }}>
            {product.stockQty > 0 ? `במלאי: ${product.stockQty}` : 'אזל מהמלאי'}
          </div>
          {product.stockQty > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBlockEnd: '1rem' }}>
              <label>כמות:
                <input
                  type="number"
                  min={1}
                  max={Math.min(99, product.stockQty)}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  style={{ width: 70, marginInlineStart: '0.5rem' }}
                />
              </label>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              disabled={product.stockQty === 0}
              onClick={() => add(product, quantity)}
            >
              הוספה לסל
            </button>
            <button
              className="secondary"
              disabled={product.stockQty === 0}
              onClick={() => { add(product, quantity); nav('/cart') }}
            >
              קנייה מהירה
            </button>
          </div>
          <p style={{ marginBlockStart: '1rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
            מק"ט: {product.sku}
          </p>
        </div>
      </div>
    </div>
  )
}
