import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { EventItem } from "@/lib/api"

export interface FormData {
  title: string
  description?: string
  date: string
  time: string
  location: string
  image: string
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=640&auto=format&fit=crop"

/** "19:30" -> "7:30 PM" */
function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

const empty = { title: "", description: "", date: "", time: "", location: "", image: "" }

interface NewEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: EventItem | null
  onSave: (data: FormData) => void
}

const EventForm = ({
  editing,
  onCancel,
  onSubmit,
}: {
  editing: EventItem | null
  onCancel: () => void
  onSubmit: (data: FormData) => void
}) => {
  const [form, setForm] = useState(() =>
    editing
      ? {
          title: editing.title,
          description: editing.description ?? "",
          date: editing.date,
          time: editing.time,
          location: editing.location,
          image: editing.image,
        }
      : empty
  )

  const set =
    (key: keyof typeof empty) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    /* El toast de éxito se muestra desde App.handleSave tras confirmar la API */
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      date: form.date,
      time: /^\d{2}:\d{2}$/.test(form.time) ? formatTime(form.time) : form.time,
      location: form.location.trim(),
      image: form.image.trim() || FALLBACK_IMAGE,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="ev-title">Nombre del evento *</Label>
        <Input
          id="ev-title"
          required
          autoFocus
          placeholder="Ej. Concierto de Verano"
          value={form.title}
          onChange={set("title")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ev-desc">Descripción</Label>
        <Textarea
          id="ev-desc"
          rows={3}
          placeholder="Cuéntanos de qué trata tu evento…"
          value={form.description}
          onChange={set("description")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="ev-date">Fecha *</Label>
          <Input id="ev-date" type="date" required value={form.date} onChange={set("date")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ev-time">Hora *</Label>
          <Input id="ev-time" type="time" required value={form.time} onChange={set("time")} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ev-location">Lugar *</Label>
        <Input
          id="ev-location"
          required
          placeholder="Ej. Auditorio Nacional"
          value={form.location}
          onChange={set("location")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ev-image">Imagen (URL)</Label>
        <Input
          id="ev-image"
          type="url"
          placeholder="https://… (opcional)"
          value={form.image}
          onChange={set("image")}
        />
      </div>

      <DialogFooter className="mt-2 gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{editing ? "Guardar cambios" : "Crear evento"}</Button>
      </DialogFooter>
    </form>
  )
}

interface NewEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: EventItem | null
  onSave: (data: FormData) => void
}

export function NewEventDialog({ open, onOpenChange, editing, onSave }: NewEventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar evento" : "Crear nuevo evento"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Modifica los datos del evento y guarda los cambios."
              : "Completa la información para crear tu evento."}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <EventForm
            key={editing?.id ?? "nuevo"}
            editing={editing}
            onCancel={() => onOpenChange(false)}
            onSubmit={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
