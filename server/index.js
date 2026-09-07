import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import crypto from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import WebSocket from "ws";

globalThis.WebSocket = WebSocket;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ?? 3001;

// ── Encriptación AES-256-GCM ─────────────────────────────
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "mievento-dev-key-change-in-production-32bytes!";
const KEY_BUFFER = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);

function encrypt(plainText) {
  if (!plainText) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY_BUFFER, iv);
  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, Buffer.from(encrypted, "base64")]);
}

function decrypt(encryptedBuffer) {
  if (!encryptedBuffer) return null;
  try {
    const data = Buffer.isBuffer(encryptedBuffer) ? encryptedBuffer : Buffer.from(encryptedBuffer, "base64");
    const iv = data.slice(0, 12);
    const tag = data.slice(12, 28);
    const encrypted = data.slice(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY_BUFFER, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString("utf8");
  } catch {
    return null;
  }
}

function hashEmail(email) {
  return crypto.createHash("sha256").update(email.toLowerCase()).digest("hex");
}

// ── Supabase ──────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL ?? "http://localhost:54321",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "service-role-key"
);

// ── JWT ───────────────────────────────────────────────────
function resolverJwtSecret() {
  const secreto = process.env.JWT_SECRET;
  if (secreto) return new TextEncoder().encode(secreto);
  if (process.env.NODE_ENV === "production") {
    console.error("FATAL: JWT_SECRET es obligatoria en producción.");
    process.exit(1);
  }
  return new TextEncoder().encode("mievento-dev-secret-solo-desarrollo");
}
const JWT_SECRET = resolverJwtSecret();
const TOKEN_EXPIRY = "7d";

async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// ── Password hashing ─────────────────────────────────────
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    candidate.length === expected.length &&
    crypto.timingSafeEqual(candidate, expected)
  );
}

// ── Middleware ─────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: "*" }));
app.use(express.json());

const limiterAuth = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const limiterApi = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false });

app.use("/api/auth", limiterAuth);
app.use(limiterApi);

async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No autenticado." });
  const payload = await verifyToken(token);
  if (!payload?.sub) return res.status(401).json({ error: "Token inválido." });
  req.userId = payload.sub;
  next();
}

async function requireAdmin(req, res, next) {
  const { data: user } = await supabase.from("users").select("role").eq("id", req.userId).single();
  if (!user || user.role !== "admin") return res.status(403).json({ error: "Acceso denegado." });
  next();
}

function zodMessage(result) {
  const issue = result.error.issues[0];
  const field = issue.path.join(".");
  return field ? `${field}: ${issue.message}` : issue.message;
}

// ── Health ────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "MiEvento API", time: new Date().toISOString() });
});

// ── Auth routes ───────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

app.post("/api/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) });
  const { name, email, password } = parsed.data;

  const emailHash = hashEmail(email);
  const { data: existing } = await supabase.from("users").select("id").eq("email_hash", emailHash).single();
  if (existing) return res.status(409).json({ error: "Ese correo ya está registrado." });

  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      name_enc: encrypt(name),
      email_hash: emailHash,
      email_enc: encrypt(email.toLowerCase()),
      password_hash: hashPassword(password),
      role: "usuario"
    })
    .select("id, role, created_at")
    .single();

  if (error) return res.status(500).json({ error: "Error al crear usuario." });

  const token = await signToken({ sub: newUser.id });
  res.status(201).json({ token, user: { id: newUser.id, name, email: email.toLowerCase(), role: newUser.role } });
});

app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) });
  const { email, password } = parsed.data;

  const emailHash = hashEmail(email);
  const { data: user } = await supabase
    .from("users")
    .select("id, name_enc, email_enc, role, password_hash")
    .eq("email_hash", emailHash)
    .single();

  if (!user || !verifyPassword(password, user.password_hash))
    return res.status(401).json({ error: "Credenciales incorrectas." });

  const token = await signToken({ sub: user.id });
  res.json({
    token,
    user: { id: user.id, name: decrypt(user.name_enc), email: decrypt(user.email_enc), role: user.role }
  });
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  const { data: user } = await supabase.from("users").select("id, name_enc, email_enc, role").eq("id", req.userId).single();
  if (!user) return res.status(404).json({ error: "Usuario no encontrado." });
  res.json({ user: { id: user.id, name: decrypt(user.name_enc), email: decrypt(user.email_enc), role: user.role } });
});

