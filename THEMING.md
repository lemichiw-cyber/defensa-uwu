# 🎨 THEMING & REBRANDING GUIDE

Guía para rebrandear MiEvento en **~15 minutos** sin tocar la lógica.

## 1 · Nombre del producto (4 lugares)

| Archivo | Qué cambiar |
|---------|-------------|
| `index.html` | `<title>` y meta description |
| `src/components/layout/Navbar.tsx` | Texto del logo (`MiEvento`) |
| `public/manifest.webmanifest` | `name` y `short_name` |
| `src/components/dashboard/HeroCard.tsx` | Saludo/bienvenida si quieres personalizarlo |

## 2 · Colores primarios

Los componentes usan utilidades Tailwind remapeadas a variables CSS.
**Un solo cambio pinta toda la app:**

```css
/* src/index.css → bloque :root */
--t-primary: #2563eb;        /* color principal */
--t-primary-dark: #1d4ed8;   /* hover/activo */
--t-primary-light: #dbebff;  /* fondos suaves */
```

> Cada tema (`[data-theme="dark"]`, `[data-theme="pastel"]`…) tiene su propio
> trio `--t-primary*`. Si quieres que tu marca respete los temas, ajusta el trio
> dentro de cada bloque; si no, deja los temas tal cual.

Botones CTA amarillos (landing): buscar `.incoa-cta` y `--yellow`.

## 3 · Logo e iconos

| Asset | Ubicación |
|-------|-----------|
| Favicon navegador | `public/favicon.svg` |
| Icono PWA 192/512 | `public/icons/icon-*.png` (regenerar con cualquier herramienta) |
| Ilustración dashboard | `src/components/dashboard/HeroCard.tsx` (SVG inline) |

## 4 · Copy de la landing

Todo el contenido vive en `src/pages/Landing.tsx`:
hero (`Welcome To…`, titular, subtítulo), servicios, stats y portfolio.
Es texto plano editable — no hay cadenas ocultas.

## 5 · Idioma / textos de la interfaz

`src/i18n/es.json` centraliza los textos principales de navegación,
login, acciones y errores. Ver sección *i18n* en el README técnico
para añadir otro idioma (`en.json`) y un selector.

## 6 · Credenciales y datos demo

- Ocultar hint del login: `VITE_SHOW_DEMO=false`
- Banner "Modo Demo": `VITE_DEMO_MODE=true`
- Cambiar usuarios sembrados: `server/db.js → seedIfEmpty()`
