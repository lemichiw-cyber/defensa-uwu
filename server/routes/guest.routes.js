import { Router } from "express"
import { z } from "zod"
import { db } from "../db.js"
import { requireAuth, findOwnedEvent, zodMessage } from "../helpers.js"

const router = Router({ mergeParams: true })
router.use(requireAuth)

const RSVP_VALUES = ["pendiente", "confirmado", "rechazado"]

const createSchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  rsvp: z.enum(RSVP_VALUES).optional().default("pendiente"),
})

const updateSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().email().optional(),
  rsvp: z.enum(RSVP_VALUES).optional(),
})

function loadEventOr404(req, res) {
  const event = findOwnedEvent(db, req.userId, Number(req.params.eventId))
  if (!event) {
    res.status(404).json({ error: "Evento no encontrado." })
    return null
  }
  return event
}

router.get("/", (req, res) => {
  if (!loadEventOr404(req, res)) return
  const guests = db
    .prepare(
      `SELECT id, event_id AS eventId, name, email, rsvp
         FROM guests WHERE event_id = ? ORDER BY created_at ASC`
    )
    .all(Number(req.params.eventId))
  res.json({ guests })
})

router.post("/", (req, res) => {
  if (!loadEventOr404(req, res)) return
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) })

  const { name, email, rsvp } = parsed.data
  const eventId = Number(req.params.eventId)

  try {
    const result = db
      .prepare("INSERT INTO guests (event_id, name, email, rsvp) VALUES (?, ?, ?, ?)")
      .run(eventId, name, email.toLowerCase(), rsvp)
    const guest = db
      .prepare("SELECT id, event_id AS eventId, name, email, rsvp FROM guests WHERE id = ?")
      .get(result.lastInsertRowid)
    res.status(201).json({ guest })
  } catch (err) {
    if (String(err?.message).includes("UNIQUE")) {
      return res
        .status(409)
        .json({ error: "Ese correo ya está en la lista de invitados." })
    }
    throw err
  }
})

router.patch("/:guestId", (req, res) => {
  if (!loadEventOr404(req, res)) return
  const parsed = updateSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) })

  const guestId = Number(req.params.guestId)
  const existing = db
    .prepare("SELECT id FROM guests WHERE id = ? AND event_id = ?")
    .get(guestId, Number(req.params.eventId))
  if (!existing) return res.status(404).json({ error: "Invitado no encontrado." })

  const data = parsed.data
  db.prepare(
    `UPDATE guests SET
       name  = COALESCE(?, name),
       email = COALESCE(?, email),
       rsvp  = COALESCE(?, rsvp)
     WHERE id = ?`
  ).run(data.name ?? null, data.email ?? null, data.rsvp ?? null, guestId)

  const guest = db
    .prepare("SELECT id, event_id AS eventId, name, email, rsvp FROM guests WHERE id = ?")
    .get(guestId)
  res.json({ guest })
})

router.delete("/:guestId", (req, res) => {
  if (!loadEventOr404(req, res)) return
  const result = db
    .prepare("DELETE FROM guests WHERE id = ? AND event_id = ?")
    .run(Number(req.params.guestId), Number(req.params.eventId))
  if (result.changes === 0) {
    return res.status(404).json({ error: "Invitado no encontrado." })
  }
  res.status(204).end()
})

export default router
