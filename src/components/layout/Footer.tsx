import { CalendarDays, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

function BrandIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d={d} />
    </svg>
  )
}

const X_PATH =
  "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
const INSTAGRAM_PATH =
  "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
const FACEBOOK_PATH =
  "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z"

const columns = [
  {
    title: "Explora",
    links: ["Eventos populares", "Categorías", "Próximos eventos", "Ciudades"],
  },
  {
    title: "Ayuda",
    links: ["Centro de ayuda", "Guía de inicio", "Preguntas frecuentes", "Soporte"],
  },
  {
    title: "Contacto",
    links: ["hola@mievento.com", "+34 900 123 456", "Prensa", "Trabaja con nosotros"],
  },
]

const socials = [
  { label: "X (Twitter)", path: X_PATH },
  { label: "Instagram", path: INSTAGRAM_PATH },
  { label: "Facebook", path: FACEBOOK_PATH },
  { label: "LinkedIn", path: LINKEDIN_PATH },
]

export function Footer() {
  return (
    <footer className="bg-[#2E1065] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-white text-[#2563eb]">
                <CalendarDays className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">MiEvento</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-violet-200/90">
              Planifica, organiza y disfruta tus eventos sin esfuerzo. Todo lo
              que necesitas en un solo lugar.
            </p>
            <form
              className="flex w-full max-w-sm items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                required
                placeholder="Tu correo electrónico"
                aria-label="Correo electrónico"
                className="border-white/20 bg-white/10 text-white placeholder:text-violet-300 focus-visible:border-violet-300 focus-visible:ring-violet-400/50"
              />
              <Button
                type="submit"
                variant="secondary"
                className="shrink-0 bg-white text-[#2563eb] hover:bg-violet-100"
              >
                <Send /> Suscribirme
              </Button>
            </form>
            <div className="flex items-center gap-2.5 pt-1">
              {socials.map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  onClick={(e) => e.preventDefault()}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-violet-100 transition-colors hover:bg-white hover:text-[#2563eb]"
                >
                  <BrandIcon d={path} />
                </a>
              ))}
            </div>
          </div>

          {}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-300">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-sm text-violet-100/85 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="my-8 bg-white/15" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-violet-200/80">
            © {new Date().getFullYear()} MiEvento. Todos los derechos reservados.
          </p>
          <div className="flex gap-5 text-xs text-violet-200/80">
            <a href="#" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-white">
              Privacidad
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-white">
              Términos
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
