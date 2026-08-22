import { CalendarDays, Clock, MapPin, Plus, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { popularEvents, type PopularEvent } from "@/data/events"

const categoryStyles: Record<PopularEvent["category"], string> = {
  Música: "bg-violet-500",
  Educativo: "bg-sky-500",
  Celebración: "bg-pink-500",
  Escolar: "bg-emerald-500",
}

interface LandingProps {
  onNewEvent: () => void
  onSeeEvents: () => void
}

export function Landing({ onNewEvent, onSeeEvents }: LandingProps) {
  return (
    <>
      {/* HERO con video de fondo (estilo EduGest) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-white to-white">
        <video
          className="absolute inset-0 size-full object-cover opacity-25"
          src="/videos/paradise-sunset.720p.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
        />
        <div className="pointer-events-none absolute -left-32 top-10 size-96 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-violet-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-1.5 text-sm font-medium text-violet-700 shadow-sm">
              <Sparkles className="size-4" /> La forma más simple de organizar eventos
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              Organiza tus{" "}
              <span className="text-primary">mejores momentos</span> sin esfuerzo
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
              Crea eventos, invita a tus amigos y mantén todo bajo control con
              calendarios, recordatorios y reportes en un solo lugar.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={onNewEvent} className="shadow-lg shadow-violet-600/25">
                <Plus /> Crear evento
              </Button>
              <Button size="lg" variant="outline" className="bg-white" onClick={onSeeEvents}>
                Ver eventos
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[12, 32, 45, 60].map((n) => (
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/64?img=${n}`}
                    alt=""
                    loading="lazy"
                    className="size-9 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">+2.000 organizadores</span>{" "}
                ya confían en MiEvento
              </p>
            </div>
          </div>

          {/* Imagen con máscara orgánica + tarjetas flotantes */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute inset-8 rounded-full bg-violet-300/30 blur-2xl" aria-hidden />
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=900&auto=format&fit=crop"
              alt="Personas celebrando un evento"
              className="relative aspect-square w-full object-cover shadow-xl [border-radius:58%_42%_45%_55%/52%_48%_52%_48%]"
            />
            <Card className="absolute -left-4 top-10 flex items-center gap-3 p-3.5 pr-5 shadow-lg sm:-left-10">
              <span className="flex size-11 items-center justify-center rounded-xl bg-violet-100">
                <CalendarDays className="size-5 text-violet-600" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Evento creado</p>
                <p className="text-xs text-gray-500">Concierto · 24 mayo</p>
              </div>
            </Card>
            <Card className="absolute -bottom-6 right-2 flex items-center gap-3 p-3.5 pr-5 shadow-lg sm:-right-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-amber-100">
                <Clock className="size-5 text-amber-600" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Recordatorio activo</p>
                <p className="text-xs text-gray-500">1 hora antes</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* EVENTOS POPULARES */}
      <section aria-labelledby="eventos-populares" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="eventos-populares" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Eventos populares
            </h2>
            <p className="mt-2 text-gray-500">
              Lo que la comunidad está organizando esta semana.
            </p>
          </div>
          <button
            onClick={onSeeEvents}
            className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-violet-800 hover:underline"
          >
            Ver todos los eventos →
          </button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularEvents.map((ev) => (
            <Card
              key={ev.id}
              className="group overflow-hidden p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={ev.image}
                  alt={ev.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Fecha destacada */}
                <div className="absolute left-3 top-3 rounded-xl bg-white px-3 py-1.5 text-center shadow-md">
                  <p className="text-xl font-extrabold leading-none text-gray-900">{ev.day}</p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-violet-600">
                    {ev.month}
                  </p>
                </div>
                {/* Categoría */}
                <Badge
                  className="absolute bottom-3 left-3 gap-1.5 rounded-full border-transparent bg-white/95 text-gray-700 shadow-sm backdrop-blur hover:bg-white"
                >
                  <span className={`size-2 rounded-full ${categoryStyles[ev.category]}`} />
                  {ev.category}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 min-h-[2.75rem] font-semibold text-gray-900 transition-colors group-hover:text-primary">
                  {ev.title}
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <CalendarDays className="size-4 shrink-0 text-gray-400" /> {ev.date}
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="size-4 shrink-0 text-gray-400" /> {ev.time}
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="size-4 shrink-0 text-gray-400" /> {ev.location}
                  </li>
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
