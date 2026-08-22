import { Bell, CalendarDays, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stat {
  icon: LucideIcon
  value: number
  label: string
  iconBg: string
  iconColor: string
}

interface StatsRowProps {
  stats: { events: number; guests: number; reminders: number }
}

export function StatsRow({ stats }: StatsRowProps) {
  const statItems: Stat[] = [
    { icon: CalendarDays, value: stats.events, label: "Eventos totales", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
    { icon: Users, value: stats.guests, label: "Invitados", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
    { icon: Bell, value: stats.reminders, label: "Recordatorios", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  ]

  return (
    <section aria-label="Estadísticas" className="grid grid-cols-1 divide-y divide-gray-100 overflow-hidden rounded-2xl border bg-white shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {statItems.map(({ icon: Icon, value, label, iconBg, iconColor }) => (
        <div key={label} className="flex items-center gap-4 p-5 transition-colors hover:bg-gray-50">
          <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-full", iconBg)}>
            <Icon className={cn("size-6", iconColor)} />
          </span>
          <div>
            <p className="text-2xl font-bold leading-none text-gray-900">{value}</p>
            <p className="mt-1.5 text-sm text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </section>
  )
}