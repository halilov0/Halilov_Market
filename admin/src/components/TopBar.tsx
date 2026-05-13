import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/authStore'
import { Icon } from './Icon'
import { comingSoon } from './Toast'

function useCrumb(): string {
  const loc = useLocation()
  const params = useParams()
  const p = loc.pathname
  if (p === '/') return 'דשבורד'
  if (p.startsWith('/orders/')) return `הזמנות › ${params.orderNumber ?? ''}`
  if (p === '/orders') return 'הזמנות'
  if (p === '/products') return 'מוצרים'
  if (p === '/categories') return 'קטגוריות'
  return ''
}

export function TopBar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const initial = user?.fullName?.[0] ?? 'א'
  const crumb = useCrumb()

  return (
    <div className="adm-top">
      <div className="crumb">
        <span>חלילוב</span><span style={{ opacity: .4 }}>›</span>
        <b>{crumb}</b>
      </div>
      <div className="search" onClick={() => comingSoon('חיפוש')} style={{ cursor: 'pointer' }}>
        <Icon name="search" size={14} />
        <span>חפש הזמנה, מוצר, לקוח…</span>
        <span className="mono" style={{
          marginInlineStart: 'auto', fontSize: 10.5,
          padding: '2px 6px', border: '1px solid var(--line)',
          borderRadius: 4, color: 'var(--ink-3)',
        }}>⌘K</span>
      </div>
      <a href="http://localhost/" target="_blank" rel="noreferrer" className="hm-btn hm-btn-quiet" style={{ padding: '8px 14px', fontSize: 12.5 }}>
        צפה בחנות
      </a>
      <div className="who">
        <div className="avatar">{initial}</div>
        <span style={{ fontWeight: 600 }}>{user?.fullName?.split(' ')[0] ?? '—'}</span>
        <a onClick={() => { logout(); nav('/login') }} style={{ color: 'var(--ink-3)', fontSize: 12, marginInlineStart: 6 }}>
          צא
        </a>
      </div>
    </div>
  )
}
