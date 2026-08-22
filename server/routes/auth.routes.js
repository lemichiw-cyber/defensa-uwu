import { Router } from "express"
import { z } from "zod"
import { db } from "../db.js"
import {
  hashPassword,
  verifyPassword,
  signToken,
  requireAuth,
  zodMessage,
} from "../helpers.js"

const router = Router()

const registerSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
})

function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email }
}

/* POST /api/auth/register */
router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: zodMessage(parsed) })
  }
  const { name, email, password } = parsed.data

  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email)
  if (exists) {
    return res.status(409).json({ error: "Ese correo ya está registrado." })
  }

  const result = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run(name, email.toLowerCase(), hashPassword(password))

  const user = db
    .prepare("SELECT id, name, email FROM users WHERE id = ?")
    .get(result.lastInsertRowid)

  const token = await signToken({ sub: String(user.id) })
  res.status(201).json({ token, user: publicUser(user) })
})

/* POST /api/auth/login */
router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: zodMessage(parsed) })
  }
  const { email, password } = parsed.data

  const user = db
    .prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?")
    .get(email.toLowerCase())

  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: "Credenciales incorrectas." })
  }

  const token = await signToken({ sub: String(user.id) })
  res.json({ token, user: publicUser(user) })
})

/* GET /api/auth/me */
router.get("/me", requireAuth, (req, res) => {
  const user = db
    .prepare("SELECT id, name, email FROM users WHERE id = ?")
    .get(req.userId)
  if (!user) return res.status(404).json({ error: "Usuario no encontrado." })
  res.json({ user: publicUser(user) })
})

export default router
