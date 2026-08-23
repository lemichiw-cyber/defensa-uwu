# 🐳 Docker — MiEvento en cualquier sistema operativo

Corre toda la plataforma (web + API + base de datos) con un solo comando,
idéntico en **Windows, macOS y Linux**. Solo necesitas
[Docker Desktop](https://www.docker.com/products/docker-desktop/) (Win/Mac)
o Docker Engine + plugin compose (Linux).

## 🚀 Arrancar todo

```bash
docker compose up --build
```

Primera vez tarda 2-4 min (descarga imágenes y compila). Luego:

| Servicio | URL | Qué es |
|----------|-----|--------|
| **Web** | http://localhost:8080 | Landing + dashboard (nginx) |
| **API** | http://localhost:3001/api/health | Backend Express |

Credenciales demo: `maria@mievento.com / demo1234` (admin) ·
`carlos@mievento.com / demo1234` (usuario).

## 🔧 Comandos útiles

```bash
docker compose up -d --build   # arranque en segundo plano
docker compose logs -f api     # ver logs del backend
docker compose down            # detener todo
docker compose down -v         # ⚠️ además borra la base de datos
```

## 💾 Persistencia de datos

La base SQLite vive en el volumen Docker `mievento_sqlite-data`
(`/data/data.sqlite` dentro del contenedor `api`):
sobrevive a `down`, reinicios y re-builds.
Solo se borra con `docker compose down -v`.

## 🧱 Arquitectura

```
        ┌──────────────┐    /api/*     ┌───────────────┐
 :8080  │  web (nginx) │ ───────────►  │ api (node:20) │ :3001
        │  React build │               │ Express+SQLite│
        └──────────────┘               └───────┬───────┘
                                               ▼ volumen sqlite-data:/data
```

- `Dockerfile` → frontend: compila Vite y sirve `dist/` con nginx;
  nginx hace de proxy inverso (`/api` → contenedor `api`), así el
  navegador solo habla con un origen (sin CORS).
- `server/Dockerfile` → backend: node:20-alpine + tini, BD en volumen.
- Healthchecks incluidos en ambos servicios.

## 📦 Publicar tus imágenes (opcional)

```bash
docker tag mievento-web  TUUSUARIO/mievento-web &&  docker push TUUSUARIO/mievento-web
docker tag mievento-api  TUUSUARIO/mievento-api &&  docker push TUUSUARIO/mievento-api
# luego en cualquier servidor: docker run TUUSUARIO/mievento-web ...
```

## ☁️ Desplegar en un VPS (DigitalOcean/Linode/Hetzner…)

```bash
ssh root@tu-servidor
apt install -y docker.io docker-compose-plugin git
git clone https://github.com/lemichiw-cyber/defensa-uwu.git mievento
cd mievento
JWT_SECRET=$(openssl rand -hex 32) sed -i "s/cambia-en-produccion/$JWT_SECRET/" docker-compose.yml
docker compose up -d --build
# ¡Plataforma viva en http://IP-DEL-SERVIDOR:8080!
```
