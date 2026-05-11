import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatPrice, type OrderView } from '../api'

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderView[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    api<OrderView[]>('/api/admin/orders')
      .then(setOrders)
      .catch(e => setError(e.message))
  }, [])

  const filtered = filter ? orders.filter(o => o.status === filter) : orders

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '1rem' }}>
        <h1 style={{ margin: 0 }}>הזמנות</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 200 }}>
          <option value="">כל הסטטוסים</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="FULFILLED">FULFILLED</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>מספר הזמנה</th><th>תאריך</th><th>סטטוס</th><th>פריטים</th><th>סה״כ</th><th>לקוח</th><th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(o => (
            <tr key={o.orderNumber}>
              <td><Link to={`/orders/${o.orderNumber}`}>{o.orderNumber}</Link></td>
              <td>{new Date(o.createdAt).toLocaleString('he-IL')}</td>
              <td><span className={`badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
              <td>{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
              <td>{formatPrice(o.totalAgorot)}</td>
              <td>{o.shipping?.fullName ?? '—'}</td>
              <td><Link to={`/orders/${o.orderNumber}`}><button className="secondary">פתח</button></Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && <p style={{ color: 'var(--muted)' }}>אין הזמנות להצגה.</p>}
    </div>
  )
}
