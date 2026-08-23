import { GraduationCap, Palette, Settings2 } from "lucide-react"
import { useReveal } from "@/hooks/useReveal"

const PORTFOLIO = [
  {
    id: "actividades",
    titulo: "Actividades",
    sub: "Gestión",
    img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "examenes",
    titulo: "Exámenes",
    sub: "Evaluaciones",
    img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "foros",
    titulo: "Foros",
    sub: "Comunidad",
    img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "agenda",
    titulo: "Agenda",
    sub: "Organización",
    img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "clases",
    titulo: "Clases Online",
    sub: "Videoconferencias",
    img: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "visor",
    titulo: "Visor Imagen",
    sub: "Visualización",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b8?auto=format&fit=crop&w=800&q=80",
  },
]

const SERVICES = [
  {
    icon: GraduationCap,
    titulo: "Para estudiantes",
    texto:
      "Gestiona tus tareas, exámenes y calificaciones. Accede a recursos educativos y mantente al día con tu agenda académica.",
  },
  {
    icon: Settings2,
    titulo: "Servicios",
    texto:
      "Plataforma integral con foros de discusión, mensajería interna, clases en línea y actividades grupales colaborativas.",
  },
  {
    icon: Palette,
    titulo: "Diseño",
    texto:
      "Interfaz moderna y responsiva diseñada para ofrecer la mejor experiencia de usuario en cualquier dispositivo.",
  },
]

const STATS = [
  { valor: "15+", label: "Módulos Activos" },
  { valor: "100%", label: "Funcional" },
  { valor: "24/7", label: "Disponibilidad" },
  { valor: "∞", label: "Posibilidades" },
]

interface LandingProps {
  onEnterSection: (sectionId: string) => void
}

export function Landing({ onEnterSection }: LandingProps) {
  useReveal()

  return (
    <div className="bg-white" id="top">
      {}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center text-center text-white">
        <img
          src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1950&q=80"
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "rgba(15,23,42,.6)" }} />

        <div className="relative z-10 max-w-3xl px-5">
          <p className="mb-4 text-sm font-normal uppercase tracking-[3px] text-yellow-400">
            Welcome To Eduset
          </p>
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
            ¡Que onda peblada!
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg opacity-90">
            Plataforma educativa institucional para gestionar actividades
            académicas, exámenes, foros y más. Todo en un solo lugar.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onEnterSection("inicio")}
              className="rounded-[30px] bg-yellow-400 px-9 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-yellow-500"
            >
              Comenzar Ahora
            </button>
            <a
              href="#portfolio"
              className="rounded-[30px] border-2 border-white px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-slate-900"
            >
              Ver Portafolio
            </a>
          </div>
        </div>
      </section>

      {}
      <section id="services" className="bg-white px-6 py-24 md:px-[10%]">
        <h2 className="text-center text-3xl font-bold uppercase tracking-widest text-gray-900">
          Services
        </h2>
        <p className="mt-3 text-center text-lg text-gray-500">
          Todo lo que necesitas para tu vida académica
        </p>

        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, titulo, texto }) => (
            <article key={titulo} className="reveal px-5 py-7 text-center transition-transform duration-300 hover:-translate-y-2.5">
              <span
                className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full text-white shadow-lg"
                style={{ background: "#f1c40f", boxShadow: "0 5px 20px rgba(241,196,15,.35)" }}
              >
                <Icon className="size-9" />
              </span>
              <h3 className="mb-4 text-xl font-bold text-slate-900">{titulo}</h3>
              <p className="leading-relaxed text-gray-500">{texto}</p>
            </article>
          ))}
        </div>
      </section>

      {}
      <section style={{ background: "linear-gradient(135deg,#2563eb,#1e3a5f)" }}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 py-16 text-center text-white lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="reveal">
              <h3 className="text-4xl font-extrabold">{s.valor}</h3>
              <p className="mt-1 text-sm uppercase tracking-wider opacity-85">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {}
      <section id="portfolio" className="bg-gray-50 px-6 py-24 md:px-[10%]">
        <h2 className="text-center text-3xl font-bold uppercase tracking-widest text-gray-900">
          Portfolio
        </h2>
        <p className="mt-3 text-center text-lg text-gray-500">
          Explora los módulos de la plataforma
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO.map((item) => (
            <button
              key={item.id}
              onClick={() => onEnterSection(item.id)}
              className="reveal group relative aspect-[4/3] overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl"
              aria-label={`Acceder a ${item.titulo}`}
            >
              <img
                src={item.img}
                alt={item.titulo}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "rgba(37,99,235,.9)" }}
              >
                <h3 className="text-2xl font-bold">{item.titulo}</h3>
                <span className="text-sm opacity-85">{item.sub}</span>
                <span className="mt-3 rounded-full bg-white px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-600">
                  Acceder
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {}
      <section id="contact" className="px-6 py-24 text-center" style={{ background: "#0f172a" }}>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">¿Listo para comenzar?</h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-300">
          Accede ahora a la plataforma educativa y descubre todas las
          funcionalidades disponibles para ti.
        </p>
        <button
          onClick={() => onEnterSection("inicio")}
          className="mt-8 inline-block rounded-[30px] bg-yellow-400 px-10 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-yellow-500"
        >
          Ir a la Plataforma
        </button>
      </section>

      {}
      <footer className="bg-slate-950 pb-8 pt-14 text-gray-400">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
          <div>
            <h4 className="mb-3 font-bold text-white">Plataforma Educativa</h4>
            <p className="text-sm leading-relaxed">
              Plataforma educativa institucional diseñada para mejorar la
              experiencia de aprendizaje de estudiantes y docentes.
            </p>
          </div>
          <div className="text-sm">
            <h4 className="mb-3 font-bold text-white">Acceso</h4>
            <button onClick={() => onEnterSection("inicio")} className="transition-colors hover:text-yellow-400">
              Acceder al Sistema →
            </button>
          </div>
          <div className="text-sm">
            <h4 className="mb-3 font-bold text-white">Contacto</h4>
            <p>📧 contacto@plataforma.edu</p>
            <p>📞 +500 6767 8989</p>
            <p>📍 Instituto Nacional, Ciudad Obrera de Apopa</p>
          </div>
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-center text-xs opacity-70">
          © 2026 Plataforma Educativa. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}
