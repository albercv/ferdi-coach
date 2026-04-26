---
title: "Arquitectura del proyecto"
description: "Stack, estructura de carpetas y patrones de diseño que rigen Ferdy Coach."
category: "dev"
tags: ["arquitectura", "stack", "next.js", "estructura"]
audience: ["dev"]
order: 10
---

# Arquitectura

## Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18, TailwindCSS 4, shadcn/ui (Radix primitives)
- **Animaciones:** Framer Motion, GSAP
- **3D:** Three.js + @react-three/fiber + drei
- **Auth:** NextAuth (Credentials + Google)
- **Pagos:** transferencia bancaria (sin pasarela)
- **Emails transaccionales:** Resend
- **Monitorización:** Sentry (`@sentry/nextjs`)
- **Tests:** Vitest
- **Persistencia de contenido:** ficheros `.md` con frontmatter (`gray-matter`)

## Estructura de carpetas

```
app/
  api/                  Endpoints (NextAuth, content, payments, media, cron, monitoring, docs)
  dashboard/            Panel admin (tabs Secciones, Media, Pagos, Documentación)
  login/                Pantalla de login
  page.tsx              Landing pública
  layout.tsx            Root layout + metadatos SEO
components/
  dashboard/            Tabs y widgets del panel admin
  layout/               Header y footer públicos
  payments/             PaymentDialog y formulario
  sections/             Secciones de la landing (Hero, About, FAQ, etc.)
  ui/                   Primitivos shadcn/ui
content/                Base de datos documental (.md)
  payments/submissions/ Histórico de pagos (NO versionado)
  payments/config.md    Configuración bancaria
  testimonials/         Un .md por testimonio
  faq/ + faq.md         FAQs
  products/             Catálogo de guías y sesiones
docs/                   Documentación viva (este directorio)
hooks/                  Custom hooks de React
lib/
  auth.ts               Configuración NextAuth
  auth/assertAdmin.ts   Helper para proteger endpoints admin
  content-md.ts         Lectura/escritura de contenido .md
  docs.ts               Lectura de /docs/*.md
  email/                Cliente Resend + plantillas + service
  media/                MediaService (upload, validación, limpieza)
  payments.ts           Lógica de pagos
  payments-storage.ts   I/O de submissions
  products-md.ts        Lectura del catálogo
  monitoring/           Wrappers de Sentry
public/                 Assets estáticos
  uploads/              Subidas de admin (NO versionado)
tasks/                  Plan operativo (todo.md, lessons.md)
```

## Patrones de diseño

### Server Components por defecto
- Las páginas son Server Components salvo que necesiten interactividad.
- `app/dashboard/page.tsx` es Client Component porque maneja formularios y estado.
- Las API routes son la frontera para todo lo que toca disco/secretos.

### Wrapping de servicios externos
Stripe (no se usa), Resend, Sentry y NextAuth se acceden **siempre** a través de `lib/`. Nunca importes `resend` o `next-auth` directamente desde una página o componente.

### `.md` como BD documental
Las tres áreas (`content/`, `docs/`, plantillas) usan el mismo patrón: frontmatter YAML + cuerpo Markdown. La capa de lectura/escritura vive en `lib/content-md.ts` y `lib/docs.ts`.

### Autorización
- **Middleware (`middleware.ts`)**: protege la ruta `/dashboard` y exige sesión.
- **API routes admin**: importan `assertAdmin` de `lib/auth/assertAdmin.ts`. Si falla, lanza `AuthzError(401|403)` que se traduce en respuesta HTTP.
- **Allowlist de admins**: `AUTH_ADMIN_EMAIL`, `AUTH_ADMIN_EMAIL_2`..`5`, o `AUTH_ADMINS` (formato `email1:role,email2:role`).

### SOLID aplicado
- Cada componente del dashboard (MediaLibraryTab, PaymentsTab, etc.) tiene una sola responsabilidad.
- Los servicios (`MediaService`, `emailService`) se inyectan vía import — no se construyen dentro de los componentes.
- Las plantillas de email son funciones puras `(data) => HTML` para que sean testeables.

### Convenciones de naming
- Componentes en PascalCase, ficheros también (`PaymentsTab.tsx`).
- Hooks empiezan por `use*`.
- Helpers de servidor en `lib/<dominio>/`.
- Endpoints REST: verbos HTTP (`GET`, `PUT`, `POST`, `PATCH`, `DELETE`).
