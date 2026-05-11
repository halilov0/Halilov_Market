import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authStore'
import { useCart } from '../cart/cartStore'

export function Header() {
  const { user, logout } = useAuth()
  const items = useCart(s => s.lines)
  const totalItems = items.reduce((s, l) => s + l.quantity, 0)
  const nav = useNavigate()

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>
          שוק חלילוב
        </Link>
        <nav style={{ marginInlineStart: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/cart" style={{ position: 'relative' }}>
            <button className="secondary">
              סל {totalItems > 0 && `(${totalItems})`}
            </button>
          </Link>
          {user ? (
            <>
              <span style={{ color: 'var(--muted)' }}>שלום, {user.fullName}</span>
              <button className="secondary" onClick={() => { logout(); nav('/') }}>
                התנתקות
              </button>
            </>
          ) : (
            <>
              <Link to="/login">התחברות</Link>
              <Link to="/register">
                <button>הרשמה</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
