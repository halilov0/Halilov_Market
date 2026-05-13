import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatPrice, ORDER_STATUSES, type OrderStatus, type OrderView } from '../api'
import { StatusPill } from '../components/StatusPill'
import { Icon } from '../components/Icon'
import { comingSoon } from '../components/Toast'

type Step = { key: string; label: string; statuses: OrderStatus[] }

const STEPS: Step[] = [
  { key: 'placed',    label: 'הוזמן',  statuses: ['PENDING', 'PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'] },
  { key: 'paid',      label: 'שולם',   statuses: ['PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'] },
  { key: 'fulfilled', label: 'הוכן',   statuses: ['FULFILLED', 'SHIPPED', 'DELIVERED'] },
  { key: 'shipped',   label: 'נשלח',   statuses: ['SHIPPED', 'DELIVERED'] },
  { key: 'delivered', label: 'נמסר',   statuses: ['DELIVERED'] },
]

function stepState(step: Step, current: OrderStatus, idx: number): 'done' | 'active' | '' {
  if (step.statuses.includes(current)) return 'done'
  const activeIdx = STEPS.findIndex(s => s.statuses.includes(current))
  if (activeIdx >= 0 && idx === activeIdx + 1) return 'active'
  return ''
}

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

  if (!order) {
    return error
      ? <div><div className="hm-error">{error}</div><p style={{ marginTop: 14 }}><Link to="/orders">← חזרה לרשימה</Link></p></div>
      : <p style={{ color: 'var(--ink-3)' }}>טוען…</p>
  }

  const dateStr = new Date(order.createdAt).toLocaleString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
        <div>
          <Link to="/orders" className="hm-meta" style={{ fontFamily: 'var(--mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            ← חזרה לרשימה
          </Link>
          <h1 style={{ marginTop: 4 }}>הזמנה {order.orderNumber}</h1>
          <div className="sub" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 0 }}>
            <span>{dateStr}</span>
            <span style={{ color: 'var(--line-2)' }}>·</span>
            <StatusPill s={order.status} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            className="hm-input"
            value={order.status}
            onChange={e => changeStatus(e.target.value as OrderStatus)}
            disabled={updating}
            style={{ width: 180, padding: '8px 12px' }}
          >
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="hm-btn hm-btn-quiet" onClick={() => comingSoon('הדפסת תווית')}>⎙ הדפסת תווית</button>
          <button className="hm-btn hm-btn-quiet" onClick={() => comingSoon('החזר תשלום')}>החזר תשלום</button>
        </div>
      </div>

      {error && <div className="hm-error" style={{ marginBottom: 14 }}>{error}</div>}

      {/* timeline */}
      <div className="adm-card" style={{ marginBottom: 14 }}>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18, marginBottom: 18 }}>מסלול הזמנה</h3>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, gap: 8, position: 'relative' }}>
          {STEPS.map((step, i) => {
            const s = stepState(step, order.status, i)
            return (
              <div key={step.key} style={{ textAlign: 'center', position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 14, insetInlineStart: '-50%', width: '100%', height: 2,
                    background: s === 'done' ? 'var(--olive)' : 'var(--line)', zIndex: 0,
                  }} />
                )}
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: s === 'active' ? 'var(--ink)' : s === 'done' ? 'var(--olive)' : 'var(--card)',
                  color: s ? 'var(--paper)' : 'var(--ink-3)',
                  border: s ? 'none' : '1px solid var(--line)',
                  margin: '0 auto', position: 'relative', zIndex: 1,
                  display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600,
                }}>
                  {s === 'done' ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: 13, fontWeight: s ? 600 : 400, marginTop: 8 }}>{step.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 14 }}>
        <div className="adm-card" style={{ padding: 0 }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>פריטים ({order.items.length})</h3>
          </div>
          <div>
            {order.items.map(it => (
              <div key={it.productId} style={{
                display: 'grid', gridTemplateColumns: '60px 1fr auto auto auto',
                gap: 16, alignItems: 'center',
                padding: '14px 22px', borderBottom: '1px solid var(--line)',
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 'var(--r-md)',
                  background: 'var(--paper-2)', display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', textAlign: 'center', padding: 4,
                }}>
                  {it.sku}
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{it.nameHe}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{it.sku}</div>
                </div>
                <div className="mono" style={{ color: 'var(--ink-3)' }}>{formatPrice(it.unitPriceAgorot)}</div>
                <div className="mono">× {it.quantity}</div>
                <div className="mono" style={{ fontWeight: 600, minWidth: 80, textAlign: 'start' }}>
                  {formatPrice(it.lineTotalAgorot)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px 22px', display: 'grid', gap: 6 }}>
            <Row k="סך ביניים" v={formatPrice(order.subtotalAgorot)} />
            <Row k="משלוח" v={formatPrice(order.shippingAgorot)} />
            <Row k='מע"מ (18%, כלול)' v={formatPrice(order.vatAgorot)} muted />
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 6,
              paddingTop: 10, borderTop: '1px solid var(--line)',
            }}>
              <strong>סך הכל</strong>
              <strong className="mono" style={{ fontSize: 18 }}>{formatPrice(order.totalAgorot)}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 14, height: 'fit-content' }}>
          {order.shipping && (
            <>
              <div className="adm-card">
                <div className="hm-label" style={{ marginBottom: 10 }}>לקוח</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'var(--terra-soft)', color: 'var(--terracotta)',
                    fontWeight: 700, display: 'grid', placeItems: 'center',
                  }}>{order.shipping.fullName?.[0] ?? '·'}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{order.shipping.fullName}</div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{order.shipping.phone}</div>
                  </div>
                </div>
              </div>

              <div className="adm-card">
                <div className="hm-label" style={{ marginBottom: 10 }}>כתובת למשלוח</div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  {order.shipping.fullName}<br />
                  <span className="mono">{order.shipping.phone}</span><br />
                  רחוב {order.shipping.street} {order.shipping.houseNo}
                  {order.shipping.apartment && `, דירה ${order.shipping.apartment}`}<br />
                  {order.shipping.city}
                  {order.shipping.postalCode && <> <span className="mono">{order.shipping.postalCode}</span></>}
                </div>
                {order.shipping.notes && (
                  <div style={{
                    marginTop: 10, padding: 10, fontSize: 12,
                    background: 'var(--paper-2)', borderRadius: 'var(--r-sm)',
                    color: 'var(--ink-2)',
                  }}>
                    {order.shipping.notes}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="adm-card">
            <div className="hm-label" style={{ marginBottom: 10 }}>תשלום</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <span>Grow / Meshulam</span>
              <StatusPill s={order.status} />
            </div>
            <hr className="hm-rule" />
            <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
              Webhook אמיתי יחובר כשנפעיל את Grow
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Row({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', color: muted ? 'var(--ink-3)' : 'var(--ink)', fontSize: 14 }}>
      <span>{k}</span><span className="mono">{v}</span>
    </div>
  )
}
