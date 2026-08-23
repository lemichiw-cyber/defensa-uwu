import { useEffect, useRef, useState } from "react"
import {
  ArrowUp,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  RotateCw,
  Send,
  Share2,
  Trash2,
  Video,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MiniCalendar } from "@/components/dashboard/MiniCalendar"
import { useAuth } from "@/context/AuthContext"

/* ---------- persistencia local ---------- */
export function useLocalState<T>(key: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : inicial
    } catch {
      return inicial
    }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(valor))
  }, [key, valor])
  return [valor, setValor] as const
}

function TituloSeccion({ titulo, sub }: { titulo: string; sub: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900">{titulo}</h2>
      <p className="mt-1 text-sm text-gray-500">{sub}</p>
    </div>
  )
}

const prioridadStyles: Record<string, string> = {
  Alta: "bg-red-100 text-red-700",
  Media: "bg-amber-100 text-amber-700",
  Baja: "bg-emerald-100 text-emerald-700",
}

/* =====================================================================
   ACTIVIDADES — Gestión con prioridades (portado de PaginaWeb.HTML)
   ===================================================================== */
type Prioridad = "Alta" | "Media" | "Baja"
interface Actividad {
  id: number
  titulo: string
  entrega: string
  prioridad: Prioridad
}

export function ActividadesSection() {
  const [actividades, setActividades] = useLocalState<Actividad[]>("incoa-actividades", [
    { id: 1, titulo: "Ensayo de Historia", entrega: "25 Ago", prioridad: "Alta" },
    { id: 2, titulo: "Ejercicios de Álgebra", entrega: "28 Ago", prioridad: "Media" },
  ])
  const [titulo, setTitulo] = useState("")
  const [prioridad, setPrioridad] = useState<Prioridad>("Media")
  const [entrega, setEntrega] = useState("")

  const añadir = () => {
    if (!titulo.trim()) return
    setActividades((prev) => [
      ...prev,
      { id: Date.now(), titulo: titulo.trim(), entrega: entrega || "Sin fecha", prioridad },
    ])
    setTitulo("")
    setEntrega("")
  }

  return (
    <section className="space-y-4" aria-label="Gestión de actividades">
      <TituloSeccion titulo="Gestión de Actividades" sub="Organiza tus tareas por prioridad y fecha de entrega." />
      <Card className="space-y-3 p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Input
            className="min-w-[200px] flex-1"
            placeholder="Título de la actividad..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && añadir()}
          />
          <Input type="date" className="w-[160px]" value={entrega} onChange={(e) => setEntrega(e.target.value)} />
          <select
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value as Prioridad)}
            aria-label="Prioridad"
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
          <Button onClick={añadir}>Añadir</Button>
        </div>
      </Card>

      <Card className="divide-y divide-gray-100 p-0 shadow-sm">
        {actividades.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">No hay actividades pendientes.</p>
        ) : (
          actividades.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{a.titulo}</p>
                <p className="text-xs text-gray-500">Entrega: {a.entrega}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${prioridadStyles[a.prioridad]}`}>
                  {a.prioridad}
                </span>
                <button
                  onClick={() => setActividades((prev) => prev.filter((x) => x.id !== a.id))}
                  aria-label={`Eliminar ${a.titulo}`}
                  className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </Card>
    </section>
  )
}

/* =====================================================================
   EXÁMENES — Tabla de próximos exámenes (portado)
   ===================================================================== */
const EXAMENES = [
  { materia: "Matemáticas II", fecha: "24 Ago", hora: "10:00 AM", estado: "Pendiente", tono: "Alta" },
  { materia: "Literatura Universal", fecha: "26 Ago", hora: "02:00 PM", estado: "Preparando", tono: "Media" },
  { materia: "Física Cuántica", fecha: "30 Ago", hora: "09:00 AM", estado: "Programado", tono: "Baja" },
]

export function ExamenesSection() {
  return (
    <section className="space-y-4" aria-label="Gestión de exámenes">
      <TituloSeccion titulo="Gestión de Exámenes" sub="Consulta tus próximas evaluaciones y su estado." />
      <Card className="p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900">Próximos Exámenes</h3>
        <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {["Materia", "Fecha", "Hora", "Estado"].map((h) => (
                <th key={h} className="px-2 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EXAMENES.map((ex) => (
              <tr key={ex.materia} className="border-b border-gray-100 last:border-0">
                <td className="px-2 py-3 font-medium text-gray-900">{ex.materia}</td>
                <td className="px-2 py-3 text-gray-500">{ex.fecha}</td>
                <td className="px-2 py-3 text-gray-500">{ex.hora}</td>
                <td className="px-2 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${prioridadStyles[ex.tono]}`}>
                    {ex.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </section>
  )
}

