import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/authStore'
import { Field } from '../components/Field'
import { comingSoon } from '../components/Toast'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(email, password)
      nav(next)
    } catch { /* error in store */ }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* form panel */}
      <div style={{ padding: '56px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, fontFamily: 'var(--serif)', fontSize: 22 }}>
          <span style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--olive)', color: 'var(--paper)',
            display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 16, fontFamily: 'var(--sans)',
          }}>ח</span>
          <span>חלילוב מרקט</span>
        </Link>

        <div className="hm-meta" style={{
          fontFamily: 'var(--mono)', letterSpacing: '0.18em',
          color: 'var(--terracotta)', textTransform: 'uppercase',
        }}>ברוכים הבאים</div>
        <h1 style={{ fontSize: 54, marginTop: 10 }}>להתחבר לחשבון.</h1>
        <p style={{ color: 'var(--ink-2)', marginTop: 14, lineHeight: 1.6, maxWidth: '42ch' }}>
          עקבו אחרי ההזמנות שלכם, שמרו כתובות, וקבלו התראה כשמוצר חוזר למלאי.
        </p>

        <form onSubmit={onSubmit} style={{ maxWidth: 380, marginTop: 30, display: 'grid', gap: 14 }}>
          <Field
            label="אימייל"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div>
            <Field
              label="סיסמה"
              type="password"
              required
              mono
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div style={{ textAlign: 'start', marginTop: 6 }}>
              <a
                onClick={() => comingSoon('שחזור סיסמה')}
                style={{ fontSize: 12.5, color: 'var(--ink-3)', textDecoration: 'underline' }}
              >
                שכחתי סיסמה
              </a>
            </div>
          </div>
          {error && <div className="hm-error">{error}</div>}
          <button
            type="submit"
            className="hm-btn hm-btn-primary hm-btn-lg"
            style={{ justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'מתחבר…' : 'כניסה לחשבון'}
          </button>
          <p className="hm-meta" style={{ textAlign: 'center', marginTop: 6 }}>
            חדש אצלנו? <Link to="/register" style={{ color: 'var(--terracotta)', textDecoration: 'underline' }}>פתיחת חשבון</Link>
          </p>
        </form>
      </div>

      {/* brand panel */}
      <div style={{
        background: 'var(--olive)', color: 'var(--paper)',
        padding: '56px 64px', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: .35,
          background: `radial-gradient(circle at 25% 35%, oklch(0.7 0.12 85) 0 22%, transparent 23%),
                       radial-gradient(circle at 75% 70%, oklch(0.6 0.13 40) 0 16%, transparent 17%),
                       radial-gradient(circle at 35% 80%, oklch(0.55 0.13 25) 0 12%, transparent 13%)`,
          filter: 'blur(2px)',
        }} />
        <div style={{ position: 'relative' }}>
          <div className="hm-meta" style={{
            fontFamily: 'var(--mono)', color: 'oklch(0.82 0.04 85)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>קהילת הלקוחות</div>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 42, lineHeight: 1.1,
            marginTop: 14, color: 'var(--paper)',
          }}>
            "האתר נקי, נדיב, והמשלוחים מגיעים מהר."
          </div>
          <div style={{ marginTop: 18, fontSize: 14, opacity: .85 }}>— מירה ר., לקוחה</div>
        </div>
      </div>
    </div>
  )
}
