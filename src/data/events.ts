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

export const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=640&auto=format&fit=crop`

export function formatShortDate(iso: string): string {
  const [, m, d] = iso.split('-').map(Number)
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${d} ${meses[(m || 1) - 1]}`
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  return `${d} de ${meses[(m || 1) - 1]} de ${y}`
}
