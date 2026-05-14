import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, type Product, type Category } from '../api'
import { useCart } from '../cart/cartStore'
import { Icon } from '../components/Icon'
import { Footer } from '../components/Footer'
import { comingSoon } from '../components/Toast'

function formatPriceParts(agorot: number) {
  const [s, a] = (agorot / 100).toFixed(2).split('.')
  return { shekels: s, agorot: a }
}

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

  if (error) return <div className="cls-page"><div className="hm-error">{error}</div></div>
  if (!product) return <div className="cls-page"><p style={{ color: 'var(--ink-3)' }}>טוען…</p></div>

  const categoryName = product.categoryId != null
    ? categories.find(c => c.id === product.categoryId)?.nameHe
    : undefined

  const outOfStock = product.stockQty <= 0
  const lowStock = product.stockQty > 0 && product.stockQty < 10
  const lineTotal = product.priceAgorot * quantity
  const totalParts = formatPriceParts(lineTotal)
  const price = formatPriceParts(product.priceAgorot)

  return (
    <>
      <div className="cls-page">
        <div className="cls-crumb">
          <Link to="/">קטלוג</Link>
          {categoryName && (
            <>
              <span className="sep">›</span>
              <Link to={`/?categoryId=${product.categoryId}`}>{categoryName}</Link>
            </>
          )}
          <span className="sep">›</span>
          <span className="current">{product.nameHe}</span>
        </div>

        <div className="cls-pdp">
          <div className="cls-pdp-gallery">
            <div className="badges">
              {outOfStock && <span className="badge-pill out" style={{ background: 'var(--ink-4)', color: '#fff', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--r-xs)' }}>אזל</span>}
              {!outOfStock && lowStock && <span className="badge-pill" style={{ background: 'var(--accent)', color: '#fff', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--r-xs)' }}>מלאי אחרון</span>}
            </div>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.nameHe} />
            ) : (
              <span className="ph">{product.sku}</span>
            )}
          </div>

          <div className="cls-pdp-info">
            <div>
              <div className="eyebrow">
                {categoryName ? `${categoryName} · ` : ''}{product.sku}
              </div>
              <h1>{product.nameHe}</h1>
            </div>

            {product.descriptionHe && <p className="desc">{product.descriptionHe}</p>}

            <div className="cls-pdp-price-box">
              <div>
                <div className="label">מחיר ליחידה</div>
                <div className="price">
                  <span className="sym">₪</span>{price.shekels}
                  <span className="agorot">.{price.agorot}</span>
                </div>
              </div>
              <div style={{ textAlign: 'end' }}>
                {outOfStock ? (
                  <span className="stock-pill out"><span className="dot" />אזל מהמלאי</span>
                ) : (
                  <span className="stock-pill in"><span className="dot" />במלאי · {product.stockQty} יח׳</span>
                )}
                <div className="ship-note">משלוח חינם מעל ₪199</div>
              </div>
            </div>

            <div className="cls-pdp-cta-row">
              <div className="cls-qty">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="פחות"
                >
                  <Icon name="minus" size={16} stroke={2.2} />
                </button>
                <span className="val">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(Math.min(99, product.stockQty), q + 1))}
                  disabled={quantity >= Math.min(99, product.stockQty)}
                  aria-label="עוד"
                >
                  <Icon name="plus" size={16} stroke={2.2} />
                </button>
              </div>
              <button
                className="add-cta"
                disabled={outOfStock}
                onClick={() => add(product, quantity)}
              >
                <Icon name="bag" size={16} stroke={2.2} />
                הוסף לסל · ₪{totalParts.shekels}.{totalParts.agorot}
              </button>
              <button
                className="fav-cta"
                onClick={() => comingSoon('מועדפים')}
                aria-label="הוסף למועדפים"
                type="button"
              >
                <Icon name="heart" size={18} />
              </button>
            </div>

            <button
              className="cls-pdp-buy-now"
              disabled={outOfStock}
              onClick={() => { add(product, quantity); nav('/cart') }}
              type="button"
            >
              קנייה מהירה
              <Icon name="arrow" size={14} stroke={2.2} />
            </button>

            <div className="cls-pdp-trust">
              {([
                ['truck',  'משלוח חינם',   'מעל ₪199 · עד 2 ימי עסקים'],
                ['secure', 'תשלום מאובטח',  'Grow/Meshulam · PCI'],
                ['pkg',    'החזרות 14 יום', 'בלי שאלות. בלי כאב ראש.'],
              ] as const).map(([i, t, s]) => (
                <div key={i} className="tile">
                  <div className="ico"><Icon name={i} size={18} /></div>
                  <div className="t">{t}</div>
                  <div className="s">{s}</div>
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