// ── Events routes ─────────────────────────────────────────
const createEventSchema = z.object({
  title: z.string().trim().min(2, "El título es obligatorio"),
  description: z.string().trim().optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (AAAA-MM-DD)"),
  time: z.string().min(1, "La hora es obligatoria"),
  location: z.string().trim().min(2, "El lugar es obligatorio"),
  image_url: z.string().optional().default(""),
  status: z.enum(["proximo", "finalizado", "cancelado"]).optional().default("proximo"),
});

const updateEventSchema = createEventSchema.partial();

app.get("/api/events", requireAuth, async (req, res) => {
  const { status, q, limit } = req.query;
  let query = supabase.from("events").select("*").eq("user_id", req.userId).order("date", { ascending: true });
  if (status && typeof status === "string") query = query.eq("status", status);
  if (limit && !isNaN(Number(limit))) query = query.limit(Number(limit));

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: "Error al obtener eventos." });

  const events = data.map(ev => ({
    id: ev.id, userId: ev.user_id, title: decrypt(ev.title_enc), description: decrypt(ev.description_enc),
    date: ev.date, time: ev.time, location: decrypt(ev.location_enc), image: ev.image_url, status: ev.status, createdAt: ev.created_at
  }));

  let filtered = events;
  if (q && typeof q === "string") {
    const search = q.toLowerCase();
    filtered = events.filter(ev => ev.title?.toLowerCase().includes(search) || ev.location?.toLowerCase().includes(search));
  }

  res.json({ events: filtered });
});

app.get("/api/events/:id", requireAuth, async (req, res) => {
  const { data, error } = await supabase.from("events").select("*").eq("id", req.params.id).eq("user_id", req.userId).single();
  if (error || !data) return res.status(404).json({ error: "Evento no encontrado." });
  res.json({ event: { id: data.id, userId: data.user_id, title: decrypt(data.title_enc), description: decrypt(data.description_enc), date: data.date, time: data.time, location: decrypt(data.location_enc), image: data.image_url, status: data.status, createdAt: data.created_at } });
});

app.post("/api/events", requireAuth, async (req, res) => {
  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) });
  const { title, description, date, time, location, image_url, status } = parsed.data;

  const { data, error } = await supabase.from("events").insert({
    title_enc: encrypt(title), description_enc: encrypt(description), date, time, location_enc: encrypt(location), image_url, status, user_id: req.userId
  }).select().single();

  if (error) return res.status(500).json({ error: "Error al crear evento." });
  res.status(201).json({ event: { id: data.id, userId: data.user_id, title, description, date: data.date, time: data.time, location, image: data.image_url, status: data.status, createdAt: data.created_at } });
});

app.patch("/api/events/:id", requireAuth, async (req, res) => {
  const parsed = updateEventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) });

  const updateData = {};
  if (parsed.data.title !== undefined) updateData.title_enc = encrypt(parsed.data.title);
  if (parsed.data.description !== undefined) updateData.description_enc = encrypt(parsed.data.description);
  if (parsed.data.location !== undefined) updateData.location_enc = encrypt(parsed.data.location);
  if (parsed.data.date !== undefined) updateData.date = parsed.data.date;
  if (parsed.data.time !== undefined) updateData.time = parsed.data.time;
  if (parsed.data.image_url !== undefined) updateData.image_url = parsed.data.image_url;
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;

  const { data, error } = await supabase.from("events").update(updateData).eq("id", req.params.id).eq("user_id", req.userId).select().single();
  if (error || !data) return res.status(404).json({ error: "Evento no encontrado." });
  res.json({ event: { id: data.id, userId: data.user_id, title: decrypt(data.title_enc), description: decrypt(data.description_enc), date: data.date, time: data.time, location: decrypt(data.location_enc), image: data.image_url, status: data.status, createdAt: data.created_at } });
});

app.delete("/api/events/:id", requireAuth, async (req, res) => {
  const { error } = await supabase.from("events").delete().eq("id", req.params.id).eq("user_id", req.userId);
  if (error) return res.status(500).json({ error: "Error al eliminar." });
  res.status(204).end();
});

// ── Guests routes ─────────────────────────────────────────
app.get("/api/events/:eventId/guests", requireAuth, async (req, res) => {
  const { data, error } = await supabase.from("guests").select("*").eq("event_id", req.params.eventId);
  if (error) return res.status(500).json({ error: "Error al obtener invitados." });
  res.json({ guests: data.map(g => ({ id: g.id, eventId: g.event_id, name: decrypt(g.name_enc), email: decrypt(g.email_enc), rsvp: g.rsvp, createdAt: g.created_at })) });
});

