import { Router } from "express"
import { z } from "zod"
import { db } from "../db.js"
import { requireAuth, findOwnedEvent, zodMessage } from "../helpers.js"

const router = Router()
router.use(requireAuth)

const STATUS_VALUES = ["proximo", "finalizado", "cancelado"]

const createEventSchema = z.object({
  title: z.string().trim().min(2, "El título es obligatorio"),
  description: z.string().trim().optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (AAAA-MM-DD)"),
  time: z.string().min(1, "La hora es obligatoria"),
  location: z.string().trim().min(2, "El lugar es obligatorio"),
  image: z.string().url("URL de imagen inválida").optional().default(""),
  status: z.enum(STATUS_VALUES).optional().default("proximo"),
})

const updateEventSchema = createEventSchema.partial()

/* GET /api/events?status=&q= */
router.get("/", (req, res) => {
  const { status, q, limit } = req.query
  const where = ["user_id = @userId"]
  const params = { userId: req.userId }

  if (status && STATUS_VALUES.includes(String(status))) {
    where.push("status = @status")
    params.status = String(status)
  }
  if (q && String(q).trim()) {
    where.push("(title LIKE @q OR location LIKE @q)")
    params.q = `%${String(q).trim()}%`
  }

  let sql = `
    SELECT id,
           user_id     AS userId,
           title,
           description,
           date,
           time,
           location,
           image_url   AS image,
           status,
           created_at  AS createdAt
      FROM events
     WHERE ${where.join(" AND ")}
     ORDER BY CASE status WHEN 'proximo' THEN 0 ELSE 1 END ASC,
              date ASC,
              time ASC`
  if (limit && Number.isInteger(Number(limit))) {
    sql += ` LIMIT ${Number(limit)}`
  }

  res.json({ events: db.prepare(sql).all(params) })
})

/* GET /api/events/:id */
router.get("/:id", (req, res) => {
  const event = findOwnedEvent(db, req.userId, Number(req.params.id))
  if (!event) return res.status(404).json({ error: "Evento no encontrado." })
  res.json({ event })
})

/* POST /api/events */
router.post("/", (req, res) => {
  const parsed = createEventSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: zodMessage(parsed) })
  }
  const { title, description, date, time, location, image, status } = parsed.data

  const result = db
    .prepare(
      `INSERT INTO events (user_id, title, description, date, time, location, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(req.userId, title, description, date, time, location, image, status)

  const event = findOwnedEvent(db, req.userId, Number(result.lastInsertRowid))
  res.status(201).json({ event })
})

/* PATCH /api/events/:id */
router.patch("/:id", (req, res) => {
  const existing = findOwnedEvent(db, req.userId, Number(req.params.id))
  if (!existing) return res.status(404).json({ error: "Evento no encontrado." })

  const parsed = updateEventSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: zodMessage(parsed) })
  }

  const data = parsed.data
  const fields = []
  const values = []
  const columnMap = {
    title: "title",
    description: "description",
    date: "date",
    time: "time",
    location: "location",
    image: "image_url",
    status: "status",
  }
  for (const [key, column] of Object.entries(columnMap)) {
    if (data[key] !== undefined) {
      fields.push(`${column} = ?`)
      values.push(data[key])
    }
  }
  if (fields.length === 0) {
    return res.json({ event: existing })
  }

  fields.push("updated_at = datetime('now')")
  values.push(existing.id)

  db.prepare(`UPDATE events SET ${fields.join(", ")} WHERE id = ?`).run(...values)
  const event = findOwnedEvent(db, req.userId, existing.id)
  res.json({ event })
})

/* DELETE /api/events/:id */
router.delete("/:id", (req, res) => {
  const existing = findOwnedEvent(db, req.userId, Number(req.params.id))
  if (!existing) return res.status(404).json({ error: "Evento no encontrado." })
  db.prepare("DELETE FROM events WHERE id = ?").run(existing.id)
  res.status(204).end()
})

/* GET /api/stats — totales para el dashboard */
export function mountStats(app) {
  app.get("/api/stats", requireAuth, (req, res) => {
    const userId = req.userId
    const events =
      db.prepare("SELECT COUNT(*) AS n FROM events WHERE user_id = ?").get(userId).n
    const guests = db
      .prepare(
        `SELECT COUNT(*) AS n
           FROM guests g JOIN events e ON e.id = g.event_id
          WHERE e.user_id = ?`
      )
      .get(userId).n
    const reminders = db
      .prepare(
        `SELECT COUNT(*) AS n
           FROM reminders r JOIN events e ON e.id = r.event_id
          WHERE e.user_id = ? AND r.sent = 0`
      )
      .get(userId).n

    res.json({ events, guests, reminders })
  })
}

export default router
