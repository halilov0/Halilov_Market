import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatPrice, type OrderView } from '../api'

export function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const [order, setOrder] = useState<OrderView | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderNumber) return
    api<OrderView>(`/api/orders/${orderNumber}`)
      .then(setOrder)
      .catch(e => setError(e.message))
  }, [orderNumber])

  if (error) return <div className="container"><div className="error">{error}</div></div>
  if (!order) return <div className="container"><p>טוען…</p></div>

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h1>תודה, ההזמנה התקבלה</h1>
      <p style={{ color: 'var(--muted)' }}>
        מספר הזמנה: <strong style={{ color: 'var(--text)' }}>{order.orderNumber}</strong> · סטטוס: {order.status}
      </p>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBlock: '1rem' }}>
        <h3 style={{ marginBlockStart: 0 }}>פריטים</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.4rem' }}>
          {order.items.map(it => (
            <li key={it.productId} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{it.nameHe} × {it.quantity}</span>
              <span>{formatPrice(it.lineTotalAgorot)}</span>
            </li>
          ))}
        </ul>
        <hr style={{ marginBlock: '0.75rem', border: 'none', borderBlockStart: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>סך ביניים</span><span>{formatPrice(order.subtotalAgorot)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>משלוח</span><span>{formatPrice(order.shippingAgorot)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.85rem' }}>
          <span>מתוכו מע"מ (18%)</span><span>{formatPrice(order.vatAgorot)}</span>
        </div>
        <hr style={{ marginBlock: '0.5rem', border: 'none', borderBlockStart: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
          <span>סך הכל</span><span>{formatPrice(order.totalAgorot)}</span>
        </div>
      </div>

      {order.shipping && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
          <h3 style={{ marginBlockStart: 0 }}>כתובת למשלוח</h3>
          <p style={{ margin: 0 }}>
            {order.shipping.fullName} · {order.shipping.phone}<br />
            {order.shipping.street} {order.shipping.houseNo}{order.shipping.apartment ? `, דירה ${order.shipping.apartment}` : ''}<br />
            {order.shipping.city}{order.shipping.postalCode ? `, ${order.shipping.postalCode}` : ''}
            {order.shipping.notes && <><br /><em style={{ color: 'var(--muted)' }}>{order.shipping.notes}</em></>}
          </p>
        </div>
      )}

      <p style={{ marginBlockStart: '1.5rem' }}>
        <Link to="/">← להמשך קניות</Link>
      </p>
    </div>
  )
}
