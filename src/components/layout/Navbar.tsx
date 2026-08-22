import { CalendarDays, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme/ThemeToggle"

interface NavbarProps {
  view: "landing" | "dashboard"
  onNavigate: (view: "landing" | "dashboard") => void
  onNewEvent: () => void
}

export function Navbar({ view, onNavigate, onNewEvent }: NavbarProps) {
  const activeLink = view === "dashboard" ? "Eventos" : "Inicio"

  const fixedLinks = ["Inicio", "Eventos", "Calendario", "Invitados", "Reportes"]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-violet-500" />
          <span className="text-lg font-bold tracking-tight text-gray-900">MiEvento</span>
          <ThemeToggle />
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {fixedLinks.map((link) => (
            <button key={link} onClick={() => onNavigate("dashboard")} className={`text-sm ${activeLink === link ? "text-violet-600" : "text-gray-600"} hover:bg-gray-100 hover:text-gray-900`}>
              {link}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button onClick={onNewEvent} className="shadow-sm shadow-violet-600/25">
            <Plus /> Nuevo evento
          </Button>
        </div>
      </div>
    </header>
  )
}
