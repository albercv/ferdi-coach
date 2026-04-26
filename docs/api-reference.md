---
title: "API Reference"
description: "Endpoints internos del proyecto, payloads y nivel de protección."
category: "dev"
tags: ["api", "endpoints", "rest"]
audience: ["dev"]
order: 50
---

# API Reference

Todos los endpoints viven bajo `app/api/`. Devuelven JSON. Errores siguen el formato `{ "error": "MENSAJE" }` con código HTTP apropiado.

## Auth (`/api/auth`)

NextAuth gestiona el flujo. Endpoints expuestos automáticamente:

- `GET /api/auth/session` — sesión actual
- `GET/POST /api/auth/signin` — login
- `POST /api/auth/signout` — logout
- `GET /api/auth/callback/google` — callback OAuth

## Content (`/api/content/*`)

Lectura pública, escritura solo admin (`assertAdmin`).

| Recurso | Métodos | Notas |
|---|---|---|
| `/api/content/about` | `GET`, `PUT` | Bloque "Sobre mí" |
| `/api/content/hero` | `GET`, `PUT` | Hero |
| `/api/content/breaker` | `GET`, `PUT` | Frase destacada |
| `/api/content/cta` | `GET`, `PUT` | Bloque CTA |
| `/api/content/for-who` | `GET`, `PUT` | "Para quién" + cards |
| `/api/content/faq` | `GET`, `POST`, `PATCH`, `DELETE` | Items individuales |
| `/api/content/testimonials` | `GET`, `POST`, `PATCH`, `DELETE` | Items individuales |
| `/api/content/products` | `GET`, `POST`, `PATCH`, `DELETE` | Guías + sesiones |

## Media (`/api/media`)

| Método | Para qué |
|---|---|
| `POST /api/media` | Subir fichero (multipart/form-data) |
| `DELETE /api/media?url=...` | Borrar si no está referenciado |
| `GET /api/media` | Listar contenido de `/uploads/` |

Validación de tipo MIME real con `file-type` (no se fía de la extensión).

## Payments (`/api/payments`)

| Método | Ruta | Auth |
|---|---|---|
| `POST` | `/api/payments/paid` | público |
| `GET` | `/api/payments/submissions` | admin |
| `PATCH` | `/api/payments/submissions` | admin |

## Cron (`/api/cron/*`)

| Ruta | Para qué |
|---|---|
| `/api/cron/payments-transitions` | Transiciona pendientes ≥30 días a `cancelled` |

Header requerido: `x-cron-secret: <CRON_SECRET>`. Compara con `crypto.timingSafeEqual` (corrección SEC-2 pendiente).

## Monitoring (`/api/monitoring/*`)

| Ruta | Para qué |
|---|---|
| `/api/monitoring/webhook` | Recibe alertas externas |

## Docs (`/api/docs`)

| Método | Ruta | Auth |
|---|---|---|
| `GET` | `/api/docs` | admin — lista de docs con metadatos |
| `GET` | `/api/docs/[slug]` | admin — documento concreto (frontmatter + body) |

## Convenciones

- **Validación**: Zod en el handler. Schemas en el propio fichero del route.
- **Errores**: throw de un Error → catch global → JSON `{ error: "..." }` con `console.error("[ruta]", err)`.
- **Tracing**: errores 5xx se reportan a Sentry automáticamente vía `instrumentation.ts`.
- **Cache**: `Cache-Control` se gestiona en cada GET público (pendiente endurecer SEC-8).
