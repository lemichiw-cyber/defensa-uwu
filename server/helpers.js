import crypto from "node:crypto"
import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "mievento-dev-secret-cambia-en-produccion"
)
const TOKEN_EXPIRY = "7d"

/* ---------- Contraseñas (scrypt, sin dependencias nativas) ---------- */

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  const candidate = crypto.scryptSync(password, salt, 64)
  const expected = Buffer.from(hash, "hex")
  return (
    candidate.length === expected.length &&
    crypto.timingSafeEqual(candidate, expected)
  )
}

/* ---------- JWT (jose) ---------- */

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

/* ---------- Middleware de autenticación ---------- */

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: "No autenticado. Falta el token." })
  }
  const payload = await verifyToken(token)
  if (!payload?.sub) {
    return res.status(401).json({ error: "Token inválido o expirado." })
  }
  req.userId = Number(payload.sub)
  next()
}

/* ---------- Utilidades ---------- */

/** Devuelve la fila del evento solo si pertenece al usuario; si no, null. */
export function findOwnedEvent(db, userId, eventId) {
  return db
    .prepare(
      `SELECT id,
              user_id     AS userId,
              title,
              description,
              date,
              time,
              location,
              image_url   AS image,
              status
         FROM events
        WHERE id = ? AND user_id = ?`
    )
    .get(eventId, userId)
}

export function zodMessage(result) {
  const issue = result.error.issues[0]
  const field = issue.path.join(".")
  return field ? `${field}: ${issue.message}` : issue.message
}

/** Extrae un parámetro numérico de ruta; responde 400 si no es válido. */
