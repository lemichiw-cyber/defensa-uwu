import { Router } from "express"
import { z } from "zod"
import { db } from "../db.js"
import { requireAuth, findOwnedEvent, zodMessage } from "../helpers.js"

const router = Router({ mergeParams: true })
router.use(requireAuth)

const createSchema = z.object({
  title: z.string().trim().min(2, "La tarea debe tener un título"),
  done: z.boolean().optional().default(false),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha límite inválida")
    .optional()
    .nullable(),
})

const updateSchema = z.object({
  title: z.string().trim().min(2).optional(),
  done: z.boolean().optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
})

function loadEventOr404(req, res) {
  const event = findOwnedEvent(db, req.userId, Number(req.params.eventId))
  if (!event) {
    res.status(404).json({ error: "Evento no encontrado." })
    return null
  }
  return event
}

const SELECT = `SELECT id, event_id AS eventId, title, done, due_date AS dueDate
                  FROM tasks WHERE event_id = ?`

/* GET /api/events/:eventId/tasks */
router.get("/", (req, res) => {
  if (!loadEventOr404(req, res)) return
  res.json({ tasks: db.prepare(`${SELECT} ORDER BY done ASC, id ASC`).all(Number(req.params.eventId)) })
})

/* POST /api/events/:eventId/tasks */
router.post("/", (req, res) => {
  if (!loadEventOr404(req, res)) return
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) })
  const { title, done, dueDate } = parsed.data

  const result = db
    .prepare("INSERT INTO tasks (event_id, title, done, due_date) VALUES (?, ?, ?, ?)")
    .run(Number(req.params.eventId), title, done ? 1 : 0, dueDate ?? null)

  res.status(201).json({
    task: db.prepare(`${SELECT} AND id = ?`).get(Number(req.params.eventId), result.lastInsertRowid),
  })
})

/* PATCH /api/events/:eventId/tasks/:taskId */
router.patch("/:taskId", (req, res) => {
  if (!loadEventOr404(req, res)) return
  const parsed = updateSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) })

  const taskId = Number(req.params.taskId)
  const eventId = Number(req.params.eventId)

  const data = parsed.data
  db.prepare(
    `UPDATE tasks SET
       title    = COALESCE(?, title),
       done     = COALESCE(?, done),
       due_date = COALESCE(?, due_date)
     WHERE id = ? AND event_id = ?`
  ).run(
    data.title ?? null,
    data.done === undefined ? null : data.done ? 1 : 0,
    data.dueDate === undefined ? null : data.dueDate,
    taskId,
    eventId
  )

  const task = db.prepare(`${SELECT} AND id = ?`).get(eventId, taskId)
  if (!task) return res.status(404).json({ error: "Tarea no encontrada." })
  res.json({ task })
})

/* DELETE /api/events/:eventId/tasks/:taskId */
router.delete("/:taskId", (req, res) => {
  if (!loadEventOr404(req, res)) return
  const result = db
    .prepare("DELETE FROM tasks WHERE id = ? AND event_id = ?")
    .run(Number(req.params.taskId), Number(req.params.eventId))
  if (result.changes === 0) {
    return res.status(404).json({ error: "Tarea no encontrada." })
  }
  res.status(204).end()
})

export default router
