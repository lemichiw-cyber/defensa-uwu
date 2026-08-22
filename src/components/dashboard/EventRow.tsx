import { CalendarDays, Clock, MapPin, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate, type EventItem } from "@/data/events"

interface EventRowProps {
  event: EventItem
  onEdit: (event: EventItem) => void
  onDelete: (id: number) => void
}

export function EventRow({ event, onEdit, onDelete }: EventRowProps) {
  return (
    <Card className="group flex items-center gap-4 p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-4">
      <img
        src={event.image}
        alt={event.title}
        loading="lazy"
        className="size-20 shrink-0 rounded-xl object-cover sm:size-24"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold text-gray-900">{event.title}</h3>
          <Badge className="rounded-full border-transparent bg-violet-100 text-violet-700 hover:bg-violet-100">
            Próximo
          </Badge>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4 text-gray-400" />
            {formatDate(event.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-gray-400" />
            {event.time}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin className="size-4 shrink-0 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-gray-400 hover:text-gray-700"
            aria-label={`Opciones de ${event.title}`}
          >
            <MoreVertical className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => onEdit(event)}>
            <Pencil /> Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(event.id)}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  )
}
