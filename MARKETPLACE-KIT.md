# 📦 MARKETPLACE KIT — qué entregar al vender

## ✅ INCLUIR en el ZIP/listing
```
README.md            SETUP.md             INSTALL.md
CHANGELOG.md         LICENSE              .env.example
THEMING.md           WHITELABEL-ROADMAP.md
src/                 server/              public/
index.html           vite.config.ts       tsconfig*.json
package.json         package-lock.json    Dockerfile
docker-compose.yml   nginx.template       vercel.json
docs/screenshots/*.png   (tus capturas reales)
```

## ⛔ EXCLUIR siempre
```
node_modules/     dist/          .env          .env.*
server/data.sqlite    *.log      .git/
```

## 📸 Capturas mínimas (docs/screenshots/)
1. dashboard-desktop.png  2. dashboard-mobile.png
3. landing.png            4. admin-panel.png
5. themes-grid.png        6. event-modal.png

## 🎬 Video demo de 60 s (guion)
docker compose up → login admin → crear evento → cambiar tema →
abrir en móvil (PWA) → panel admin → fin.

## 🏷️ Metadatos sugeridos
Título: *MiEvento — React & Node Event Management Platform*
Tags: event manager, react template, nodejs api, sqlite, jwt, pwa, docker
