import { useEffect, useState } from 'react'
import { api, formatPrice, type OrderView, type Product } from '../api'

export function DashboardPage() {
  const [orders, setOrders] = useState<OrderView[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      api<OrderView[]>('/api/admin/orders'),
      api<{ content: Product[] }>('/api/products?size=100'),
    ])
      .then(([o, p]) => { setOrders(o); setProducts(p.content) })
      .catch(e => setError(e.message))
  }, [])

  const pending = orders.filter(o => o.status === 'PENDING').length
  const paid = orders.filter(o => o.status === 'PAID').length
  const revenue = orders
    .filter(o => o.status !== 'PENDING' && o.status !== 'CANCELLED')
    .reduce((s, o) => s + o.totalAgorot, 0)
  const lowStock = products.filter(p => p.stockQty < 10).length

  return (
    <div>
      <h1>דשבורד</h1>
      {error && <div className="error">{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        <Stat title="הזמנות בהמתנה" value={String(pending)} />
        <Stat title="הזמנות שולמו" value={String(paid)} />
        <Stat title="הכנסות (לא PENDING/CANCELLED)" value={formatPrice(revenue)} />
        <Stat title="מוצרים במלאי נמוך (<10)" value={String(lowStock)} />
        <Stat title="סה״כ הזמנות" value={String(orders.length)} />
        <Stat title="סה״כ מוצרים" value={String(products.length)} />
      </div>
    </div>
  )
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="card">
      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{title}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 700, marginBlockStart: '0.4rem' }}>{value}</div>
    </div>
  )
}
