import { CalendarPlus } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface HeroCardProps {
  onNewEvent?: () => void
}

/** Ilustración flat: persona con laptop */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 360 260" className="w-full max-w-xs drop-shadow-sm" role="img" aria-label="Ilustración de persona organizando eventos con su laptop">
      {/* Fondo */}
      <circle cx="185" cy="132" r="108" fill="#DBEAFE" />
      <ellipse cx="185" cy="228" rx="125" ry="14" fill="#E5E7EB" opacity="0.55" />

      {/* Sparkles decorativos */}
      <g stroke="#93c5fd" strokeWidth="4" strokeLinecap="round">
        <path d="M62 64v16M54 72h16" />
        <path d="M312 148v12M306 154h12" />
      </g>
      <circle cx="96" cy="180" r="5" fill="#BFDBFE" />
      <circle cx="330" cy="96" r="6" fill="#BFDBFE" />

      {/* Persona */}
      {/* Piernas cruzadas */}
      <path d="M116 212q48-28 94-8 12 5 2 11-52 17-96 3z" fill="#1e40af" />
      {/* Torso */}
      <path d="M130 176q0-39 30-39t30 39v12h-60z" fill="#2563eb" />
      {/* Brazos hacia el laptop */}
      <path d="M146 152l38 24" stroke="#1d4ed8" strokeWidth="13" strokeLinecap="round" />
      <circle cx="188" cy="177" r="7" fill="#FFC7A3" />
      {/* Cuello y cabeza */}
      <rect x="153" y="118" width="14" height="12" rx="4" fill="#F5B08C" />
      <circle cx="160" cy="102" r="21" fill="#FFC7A3" />
      {/* Pelo con moño */}
      <path d="M139 100a21 21 0 0 1 42-4c-2-11-11-18-21-18-12 0-20 10-21 22z" fill="#312E81" />
      <circle cx="143" cy="82" r="9" fill="#312E81" />

      {/* Laptop */}
      <rect x="172" y="140" width="56" height="38" rx="6" fill="#111827" />
      <rect x="177" y="145" width="46" height="28" rx="3" fill="#3b82f6" opacity="0.9" />
      <path d="M164 198h74l-9 9h-56z" fill="#374151" />

      {/* Planta */}
      <path d="M294 198h34l-5 26h-24z" fill="#93c5fd" />
      <path d="M311 196c-2-14 6-24 16-28-1 14-7 24-16 28z" fill="#10B981" />
      <path d="M310 196c1-12-5-21-14-25 0 12 5 21 14 25z" fill="#34D399" />

      {/* Tarjeta calendario flotante */}
      <g transform="translate(250 24)">
        <rect width="78" height="70" rx="12" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="2" />
        <path d="M0 12a12 12 0 0 1 12-12h54a12 12 0 0 1 12 12v8H0z" fill="#1d4ed8" />
        <rect x="18" y="-5" width="6" height="12" rx="3" fill="#4C1D95" />
        <rect x="54" y="-5" width="6" height="12" rx="3" fill="#4C1D95" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <circle key={`${r}-${c}`} cx={16 + c * 15} cy={36 + r * 13} r="3.2" fill={r === 1 && c === 2 ? "#34D399" : "#BFDBFE"} />
          ))
        )}
      </g>
    </svg>
  )
}

export function HeroCard({ onNewEvent }: HeroCardProps) {
  const { user, esAdmin } = useAuth()
  const primerNombre = user?.name.split(" ")[0] ?? "invitado"

  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-sky-50/80 to-white p-6 shadow-sm sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[3px] text-yellow-500">
            {esAdmin ? "Panel de administración" : "Tu espacio"}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            ¡Hola, {primerNombre}! 👋
          </h1>
          <p className="mt-2 max-w-md text-base text-gray-500">
            Aquí tienes un resumen de tus eventos.
          </p>
          {onNewEvent && (
            <button onClick={onNewEvent} className="incoa-cta mt-5 inline-flex items-center gap-2 px-6 py-2.5 text-xs">
              <CalendarPlus className="size-4" /> Nuevo evento
            </button>
          )}
        </div>
        <div className="justify-self-center sm:justify-self-end">
          <HeroIllustration />
        </div>
      </div>
    </section>
  )
}
