# 🏢 WHITE-LABEL ROADMAP — Multi-organización

## Veredicto rápido
**Viable sin refactorización masiva.** La arquitectura actual (todas las tablas
colgando de `users` + JWT con rol) admite multi-tenancy añadiendo una tabla y
una columna, más filtros por tenant en las consultas.

## Fase 1 — Fundamento (≈2 días)
```sql
CREATE TABLE organizaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
  tema TEXT DEFAULT 'light', creado_en TEXT DEFAULT (datetime('now'))
);
ALTER TABLE users ADD COLUMN org_id INTEGER REFERENCES organizaciones(id);
ALTER TABLE events ADD COLUMN org_id INTEGER;
```
- Registro crea organización individual por defecto.
- JWT pasa a incluir `org_id`; `requireAuth` lo expone como `req.orgId`.
- Toda query de eventos/guests/tasks/reminders añade `AND org_id = ?`.

## Fase 2 — Aislamiento de UI (≈2 días)
- Tema por organización (`org.tema`) servido en `/api/config`.
- Dominio/subdominio por tenant (`{slug}.tudominio.com` → middleware que
  resuelve org por host).

## Fase 3 — Planes comerciales (≈3 días)
- Tabla `planes` (límite de eventos/usuarios por org) + middleware de cuota.
- Panel super-admin para gestionar organizaciones.

## Por qué NO conviene hacerlo ahora (producto)
El comprador de marketplace quiere **una tienda lista**, no un mini-SaaS.
Multi-tenant complica onboarding y soporte. Como upsell "Enterprise"
($299+) o migración pagada, sí es un excelente ancla de valor — este
documento sirve exactamente para eso en la conversación de venta.
