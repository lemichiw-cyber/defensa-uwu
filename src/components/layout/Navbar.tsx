import { CalendarDays, LogOut, Plus, ShieldCheck, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme/ThemeToggle"
import { useAuth } from "@/context/AuthContext"

interface NavbarProps {
  view: "landing" | "dashboard"
  onNavigate: (view: "landing" | "dashboard") => void
  onNewEvent: () => void
}

const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

export function Navbar({ view, onNavigate, onNewEvent }: NavbarProps) {
  const { user, esAdmin, logout } = useAuth()

  const irA = (destino: string) => {
    if (destino === "Inicio") onNavigate("landing")
    else onNavigate("dashboard")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo → Landing */}
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Ir al inicio"
        >
          <CalendarDays className="size-5 text-violet-500" />
          <span className="text-lg font-bold tracking-tight text-gray-900">MiEvento</span>
        </button>

        {/* Navegación principal */}
        <nav className="hidden items-center gap-1 md:flex">
          {["Inicio", "Eventos", "Calendario", "Invitados", "Reportes"].map((link) => (
            <button
              key={link}
              onClick={() => irA(link)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 ${
                (link === "Inicio" && view === "landing") ||
                (link !== "Inicio" && view === "dashboard")
                  ? "text-violet-600"
                  : "text-gray-600"
              }`}
            >
              {link}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {esAdmin && (
            <span className="hidden items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 lg:inline-flex">
              <ShieldCheck className="size-3.5" /> Admin
            </span>
          )}
          <ThemeToggle />
          <Button onClick={onNewEvent} className="shadow-sm shadow-violet-600/25">
            <Plus /> Nuevo evento
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Menú de usuario"
                  title={`${user.name} (${user.role})`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white shadow-sm ring-2 ring-white transition-transform hover:scale-105"
                >
                  {iniciales(user.name)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="truncate text-xs font-normal text-gray-500">{user.email}</p>
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                    {esAdmin ? (
                      <>
                        <ShieldCheck className="size-3" /> Administrador
                      </>
                    ) : (
                      "Usuario"
                    )}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout()
                    onNavigate("landing")
                  }}
                  className="text-red-600 focus:bg-red-50 focus:text-red-700"
                >
                  <LogOut /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={() => onNavigate("dashboard")}>
              <UserRound /> Iniciar sesión
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
