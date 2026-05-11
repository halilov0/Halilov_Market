import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatPrice, ORDER_STATUSES, type OrderStatus, type OrderView } from '../api'

export function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const [order, setOrder] = useState<OrderView | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  function load() {
    if (!orderNumber) return
    api<OrderView>(`/api/admin/orders/${orderNumber}`)
      .then(setOrder)
      .catch(e => setError(e.message))
  }
  useEffect(load, [orderNumber])

  async function changeStatus(status: OrderStatus) {
    if (!orderNumber || !order) return
    if (status === order.status) return
    if (!confirm(`לעדכן סטטוס ל-${status}?`)) return
    setUpdating(true); setError(null)
    try {
      const updated = await api<OrderView>(`/api/admin/orders/${orderNumber}/status`, {
        method: 'PATCH', body: JSON.stringify({ status }),
      })
      setOrder(updated)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה')
    } finally {
      setUpdating(false)
    }
  }

  if (error) return <div><div className="error">{error}</div><p><Link to="/orders">← חזרה לרשימה</Link></p></div>
  if (!order) return <p>טוען…</p>

  return (
    <div>
      <p><Link to="/orders">← חזרה לרשימה</Link></p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>{order.orderNumber}</h1>
          <div style={{ color: 'var(--muted)' }}>{new Date(order.createdAt).toLocaleString('he-IL')}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`badge ${order.status.toLowerCase()}`}>{order.status}</span>
          <select
            value={order.status}
            onChange={e => changeStatus(e.target.value as OrderStatus)}
            disabled={updating}
            style={{ width: 180 }}
          >
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <div className="card">
          <h3 style={{ marginBlockStart: 0 }}>פריטים</h3>
          <table>
            <thead>
              <tr><th>מק"ט</th><th>שם</th><th>מחיר ליחידה</th><th>כמות</th><th>סה״כ</th></tr>
            </thead>
            <tbody>
              {order.items.map(it => (
                <tr key={it.productId}>
                  <td>{it.sku}</td>
                  <td>{it.nameHe}</td>
                  <td>{formatPrice(it.unitPriceAgorot)}</td>
                  <td>{it.quantity}</td>
                  <td>{formatPrice(it.lineTotalAgorot)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginBlockStart: '1rem', display: 'grid', gap: '0.25rem' }}>
            <Row label="סך ביניים" value={formatPrice(order.subtotalAgorot)} />
            <Row label="משלוח" value={formatPrice(order.shippingAgorot)} />
            <Row label="מתוכו מע״מ (18%)" value={formatPrice(order.vatAgorot)} muted />
            <Row label="סה״כ" value={formatPrice(order.totalAgorot)} bold />
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBlockStart: 0 }}>כתובת למשלוח</h3>
          {order.shipping ? (
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              {order.shipping.fullName}<br />
              {order.shipping.phone}<br />
              {order.shipping.street} {order.shipping.houseNo}{order.shipping.apartment ? `, דירה ${order.shipping.apartment}` : ''}<br />
              {order.shipping.city}{order.shipping.postalCode ? `, ${order.shipping.postalCode}` : ''}
              {order.shipping.notes && <><br /><em style={{ color: 'var(--muted)' }}>{order.shipping.notes}</em></>}
            </p>
          ) : <p style={{ color: 'var(--muted)' }}>— אין —</p>}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: bold ? 700 : 400,
      color: muted ? 'var(--muted)' : undefined,
      fontSize: bold ? '1.1rem' : undefined,
    }}>
      <span>{label}</span><span>{value}</span>
    </div>
  )
}
