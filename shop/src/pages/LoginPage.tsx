import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authStore'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()
  const nav = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(email, password)
      nav('/')
    } catch { /* error shown via store */ }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h1>התחברות</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <label>
          אימייל
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          סיסמה
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'מתחבר…' : 'התחבר'}</button>
        <p style={{ color: 'var(--muted)' }}>
          אין לך חשבון? <Link to="/register">הרשמה</Link>
        </p>
      </form>
    </div>
  )
}
