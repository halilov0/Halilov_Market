import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authStore'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(email, password)
      nav(from, { replace: true })
    } catch { /* error in store */ }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <form
        onSubmit={onSubmit}
        className="card"
        style={{ width: 360, display: 'grid', gap: '0.75rem' }}
      >
        <h1 style={{ marginBlockStart: 0, marginBlockEnd: '0.5rem' }}>כניסת מנהל</h1>
        <label>אימייל
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>סיסמה
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'מתחבר…' : 'התחבר'}</button>
      </form>
    </div>
  )
}
