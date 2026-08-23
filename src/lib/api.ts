const TOKEN_KEY = "mievento_token"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export interface ApiError extends Error {
  status: number
}

function createApiError(status: number, message: string): ApiError {
  const error = new Error(message) as ApiError
  error.status = status
  error.name = "ApiError"
  return error
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`/api${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw createApiError(res.status, data.error ?? `Error ${res.status}`)
  }
  return data as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
}

export interface User {
  id: number
  name: string
  email: string
  role: "usuario" | "admin"
}

export interface EventItem {
  id: number
  userId: number
  title: string
  description: string | null
  date: string
  time: string
  location: string
  image: string
  status: "proximo" | "finalizado" | "cancelado"
  createdAt: string
}

export interface Guest {
  id: number
  eventId: number
  name: string
  email: string
  rsvp: "pendiente" | "confirmado" | "rechazado"
}

export interface Task {
  id: number
  eventId: number
  title: string
  done: number
  dueDate: string | null
}

export interface Reminder {
  id: number
  eventId: number
  message: string
  remindAt: string
  sent: number
}

export interface Stats {
  events: number
  guests: number
  reminders: number
}

export interface AuthResponse {
  token: string
  user: User
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data),
  me: () => api.get<{ user: User }>("/auth/me"),
}

export const eventsApi = {
  list: (params?: { status?: string; q?: string; limit?: number }) => {
    const qs = new URLSearchParams()
    if (params?.status) qs.set("status", params.status)
    if (params?.q) qs.set("q", params.q)
    if (params?.limit) qs.set("limit", String(params.limit))
    return api.get<{ events: EventItem[] }>(`/events?${qs}`)
  },
  get: (id: number) => api.get<{ event: EventItem }>(`/events/${id}`),
  create: (data: Omit<EventItem, "id" | "userId" | "createdAt">) =>
    api.post<{ event: EventItem }>("/events", data),
  update: (id: number, data: Partial<Omit<EventItem, "id" | "userId" | "createdAt">>) =>
    api.patch<{ event: EventItem }>(`/events/${id}`, data),
  delete: (id: number) => api.delete<void>(`/events/${id}`),
  stats: () => api.get<Stats>("/stats"),
}

export const guestsApi = {
  list: (eventId: number) => api.get<{ guests: Guest[] }>(`/events/${eventId}/guests`),
  create: (eventId: number, data: { name: string; email: string; rsvp?: Guest["rsvp"] }) =>
    api.post<{ guest: Guest }>(`/events/${eventId}/guests`, data),
  update: (eventId: number, guestId: number, data: Partial<{ name: string; email: string; rsvp: Guest["rsvp"] }>) =>
    api.patch<{ guest: Guest }>(`/events/${eventId}/guests/${guestId}`, data),
  delete: (eventId: number, guestId: number) => api.delete<void>(`/events/${eventId}/guests/${guestId}`),
}

export const tasksApi = {
  list: (eventId: number) => api.get<{ tasks: Task[] }>(`/events/${eventId}/tasks`),
  create: (eventId: number, data: { title: string; done?: boolean; dueDate?: string | null }) =>
    api.post<{ task: Task }>(`/events/${eventId}/tasks`, data),
  update: (eventId: number, taskId: number, data: Partial<{ title: string; done: boolean; dueDate: string | null }>) =>
    api.patch<{ task: Task }>(`/events/${eventId}/tasks/${taskId}`, data),
  delete: (eventId: number, taskId: number) => api.delete<void>(`/events/${eventId}/tasks/${taskId}`),
}

export const remindersApi = {
  list: (eventId: number) => api.get<{ reminders: Reminder[] }>(`/events/${eventId}/reminders`),
  create: (eventId: number, data: { message: string; remindAt: string }) =>
    api.post<{ reminder: Reminder }>(`/events/${eventId}/reminders`, data),
  delete: (eventId: number, reminderId: number) => api.delete<void>(`/events/${eventId}/reminders/${reminderId}`),
}

export interface AdminUser {
  id: number
  name: string
  email: string
  role: "usuario" | "admin"
  created_at: string
}

export const adminApi = {
  users: () => api.get<{ users: AdminUser[] }>("/admin/users"),
  overview: () =>
    api.get<{
      overview: { users: number; events: number; guests: number; tasks: number; reminders: number }
    }>("/admin/overview"),
  setRole: (userId: number, role: "usuario" | "admin") =>
    api.patch<{ ok: boolean }>(`/admin/users/${userId}/role`, { role }),
}
