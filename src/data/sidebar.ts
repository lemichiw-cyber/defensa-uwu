import {
  BarChart3,
  Bell,
  Calendar,
  CalendarDays,
  Home,
  ListChecks,
  Settings,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon
}

export const sidebarItems: SidebarItem[] = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "eventos", label: "Eventos", icon: CalendarDays },
  { id: "calendario", label: "Calendario", icon: Calendar },
  { id: "invitados", label: "Invitados", icon: Users },
  { id: "tareas", label: "Tareas", icon: ListChecks },
  { id: "recordatorios", label: "Recordatorios", icon: Bell },
  { id: "reportes", label: "Reportes", icon: BarChart3 },
  { id: "ajustes", label: "Ajustes", icon: Settings },
]
