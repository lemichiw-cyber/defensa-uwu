import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { eventsApi, type EventItem } from "@/lib/api"

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"]
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

const pad = (n: number) => String(n).padStart(2, "0")

export function MiniCalendar() {
  const hoy = new Date()
  const [cursor, setCursor] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() })
  const [selected, setSelected] = useState<string | null>(null)

  const [eventDays, setEventDays] = useState<Set<string>>(new Set())

  const { year, month } = cursor

  useEffect(() => {
    let cancelled = false
    eventsApi
      .list({ status: "proximo" })
      .then((res: { events: EventItem[] }) => {
        if (cancelled) return
        setEventDays(new Set(res.events.map((ev) => ev.date.slice(0, 10))))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const cells = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startOffset = (new Date(year, month, 1).getDay() + 6) % 7
    return [...Array<null>(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  }, [year, month])

  const move = (delta: number) =>
    setCursor(({ year, month }) => {
      const m = month + delta
      if (m < 0) return { year: year - 1, month: 11 }
      if (m > 11) return { year: year + 1, month: 0 }
      return { year, month: m }
    })

  const isoFor = (day: number) => `${year}-${pad(month + 1)}-${pad(day)}`
  const isToday = (day: number) =>
    day === hoy.getDate() && month === hoy.getMonth() && year === hoy.getFullYear()

  return (
    <Card className="p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold capitalize text-gray-900">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => move(-1)} aria-label="Mes anterior">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => move(1)} aria-label="Mes siguiente">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 text-[11px] font-semibold uppercase text-gray-400">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`blank-${i}`} />
          const today = isToday(day)
          const iso = isoFor(day)
          const isSelected = selected === iso
          return (
            <button
              key={iso}
              type="button"
              onClick={() => setSelected(iso)}
              title={iso}
              className={cn(
                "relative mx-auto flex size-9 items-center justify-center rounded-full text-sm transition-colors",
                today
                  ? "bg-primary font-semibold text-white hover:bg-primary/90"
                  : isSelected
                    ? "bg-violet-200 font-medium text-violet-800"
                    : "text-gray-600 hover:bg-violet-100",
              )}
            >
              {day}
              {eventDays.has(iso) && (
                <span
                  className={cn(
                    "absolute bottom-1 size-1 rounded-full",
                    today ? "bg-white" : "bg-violet-500"
                  )}
                />
              )}
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-center text-xs text-gray-500">
        Los puntos indican días con eventos próximos.
      </p>
    </Card>
  )
}
