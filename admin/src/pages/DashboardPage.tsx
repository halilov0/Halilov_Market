import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatPrice, type OrderView, type Product } from '../api'
import { useAuth } from '../auth/authStore'
import { StatusPill } from '../components/StatusPill'
import { comingSoon } from '../components/Toast'

const REVENUE_STATUSES = new Set(['PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'])
const DAYS = 14

export function DashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderView[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      api<OrderView[]>('/api/admin/orders'),
      api<{ content: Product[] }>('/api/products?size=200'),
    ])
      .then(([o, p]) => { setOrders(o); setProducts(p.content) })
      .catch(e => setError(e.message))
  }, [])

  const stats = useMemo(() => {
    const now = Date.now()
    const cutoff = now - DAYS * 24 * 3600_000
    const recent = orders.filter(o => new Date(o.createdAt).getTime() >= cutoff)
    const recentRevenue = recent.filter(o => REVENUE_STATUSES.has(o.status))
      .reduce((s, o) => s + o.totalAgorot, 0)
    const recentPaid = recent.filter(o => REVENUE_STATUSES.has(o.status)).length
    const aov = recentPaid > 0 ? Math.round(recentRevenue / recentPaid) : 0
    const lowStock = products.filter(p => p.stockQty < 10).length
    return { recent, recentRevenue, recentOrders: recent.length, recentPaid, aov, lowStock }
  }, [orders, products])

  const bars = useMemo(() => {
    const buckets = new Array(DAYS).fill(0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    orders.forEach(o => {
      if (!REVENUE_STATUSES.has(o.status)) return
      const d = new Date(o.createdAt)
      d.setHours(0, 0, 0, 0)
      const diff = Math.floor((today.getTime() - d.getTime()) / (24 * 3600_000))
      if (diff >= 0 && diff < DAYS) buckets[DAYS - 1 - diff] += o.totalAgorot
    })
    return buckets
  }, [orders])
  const barMax = Math.max(1, ...bars)

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [orders],
  )

  const greetingName = user?.fullName?.split(' ')[0] ?? ''

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h1>בוקר טוב{greetingName ? `, ${greetingName}` : ''} ✿</h1>
          <div className="sub">סקירה של {DAYS} הימים האחרונים</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="hm-btn hm-btn-quiet" onClick={() => comingSoon('ייצוא CSV')}>ייצוא CSV</button>
          <Link to="/products" className="hm-btn hm-btn-primary">+ מוצר חדש</Link>
        </div>
      </div>

      {error && <div className="hm-error" style={{ marginBottom: 14 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <Stat k={`הכנסות (${DAYS}י׳)`}      v={formatPrice(stats.recentRevenue)} hint={`${stats.recentPaid} שולמו`} />
        <Stat k="הזמנות"                    v={String(stats.recentOrders)}        hint={`מתוכן ${stats.recentPaid} שולמו`} />
        <Stat k="ערך הזמנה ממוצע"          v={stats.aov > 0 ? formatPrice(stats.aov) : '—'} hint="בתקופה" />
        <Stat k="מלאי נמוך"                v={String(stats.lowStock)}              hint="< 10 יח׳" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 20 }}>
        <div className="adm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>הכנסות יומיות</h3>
              <div className="sub" style={{ marginBottom: 0 }}>{DAYS} ימים אחרונים</div>
            </div>
            <div style={{ display: 'flex', gap: 6, fontSize: 12 }}>
              <button className="hm-chip active">{DAYS} ימים</button>
              <button className="hm-chip" onClick={() => comingSoon('טווח חודש')}>חודש</button>
              <button className="hm-chip" onClick={() => comingSoon('טווח רבעון')}>רבעון</button>
            </div>
          </div>
          <div className="adm-bars">
            {bars.map((v, i) => (
              <div key={i} className={`bar ${v === barMax && v > 0 ? 'peak' : ''}`}>
                <div className="fill" style={{ height: `${barMax > 0 ? (v / barMax) * 100 : 0}%` }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--mono)' }}>
            <span>היום - {DAYS - 1}</span>
            <span>אמצע</span>
            <span>היום</span>
          </div>
        </div>

        <div className="adm-card">
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18, marginBottom: 14 }}>סיכום מהיר</h3>
          <Quick k="סה״כ הזמנות במערכת" v={String(orders.length)} />
          <Quick k="הזמנות בהמתנה" v={String(orders.filter(o => o.status === 'PENDING').length)} />
          <Quick k="הזמנות שולמו" v={String(orders.filter(o => o.status === 'PAID').length)} />
          <Quick k="מוצרים פעילים" v={String(products.filter(p => p.active).length)} />
          <Quick k="סה״כ מוצרים" v={String(products.length)} />
        </div>
      </div>

      <div className="adm-card" style={{ padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>הזמנות אחרונות</h3>
            <div className="sub" style={{ marginBottom: 0 }}>{Math.min(5, recentOrders.length)} הזמנות עדכניות</div>
          </div>
          <Link to="/orders" style={{ color: 'var(--terracotta)', fontSize: 13, fontWeight: 600 }}>הצג הכול ←</Link>
        </div>
        <table className="adm-table" style={{ border: 'none', borderRadius: 0 }}>
          <thead>
            <tr>
              <th>הזמנה</th><th>תאריך</th><th>לקוח</th><th>פריטים</th><th>סטטוס</th>
              <th style={{ textAlign: 'start' }}>סכום</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(o => (
              <tr key={o.orderNumber} onClick={() => location.assign(`/orders/${o.orderNumber}`)} style={{ cursor: 'pointer' }}>
                <td className="num"><b>{o.orderNumber}</b></td>
                <td style={{ color: 'var(--ink-3)' }}>
                  {new Date(o.createdAt).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td>
                  {o.shipping?.fullName ?? '—'}
                  {o.shipping?.city && <span style={{ color: 'var(--ink-3)' }}> · {o.shipping.city}</span>}
                </td>
                <td className="num">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                <td><StatusPill s={o.status} /></td>
                <td className="num" style={{ textAlign: 'start', fontWeight: 600 }}>{formatPrice(o.totalAgorot)}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--ink-3)', padding: 30 }}>אין הזמנות עדיין.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

function Stat({ k, v, hint }: { k: string; v: string; hint?: string }) {
  return (
    <div className="adm-stat">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
      {hint && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function Quick({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)', fontSize: 13 }}>
      <span style={{ color: 'var(--ink-2)' }}>{k}</span>
      <span className="mono" style={{ fontWeight: 600 }}>{v}</span>
    </div>
  )
}
