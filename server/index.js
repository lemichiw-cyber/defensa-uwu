import express from "express"
import cors from "cors"
import "./db.js"
import authRoutes from "./routes/auth.routes.js"
import eventRoutes, { mountStats } from "./routes/event.routes.js"
import guestRoutes from "./routes/guest.routes.js"
import taskRoutes from "./routes/task.routes.js"
import reminderRoutes from "./routes/reminder.routes.js"

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "MiEvento API", time: new Date().toISOString() })
})

mountStats(app)
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/events/:eventId/guests", guestRoutes)
app.use("/api/events/:eventId/tasks", taskRoutes)
app.use("/api/events/:eventId/reminders", reminderRoutes)

/* 404 para rutas de API desconocidas */
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." })
})

/* Manejador global de errores */
app.use((err, _req, res, _next) => {
  console.error("[error]", err)
  res.status(500).json({ error: "Error interno del servidor." })
})

app.listen(PORT, () => {
  console.log(`[MiEvento API] escuchando en http://localhost:${PORT}`)
})
