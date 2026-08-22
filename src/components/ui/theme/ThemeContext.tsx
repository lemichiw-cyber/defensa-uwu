import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("mievento-theme")
    if (stored) return stored as Theme
    return "system"
  })

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const html = document.documentElement
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (theme === "system") {
      setResolvedTheme(systemDark ? "dark" : "light")
      html.classList.remove("light", "dark")
      html.classList.add(resolvedTheme ? "dark" : "light")
    } else {
      setResolvedTheme(theme)
      html.classList.remove("light", "dark")
      html.classList.add(theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "system" ? "dark" : "system"))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, toggleTheme }}>
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
