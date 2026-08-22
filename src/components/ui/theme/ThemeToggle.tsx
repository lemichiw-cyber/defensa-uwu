import { useTheme } from "@/components/ui/theme/ThemeContext"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { toggleTheme, resolvedTheme } = useTheme()

  const Icon = resolvedTheme === "dark" ? Sun : Moon
  const iconAlt = resolvedTheme === "dark" ? "Modo claro" : "Modo oscuro"

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full bg-gray-100 p-1.5 hover:bg-gray-200 transition-colors"
      aria-label={iconAlt}
    >
      <Icon className="size-5" />
    </button>
  )
}
