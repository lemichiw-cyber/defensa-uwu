# ============================================================
# MiEvento v2.0 — Plataforma de Gestión de Eventos
# ============================================================
#
# Stack:
#   - Backend: Express 5 + Supabase (PostgreSQL)
#   - Frontend: HTML5 + CSS3 + JavaScript/TypeScript (Vanilla ES Modules)
#   - Auth: JWT (HS256) + scrypt password hashing
#   - Seguridad: Helmet, Rate Limiting, Zod validation, RLS
#
# Despliegue: Docker o VPS (Node.js >= 20)
# ============================================================

## 🚀 Quick Start

### 1. Clonar e instalar
```bash
git clone https://github.com/tu-usuario/defensa-uwu.git mievento
cd mievento
npm install
cp .env.example .env   # Editar con tus valores
npm start
```

### 2. Configurar Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** → ejecutar el contenido de `supabase.sql`
3. Copiar URL y Service Role Key → pegar en `.env`

### 3. Acceder
- Web: <http://localhost:3001>
- Admin: `maria@mievento.com` / `demo1234`
- Usuario: `carlos@mievento.com` / `demo1234`

---

## 🗄️ Base de Datos (Supabase)

El archivo **`supabase.sql`** contiene todo lo necesario:

- **Tablas**: `users`, `events`, `guests`, `tasks`, `reminders`
- **RLS (Row Level Security)**: políticas de seguridad por rol
- **Índices**: optimización de consultas
- **Trigger**: `updated_at` automático
- **Seed data**: usuarios y eventos de demostración

### Diagrama Entidad-Relación
```
users (1) ──< events (1) ──< guests
                     ├──< tasks
                     └──< reminders
```

---

## 🔐 API REST

| Método | Endpoint | Acceso |
|--------|----------|--------|
| POST | `/api/auth/register` | público |
| POST | `/api/auth/login` | público |
| GET | `/api/auth/me` | usuario |
| GET/POST | `/api/events` | usuario |
| GET/PATCH/DELETE | `/api/events/:id` | dueño / admin |
| CRUD | `/api/events/:id/guests` | dueño / admin |
| CRUD | `/api/events/:id/tasks` | dueño / admin |
| CRUD | `/api/events/:id/reminders` | dueño / admin |
| GET | `/api/stats` | usuario |
| GET | `/api/admin/users` | admin |
| GET | `/api/admin/overview` | admin |
| PATCH | `/api/admin/users/:id/role` | admin |

---

## 📁 Estructura del Proyecto

```
├── public/
│   ├── css/styles.css      # Design system completo
│   ├── js/
│   │   ├── app.js          # Frontend SPA vanilla
│   │   └── utils.js        # API client, router, DOM helpers
│   ├── index.html          # Entry point
│   └── favicon.svg
├── server/
│   └── index.js            # API Express + Supabase
├── supabase.sql            # Schema + RLS + seed
├── package.json
├── Dockerfile
└── docker-compose.yml
```

---

## 🛡️ Seguridad

- **JWT** con expiración de 7 días
- **scrypt** password hashing (salt + hash)
- **Rate limiting**: 20 intentos/auth por IP / 15 min
- **Helmet** headers (CSP desactivado para la SPA)
- **RLS** en Supabase: usuarios solo ven sus propios datos
- **Zod** validación de inputs en todas las rutas

---

## 📄 Licencia

MIT License — libre uso y modificación.
