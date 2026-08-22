import { Router } from "express"
import { db } from "../db.js"
import { requireAuth, requireAdmin } from "../helpers.js"

const router = Router()

/* Todo /api/admin requiere autenticación + rol admin — capa 1 del backend */
router.use(requireAuth, requireAdmin)

/* GET /api/admin/users — lista de cuentas registradas */
router.get("/users", (_req, res) => {
  const users = db
    .prepare("SELECT id, name, email, role, created_at FROM users ORDER BY id")
    .all()
  res.json({ users })
})

/* PATCH /api/admin/users/:id/role — cambiar rol */
router.patch("/users/:id/role", (req, res) => {
  const { role } = req.body ?? {}
  if (!["usuario", "admin"].includes(role)) {
    return res.status(400).json({ error: "Rol inválido." })
  }
  const id = Number(req.params.id)
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(id)
  if (!user) return res.status(404).json({ error: "Usuario no encontrado." })

  /* Un admin no puede quitarse su propio rol admin */
  if (id === req.userId && role !== "admin") {
    return res.status(400).json({ error: "No puedes quitarte tu propio rol admin." })
  }

  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id)
  res.json({ ok: true })
})

/* GET /api/admin/overview — resumen global del sistema */
router.get("/overview", (_req, res) => {
  const overview = {
    users: db.prepare("SELECT COUNT(*) AS n FROM users").get().n,
    events: db.prepare("SELECT COUNT(*) AS n FROM events").get().n,
    guests: db.prepare("SELECT COUNT(*) AS n FROM guests").get().n,
    tasks: db.prepare("SELECT COUNT(*) AS n FROM tasks").get().n,
    reminders: db.prepare("SELECT COUNT(*) AS n FROM reminders").get().n,
  }
  res.json({ overview })
})

export default router
