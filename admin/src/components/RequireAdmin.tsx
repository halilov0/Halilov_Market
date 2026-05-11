import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/authStore'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, bootstrapped, fetchMe } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!bootstrapped) fetchMe()
  }, [bootstrapped, fetchMe])

  if (!bootstrapped) return <div style={{ padding: '2rem' }}>טוען…</div>
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return <>{children}</>
}