app.post("/api/events/:eventId/guests", requireAuth, async (req, res) => {
  const schema = z.object({ name: z.string().min(2), email: z.string().email(), rsvp: z.enum(["pendiente", "confirmado", "rechazado"]).optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) });
  const { name, email, rsvp } = parsed.data;

  const { data, error } = await supabase.from("guests").insert({
    name_enc: encrypt(name), email_enc: encrypt(email.toLowerCase()), rsvp: rsvp || "pendiente", event_id: req.params.eventId
  }).select().single();

  if (error) return res.status(500).json({ error: "Error al crear invitado." });
  res.status(201).json({ guest: { id: data.id, eventId: data.event_id, name, email, rsvp: data.rsvp, createdAt: data.created_at } });
});

app.delete("/api/events/:eventId/guests/:guestId", requireAuth, async (req, res) => {
  const { error } = await supabase.from("guests").delete().eq("id", req.params.guestId).eq("event_id", req.params.eventId);
  if (error) return res.status(500).json({ error: "Error al eliminar." });
  res.status(204).end();
});

// ── Tasks routes ──────────────────────────────────────────
app.get("/api/events/:eventId/tasks", requireAuth, async (req, res) => {
  const { data, error } = await supabase.from("tasks").select("*").eq("event_id", req.params.eventId);
  if (error) return res.status(500).json({ error: "Error al obtener tareas." });
  res.json({ tasks: data.map(t => ({ id: t.id, eventId: t.event_id, title: decrypt(t.title_enc), done: t.done, dueDate: t.due_date, createdAt: t.created_at })) });
});

app.post("/api/events/:eventId/tasks", requireAuth, async (req, res) => {
  const schema = z.object({ title: z.string().min(2), done: z.boolean().optional(), due_date: z.string().optional().nullable() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) });
  const { title, done, due_date } = parsed.data;

  const { data, error } = await supabase.from("tasks").insert({
    title_enc: encrypt(title), done: done || false, due_date: due_date || null, event_id: req.params.eventId
  }).select().single();

  if (error) return res.status(500).json({ error: "Error al crear tarea." });
  res.status(201).json({ task: { id: data.id, eventId: data.event_id, title, done: data.done, dueDate: data.due_date, createdAt: data.created_at } });
});

app.patch("/api/events/:eventId/tasks/:taskId", requireAuth, async (req, res) => {
  const schema = z.object({ title: z.string().optional(), done: z.boolean().optional(), due_date: z.string().optional().nullable() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) });

  const updateData = {};
  if (parsed.data.title !== undefined) updateData.title_enc = encrypt(parsed.data.title);
  if (parsed.data.done !== undefined) updateData.done = parsed.data.done;
  if (parsed.data.due_date !== undefined) updateData.due_date = parsed.data.due_date;

  const { data, error } = await supabase.from("tasks").update(updateData).eq("id", req.params.taskId).eq("event_id", req.params.eventId).select().single();
  if (error) return res.status(500).json({ error: "Error al actualizar." });
  res.json({ task: { id: data.id, eventId: data.event_id, title: decrypt(data.title_enc), done: data.done, dueDate: data.due_date, createdAt: data.created_at } });
});

app.delete("/api/events/:eventId/tasks/:taskId", requireAuth, async (req, res) => {
  const { error } = await supabase.from("tasks").delete().eq("id", req.params.taskId).eq("event_id", req.params.eventId);
  if (error) return res.status(500).json({ error: "Error al eliminar." });
  res.status(204).end();
});

// ── Reminders routes ──────────────────────────────────────
app.get("/api/events/:eventId/reminders", requireAuth, async (req, res) => {
  const { data, error } = await supabase.from("reminders").select("*").eq("event_id", req.params.eventId);
  if (error) return res.status(500).json({ error: "Error al obtener recordatorios." });
  res.json({ reminders: data.map(r => ({ id: r.id, eventId: r.event_id, message: decrypt(r.message_enc), remindAt: r.remind_at, sent: r.sent, createdAt: r.created_at })) });
});

