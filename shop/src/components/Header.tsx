import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()
  const onCatalog = loc.pathname === '/'
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const close = () => setOpen(false)

  // keep input synced when URL changes (e.g. user navigates back)
  useEffect(() => { setQuery(searchParams.get('q') ?? '') }, [searchParams])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const v = query.trim()
    close()
    nav(v ? `/?q=${encodeURIComponent(v)}` : '/')
  }

  const initial = user?.fullName?.[0] ?? '·'

  return (
    <header className={`hm-header${open ? ' open' : ''}`}>
      <Link to="/" className="hm-logo" onClick={close}>
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
        <form
          className="hm-header-search"
          onSubmit={submitSearch}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--card)', border: '1px solid var(--line)',
            borderRadius: 'var(--r-pill)', padding: '6px 14px',
            width: 260,
          }}
        >
          <button type="submit" aria-label="חפש" style={{
            border: 'none', background: 'transparent', color: 'var(--ink-3)',
            padding: 0, display: 'grid', placeItems: 'center', cursor: 'pointer',
          }}>
            <Icon name="search" size={16} />
          </button>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="חפש מוצר…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 14, color: 'var(--ink)', minWidth: 0, fontFamily: 'inherit',
            }}
          />
        </form>
        <button className="hm-icon-btn hm-mobile-hide" onClick={() => comingSoon('מועדפים')} title="מועדפים">
          <Icon name="heart" />
        </button>
        <Link to="/cart" className="hm-icon-btn" title="סל" onClick={close}>
          <Icon name="bag" />
          {totalItems > 0 && <span className="badge">{totalItems}</span>}
        </Link>
        {user ? (
          <div className="hm-mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: 10, marginInlineStart: 8 }}>
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
            <Link to="/login" className="hm-btn hm-btn-quiet hm-mobile-hide" onClick={close}>התחברות</Link>
            <Link to="/register" className="hm-btn hm-btn-primary hm-mobile-hide" onClick={close}>הרשמה</Link>
          </>
        )}
      </div>
      <button
        className="hm-menu-toggle"
        aria-label={open ? 'סגור תפריט' : 'פתח תפריט'}
        onClick={() => setOpen(o => !o)}
      >
        <Icon name={open ? 'x' : 'menu'} />
      </button>

      <div className="hm-mobile-drawer">
        <form className="hm-mobile-search" onSubmit={submitSearch}>
          <button type="submit" aria-label="חפש" style={{
            border: 'none', background: 'transparent', color: 'var(--ink-3)',
            padding: 0, display: 'grid', placeItems: 'center',
          }}>
            <Icon name="search" size={16} />
          </button>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="חפש מוצר…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 16, color: 'var(--ink)', minWidth: 0, fontFamily: 'inherit',
            }}
          />
        </form>
        <Link to="/" onClick={close}>קטלוג</Link>
        <a onClick={() => { comingSoon('טריות השבוע'); close() }}>טריות השבוע</a>
        <a onClick={() => { comingSoon('מבצעים'); close() }}>מבצעים</a>
        <a onClick={() => { comingSoon('חדש בקטלוג'); close() }}>חדש בקטלוג</a>
        <a onClick={() => { comingSoon('עלינו'); close() }}>עלינו</a>
        <a onClick={() => { comingSoon('מועדפים'); close() }}>מועדפים</a>
        {user ? (
          <>
            <span style={{ padding: '12px 4px', fontSize: 13, color: 'var(--ink-3)' }}>
              שלום, {user.fullName}
            </span>
            <a onClick={() => { logout(); nav('/'); close() }} style={{ color: 'var(--terracotta)' }}>
              התנתקות
            </a>
          </>
        ) : (
          <>
            <Link to="/login" onClick={close}>התחברות</Link>
            <Link to="/register" onClick={close} style={{ color: 'var(--olive-2)', fontWeight: 600 }}>
              הרשמה
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
