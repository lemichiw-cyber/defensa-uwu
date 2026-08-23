import { BellPlus, CalendarPlus, ListChecks, UserPlus } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface QuickAction {
  label: string
  icon: LucideIcon
  iconBg: string

  action: { type: "newEvent" } | { type: "section"; id: string }
}

const actions: QuickAction[] = [
  { label: "Nuevo evento", icon: CalendarPlus, iconBg: "bg-violet-100 text-violet-600", action: { type: "newEvent" } },
  { label: "Agregar invitados", icon: UserPlus, iconBg: "bg-emerald-100 text-emerald-600", action: { type: "section", id: "actividades" } },
  { label: "Crear recordatorio", icon: BellPlus, iconBg: "bg-amber-100 text-amber-600", action: { type: "section", id: "recordatorios" } },
  { label: "Lista de tareas", icon: ListChecks, iconBg: "bg-pink-100 text-pink-600", action: { type: "section", id: "tareas" } },
]

interface QuickActionsProps {
  onNewEvent: () => void
  onNavigate: (sectionId: string) => void
}

export function QuickActions({ onNewEvent, onNavigate }: QuickActionsProps) {
  return (
    <section aria-label="Acciones rápidas">
      <h2 className="text-lg font-bold text-gray-900">Acciones rápidas</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {actions.map(({ label, icon: Icon, iconBg, action }) => (
          <button
            key={label}
            onClick={() =>
              action.type === "newEvent" ? onNewEvent() : onNavigate(action.id)
            }
            className="text-left"
          >
            <Card className="flex aspect-square flex-col items-center justify-center gap-4 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <span className={cn("flex size-16 items-center justify-center rounded-2xl", iconBg)}>
                <Icon className="size-7" />
              </span>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </Card>
          </button>
        ))}
      </div>
    </section>
  )
}
