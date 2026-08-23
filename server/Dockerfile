FROM node:20-alpine

RUN apk add --no-cache sqlite tini

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

COPY server ./server

ENV NODE_ENV=production \
    DB_PATH=/data/data.sqlite \
    PORT=3001

VOLUME /data
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server/index.js"]
