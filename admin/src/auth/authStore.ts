import { create } from 'zustand'
import { api, setToken, getToken, type AuthResponse, type Me } from '../api'

type AuthState = {
  token: string | null
  user: Me | null
  loading: boolean
  error: string | null
  bootstrapped: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  fetchMe: () => Promise<void>
}

export const useAuth = create<AuthState>((set, get) => ({
  token: getToken(),
  user: null,
  loading: false,
  error: null,
  bootstrapped: false,

  async login(email, password) {
    set({ loading: true, error: null })
    try {
      const res = await api<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      if (res.role !== 'ADMIN') {
        throw new Error('המשתמש אינו מנהל')
      }
      setToken(res.token)
      set({ token: res.token })
      await get().fetchMe()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'שגיאת התחברות'
      set({ error: msg })
      throw e
    } finally {
      set({ loading: false })
    }
  },

  logout() {
    setToken(null)
    set({ token: null, user: null })
  },

  async fetchMe() {
    if (!getToken()) {
      set({ user: null, bootstrapped: true })
      return
    }
    try {
      const me = await api<Me>('/api/auth/me')
      if (me.role !== 'ADMIN') {
        setToken(null)
        set({ token: null, user: null })
      } else {
        set({ user: me })
      }
    } catch {
      setToken(null)
      set({ token: null, user: null })
    } finally {
      set({ bootstrapped: true })
    }
  },
}))
