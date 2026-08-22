import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authApi, type User } from "@/lib/api"

export type Rol = "usuario" | "admin"

interface AuthContextValue {
  user: User | null
  loading: boolean
  esAdmin: boolean
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

  const register = async (name: string, email: string, password: string) => {
    const { token, user } = await authApi.register({ name, email, password })
    localStorage.setItem("mievento_token", token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("mievento_token")
    setUser(null)
  }

  /* Doble capa (capa 2): el frontend oculta funciones admin a usuarios comunes.
     La capa 1 es el middleware requireAdmin en el servidor. */
  const esAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, loading, esAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
