# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] — 2026-08-24

### Added
- Full-stack event management platform (React 19 + TypeScript + Vite / Express 5 + SQLite)
- JWT authentication with scrypt hashing and Zod input validation
- Role-based access control with double-layer enforcement (API middleware + UI guards)
- Events CRUD with image support; guests RSVP; per-event tasks and reminders
- Admin panel: user management, role promotion/demotion, global KPIs
- Dashboard: hero, KPI stats row, upcoming events, mini calendar synced to data, quick actions
- Landing page with video hero and module portfolio navigation
- Splash screen and PWA support (manifest + service worker, installable)
- 10 UI themes persisted via localStorage (`data-theme`)
- Toast notification system with variants and auto-dismiss
- Docker deployment (Dockerfile + docker-compose) with persistent SQLite volume
- Security: helmet headers, auth rate limiting (20 req/15 min), general API limiter
- Fail-fast secret handling: refuses to boot in production without JWT_SECRET
- Demo seed data toggleable via VITE_SHOW_DEMO
- Documentation: README, SETUP guide, SELLING-GUIDE, .env.example, MIT LICENSE

### Security
- Parameterized SQL queries across all endpoints
- Timing-safe token verification; expiring tokens (7 days)
