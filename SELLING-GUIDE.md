# 💰 SELLING GUIDE — How to package & sell MiEvento

This guide helps you turn this codebase into a listed product on
CodeCanyon, Gumroad or Flippa.

---

## 1 · Where to sell

| Platform | Best for | Notes |
|----------|----------|-------|
| **CodeCanyon (Envato)** | Highest reach for PHP/JS app templates | Requires English docs, clean demo, strict QA review. Typical approval adds credibility |
| **Gumroad** | Fastest start — zero review | Great for "launch this week". Bundle source + PDF setup guide + video walkthrough |
| **Flippa** | Selling as a *working business* with the deployed site | List the live instance + revenue if any. Higher ticket prices |
| **Your own landing** | 100% margin | Combine with the included SELLING assets |

Recommendation: start on **Gumroad** today, submit to **CodeCanyon** for reach.

---

## 2 · Suggested pricing tiers

| Tier | Price | What's included |
|------|-------|-----------------|
| 🥉 Personal | **$49** | Full source, single end-product, personal/commercial use, 6 months updates |
| 🥈 Commercial | **$99** | Previous + use in client products, priority email support 3 months, deployment help doc |
| 🥇 Extended / Resale | **$199** | Previous + resale rights inside your own SaaS, removal of branding, 12 months updates |

Anchoring tips: put the Extended tier first (left), show Commercial as “most popular”.
Offer an installation service add-on (+$49) — high margin, low effort.

---

## 3 · What to include in the sale package

- ✅ This repository (clean `main` + tagged release)
- ✅ `README.md` · `SETUP.md` · `.env.example` · `CHANGELOG.md`
- ✅ `docs/screenshots/*.png` — **take 5–8 captures**: dashboard desktop/mobile,
  landing, admin panel, themes grid (the theme picker screenshots very well)
- ✅ A 60–90 s screen recording: clone → docker compose up → login → create event → switch theme
- ✅ Demo link (deploy free on Vercel+Render following SETUP.md §3)
- ⛔ Do NOT include: `.env`, real secrets, `server/data.sqlite`, node_modules

---

## 4 · Listing copy you can reuse

> **MiEvento — Full-Stack Event Management Platform (React + Node + SQLite)**
>
> Launch your own event-management SaaS in minutes. Events, guests, tasks and
> reminders wrapped in a beautiful 10-theme dashboard. JWT auth with double-layer
> role security, rate limiting, Docker one-command deploy, PWA mobile experience
> and an Android-ready build. Zero external database required — SQLite does it all.
>
> Includes full TypeScript source, REST API, seed data, deployment guides for
> Vercel + Render and a MIT license.

Keywords/tags: event manager, booking, dashboard, react template, node api,
sqlite, saas starter, jwt auth, pwa, docker.

---

## 5 · Pre-listing checklist

- [ ] Replace `[Tu Nombre o Tu Empresa]` in `LICENSE`
- [ ] Point repo URLs in README to YOUR public repo
- [ ] Add real screenshots to `docs/screenshots/`
- [ ] Record demo video and host on YouTube (unlisted)
- [ ] Live demo deployed (SETUP.md §3) with reset cron (`docker compose down -v` nightly)
- [ ] Set final `version` in `package.json` and tag the release
- [ ] Remove this file (`SELLING-GUIDE.md`) from buyer copies if you prefer

---

## 6 · Upsells that increase average order value

1. Installation service — $49
2. Custom branding (logo + colors) — $99
3. Multi-language pack (EN/ES) — $59
4. Year of premium updates — $59/yr
