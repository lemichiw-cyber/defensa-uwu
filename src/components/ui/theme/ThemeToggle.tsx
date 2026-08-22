import { useEffect, useRef, useState } from "react"
import { Palette, Check } from "lucide-react"
import { THEMES, useTheme } from "@/components/ui/theme/ThemeContext"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickFuera = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickFuera)
    return () => document.removeEventListener("mousedown", onClickFuera)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
        aria-label="Cambiar tema"
        title="Cambiar tema"
      >
        <Palette className="size-5 text-violet-600" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-2 px-1 text-sm font-semibold text-gray-900">
            Elige un tema
          </p>
          <div className="theme-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id)
                  setOpen(false)
                }}
                className={`theme-card ${theme === t.id ? "active" : ""}`}
                data-theme-card={t.id}
              >
                <span
                  className="theme-swatch block"
                  style={{ background: t.swatch }}
                  aria-hidden
                />
                <span className="theme-name flex items-center justify-center gap-1">
                  {t.nombre}
                  {theme === t.id && (
                    <Check className="size-3 text-violet-600" strokeWidth={3} />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
