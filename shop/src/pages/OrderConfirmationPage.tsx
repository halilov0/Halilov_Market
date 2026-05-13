import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatPrice, type OrderView } from '../api'
import { Icon } from '../components/Icon'
import { Footer } from '../components/Footer'
import { SummaryRow } from '../components/SummaryRow'
import { useAuth } from '../auth/authStore'
import { comingSoon } from '../components/Toast'

export function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const [order, setOrder] = useState<OrderView | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!orderNumber) return
    api<OrderView>(`/api/orders/${orderNumber}`)
      .then(setOrder)
      .catch(e => setError(e.message))
  }, [orderNumber])

  if (error) return <div className="hm-page"><div className="hm-error">{error}</div></div>
  if (!order) return <div className="hm-page"><p style={{ color: 'var(--ink-3)' }}>טוען…</p></div>

  const greetingName = user?.fullName?.split(' ')[0] ?? ''
  const statusLower = order.status.toLowerCase()

  return (
    <>
      <div className="hm-page-narrow">
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--olive-soft)', color: 'var(--olive-2)',
            display: 'grid', placeItems: 'center', margin: '0 auto 18px',
          }}>
            <Icon name="check" size={32} stroke={2.4} />
          </div>
          <div className="hm-meta" style={{
            fontFamily: 'var(--mono)', letterSpacing: '0.18em',
            color: 'var(--terracotta)', textTransform: 'uppercase',
          }}>הזמנה התקבלה</div>
          <h1 style={{ fontSize: 42, marginTop: 10 }}>תודה{greetingName ? `, ${greetingName}` : ''} ✿</h1>
          <p style={{ color: 'var(--ink-2)', marginTop: 8 }}>
            הזמנה <span className="mono" style={{ color: 'var(--ink)' }}>#{order.orderNumber}</span>
            {user && <> · נשלח אישור אל {user.email}</>}
          </p>
        </div>

        <div className="hm-card">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingBottom: 16, borderBottom: '1px solid var(--line)',
          }}>
            <div>
              <h3>סטטוס הזמנה</h3>
              <div style={{ color: 'var(--ink-2)', marginTop: 4 }}>
                נוצר ב-{new Date(order.createdAt).toLocaleString('he-IL', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </div>
            </div>
            <span className={`hm-status hm-status-${statusLower}`}>{order.status}</span>
          </div>

          <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
            {order.items.map(it => (
              <div key={it.productId} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 'var(--r-md)',
                  background: 'var(--paper-2)', display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)',
                  letterSpacing: '0.14em', textAlign: 'center', padding: 4,
                }}>
                  {it.sku}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>{it.nameHe}</div>
                  <div className="hm-meta">× {it.quantity}</div>
                </div>
                <div className="mono" style={{ fontWeight: 600 }}>
                  {formatPrice(it.lineTotalAgorot)}
                </div>
              </div>
            ))}
          </div>

          <hr className="hm-rule" />
          <SummaryRow k="סך ביניים" v={formatPrice(order.subtotalAgorot)} />
          <SummaryRow k="משלוח" v={formatPrice(order.shippingAgorot)} />
          <SummaryRow k='מע"מ (18%, כלול)' v={formatPrice(order.vatAgorot)} muted />
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 10,
            paddingTop: 10, borderTop: '1px solid var(--line)',
          }}>
            <strong>סך הכל</strong>
            <strong className="mono" style={{ fontSize: 22 }}>{formatPrice(order.totalAgorot)}</strong>
          </div>
        </div>

        {order.shipping && (
          <div style={{
            marginTop: 18, padding: 20, borderRadius: 'var(--r-lg)',
            background: 'var(--card)', border: '1px solid var(--line)',
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'var(--terra-soft)', color: 'var(--terracotta)',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Icon name="truck" size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: 4 }}>כתובת למשלוח</h4>
              <div className="hm-meta" style={{ lineHeight: 1.6 }}>
                {order.shipping.fullName} · <span className="mono">{order.shipping.phone}</span><br />
                רחוב {order.shipping.street} {order.shipping.houseNo}
                {order.shipping.apartment && `, דירה ${order.shipping.apartment}`}<br />
                {order.shipping.city}
                {order.shipping.postalCode && ` · ${order.shipping.postalCode}`}
                {order.shipping.notes && (
                  <><br /><em>"{order.shipping.notes}"</em></>
                )}
              </div>
            </div>
            <button className="hm-btn hm-btn-ghost" onClick={() => comingSoon('מעקב משלוח')}>
              עקוב
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'center' }}>
          <Link to="/" className="hm-btn hm-btn-primary">המשך קניות</Link>
          <button className="hm-btn hm-btn-quiet" onClick={() => comingSoon('חשבונית')}>
            הורד חשבונית
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}
