# ⚙️ SETUP — Installation & Deployment Guide

## Requirements

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ≥ 22.5 | required by `node:sqlite` |
| npm | ≥ 10 | ships with Node |
| Docker (optional) | ≥ 24 + compose plugin | for one-command deploy |

---

## 1 · Local development

```bash
npm install
cp .env.example .env
npm run dev
```

- Web app → http://localhost:5173
- REST API → http://localhost:3001/api/health

The SQLite database (`server/data.sqlite`) is created and seeded automatically on first start.

---

## 2 · Production — Docker (single host)

```bash
# set a real secret BEFORE going live:
export JWT_SECRET="$(openssl rand -hex 32)"

docker compose up -d --build
```

- Web (nginx) → port **8080**
- API (Express) → port **3001**

Data persists in the `mievento_sqlite-data` volume.
To wipe all data: `docker compose down -v`.

> Tip: put nginx/Caddy in front for HTTPS, or open only :8080 behind a reverse proxy.

---

## 3 · Production — Vercel (web) + Render (API) · free tiers

### 3.1 API on Render
1. Push this repo to GitHub.
2. dashboard.render.com → **New → Web Service** → connect the repo.
3. Runtime `Node`, Build `npm install`, Start `npm start`.
4. Environment variables: `NODE_ENV=production`, `JWT_SECRET=<openssl rand -hex 32>`.
5. Create → copy your API URL (e.g. `https://mievento-api.onrender.com`).

### 3.2 Web on Vercel
1. vercel.com/new → import the same repo.
2. Add rewrite `/api/*` → `<your-render-url>/api/*` (see `vercel.json` example already included).
3. Deploy.

Free Render instances sleep after ~15 min idle; first request takes ≈30 s to wake up.

---

## 4 · Environment variables reference

| Variable | Scope | Required | Default | Description |
|----------|-------|----------|---------|-------------|
| `PORT` | server | no | `3001` | API listen port |
| `NODE_ENV` | server | yes (prod) | `development` | `production` enforces `JWT_SECRET` |
| `JWT_SECRET` | server | **yes (prod)** | dev-only fallback | Long random string — `openssl rand -hex 32` |
| `DB_PATH` | server | no | `server/data.sqlite` | Custom SQLite file location (Docker volume) |
| `VITE_SHOW_DEMO` | frontend | no | `true` | Show demo-credentials hint on login |

---

## 5 · Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Process exits with *“JWT_SECRET is mandatory”* | production without secret | set `JWT_SECRET` env var |
| First request slow (~30 s) | free-tier instance sleeping | expected on Render free; upgrade or keep-alive ping |
| `node:sqlite` not found | Node < 22.5 | upgrade Node (a `.node-version`/Dockerfile pins it) |
| Login returns 429 | rate limit hit | wait 15 min or restart container |

---

## 6 · Reset demo data

```bash
docker compose down -v        # removes the database volume
rm server/data.sqlite         # local installs
```
