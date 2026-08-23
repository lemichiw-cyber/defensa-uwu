import { LogOut, Plus, ShieldCheck, UserRound } from "lucide-react"
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
import { cn } from "@/lib/utils"

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
  /* Header transparente sobre el hero de la landing (estilo NewIndex.HTML) */
  const onLanding = view === "landing"

  const irA = (destino: string) => {
    if (destino === "Inicio") onNavigate("landing")
    else onNavigate("dashboard")
  }

  return (
    <header
      className={cn(
        "z-40 w-full",
        onLanding
          ? "absolute top-0 bg-gradient-to-b from-black/70 to-transparent"
          : "sticky top-0 border-b border-gray-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Ir al inicio"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            M
          </span>
          <span
            className={cn(
              "text-lg font-bold tracking-wide",
              onLanding ? "text-white" : "text-gray-900"
            )}
          >
            MiEvento
          </span>
        </button>

        {/* Navegación */}
        <nav className="hidden items-center gap-1 md:flex">
          {["Inicio", "Eventos", "Calendario", "Invitados", "Reportes"].map((link) => (
            <button
              key={link}
              onClick={() => irA(link)}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium uppercase tracking-wider transition-colors",
                onLanding
                  ? "text-white hover:text-yellow-400"
                  : cn(
                      "hover:bg-gray-100 hover:text-gray-900",
                      view === "dashboard" ? "text-blue-600" : "text-gray-600"
                    )
              )}
            >
              {link}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {esAdmin && (
            <span
              className={cn(
                "hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold lg:inline-flex",
                onLanding ? "bg-white/10 text-yellow-300" : "bg-violet-100 text-violet-700"
              )}
            >
              <ShieldCheck className="size-3.5" /> Admin
            </span>
          )}
          <ThemeToggle variant={onLanding ? "onDark" : "solid"} />
          <Button onClick={onNewEvent} className="shadow-sm shadow-violet-600/25">
            <Plus /> Nuevo evento
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Menú de usuario"
                  title={`${user.name} (${user.role})`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm ring-2 ring-white transition-transform hover:scale-105"
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
            <Button
              variant={onLanding ? "outline" : "outline"}
              onClick={() => onNavigate("dashboard")}
              className={onLanding ? "border-white text-white hover:bg-white hover:text-slate-900" : ""}
            >
              <UserRound /> Iniciar sesión
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
