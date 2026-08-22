import { useToast } from "@/components/ui/toast/ToastContext"
import { useEffect, useState } from "react"
import { CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/Sidebar"
import { sidebarItems } from "@/data/sidebar"
import { useAuth } from "@/context/AuthContext"
import { AdminSections } from "@/components/dashboard/sections"
import { HeroCard } from "@/components/dashboard/HeroCard"
import { StatsRow } from "@/components/dashboard/StatsRow"
import { EventRow } from "@/components/dashboard/EventRow"
import { MiniCalendar } from "@/components/dashboard/MiniCalendar"
import { HelpWidget, RecentEventsWidget } from "@/components/dashboard/SideWidgets"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { eventsApi, type EventItem, type Stats } from "@/lib/api"
import { type EventItem as LocalEventItem } from "@/data/events"

interface DashboardProps {
  onNewEvent: () => void
  onEditEvent: (event: LocalEventItem) => void
  onDeleteEvent: (id: number) => void
}

export function Dashboard({ onNewEvent, onEditEvent, onDeleteEvent }: DashboardProps) {
  const { esAdmin } = useAuth()
  const { toast } = useToast()
  const [collapsed, setCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState(sidebarItems[0].id)

  const [events, setEvents] = useState<EventItem[]>([])
  const [stats, setStats] = useState<Stats>({ events: 0, guests: 0, reminders: 0 })
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [eventsRes, statsRes, finishedRes] = await Promise.all([
          eventsApi.list({ status: "proximo" }),
          eventsApi.stats(),
          eventsApi.list({ status: "finalizado", limit: 3 }),
        ])
        if (cancelled) return
        setEvents(eventsRes.events)
        setStats(statsRes)
        setRecentEvents(finishedRes.events)
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Error al cargar datos")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  /* Reintento manual (botón) */
  const retry = () => {
    setError(null)
    setLoading(true)
    eventsApi
      .list({ status: "proximo" })
      .then((eventsRes) => setEvents(eventsRes.events))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error al cargar datos")
      )
      .finally(() => setLoading(false))
  }

  const handleDelete = async (id: number) => {
    try {
      await eventsApi.delete(id)
      toast({ message: "Evento eliminado correctamente" })
      onDeleteEvent(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
      setStats((s) => ({ ...s, events: s.events - 1 }))
    } catch (err) {
      toast({
        message:
          err instanceof Error
            ? err.message
            : "No tienes permisos para eliminar eventos",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-dashed p-10 text-center shadow-sm">
        <p className="text-red-600">{error}</p>
        <Button onClick={retry} className="mt-4" variant="outline">
          Reintentar
        </Button>
      </Card>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px]">
      <Sidebar
        collapsed={collapsed}
        active={activeSection}
        esAdmin={esAdmin}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onSelect={setActiveSection}
      />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Navegación de secciones para móvil (la sidebar está oculta) */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 md:hidden" role="tablist" aria-label="Secciones">
          {sidebarItems
            .filter((item) => !item.soloAdmin || esAdmin)
            .map(({ id, label }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeSection === id}
                onClick={() => setActiveSection(id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeSection === id
                    ? "bg-violet-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
        </div>

        {activeSection !== "inicio" ? (
          <div className="mx-auto max-w-3xl">
            <AdminSections section={activeSection} esAdmin={esAdmin} />
          </div>
        ) : (
        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-8">
            <HeroCard />
            <StatsRow stats={stats} />

            <section aria-labelledby="proximos-eventos">
              <div className="flex items-center justify-between">
                <h2 id="proximos-eventos" className="text-lg font-bold text-gray-900">
                  Próximos eventos
                </h2>
                <button
                  onClick={() => setActiveSection("actividades")}
                  className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-violet-800 hover:underline"
                >
                  Ver todos
                </button>
              </div>

              {events.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {events.map((ev) => {
                    const localEvent: LocalEventItem = {
                      id: ev.id,
                      title: ev.title,
                      description: ev.description ?? undefined,
                      date: ev.date,
                      time: ev.time,
                      location: ev.location,
                      image: ev.image,
                      status: ev.status,
                    }
                    return (
                      <EventRow
                        key={ev.id}
                        event={localEvent}
                        onEdit={() => onEditEvent(localEvent)}
                        onDelete={handleDelete}
                      />
                    )
                  })}
                </div>
              ) : (
                <Card className="mt-4 border-dashed p-10 text-center shadow-sm">
                  <p className="text-gray-500">No hay eventos próximos.</p>
                  <Button onClick={onNewEvent} className="mt-4">
                    <CalendarPlus /> Crear mi primer evento
                  </Button>
                </Card>
              )}
            </section>

            <QuickActions onNewEvent={onNewEvent} onNavigate={setActiveSection} />
          </div>

          <aside className="flex min-w-0 flex-col gap-6">
            <MiniCalendar />
            <RecentEventsWidget events={recentEvents} />
            <HelpWidget />
          </aside>
        </div>
        )}
      </main>
    </div>
  )
}