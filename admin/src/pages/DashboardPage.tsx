import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, downloadFile, formatPrice, type DashboardMetrics, type OrderStatus } from '../api'
import { useAuth } from '../auth/authStore'
import { StatusPill } from '../components/StatusPill'
import { Icon } from '../components/Icon'
import { comingSoon } from '../components/Toast'

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:   'בהמתנה',
  PAID:      'שולמו',
  FULFILLED: 'בהכנה',
  SHIPPED:   'נשלחו',
  DELIVERED: 'נמסרו',
  CANCELLED: 'בוטלו',
  REFUNDED:  'הוחזרו',
}

export function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardMetrics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  async function exportOrders() {
    setExporting(true); setError(null)
    try {
      await downloadFile('/api/admin/orders/export.csv', 'orders.csv')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה בייצוא')
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    api<DashboardMetrics>('/api/admin/metrics/dashboard')
      .then(setData)
      .catch(e => setError(e.message))
  }, [])

  const barMax = useMemo(() => {
    if (!data) return 1
    return Math.max(1, ...data.dailyRevenue.map(b => b.revenueAgorot))
  }, [data])

  const greetingName = user?.fullName?.split(' ')[0] ?? ''

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h1>בוקר טוב{greetingName ? `, ${greetingName}` : ''} ✿</h1>
          <div className="sub">סקירה בזמן אמת של החנות</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="hm-btn hm-btn-quiet" onClick={exportOrders} disabled={exporting}>
            {exporting ? 'מייצא…' : 'ייצוא הזמנות CSV'}
          </button>
          <Link to="/products" className="hm-btn hm-btn-primary">+ מוצר חדש</Link>
        </div>
      </div>

      {error && <div className="hm-error" style={{ marginBottom: 14 }}>{error}</div>}

      {!data && !error && (
        <p style={{ color: 'var(--ink-3)' }}>טוען נתונים…</p>
      )}

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            <Stat k="הכנסות היום" v={formatPrice(data.kpi.revenueTodayAgorot)} hint={`${data.kpi.ordersTodayCount} הזמנות`} />
            <Stat k="הכנסות 7 ימים" v={formatPrice(data.kpi.revenueLast7Agorot)} hint="חלון נע" />
            <Stat k="הכנסות 30 ימים" v={formatPrice(data.kpi.revenueLast30Agorot)} hint="חלון נע" />
            <Stat k="הכנסות מצטברות" v={formatPrice(data.kpi.revenueLifetimeAgorot)}
                  hint={`AOV ${data.kpi.aovAgorot > 0 ? formatPrice(data.kpi.aovAgorot) : '—'}`} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 20 }}>
            <div className="adm-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>הכנסות יומיות</h3>
                  <div className="sub" style={{ marginBottom: 0 }}>14 ימים אחרונים</div>
                </div>
                <div style={{ display: 'flex', gap: 6, fontSize: 12 }}>
                  <button className="hm-chip active">14 ימים</button>
                  <button className="hm-chip" onClick={() => comingSoon('טווח חודש')}>חודש</button>
                  <button className="hm-chip" onClick={() => comingSoon('טווח רבעון')}>רבעון</button>
                </div>
              </div>
              <div className="adm-bars">
                {data.dailyRevenue.map(b => (
                  <div
                    key={b.date}
                    className={`bar ${b.revenueAgorot === barMax && b.revenueAgorot > 0 ? 'peak' : ''}`}
                    title={`${b.date}\n${formatPrice(b.revenueAgorot)} · ${b.orderCount} הזמנות`}
                  >
                    <div className="fill" style={{ height: `${barMax > 0 ? (b.revenueAgorot / barMax) * 100 : 0}%` }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--mono)' }}>
                <span>היום - 13</span>
                <span>אמצע</span>
                <span>היום</span>
              </div>
            </div>

            <div className="adm-card">
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18, marginBottom: 14 }}>פילוח לפי סטטוס</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                {(Object.keys(STATUS_LABEL) as OrderStatus[]).map(s => {
                  const count = data.statusCounts[s] ?? 0
                  return (
                    <div key={s} className="adm-status-row">
                      <StatusPill s={s} />
                      <span className="lbl">{STATUS_LABEL[s]}</span>
                      <span className="cnt mono">{count}</span>
                    </div>
                  )
                })}
              </div>
              <hr className="hm-rule" />
              <Quick k="סה״כ הזמנות" v={String(data.kpi.ordersLifetimeCount)} />
              <Quick k="הזמנות שולמו" v={String(data.kpi.paidOrdersLifetimeCount)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div className="adm-card" style={{ padding: 0 }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>מוצרים מובילים</h3>
                <div className="sub" style={{ marginBottom: 0 }}>לפי כמות נמכרת</div>
              </div>
              {data.topProducts.length === 0 ? (
                <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-3)' }}>
                  אין מכירות עדיין.
                </div>
              ) : (
                <table className="adm-table" style={{ border: 'none', borderRadius: 0 }}>
                  <thead>
                    <tr><th>מוצר</th><th>מק״ט</th><th>נמכרו</th><th style={{ textAlign: 'start' }}>הכנסות</th></tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map((p, i) => (
                      <tr key={p.productId}>
                        <td>
                          <span className="adm-rank">{i + 1}</span>
                          <Link to={`/products?q=${encodeURIComponent(p.sku)}`} style={{ fontWeight: 500 }}>
                            {p.nameHe}
                          </Link>
                        </td>
                        <td className="num" style={{ color: 'var(--ink-3)' }}>{p.sku}</td>
                        <td className="num">{p.qtySold}</td>
                        <td className="num" style={{ textAlign: 'start', fontWeight: 600 }}>{formatPrice(p.revenueAgorot)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="adm-card" style={{ padding: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>מלאי נמוך</h3>
                  <div className="sub" style={{ marginBottom: 0 }}>פחות מ-10 יחידות</div>
                </div>
                {data.lowStock.length > 0 && (
                  <Link to="/products" style={{ color: 'var(--terracotta)', fontSize: 13, fontWeight: 600 }}>נהל ←</Link>
                )}
              </div>
              {data.lowStock.length === 0 ? (
                <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-3)' }}>
                  כל המלאי תקין ✓
                </div>
              ) : (
                <table className="adm-table" style={{ border: 'none', borderRadius: 0 }}>
                  <thead>
                    <tr><th>מוצר</th><th>מק״ט</th><th style={{ textAlign: 'start' }}>במלאי</th></tr>
                  </thead>
                  <tbody>
                    {data.lowStock.map(p => (
                      <tr key={p.id}>
                        <td>
                          <Link to={`/products?q=${encodeURIComponent(p.sku)}`} style={{ fontWeight: 500 }}>
                            {p.nameHe}
                          </Link>
                        </td>
                        <td className="num" style={{ color: 'var(--ink-3)' }}>{p.sku}</td>
                        <td className="num" style={{
                          textAlign: 'start', fontWeight: 700,
                          color: p.stockQty <= 0 ? 'var(--berry)' : 'var(--terracotta)',
                        }}>
                          {p.stockQty} {p.stockQty <= 0 && <Icon name="x" size={12} />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="adm-card" style={{ padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>הזמנות אחרונות</h3>
                <div className="sub" style={{ marginBottom: 0 }}>{data.recentOrders.length} הזמנות עדכניות</div>
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
                {data.recentOrders.map(o => (
                  <tr key={o.orderNumber} onClick={() => location.assign(`/orders/${o.orderNumber}`)} style={{ cursor: 'pointer' }}>
                    <td className="num"><b>{o.orderNumber}</b></td>
                    <td style={{ color: 'var(--ink-3)' }}>
                      {new Date(o.createdAt).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      {o.customerName ?? '—'}
                      {o.city && <span style={{ color: 'var(--ink-3)' }}> · {o.city}</span>}
                    </td>
                    <td className="num">{o.itemCount}</td>
                    <td><StatusPill s={o.status} /></td>
                    <td className="num" style={{ textAlign: 'start', fontWeight: 600 }}>{formatPrice(o.totalAgorot)}</td>
                  </tr>
                ))}
                {data.recentOrders.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--ink-3)', padding: 30 }}>אין הזמנות עדיין.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
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
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13 }}>
      <span style={{ color: 'var(--ink-2)' }}>{k}</span>
      <span className="mono" style={{ fontWeight: 600 }}>{v}</span>
    </div>
  )
}
