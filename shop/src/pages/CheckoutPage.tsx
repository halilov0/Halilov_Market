import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, formatPrice, type CreateOrderRequest, type OrderView } from '../api'
import { useCart } from '../cart/cartStore'
import { useAuth } from '../auth/authStore'

const SHIPPING_AGOROT = 1990 // ₪19.90 flat — placeholder until Israel Post integration

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
    if (!user) {
      nav(`/login?next=/checkout`)
    }
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
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div>
        <h1>קופה — פרטי משלוח</h1>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
          <label>שם מלא
            <input required value={fullName} onChange={e => setFullName(e.target.value)} />
          </label>
          <label>טלפון
            <input required value={phone} onChange={e => setPhone(e.target.value)} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
            <label>רחוב
              <input required value={street} onChange={e => setStreet(e.target.value)} />
            </label>
            <label>מספר
              <input value={houseNo} onChange={e => setHouseNo(e.target.value)} />
            </label>
            <label>דירה
              <input value={apartment} onChange={e => setApartment(e.target.value)} />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
            <label>עיר
              <input required value={city} onChange={e => setCity(e.target.value)} />
            </label>
            <label>מיקוד
              <input value={postalCode} onChange={e => setPostalCode(e.target.value)} />
            </label>
          </div>
          <label>הערות לשליח
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'יוצר הזמנה…' : 'אישור הזמנה'}
          </button>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            תשלום אמיתי עם Grow יחובר בהמשך. כרגע ההזמנה נוצרת בסטטוס PENDING.
          </p>
        </form>
      </div>

      <aside style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', height: 'fit-content' }}>
        <h3 style={{ marginBlockStart: 0 }}>סיכום הזמנה</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.4rem' }}>
          {lines.map(l => (
            <li key={l.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>{l.nameHe} × {l.quantity}</span>
              <span>{formatPrice(l.priceAgorot * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <hr style={{ marginBlock: '0.75rem', border: 'none', borderBlockStart: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>סך ביניים</span><span>{formatPrice(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>משלוח</span><span>{formatPrice(SHIPPING_AGOROT)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.85rem' }}>
          <span>מתוכו מע"מ (18%)</span><span>{formatPrice(vat)}</span>
        </div>
        <hr style={{ marginBlock: '0.5rem', border: 'none', borderBlockStart: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.15rem' }}>
          <span>סך הכל לתשלום</span><span>{formatPrice(total)}</span>
        </div>
      </aside>
    </div>
  )
}
