import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authStore'

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
    } catch { /* error shown via store */ }
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h1>הרשמה</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <label>
          שם מלא
          <input required value={fullName} onChange={e => setFullName(e.target.value)} />
        </label>
        <label>
          אימייל
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          טלפון (לא חובה)
          <input value={phone} onChange={e => setPhone(e.target.value)} />
        </label>
        <label>
          סיסמה (לפחות 8 תווים)
          <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'נרשם…' : 'הירשם'}</button>
        <p style={{ color: 'var(--muted)' }}>
          כבר רשום? <Link to="/login">התחברות</Link>
        </p>
      </form>
    </div>
  )
}
