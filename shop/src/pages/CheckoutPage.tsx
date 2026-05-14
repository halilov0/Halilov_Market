import { useEffect, useState, Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, formatPrice, type CreateOrderRequest, type OrderView } from '../api'
import { useCart } from '../cart/cartStore'
import { useAuth } from '../auth/authStore'
import { Field } from '../components/Field'
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
      const pay = await api<{ provider: string; redirectUrl: string; orderNumber: string }>(
        `/api/orders/${order.orderNumber}/pay`,
        { method: 'POST' }
      )
      if (pay.redirectUrl.startsWith('http://') || pay.redirectUrl.startsWith('https://')) {
        window.location.href = pay.redirectUrl
      } else {
        nav(pay.redirectUrl)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה ביצירת ההזמנה')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="cls-page">
          <div className="cls-crumb">
            <Link to="/cart">סל</Link>
            <span className="sep">›</span>
            <span className="current">קופה</span>
          </div>

          <div className="cls-sidebar-layout">
            <div>
              <div className="cls-stepper">
                {STEPS.map(([n, t], i) => {
                  const isActive = i === 0
                  return (
                    <Fragment key={n}>
                      <div className={`step${isActive ? ' active' : ''}`}>
                        <div className="dot">{n}</div>
                        <span className="lbl">{t}</span>
                      </div>
                      {n !== '3' && <div className="bar" />}
                    </Fragment>
                  )
                })}
              </div>

              <div className="cls-checkout-section-title">פרטי משלוח</div>

              <div style={{ display: 'grid', gap: 12 }}>
                <div className="cls-row-2">
                  <Field label="שם מלא" required value={fullName} onChange={e => setFullName(e.target.value)} />
                  <Field label="טלפון" required mono value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="cls-row-3">
                  <Field label="רחוב" required value={street} onChange={e => setStreet(e.target.value)} />
                  <Field label="מספר" value={houseNo} onChange={e => setHouseNo(e.target.value)} />
                  <Field label="דירה" value={apartment} onChange={e => setApartment(e.target.value)} />
                </div>
                <div className="cls-row-21">
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

              <div className="cls-info-banner">
                <span className="ico"><Icon name="truck" size={16} /></span>
                <div>השליח יצור איתך קשר ~30 דקות לפני הגעה.</div>
              </div>

              {error && <div className="hm-error" style={{ marginTop: 14 }}>{error}</div>}
            </div>

            <aside className="cls-summary">
              <h3>סיכום</h3>
              <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
                {lines.map(l => (
                  <div key={l.productId} className="cls-mini-line">
                    <div className="thumb">
                      {l.imageUrl ? <img src={l.imageUrl} alt={l.nameHe} /> : <span className="ph">{l.slug.slice(0, 6)}</span>}
                    </div>
                    <div className="info">
                      <div className="n">{l.nameHe}</div>
                      <div className="q">× {l.quantity}</div>
                    </div>
                    <div className="v">{formatPrice(l.priceAgorot * l.quantity)}</div>
                  </div>
                ))}
              </div>
              <hr />
              <div className="row">
                <span>סך ביניים</span>
                <span className="v">{formatPrice(subtotal)}</span>
              </div>
              <div className="row">
                <span>משלוח</span>
                <span className="v">{formatPrice(SHIPPING_AGOROT)}</span>
              </div>
              <div className="row muted">
                <span>מע"מ (18%, כלול)</span>
                <span className="v">{formatPrice(vat)}</span>
              </div>
              <hr />
              <div className="total-row">
                <span className="lbl">סך הכל</span>
                <span className="v">{formatPrice(total)}</span>
              </div>
              <button type="submit" className="cta" disabled={submitting}>
                {submitting ? 'יוצר הזמנה…' : 'אישור הזמנה'}
                {!submitting && <Icon name="arrow" size={14} stroke={2.2} />}
              </button>
              <div className="secure-note">
                <Icon name="secure" size={16} />
                תשלום מאובטח · Grow / Meshulam
              </div>
            </aside>
          </div>
        </div>
      </form>
      <Footer />
    </>
  )
}
