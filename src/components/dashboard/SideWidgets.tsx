import { ArrowRight, HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatShortDate } from "@/data/events"
import type { EventItem } from "@/lib/api"

interface RecentEventsWidgetProps {
  events: EventItem[]
}

export function RecentEventsWidget({ events }: RecentEventsWidgetProps) {
  return (
    <Card className="p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">Eventos recientes</h3>
      <ul className="mt-4 space-y-1.5">
        {events.length === 0 ? (
          <li className="text-sm text-gray-500 text-center py-4">No hay eventos finalizados</li>
        ) : (
          events.map((ev) => (
            <li key={ev.id} className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">{ev.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{formatShortDate(ev.date)}</p>
              </div>
              <Badge className="shrink-0 rounded-full border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Finalizado
              </Badge>
            </li>
          ))
        )}
      </ul>
    </Card>
  )
}

export function HelpWidget() {
  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
      <span className="flex size-11 items-center justify-center rounded-full bg-white shadow-sm">
        <HelpCircle className="size-5 text-primary" />
      </span>
      <h3 className="mt-3 font-semibold text-gray-900">¿Necesitas ayuda?</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-500">
        Consulta la guía rápida y saca el máximo partido a MiEvento.
      </p>
      <Button className="mt-4 w-full" size="sm">
        Ver guía <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}