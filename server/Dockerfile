# ── API MiEvento: Express + SQLite (node nativo) ──
FROM node:20-alpine

# sqlite3 CLI opcional para inspección manual; tini para señales limpias
RUN apk add --no-cache sqlite tini

WORKDIR /app

# Dependencias (capa cacheable)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

# Código del servidor
COPY server ./server

# BD persistente fuera del contenedor (montar volumen en /data)
ENV NODE_ENV=production \
    DB_PATH=/data/data.sqlite \
    PORT=3001

VOLUME /data
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server/index.js"]