app.post("/api/events/:eventId/reminders", requireAuth, async (req, res) => {
  const schema = z.object({ message: z.string().min(2), remind_at: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) });
  const { message, remind_at } = parsed.data;

  const { data, error } = await supabase.from("reminders").insert({
    message_enc: encrypt(message), remind_at, event_id: req.params.eventId
  }).select().single();

  if (error) return res.status(500).json({ error: "Error al crear recordatorio." });
  res.status(201).json({ reminder: { id: data.id, eventId: data.event_id, message, remindAt: data.remind_at, sent: data.sent, createdAt: data.created_at } });
});

app.delete("/api/events/:eventId/reminders/:reminderId", requireAuth, async (req, res) => {
  const { error } = await supabase.from("reminders").delete().eq("id", req.params.reminderId).eq("event_id", req.params.eventId);
  if (error) return res.status(500).json({ error: "Error al eliminar." });
  res.status(204).end();
});

// ── Stats ─────────────────────────────────────────────────
app.get("/api/stats", requireAuth, async (req, res) => {
  const { count: events } = await supabase.from("events").select("*", { count: "exact", head: true }).eq("user_id", req.userId);
  const userEvents = await supabase.from("events").select("id").eq("user_id", req.userId);
  const eventIds = userEvents.data?.map(e => e.id) ?? [];
  const { count: guests } = await supabase.from("guests").select("*", { count: "exact", head: true }).in("event_id", eventIds.length > 0 ? eventIds : ["00000000-0000-0000-0000-000000000000"]);
  const { count: reminders } = await supabase.from("reminders").select("*", { count: "exact", head: true }).eq("sent", false).in("event_id", eventIds.length > 0 ? eventIds : ["00000000-0000-0000-0000-000000000000"]);
  res.json({ events: events ?? 0, guests: guests ?? 0, reminders: reminders ?? 0 });
});

// ── Admin routes ──────────────────────────────────────────
app.get("/api/admin/users", requireAuth, requireAdmin, async (_req, res) => {
  const { data, error } = await supabase.from("users").select("id, name_enc, email_enc, role, created_at");
  if (error) return res.status(500).json({ error: "Error al obtener usuarios." });
  res.json({ users: data.map(u => ({ id: u.id, name: decrypt(u.name_enc), email: decrypt(u.email_enc), role: u.role, created_at: u.created_at })) });
});

app.get("/api/admin/overview", requireAuth, requireAdmin, async (_req, res) => {
  const [{ count: users }, { count: events }, { count: guests }, { count: tasks }, { count: reminders }] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("guests").select("*", { count: "exact", head: true }),
    supabase.from("tasks").select("*", { count: "exact", head: true }),
    supabase.from("reminders").select("*", { count: "exact", head: true }),
  ]);
  res.json({ overview: { users: users ?? 0, events: events ?? 0, guests: guests ?? 0, tasks: tasks ?? 0, reminders: reminders ?? 0 } });
});

app.patch("/api/admin/users/:id/role", requireAuth, requireAdmin, async (req, res) => {
  const schema = z.object({ role: z.enum(["usuario", "admin"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: zodMessage(parsed) });
  const { data, error } = await supabase.from("users").update({ role: parsed.data.role }).eq("id", req.params.id).select("id, name_enc, email_enc, role").single();
  if (error) return res.status(500).json({ error: "Error al actualizar rol." });
  res.json({ user: { id: data.id, name: decrypt(data.name_enc), email: decrypt(data.email_enc), role: data.role } });
});

// ── 404 ───────────────────────────────────────────────────
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

// ── Static files (frontend) ──────────────────────────────
const possiblePublicPaths = [
  path.resolve(__dirname, "..", "public"),
  path.resolve(__dirname, "public"),
  path.resolve(process.cwd(), "public"),
];

let publicDir = null;
for (const p of possiblePublicPaths) {
  if (fs.existsSync(p)) {
    publicDir = p;
    break;
  }
}

if (publicDir) {
  console.log(`[MiEvento] Sirviendo frontend desde: ${publicDir}`);
  app.use(express.static(publicDir));
  // Express 5 compatible catch-all (no usar app.get("*"))
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      res.sendFile(path.join(publicDir, "index.html"));
    } else {
      next();
    }
  });
} else {
  console.log("[MiEvento] No se encontró carpeta public/, sirviendo solo API");
  app.get("/", (_req, res) => {
    res.json({ ok: true, service: "MiEvento API", message: "API running. Frontend not found." });
  });
}

// ── Error handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[error]", err);
  res.status(500).json({ error: "Error interno del servidor." });
});

app.listen(PORT, () => {
  console.log(`[MiEvento API] escuchando en http://localhost:${PORT}`);
});
