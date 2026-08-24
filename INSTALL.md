# ⚡ INSTALL — De compra a producción en 10 minutos

## Minuto 0–2 · Descargar y descomprimir
Descomprime el ZIP. Dentro encontrarás esta misma estructura.
Necesitas Node ≥ 22.5 **o** Docker.

## Minuto 2–4 · Arrancar

**Con Docker:**
```bash
docker compose up -d --build
```
✅ Web: http://localhost:8080

**Sin Docker:**
```bash
npm install
npm run dev
```
✅ Web: http://localhost:5173

## Minuto 4–5 · Entrar
| Usuario | Email | Clave |
|---------|-------|-------|
| Admin | maria@mievento.com | demo1234 |

## Minuto 5–8 · Rebrandear
Sigue [THEMING.md](./THEMING.md): nombre (4 archivos), colores (3 variables), logo (2 assets).

## Minuto 8–10 · Publicar
- API → [Render gratis](https://render.com): New Web Service → `npm start` → define `JWT_SECRET` y `NODE_ENV=production`
- Web → [Vercel](https://vercel.com/new): importa el repo → define `API_ORIGIN` apuntando a tu API
Guía detallada con capturas: [SETUP.md](./SETUP.md §3).

## Checklist final
- [ ] `JWT_SECRET` cambiado (nunca uses el de ejemplo)
- [ ] `VITE_SHOW_DEMO=false` si no quieres mostrar credenciales
- [ ] HTTPS activo (Vercel/Render lo dan gratis)
