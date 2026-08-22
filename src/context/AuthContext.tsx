import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authApi, type User } from "@/lib/api"

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("mievento_token")
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem("mievento_token"))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const { token, user } = await authApi.login({ email, password })
    localStorage.setItem("mievento_token", token)
    setUser(user)
  }

  // Theme support
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("mievento-theme")
    return saved || "pastel"
  })

  const register = async (name: string, email: string, password: string) => {
    const { token, user } = await authApi.register({ name, email, password })
    localStorage.setItem("mievento_token", token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("mievento_token")
    setUser(null)
  }

  // Apply theme to HTML element
  useEffect(() => {
    const html = document.documentElement
    html.dataset.theme = theme
    html.style.setProperty('--primary', theme === 'dark' ? '#6d28d9' : getComputedStyle(document.documentElement).getPropertyValue('--primary').trim())
    html.style.setProperty('--bg-card', theme === 'dark' ? '#18181b' : '#fff')
    html.style.setProperty('--bg-sidebar', theme === 'dark' ? '#18181b' : '#f9fafb')
    html.style.setProperty('--text', theme === 'dark' ? '#f9fafb' : '#111827')
    html.style.setProperty('--text-secondary', theme === 'dark' ? '#7f8c8d' : '#6b7280')
    html.style.setProperty('--primary-light', theme === 'dark' ? '#a855f6' : '#f3f4f6')
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, theme, setTheme }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}