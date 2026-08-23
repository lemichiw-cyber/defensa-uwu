import {
  Bell,
  Building2,
  Calendar,
  CalendarCheck,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Home,
  Image,
  Mail,
  MessageCircle,
  Palette,
  Settings,
  ShieldCheck,
  UserPlus,
  Users,
  Video,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon

  soloAdmin?: boolean
}

export const sidebarItems: SidebarItem[] = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "actividades", label: "Actividades", icon: ClipboardList },
  { id: "examenes", label: "Exámenes", icon: FileText },
  { id: "foros", label: "Foro Estudiantil", icon: MessageCircle },
  { id: "agenda", label: "Agenda", icon: CalendarCheck },
  { id: "calendario", label: "Calendario", icon: Calendar },
  { id: "clases", label: "Videollamadas", icon: Video },
  { id: "visor", label: "Visor de Imagen", icon: Image },
  { id: "mensajes", label: "Mensajes", icon: Mail },
  { id: "tareas", label: "Tareas", icon: ClipboardCheck },
  { id: "recordatorios", label: "Recordatorios", icon: Bell },

  { id: "protegido", label: "Seguridad", icon: ShieldCheck, soloAdmin: true },
  { id: "aulas", label: "Aulas Virtuales", icon: Building2, soloAdmin: true },
  { id: "matricula", label: "Matrícula", icon: UserPlus, soloAdmin: true },
  { id: "usuarios", label: "Usuarios", icon: Users, soloAdmin: true },
  { id: "temas", label: "Temas", icon: Palette },
  { id: "configuracion", label: "Configuración", icon: Settings, soloAdmin: true },
]
