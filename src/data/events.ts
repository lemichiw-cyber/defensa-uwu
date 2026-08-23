export interface EventItem {
  id: number
  title: string
  description?: string
  date: string
  time: string
  location: string
  image: string
  status: "proximo" | "finalizado" | "cancelado"
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=640&auto=format&fit=crop`

export const initialEvents: EventItem[] = [
  {
    id: 1,
    title: "Concierto de Verano",
    date: "2024-05-24",
    time: "7:00 PM",
    location: "Auditorio Nacional",
    image: unsplash("photo-1470229722913-7c0e2dbbafd3"),
    status: "proximo",
  },
  {
    id: 2,
    title: "Conferencia de Tecnología",
    date: "2024-06-10",
    time: "9:00 AM",
    location: "Centro de Convenciones",
    image: unsplash("photo-1540575467063-178a50c2df87"),
    status: "proximo",
  },
  {
    id: 3,
    title: "Cumpleaños de Ana",
    date: "2024-06-18",
    time: "4:00 PM",
    location: "Casa de Ana",
    image: unsplash("photo-1530103862676-de8c9debad1d"),
    status: "proximo",
  },
]

export const recentEvents: EventItem[] = [
  {
    id: 101,
    title: "Gala Benéfica",
    date: "2024-05-02",
    time: "8:00 PM",
    location: "Hotel Central",
    image: unsplash("photo-1492684223066-81342ee5ff30"),
    status: "finalizado",
  },
  {
    id: 102,
    title: "Taller de Fotografía",
    date: "2024-04-28",
    time: "10:00 AM",
    location: "Estudio Lumière",
    image: unsplash("photo-1452587925148-ce544e77e70d"),
    status: "finalizado",
  },
  {
    id: 103,
    title: "Reunión de Equipo",
    date: "2024-04-20",
    time: "5:00 PM",
    location: "Oficina Principal",
    image: unsplash("photo-1517245386807-bb43f82c33c4"),
    status: "finalizado",
  },
]

export interface PopularEvent {
  id: number
  title: string
  category: "Música" | "Educativo" | "Celebración" | "Escolar"
  date: string
  day: string
  month: string
  time: string
  location: string
  image: string
}

export const popularEvents: PopularEvent[] = [
  {
    id: 201,
    title: "Festival de Música Independiente",
    category: "Música",
    date: "Sábado, 15 de junio",
    day: "15",
    month: "Jun",
    time: "6:00 PM",
    location: "Parque Metropolitano",
    image: unsplash("photo-1501281668745-f7f57925c3b4"),
  },
  {
    id: 202,
    title: "Tech Summit 2024",
    category: "Educativo",
    date: "Miércoles, 26 de junio",
    day: "26",
    month: "Jun",
    time: "9:00 AM",
    location: "Centro de Convenciones",
    image: unsplash("photo-1505373877841-8d25f7d46678"),
  },
  {
    id: 203,
    title: "Fiesta de Aniversario",
    category: "Celebración",
    date: "Viernes, 21 de junio",
    day: "21",
    month: "Jun",
    time: "8:00 PM",
    location: "Salón Dorado",
    image: unsplash("photo-1492684223066-81342ee5ff30"),
  },
  {
    id: 204,
    title: "Feria Escolar de Ciencias",
    category: "Escolar",
    date: "Jueves, 27 de junio",
    day: "27",
    month: "Jun",
    time: "11:00 AM",
    location: "Colegio San Marcos",
    image: unsplash("photo-1523050854058-8df90110c9f1"),
  },
]

const meses = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
]

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return `${d} de ${meses[m - 1]} de ${y}`
}

export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return `${d} ${meses[m - 1]} ${y}`
}

export const DEMO_TODAY = { year: 2024, month: 4, day: 15 }

export const EVENT_DATES = new Set([
  "2024-05-24",
  "2024-06-10",
  "2024-06-18",
])
