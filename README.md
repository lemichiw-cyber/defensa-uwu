# MiEvento v2.0 — Plataforma de Gestión de Eventos

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│  GitHub Pages (Frontend)                                     │
│  - HTML5 + CSS3 + JavaScript (Vanilla ES Modules)           │
│  - Sin build step, sin dependencias                         │
│  - URL: https://lemichiw-cyber.github.io/defensa-uwu        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ fetch()
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Railway.app (Backend API)                                   │
│  - Express 5 + Supabase + AES-256-GCM encryption            │
│  - JWT auth + scrypt password hashing                       │
│  - URL: https://mievento-api.up.railway.app                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase (PostgreSQL)                                       │
│  - Datos cifrados (bytea) + RLS                             │
│  - email_hash para login sin descifrar                      │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Deploy

### 1. Supabase (Base de datos)

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** → **New Query**
3. Primero limpia (si hay tablas viejas):
   ```sql
   drop table if exists public.reminders cascade;
   drop table if exists public.tasks cascade;
   drop table if exists public.guests cascade;
   drop table if exists public.events cascade;
   drop table if exists public.users cascade;
   ```
4. Pega el contenido de `supabase.sql` → **Run**
5. Copia la **URL** y **Service Role Key**

### 2. Railway (Backend)

1. Ve a [railway.app](https://railway.app) → **New Project**
2. **Deploy from GitHub repo** → selecciona `lemichiw-cyber/defensa-uwu`
3. En **Settings**:
   - **Root Directory:** `server`
   - **Start Command:** `npm start`
4. En **Variables**:
   - `SUPABASE_URL` → tu URL de Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` → tu service role key
   - `JWT_SECRET` → genera con `openssl rand -base64 32`
   - `ENCRYPTION_KEY` → genera con `openssl rand -base64 32`
5. Copia la URL del deploy (ej: `https://mievento-api.up.railway.app`)

### 3. GitHub Pages (Frontend)

1. En el repo → **Settings** → **Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `master` → `/public` folder
4. Click **Save**
5. Espera 2-3 minutos

### 4. Conectar Frontend con Backend

Edita `public/js/utils.js`:
```js
const API_BASE = "https://tu-url-de-railway.app/api";
```

Haz commit y push. GitHub Pages se actualiza automáticamente.

---

## 🔐 Seguridad

| Campo | Método |
|-------|--------|
| `name_enc`, `email_enc` | AES-256-GCM |
| `title_enc`, `description_enc` | AES-256-GCM |
| `location_enc`, `message_enc` | AES-256-GCM |
| `email_hash` | SHA-256 (para login) |
| `password_hash` | scrypt |
| `date`, `status`, `image_url` | Sin cifrar (filtros) |

La clave de encriptación **nunca** sale del backend.

---

## 📁 Estructura

```
├── public/               # Frontend (GitHub Pages)
│   ├── css/styles.css
│   ├── js/
│   │   ├── app.js
│   │   └── utils.js      # ← Cambia API_BASE aquí
│   └── index.html
├── server/               # Backend (Railway)
│   ├── index.js
│   └── package.json
├── supabase.sql          # Schema + RLS
└── README.md
```

---

## 📄 Licencia

MIT
