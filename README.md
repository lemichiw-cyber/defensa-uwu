<div align="center">

# 🎉 MiEvento

### Full-Stack Event Management Platform · Ready to Launch

**React 19 · TypeScript · Vite · Express · SQLite · Docker · PWA**

Organize events, manage guests, track tasks and set reminders —
with a beautiful themed dashboard, admin panel and a mobile-ready experience.

[Features](#-features) · [Quick Start](#-quick-start) · [Screenshots](#-screenshots) · [Tech Stack](#-tech-stack) · [Documentation](#-documentation) · [License](#-license)

</div>

---

## ✨ Features

**For end users**
- 📅 **Events CRUD** — create, edit and browse events with images, dates and locations
- 👥 **Guests & RSVP** — per-event guest lists with confirmation status
- ✅ **Tasks & Reminders** — organize every event with checklists and alerts
- 🗓️ **Mini calendar** — real-time calendar synced with upcoming events
- 🔔 **Toast notifications** for every action (create / update / delete)
- 🎨 **10 UI themes** (light, dark, pastel, sunset, ocean, sakura…) persisted per user
- 📱 **Installable PWA** + splash screen — works like a native mobile app

**For administrators**
- 🛡️ **Double-layer security** — role checks in both API middleware *and* UI
- 👤 **User management panel** — list accounts, promote/demote admins
- 📊 **Global KPIs** — users, events, guests, tasks and reminders at a glance

**Under the hood**
- ⚡ REST API with **JWT auth**, scrypt password hashing and Zod input validation
- 🚦 **Rate limiting** on auth endpoints + `helmet` security headers
- 💾 **Zero-config SQLite** (via `node:sqlite` — no external database server needed)
- 🐳 **One-command Docker deploy**
- 🔒 Fail-fast secrets: refuses to boot in production without a proper `JWT_SECRET`

---

## 🚀 Quick Start

### Option A — Docker (recommended)

```bash
git clone https://github.com/YOUR_USERNAME/defensa-uwu.git mievento
cd mievento
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web app | http://localhost:8080 |
| REST API | http://localhost:3001/api/health |

### Option B — Local development

```bash
npm install
cp .env.example .env        # adjust values if you want
npm run dev                 # starts Vite (5173) + API (3001) together
```

> Full production deployment guides (Vercel + Render, VPS, Docker) in [SETUP.md](./SETUP.md).

### Default demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `maria@mievento.com` | `demo1234` |
| User | `carlos@mievento.com` | `demo1234` |

*Demo data is seeded automatically on first run. Hide the hint on the login screen with `VITE_SHOW_DEMO=false`.*

---

## 📸 Screenshots

> 📍 Place your captures in `docs/screenshots/` and they will render here.

| Dashboard | Landing | Admin panel |
|-----------|---------|-------------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Landing](docs/screenshots/landing.png) | ![Admin](docs/screenshots/admin.png) |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Lucide icons |
| Backend | Node.js ≥22.5, Express 5, SQLite (`node:sqlite`, zero external DB), Zod |
| Auth | JWT (HMAC-SHA256) + scrypt password hashing + rate limiting |
| Security | Helmet headers, double-layer RBAC, parameterized SQL |
| Deploy | Docker / docker-compose, Vercel (web) + Render (API), any Node VPS |

## 📖 Documentation

| File | Contents |
|------|----------|
| [SETUP.md](./SETUP.md) | Step-by-step installation & production deployment |
| [.env.example](./.env.example) | Every environment variable explained |
| [SELLING-GUIDE.md](./SELLING-GUIDE.md) | Marketplace listing kit (pricing tiers, platforms) |
| [CHANGELOG.md](./CHANGELOG.md) | Release history |

## 🗂️ Project Structure

```
├── public/               # PWA assets served as-is (videos, favicon)
├── src/
│   ├── components/       # React components (dashboard, layout, ui/)
│   ├── context/          # AuthContext (JWT session + roles)
│   ├── pages/            # Landing · Dashboard · Login
│   ├── lib/api.ts        # Typed REST client
│   └── data/             # Static content helpers
├── server/
│   ├── routes/           # auth · events · guests · tasks · reminders · admin
│   ├── db.js             # SQLite schema + auto-seed demo data
│   └── index.js          # Express app (helmet · rate-limit · CORS)
├── Dockerfile            # Production container
└── docker-compose.yml    # One-command full stack
```

## 🔌 API Overview

All endpoints are prefixed with `/api`. Authenticated requests require
`Authorization: Bearer <token>`.

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` · `/api/auth/login` | public (rate-limited) |
| GET | `/api/auth/me` | user |
| GET/POST | `/api/events` | user |
| PUT/PATCH/DELETE | `/api/events/:id` | owner / **admin** |
| CRUD | `/api/events/:id/guests` · `/tasks` · `/reminders` | owner / **admin** |
| GET | `/api/stats` | user |
| GET/PATCH | `/api/admin/users` · `/users/:id/role` | **admin** |
| GET | `/api/admin/overview` | **admin** |

## 📄 License

Released under the [MIT License](./LICENSE).

## 🛒 Support

This product includes source code, documentation and demo seed data.
For setup questions please refer to [SETUP.md](./SETUP.md).
