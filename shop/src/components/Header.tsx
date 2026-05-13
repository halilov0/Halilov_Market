import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/authStore'
import { useCart } from '../cart/cartStore'
import { Icon } from './Icon'
import { comingSoon } from './Toast'

export function Header() {
  const { user, logout } = useAuth()
  const items = useCart(s => s.lines)
  const totalItems = items.reduce((s, l) => s + l.quantity, 0)
  const nav = useNavigate()
  const loc = useLocation()
  const onCatalog = loc.pathname === '/'

  const initial = user?.fullName?.[0] ?? '·'

  return (
    <header className="hm-header">
      <Link to="/" className="hm-logo">
        <span className="mark">ח</span>
        <span>חלילוב מרקט</span>
      </Link>
      <nav className="hm-nav">
        <Link to="/" className={onCatalog ? 'active' : ''}>קטלוג</Link>
        <a onClick={() => comingSoon('טריות השבוע')}>טריות השבוע</a>
        <a onClick={() => comingSoon('מבצעים')}>מבצעים</a>
        <a onClick={() => comingSoon('חדש בקטלוג')}>חדש בקטלוג</a>
        <a onClick={() => comingSoon('עלינו')}>עלינו</a>
      </nav>
      <div className="hm-header-actions">
        <div
          onClick={() => comingSoon('חיפוש')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--card)', border: '1px solid var(--line)',
            borderRadius: 'var(--r-pill)', padding: '9px 16px',
            width: 260, color: 'var(--ink-3)', fontSize: 14, cursor: 'pointer',
          }}
        >
          <Icon name="search" size={16} />
          <span>חפש מוצר, מותג, קטגוריה…</span>
        </div>
        <button className="hm-icon-btn" onClick={() => comingSoon('מועדפים')} title="מועדפים">
          <Icon name="heart" />
        </button>
        <Link to="/cart" className="hm-icon-btn" title="סל">
          <Icon name="bag" />
          {totalItems > 0 && <span className="badge">{totalItems}</span>}
        </Link>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginInlineStart: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--terra-soft)', color: 'var(--terracotta)',
              display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14,
            }}>{initial}</div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>שלום, {user.fullName}</div>
              <a onClick={() => { logout(); nav('/') }} style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                התנתקות
              </a>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="hm-btn hm-btn-quiet">התחברות</Link>
            <Link to="/register" className="hm-btn hm-btn-primary">הרשמה</Link>
          </>
        )}
      </div>
    </header>
  )
}
