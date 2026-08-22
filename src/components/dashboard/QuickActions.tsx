import { BellPlus, CalendarPlus, ListChecks, UserPlus } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface QuickAction {
  label: string
  icon: LucideIcon
  iconBg: string
  onClick?: () => void
}

const actions: Omit<QuickAction, "onClick">[] = [
  { label: "Nuevo evento", icon: CalendarPlus, iconBg: "bg-violet-100 text-violet-600" },
  { label: "Agregar invitados", icon: UserPlus, iconBg: "bg-emerald-100 text-emerald-600" },
  { label: "Crear recordatorio", icon: BellPlus, iconBg: "bg-amber-100 text-amber-600" },
  { label: "Lista de tareas", icon: ListChecks, iconBg: "bg-pink-100 text-pink-600" },
]

export function QuickActions({ onNewEvent }: { onNewEvent: () => void }) {
  const handleClick = (label: string) => {
    if (label === "Nuevo evento") onNewEvent()
  }

  return (
    <section aria-label="Acciones rápidas">
      <h2 className="text-lg font-bold text-gray-900">Acciones rápidas</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {(actions as QuickAction[]).map(({ label, icon: Icon, iconBg }) => (
          <button key={label} onClick={() => handleClick(label)} className="text-left">
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
