import { Router } from "express"
import { z } from "zod"
import { db } from "../db.js"
import { requireAuth, findOwnedEvent, zodMessage } from "../helpers.js"

const router = Router({ mergeParams: true })
router.use(requireAuth)

const createSchema = z.object({
  message: z.string().trim().min(2, "El mensaje es obligatorio"),
  remindAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2})?$/, "Fecha/hora inválida (AAAA-MM-DD HH:MM)"),
})

function loadEventOr404(req, res) {
  const event = findOwnedEvent(db, req.userId, Number(req.params.eventId))
  if (!event) {
    res.status(404).json({ error: "Evento no encontrado." })
    return null
  }
  return event
}

const SELECT = `SELECT id, event_id AS eventId, message, remind_at AS remindAt, sent
                  FROM reminders WHERE event_id = ?`

router.get("/", (req, res) => {
  if (!loadEventOr404(req, res)) return
  res.json({ reminders: db.prepare(`${SELECT} ORDER BY remind_at ASC`).all(Number(req.params.eventId)) })
})

router.post("/", (req, res) => {
  if (!loadEventOr404(req, res)) return
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) })
  const { message, remindAt } = parsed.data

  const result = db
    .prepare("INSERT INTO reminders (event_id, message, remind_at) VALUES (?, ?, ?)")
    .run(Number(req.params.eventId), message, remindAt.replace("T", " "))

  res.status(201).json({
    reminder: db
      .prepare(`${SELECT} AND id = ?`)
      .get(Number(req.params.eventId), result.lastInsertRowid),
  })
})

router.delete("/:reminderId", (req, res) => {
  if (!loadEventOr404(req, res)) return
  const result = db
    .prepare("DELETE FROM reminders WHERE id = ? AND event_id = ?")
    .run(Number(req.params.reminderId), Number(req.params.eventId))
  if (result.changes === 0) {
    return res.status(404).json({ error: "Recordatorio no encontrado." })
  }
  res.status(204).end()
})

export default router
