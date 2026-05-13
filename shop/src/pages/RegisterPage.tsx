import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authStore'
import { Field } from '../components/Field'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const { register, loading, error } = useAuth()
  const nav = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await register({ email, password, fullName, phone: phone || undefined })
      nav('/')
    } catch { /* error in store */ }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
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
        }}>הצטרפו אלינו</div>
        <h1 style={{ fontSize: 54, marginTop: 10 }}>פתיחת חשבון.</h1>
        <p style={{ color: 'var(--ink-2)', marginTop: 14, lineHeight: 1.6, maxWidth: '42ch' }}>
          רישום מהיר. שמרו פרטי משלוח, עקבו אחרי הזמנות, וקבלו עדכונים על מבצעים.
        </p>

        <form onSubmit={onSubmit} style={{ maxWidth: 420, marginTop: 30, display: 'grid', gap: 14 }}>
          <Field label="שם מלא" required value={fullName} onChange={e => setFullName(e.target.value)} />
          <Field label="אימייל" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          <Field label="טלפון (לא חובה)" mono value={phone} onChange={e => setPhone(e.target.value)} />
          <Field
            label="סיסמה (לפחות 8 תווים)"
            type="password"
            required
            minLength={8}
            mono
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="hm-error">{error}</div>}
          <button
            type="submit"
            className="hm-btn hm-btn-primary hm-btn-lg"
            style={{ justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'נרשם…' : 'יצירת חשבון'}
          </button>
          <p className="hm-meta" style={{ textAlign: 'center', marginTop: 6 }}>
            כבר רשום? <Link to="/login" style={{ color: 'var(--terracotta)', textDecoration: 'underline' }}>התחברות</Link>
          </p>
        </form>
      </div>

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
          }}>למה חלילוב</div>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 42, lineHeight: 1.1,
            marginTop: 14, color: 'var(--paper)',
          }}>
            "סופר ישראלי אמיתי. מחירים הוגנים, משלוח מהיר."
          </div>
          <div style={{ marginTop: 18, fontSize: 14, opacity: .85 }}>— צוות חלילוב</div>
        </div>
      </div>
    </div>
  )
}
