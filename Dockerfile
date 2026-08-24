# ── Frontend MiEvento: build Vite + nginx con upstream configurable ──
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
# Valor por defecto para docker-compose; en producción sobrescribir
# con la variable de entorno API_ORIGIN (URL pública del servicio API)
ENV API_ORIGIN=http://api:3001
COPY --from=build /app/dist /usr/share/nginx/html
# La imagen oficial hace envsubst de los *.template usando las variables de entorno
COPY nginx.template /etc/nginx/templates/default.conf.template
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1
