import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../cart/cartStore'
import { formatPrice } from '../api'
import { Icon } from '../components/Icon'
import { Footer } from '../components/Footer'
import { SummaryRow } from '../components/SummaryRow'
import { comingSoon } from '../components/Toast'

const FREE_SHIPPING_THRESHOLD = 15000 // ₪150
const SHIPPING_AGOROT = 1990

export function CartPage() {
  const { lines, setQty, remove, subtotalAgorot } = useCart()
  const nav = useNavigate()
  const subtotal = subtotalAgorot()
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_AGOROT
  const total = subtotal + shipping
  const vat = Math.round((total * 18) / 118)
  const toFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  if (lines.length === 0) {
    return (
      <>
        <div className="hm-page" style={{ textAlign: 'center', paddingTop: 80 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--paper-2)', color: 'var(--ink-3)',
            display: 'grid', placeItems: 'center', margin: '0 auto 18px',
          }}>
            <Icon name="bag" size={28} />
          </div>
          <h1 style={{ fontSize: 36 }}>הסל ריק</h1>
          <p style={{ color: 'var(--ink-3)', marginTop: 8 }}>הוסיפו מוצרים מהקטלוג כדי להתחיל.</p>
          <Link to="/" className="hm-btn hm-btn-primary" style={{ marginTop: 24 }}>
            ← חזרה לקטלוג
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="hm-page hm-sidebar-layout">
        <div>
          <div className="hm-crumb">
            <Link to="/" style={{ color: 'var(--ink-3)' }}>קטלוג</Link>
            <span className="sep">›</span>
            <span style={{ color: 'var(--ink)' }}>סל קניות</span>
          </div>
          <h1 style={{ fontSize: 44 }}>סל קניות</h1>
          <p className="hm-meta" style={{ marginTop: 8 }}>
            {lines.length} פריטים · משלוח משוער עד 2 ימי עסקים
          </p>

          <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
            {lines.map(line => (
              <div key={line.productId} className="hm-cart-line" style={{
                padding: 14, background: 'var(--card)',
                border: '1px solid var(--line)', borderRadius: 'var(--r-lg)',
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 'var(--r-md)',
                  background: 'var(--paper-2)', display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
                  color: 'var(--ink-3)', textTransform: 'uppercase', padding: 6, textAlign: 'center',
                }}>
                  {line.slug.slice(0, 12)}
                </div>
                <div>
                  <Link to={`/p/${line.slug}`} style={{ fontFamily: 'var(--serif)', fontSize: 19, color: 'var(--ink)' }}>
                    {line.nameHe}
                  </Link>
                  <div className="hm-meta">{formatPrice(line.priceAgorot)} ליחידה</div>
                  <a
                    onClick={() => remove(line.productId)}
                    style={{ marginTop: 6, display: 'inline-block', color: 'var(--terracotta)', fontSize: 12.5, textDecoration: 'underline' }}
                  >
                    הסר
                  </a>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  border: '1px solid var(--line)', borderRadius: 'var(--r-pill)',
                  background: 'var(--paper)',
                }}>
                  <button
                    onClick={() => setQty(line.productId, line.quantity - 1)}
                    disabled={line.quantity <= 1}
                    style={{ width: 32, height: 36, background: 'none', border: 'none' }}
                  >
                    <Icon name="minus" size={14} />
                  </button>
                  <span className="mono" style={{ padding: '0 10px', fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
                    {line.quantity}
                  </span>
                  <button
                    onClick={() => setQty(line.productId, line.quantity + 1)}
                    disabled={line.quantity >= 99}
                    style={{ width: 32, height: 36, background: 'none', border: 'none' }}
                  >
                    <Icon name="plus" size={14} />
                  </button>
                </div>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 17, fontWeight: 600,
                  minWidth: 90, textAlign: 'start',
                }}>
                  {formatPrice(line.priceAgorot * line.quantity)}
                </div>
              </div>
            ))}
          </div>

          {toFree > 0 && (
            <div style={{
              marginTop: 18, display: 'flex', gap: 12,
              padding: 14, borderRadius: 'var(--r-md)',
              background: 'var(--olive-soft)', alignItems: 'center',
            }}>
              <span style={{ color: 'var(--olive-2)' }}><Icon name="leaf" size={20} /></span>
              <div style={{ flex: 1, fontSize: 13.5 }}>
                עוד <strong>{formatPrice(toFree)}</strong> ותקבלו משלוח חינם.
              </div>
            </div>
          )}
        </div>

        <aside style={{
          position: 'sticky', top: 24, height: 'fit-content',
          background: 'var(--card)', border: '1px solid var(--line)',
          borderRadius: 'var(--r-lg)', padding: 24,
        }}>
          <h3 style={{ marginBottom: 14 }}>סיכום הזמנה</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            <SummaryRow k="סך ביניים" v={formatPrice(subtotal)} />
            <SummaryRow k="משלוח" v={shipping === 0 ? 'חינם' : formatPrice(shipping)} />
            <SummaryRow k='מע"מ (18%, כלול)' v={formatPrice(vat)} muted />
          </div>
          <hr className="hm-rule" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 600 }}>סך הכל לתשלום</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 600 }}>{formatPrice(total)}</span>
          </div>
          <button
            className="hm-btn hm-btn-primary hm-btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
            onClick={() => nav('/checkout')}
          >
            למעבר לקופה <Icon name="chev" size={16} />
          </button>
          <div style={{
            marginTop: 14, display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 'var(--r-md)', background: 'var(--paper-2)',
          }}>
            <Icon name="secure" size={16} />
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>
              תשלום מאובטח · Grow / Meshulam
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="hm-label" style={{ marginBottom: 6 }}>קוד הטבה</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="hm-input" placeholder="HALILOV20" style={{ flex: 1 }} />
              <button className="hm-btn hm-btn-ghost" onClick={() => comingSoon('קופונים')}>החל</button>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </>
  )
}
