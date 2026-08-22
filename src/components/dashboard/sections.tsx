import { useEffect, useState } from "react"
import {
  Building2,
  CalendarCheck,
  Calendar,
  ClipboardList,
  FileText,
  Mail,
  MessageCircle,
  ShieldCheck,
  UserPlus,
  Video,
  ClipboardCheck,
  Bell,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { adminApi, type AdminUser } from "@/lib/api"
import { useToast } from "@/components/ui/toast/ToastContext"
import { THEMES, useTheme, type Theme } from "@/components/ui/theme/ThemeContext"

/* ---------- Apartado genérico estilo EduGest ---------- */
function SectionPlaceholder({
  icon: Icon,
  titulo,
  descripcion,
}: {
  icon: React.ComponentType<{ className?: string }>
  titulo: string
  descripcion: string
}) {
  return (
    <section className="space-y-4" aria-label={titulo}>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{titulo}</h2>
        <p className="mt-1 text-sm text-gray-500">{descripcion}</p>
      </div>
      <Card className="flex flex-col items-center justify-center gap-3 border-dashed p-10 text-center shadow-sm">
        <span className="flex size-14 items-center justify-center rounded-full bg-violet-100">
          <Icon className="size-7 text-violet-600" />
        </span>
        <p className="font-medium text-gray-900">{titulo}</p>
        <p className="max-w-sm text-sm text-gray-500">{descripcion}</p>
      </Card>
    </section>
  )
}

/* ---------- Panel de administración (solo admins) ---------- */
function UsuariosPanel() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [overview, setOverview] = useState<{
    users: number; events: number; guests: number; tasks: number; reminders: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    Promise.all([adminApi.users(), adminApi.overview()])
      .then(([u, o]) => {
        setUsers(u.users)
        setOverview(o.overview)
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error al cargar datos")
      )
  }, [])

  const cambiarRol = async (id: number, role: "usuario" | "admin") => {
    try {
      await adminApi.setRole(id, role)
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
      toast({ message: `Rol actualizado a ${role}` })
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : "Error al actualizar rol",
        variant: "destructive",
      })
    }
  }

  if (error) return <Card className="border-dashed p-8 text-center text-red-600">{error}</Card>

  return (
    <section className="space-y-6" aria-label="Administración de usuarios">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Panel de administración</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gestión global del sistema — solo visible para administradores.
        </p>
      </div>

      {overview && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            ["Usuarios", overview.users],
            ["Eventos", overview.events],
            ["Invitados", overview.guests],
            ["Tareas", overview.tasks],
            ["Recordatorios", overview.reminders],
          ].map(([label, valor]) => (
            <Card key={label as string} className="p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{valor}</p>
              <p className="mt-1 text-xs text-gray-500">{label}</p>
            </Card>
          ))}
        </div>
      )}

      <Card className="overflow-hidden p-0 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    className={
                      u.role === "admin"
                        ? "bg-violet-100 text-violet-700"
                        : "bg-gray-100 text-gray-600"
                    }
                  >
                    {u.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cambiarRol(u.id, u.role === "admin" ? "usuario" : "admin")}
                  >
                    {u.role === "admin" ? "Quitar admin" : "Hacer admin"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  )
}

/* ---------- Panel de temas (estilo EduGest) ---------- */
function TemasPanel() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  return (
    <section className="space-y-4" aria-label="Temas">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Personalización</h2>
        <p className="mt-1 text-sm text-gray-500">
          Elige el tema que más te guste. Se guarda automáticamente.
        </p>
      </div>
      <Card className="p-5 shadow-sm">
        <div className="theme-grid" style={{ maxWidth: 420 }}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id as Theme)
                toast({ message: `Tema cambiado a ${t.nombre}` })
              }}
              className={`theme-card ${theme === t.id ? "active" : ""}`}
            >
              <span className="theme-swatch block" style={{ background: t.swatch }} aria-hidden />
              <span className="theme-name">{t.nombre}</span>
            </button>
          ))}
        </div>
      </Card>
    </section>
  )
}

/* ---------- Acceso denegado (capa 2 frontend) ---------- */
function AccesoDenegado() {
  return (
    <Card className="flex flex-col items-center gap-3 border-dashed border-red-300 p-10 text-center">
      <ShieldCheck className="size-10 text-red-400" />
      <p className="font-semibold text-gray-900">Acceso denegado</p>
      <p className="max-w-sm text-sm text-gray-500">
        Esta sección es exclusiva para administradores. Si crees que es un error,
        contacta a un administrador del sistema.
      </p>
    </Card>
  )
}

interface SectionsProps {
  section: string
  esAdmin: boolean
}

export function AdminSections({ section, esAdmin }: SectionsProps) {
  /* Capa 2: aunque se fuerce la sección por estado, se valida el rol */
  const item = { protegido: true, aulas: true, matricula: true, usuarios: true, configuracion: true }[section]
  if (item && !esAdmin) return <AccesoDenegado />

  switch (section) {
    case "actividades":
      return <SectionPlaceholder icon={ClipboardList} titulo="Actividades" descripcion="Tareas y pendientes organizados en un solo lugar." />
    case "examenes":
      return <SectionPlaceholder icon={FileText} titulo="Exámenes" descripcion="Creador y simulador de exámenes." />
    case "foros":
      return <SectionPlaceholder icon={MessageCircle} titulo="Foros" descripcion="Discusión académica por tema." />
    case "agenda":
      return <SectionPlaceholder icon={CalendarCheck} titulo="Agenda" descripcion="Tu plan diario con actividades y pendientes." />
    case "calendario":
      return <SectionPlaceholder icon={Calendar} titulo="Calendario" descripcion="Eventos y fechas importantes." />
    case "clases":
      return <SectionPlaceholder icon={Video} titulo="Clases en línea" descripcion="Enlaces y reuniones con un solo clic." />
    case "mensajes":
      return <SectionPlaceholder icon={Mail} titulo="Mensajes" descripcion="Bandeja de entrada de mensajes." />
    case "tareas":
      return <SectionPlaceholder icon={ClipboardCheck} titulo="Tareas" descripcion="Gestión de actividades asignadas." />
    case "recordatorios":
      return <SectionPlaceholder icon={Bell} titulo="Recordatorios" descripcion="Notificaciones y avisos programados." />
    case "protegido":
      return <SectionPlaceholder icon={ShieldCheck} titulo="Seguridad" descripcion="Protocolos de seguridad y reportes (solo admin)." />
    case "aulas":
      return <SectionPlaceholder icon={Building2} titulo="Aulas Virtuales" descripcion="Espacios de clase virtuales (solo admin)." />
    case "matricula":
      return <SectionPlaceholder icon={UserPlus} titulo="Matrícula" descripcion="Inscripciones en línea (solo admin)." />
    case "usuarios":
      return <UsuariosPanel />
    case "temas":
      return <TemasPanel />
    default:
      return null
  }
}
