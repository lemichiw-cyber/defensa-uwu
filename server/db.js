import { DatabaseSync } from "node:sqlite"
import path from "node:path"
import { scryptSync, randomBytes } from "node:crypto"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const db = new DatabaseSync(path.resolve(__dirname, "data.sqlite"))

db.exec("PRAGMA foreign_keys = ON;")

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    email         TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    role          TEXT    NOT NULL DEFAULT 'usuario'
                  CHECK (role IN ('usuario','admin')),
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    date        TEXT    NOT NULL,
    time        TEXT    NOT NULL,
    location    TEXT    NOT NULL,
    image_url   TEXT    NOT NULL DEFAULT '',
    status      TEXT    NOT NULL DEFAULT 'proximo'
                CHECK (status IN ('proximo','finalizado','cancelado')),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS guests (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id   INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL,
    rsvp       TEXT    NOT NULL DEFAULT 'pendiente'
               CHECK (rsvp IN ('pendiente','confirmado','rechazado')),
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE (event_id, email)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id   INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title      TEXT    NOT NULL,
    done       INTEGER NOT NULL DEFAULT 0,
    due_date   TEXT,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reminders (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id   INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    message    TEXT    NOT NULL,
    remind_at  TEXT    NOT NULL,
    sent       INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_events_user ON events(user_id);
  CREATE INDEX IF NOT EXISTS idx_guests_event ON guests(event_id);
  CREATE INDEX IF NOT EXISTS idx_tasks_event ON tasks(event_id);
  CREATE INDEX IF NOT EXISTS idx_reminders_event ON reminders(event_id);
`)

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

/* Migración: añade la columna role a bases de datos existentes */
try {
  db.prepare("SELECT role FROM users LIMIT 1").get()
} catch {
  db.exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'usuario';")
}

function seedIfEmpty() {
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM users").get()
  if (n > 0) return

  const insertUser = db.prepare(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)"
  )
  /* ADMIN — acceso total a funciones de administración */
  insertUser.run(
    "María García",
    "maria@mievento.com",
    hashPassword("demo1234"),
    "admin"
  )
  /* USUARIO COMÚN — sin funciones de administrador */
  const infoUsuario = insertUser.run(
    "Carlos López",
    "carlos@mievento.com",
    hashPassword("demo1234"),
    "usuario"
  )
  const userId = Number(infoUsuario.lastInsertRowid)

  const insertEvent = db.prepare(`
    INSERT INTO events (user_id, title, description, date, time, location, image_url, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const upcoming = [
    [
      "Concierto de Verano",
      "Noche de música en vivo con artistas invitados.",
      "2024-05-24",
      "7:00 PM",
      "Auditorio Nacional",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=640&auto=format&fit=crop",
    ],
    [
      "Conferencia de Tecnología",
      "Charlas sobre IA, desarrollo web y producto.",
      "2024-06-10",
      "9:00 AM",
      "Centro de Convenciones",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=640&auto=format&fit=crop",
    ],
    [
      "Cumpleaños de Ana",
      "Celebración sorpresa con pastel y piñata.",
      "2024-06-18",
      "4:00 PM",
      "Casa de Ana",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=640&auto=format&fit=crop",
    ],
  ]

  const finished = [
    [
      "Gala Benéfica",
      "Cena de recaudación para fundaciones locales.",
      "2024-05-02",
      "8:00 PM",
      "Hotel Central",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=640&auto=format&fit=crop",
    ],
    [
      "Taller de Fotografía",
      "Taller práctico de retrato con luz natural.",
      "2024-04-28",
      "10:00 AM",
      "Estudio Lumière",
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=640&auto=format&fit=crop",
    ],
    [
      "Reunión de Equipo",
      "Revisión trimestral y planificación.",
      "2024-04-20",
      "5:00 PM",
      "Oficina Principal",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=640&auto=format&fit=crop",
    ],
  ]

  const eventIds = []
  for (const [title, desc, date, time, location, image] of upcoming) {
    const r = insertEvent.run(userId, title, desc, date, time, location, image, "proximo")
    eventIds.push(Number(r.lastInsertRowid))
  }
  for (const [title, desc, date, time, location, image] of finished) {
    insertEvent.run(userId, title, desc, date, time, location, image, "finalizado")
  }

  const firstEventId = eventIds[0]
  const insertGuest = db.prepare(
    "INSERT INTO guests (event_id, name, email, rsvp) VALUES (?, ?, ?, ?)"
  )
  insertGuest.run(firstEventId, "Carlos López", "carlos@example.com", "confirmado")
  insertGuest.run(firstEventId, "Lucía Fernández", "lucia@example.com", "pendiente")
  insertGuest.run(firstEventId, "Pedro Sánchez", "pedro@example.com", "rechazado")

  const insertTask = db.prepare(
    "INSERT INTO tasks (event_id, title, done, due_date) VALUES (?, ?, ?, ?)"
  )
  insertTask.run(firstEventId, "Contratar equipo de sonido", 1, "2024-05-10")
  insertTask.run(firstEventId, "Confirmar catering", 0, "2024-05-15")

  db.prepare(
    "INSERT INTO reminders (event_id, message, remind_at) VALUES (?, ?, ?)"
  ).run(firstEventId, "Enviar recordatorio a los invitados", "2024-05-23 10:00")

  console.log("[db] Datos de demostración creados (maria@mievento.com / demo1234)")
}

seedIfEmpty()
