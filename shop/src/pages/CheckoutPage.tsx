import { useEffect, useState, Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, formatPrice, type CreateOrderRequest, type OrderView } from '../api'
import { useCart } from '../cart/cartStore'
import { useAuth } from '../auth/authStore'
import { Field } from '../components/Field'
import { SummaryRow } from '../components/SummaryRow'
import { Icon } from '../components/Icon'
import { Footer } from '../components/Footer'

const SHIPPING_AGOROT = 1990

const STEPS = [
  ['1', 'משלוח'],
  ['2', 'תשלום'],
  ['3', 'אישור'],
] as const

export function CheckoutPage() {
  const { lines, subtotalAgorot, clear } = useCart()
  const { user } = useAuth()
  const nav = useNavigate()

  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [street, setStreet] = useState('')
  const [houseNo, setHouseNo] = useState('')
  const [apartment, setApartment] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) nav('/login?next=/checkout')
  }, [user, nav])

  useEffect(() => {
    if (lines.length === 0) nav('/cart')
  }, [lines.length, nav])

  if (!user || lines.length === 0) return null

  const subtotal = subtotalAgorot()
  const total = subtotal + SHIPPING_AGOROT
  const vat = Math.round((total * 18) / 118)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const body: CreateOrderRequest = {
        items: lines.map(l => ({ productId: l.productId, quantity: l.quantity })),
        shipping: {
          fullName, phone, street,
          houseNo: houseNo || undefined,
          apartment: apartment || undefined,
          city,
          postalCode: postalCode || undefined,
          notes: notes || undefined,
        },
        shippingAgorot: SHIPPING_AGOROT,
      }
      const order = await api<OrderView>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      clear()
      nav(`/orders/${order.orderNumber}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה ביצירת ההזמנה')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="hm-page hm-sidebar-layout">
          <div>
            <div className="hm-crumb">
              <Link to="/cart" style={{ color: 'var(--ink-3)' }}>סל</Link>
              <span className="sep">›</span>
              <span style={{ color: 'var(--ink)' }}>קופה</span>
            </div>

            {/* stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '12px 0 22px' }}>
              {STEPS.map(([n, t], i) => {
                const state = i === 0 ? 'active' : ''
                const dotBg = state === 'active' ? 'var(--ink)' : 'var(--card)'
                const dotColor = state === 'active' ? 'var(--paper)' : 'var(--ink-3)'
                return (
                  <Fragment key={n}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: dotBg, color: dotColor,
                        border: state === 'active' ? 'none' : '1px solid var(--line)',
                        display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 13,
                      }}>{n}</div>
                      <span style={{
                        fontSize: 14,
                        fontWeight: state === 'active' ? 600 : 400,
                        color: state === 'active' ? 'var(--ink)' : 'var(--ink-3)',
                      }}>{t}</span>
                    </div>
                    {n !== '3' && <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />}
                  </Fragment>
                )
              })}
            </div>

            <h2 style={{ marginBottom: 18 }}>פרטי משלוח</h2>

            <div style={{ display: 'grid', gap: 14 }}>
              <div className="hm-checkout-row-2">
                <Field label="שם מלא" required value={fullName} onChange={e => setFullName(e.target.value)} />
                <Field label="טלפון" required mono value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="hm-checkout-row-3">
                <Field label="רחוב" required value={street} onChange={e => setStreet(e.target.value)} />
                <Field label="מספר" value={houseNo} onChange={e => setHouseNo(e.target.value)} />
                <Field label="דירה" value={apartment} onChange={e => setApartment(e.target.value)} />
              </div>
              <div className="hm-checkout-row-21">
                <Field label="עיר" required value={city} onChange={e => setCity(e.target.value)} />
                <Field label="מיקוד" mono value={postalCode} onChange={e => setPostalCode(e.target.value)} />
              </div>
              <Field
                label="הערות לשליח"
                multiline
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div style={{
              marginTop: 18, padding: 14, background: 'var(--olive-soft)',
              borderRadius: 'var(--r-md)', display: 'flex', gap: 10, alignItems: 'center',
            }}>
              <Icon name="truck" size={18} />
              <div style={{ fontSize: 13.5 }}>
                השליח יצור איתך קשר ~30 דקות לפני הגעה.
              </div>
            </div>

            {error && <div className="hm-error" style={{ marginTop: 14 }}>{error}</div>}
          </div>

          <aside style={{
            background: 'var(--card)', border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)', padding: 22, height: 'fit-content',
            position: 'sticky', top: 24,
          }}>
            <h3 style={{ marginBottom: 14 }}>סיכום</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {lines.map(l => (
                <div key={l.productId} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 'var(--r-sm)',
                    background: 'var(--paper-2)', display: 'grid', placeItems: 'center',
                    fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)',
                    letterSpacing: '0.12em', textAlign: 'center', padding: 4,
                  }}>
                    {l.slug.slice(0, 8)}
                  </div>
                  <div style={{ flex: 1, fontSize: 13 }}>
                    <div style={{ fontWeight: 500 }}>{l.nameHe}</div>
                    <div className="hm-meta" style={{ fontSize: 11.5 }}>× {l.quantity}</div>
                  </div>
                  <div className="mono" style={{ fontSize: 13 }}>
                    {formatPrice(l.priceAgorot * l.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <hr className="hm-rule" />
            <SummaryRow k="סך ביניים" v={formatPrice(subtotal)} />
            <SummaryRow k="משלוח" v={formatPrice(SHIPPING_AGOROT)} />
            <SummaryRow k='מע"מ (18%, כלול)' v={formatPrice(vat)} muted />
            <hr className="hm-rule" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
              <span style={{ fontWeight: 600 }}>סך הכל</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 600 }}>{formatPrice(total)}</span>
            </div>
            <button
              type="submit"
              className="hm-btn hm-btn-primary hm-btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
              disabled={submitting}
            >
              {submitting ? 'יוצר הזמנה…' : 'אישור הזמנה'}
            </button>
            <div className="hm-meta" style={{ marginTop: 10, textAlign: 'center', fontSize: 11.5 }}>
              כרגע ההזמנה נשמרת כ-PENDING. Grow יחובר בהמשך.
            </div>
          </aside>
        </div>
      </form>
      <Footer />
    </>
  )
}
