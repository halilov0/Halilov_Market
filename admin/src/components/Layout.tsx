import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authStore'

const navItems = [
  { to: '/', label: 'דשבורד', end: true },
  { to: '/products', label: 'מוצרים' },
  { to: '/categories', label: 'קטגוריות' },
  { to: '/orders', label: 'הזמנות' },
]

export function Layout() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
      <aside style={{ background: 'var(--primary)', color: '#fff', padding: '1rem 0' }}>
        <div style={{ padding: '0 1.25rem 1rem', fontWeight: 700, fontSize: '1.1rem', borderBlockEnd: '1px solid #374151' }}>
          חלילוב · ניהול
        </div>
        <nav style={{ padding: '0.75rem 0', display: 'grid' }}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                padding: '0.65rem 1.25rem',
                color: '#fff',
                background: isActive ? '#374151' : 'transparent',
                textDecoration: 'none',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main>
        <header
          style={{
            background: 'var(--surface)',
            borderBlockEnd: '1px solid var(--border)',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ color: 'var(--muted)' }}>{user?.email}</div>
          <button className="secondary" onClick={() => { logout(); nav('/login') }}>התנתקות</button>
        </header>
        <div style={{ padding: '1.25rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
