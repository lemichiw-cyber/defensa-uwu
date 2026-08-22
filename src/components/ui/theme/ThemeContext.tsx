import { createContext, useContext, useEffect, useState } from "react"

export const THEMES = [
  { id: "light", nombre: "Claro", swatch: "linear-gradient(135deg,#ffffff,#f3f4f6)", icono: "sun" },
  { id: "dark", nombre: "Oscuro", swatch: "linear-gradient(135deg,#0f172a,#1e293b)", icono: "moon" },
  { id: "pastel", nombre: "Pastel", swatch: "linear-gradient(135deg,#fdf6f9,#fce4ef)", icono: "flower" },
  { id: "sunset", nombre: "Atardecer", swatch: "linear-gradient(135deg,#1c1917,#fb923c)", icono: "sunset" },
  { id: "dawn", nombre: "Amanecer", swatch: "linear-gradient(135deg,#faf8f0,#e8a030)", icono: "sun-high" },
  { id: "ocean", nombre: "Océano", swatch: "linear-gradient(135deg,#f0f6f8,#2a8ab8)", icono: "droplet" },
  { id: "mlp", nombre: "Magia", swatch: "linear-gradient(135deg,#f8f0fa,#9b59b6)", icono: "star" },
  { id: "chicawa", nombre: "Chicawa", swatch: "linear-gradient(135deg,#FFF8F9,#FF8FAB)", icono: "heart" },
  { id: "sakura", nombre: "Sakura", swatch: "linear-gradient(135deg,#160C1E,#D480B8)", icono: "flower" },
  { id: "paraiso", nombre: "Paraíso", swatch: "linear-gradient(135deg,#0D0B14,#FF8C42)", icono: "palmtree" },
] as const

export type Theme = (typeof THEMES)[number]["id"]

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = "mievento-theme"

function temaValido(valor: string | null): Theme {
  if (!valor) return "light"
  return THEMES.some((t) => t.id === valor) ? (valor as Theme) : "light"
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    temaValido(localStorage.getItem(STORAGE_KEY))
  )

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = (nuevo: Theme) => setThemeState(nuevo)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

export { ThemeProvider }