/* =====================================================================
   FORO ESTUDIANTIL — Publicar + upvotes (portado, persistente)
   ===================================================================== */
interface Post {
  id: number
  autor: string
  titulo: string
  cuerpo: string
  votos: number
}

export function ForoSection() {
  const { user } = useAuth()
  const [posts, setPosts] = useLocalState<Post[]>("incoa-foro", [
    {
      id: 1,
      autor: "@AnaGarcia",
      titulo: "¿Alguien tiene los apuntes de la clase de ayer?",
      cuerpo: "No pude asistir por enfermedad y necesito revisar el tema de derivadas. ¡Gracias!",
      votos: 24,
    },
    {
      id: 2,
      autor: "@CarlosDev",
      titulo: "Tips para el examen de programación",
      cuerpo: "Recuerden practicar bien los bucles anidados y las estructuras de datos.",
      votos: 56,
    },
  ])
  const [texto, setTexto] = useState("")

  const publicar = () => {
    if (!texto.trim()) return
    setPosts((prev) => [
      {
        id: Date.now(),
        autor: user ? `@${user.name.split(" ")[0]}` : "@Anónimo",
        titulo: texto.trim(),
        cuerpo: "",
        votos: 0,
      },
      ...prev,
    ])
    setTexto("")
  }

  return (
    <section className="space-y-4" aria-label="Foro estudiantil">
      <TituloSeccion titulo="Foro Estudiantil" sub="Comparte dudas, apuntes y consejos con tu sección." />
      <Card className="space-y-3 p-5 shadow-sm">
        <Textarea
          rows={3}
          placeholder="¿Qué estás pensando? Comparte con tu sección..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <div className="flex justify-end">
          <Button onClick={publicar}>Publicar</Button>
        </div>
      </Card>

      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id} className="p-4 shadow-sm">
            <p className="text-xs text-gray-500">Publicado por {post.autor}</p>
            <h3 className="mt-1 font-bold text-gray-900">{post.titulo}</h3>
            {post.cuerpo && <p className="mt-1 text-sm leading-relaxed text-gray-500">{post.cuerpo}</p>}
            <div className="mt-3 flex items-center gap-3 text-xs font-medium text-gray-500">
              <button
                onClick={() =>
                  setPosts((prev) =>
                    prev.map((p) => (p.id === post.id ? { ...p, votos: p.votos + 1 } : p))
                  )
                }
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 transition-colors hover:bg-violet-100 hover:text-violet-700"
              >
                <ArrowUp className="size-3.5" /> {post.votos}
              </button>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                <MessageSquare className="size-3.5" /> Comentarios
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                <Share2 className="size-3.5" /> Compartir
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

/* =====================================================================
   AGENDA — reutiliza el MiniCalendar real
   ===================================================================== */
export function AgendaSection() {
  return (
    <section className="space-y-4" aria-label="Agenda académica">
      <TituloSeccion titulo="Agenda Académica" sub="Tu calendario con eventos y fechas importantes." />
      <div className="max-w-sm">
        <MiniCalendar />
      </div>
    </section>
  )
}

/* =====================================================================
   VIDEOLLAMADAS — sala en vivo + chat funcional (portado)
   ===================================================================== */
interface MensajeChat {
  id: number
  autor: string
  texto: string
}

export function ClasesSection() {
  const { user } = useAuth()
  const [micActivo, setMicActivo] = useState(true)
  const [camActiva, setCamActiva] = useState(true)
  const [chat, setChat] = useLocalState<MensajeChat[]>("incoa-chat", [
    { id: 1, autor: "@Lucia", texto: "Profe, ¿podría repetir la última diapositiva?" },
    { id: 2, autor: "@Prof.Martinez", texto: "Claro Lucía, aquí está." },
    { id: 3, autor: "@Diego", texto: "Gracias profe 👍" },
  ])
  const [mensaje, setMensaje] = useState("")
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight })
  }, [chat])

  const enviar = () => {
    if (!mensaje.trim()) return
    setChat((prev) => [
      ...prev,
      { id: Date.now(), autor: user ? `@${user.name.split(" ")[0]}` : "@Yo", texto: mensaje.trim() },
    ])
    setMensaje("")
  }

  return (
    <section className="space-y-4" aria-label="Sala de videollamadas">
      <TituloSeccion titulo="Sala de Videollamadas" sub="Accede a tus clases en vivo con un solo clic." />

      <div
        className="relative flex min-h-[280px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl p-8 text-center text-white"
        style={{ background: "linear-gradient(135deg,#1d4ed8,#0f172a)" }}
      >
        <div className="text-6xl">{camActiva ? "👨‍🏫" : "📷"}</div>
        <h3 className="text-xl font-bold">Clase en Vivo: Biología Molecular</h3>
        <p className="opacity-80">Prof. Martínez • Duración: 45 min restantes</p>

        {!micActivo && (
          <span className="absolute left-4 top-4 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold">
            Micrófono silenciado
          </span>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setMicActivo((v) => !v)}
            title="Silenciar"
            aria-label="Alternar micrófono"
            className={`flex size-12 items-center justify-center rounded-full transition-all ${
              micActivo ? "bg-white/15 hover:bg-white/25" : "bg-red-500 hover:bg-red-400"
            }`}
          >
            {micActivo ? <Mic className="size-5" /> : <MicOff className="size-5" />}
          </button>
          <button
            onClick={() => setCamActiva((v) => !v)}
            title="Cámara"
            aria-label="Alternar cámara"
            className={`flex size-12 items-center justify-center rounded-full transition-all ${
              camActiva ? "bg-white/15 hover:bg-white/25" : "bg-red-500 hover:bg-red-400"
            }`}
          >
            <Video className="size-5" />
          </button>
          <button
            title="Colgar"
            aria-label="Salir de la llamada"
            className="flex size-12 items-center justify-center rounded-full bg-red-600 transition-transform hover:scale-105"
          >
            <PhoneOff className="size-5" />
          </button>
        </div>
      </div>

      <Card className="p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900">Chat de Clase</h3>
        <div ref={chatRef} className="my-3 h-40 space-y-1 overflow-y-auto rounded-lg bg-gray-50 p-3 text-sm">
          {chat.map((m) => (
            <p key={m.id}>
              <strong className="text-violet-700">{m.autor}:</strong>{" "}
              <span className="text-gray-700">{m.texto}</span>
            </p>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
          />
          <Button onClick={enviar} size="icon" aria-label="Enviar mensaje">
            <Send className="size-4" />
          </Button>
        </div>
      </Card>
    </section>
  )
}

/* =====================================================================
   VISOR DE RECURSOS — URL/upload + zoom + rotar (portado)
   ===================================================================== */
export function VisorSection() {
  const [url, setUrl] = useState("")
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [rotacion, setRotacion] = useState(0)

  const cargar = () => {
    if (!url.trim()) return
    setImgSrc(url.trim())
    setZoom(1)
    setRotacion(0)
  }

  const subirArchivo = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImgSrc(String(reader.result))
      setZoom(1)
      setRotacion(0)
    }
    reader.readAsDataURL(file)
  }

  return (
    <section className="space-y-4" aria-label="Visor de recursos visuales">
      <TituloSeccion titulo="Visor de Recursos Visuales" sub="Carga imágenes por URL o archivo e inspecciónalas." />
      <Card className="p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Input
            className="min-w-[200px] flex-1"
            placeholder="Pega URL de imagen..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && cargar()}
          />
          <Button variant="outline" onClick={cargar}>Cargar</Button>
          <label
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-transparent px-4 text-sm font-medium transition-colors hover:bg-gray-100"
          >
            Subir
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => subirArchivo(e.target.files?.[0])}
            />
          </label>
        </div>

        {/* Escenario del visor */}
        <div className="mt-4 flex min-h-[260px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt="Recurso visual"
              className="max-h-[320px] max-w-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom}) rotate(${rotacion}deg)` }}
            />
          ) : (
            <p className="text-sm text-gray-400">La imagen aparecerá aquí</p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.min(4, z + 0.2))}>
            <ZoomIn className="size-4" /> Acercar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.max(0.2, z - 0.2))}>
            <ZoomOut className="size-4" /> Alejar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setRotacion((r) => r + 90)}>
            <RotateCw className="size-4" /> Rotar
          </Button>
          {imgSrc && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50"
              onClick={() => {
                setImgSrc(null)
                setUrl("")
                setZoom(1)
                setRotacion(0)
              }}
            >
              <Trash2 className="size-4" /> Quitar imagen
            </Button>
          )}
        </div>
      </Card>
    </section>
  )
}
