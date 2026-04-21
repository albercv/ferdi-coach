# Monitorización de Errores — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capturar errores de cliente y servidor en Sentry, con alertas automáticas a Telegram para errores críticos en producción, y métricas de rendimiento (Core Web Vitals).

**Architecture:** Sentry SDK para Next.js captura errores en cliente, servidor y edge de forma automática. Un endpoint propio (`/api/monitoring/webhook`) actúa de puente entre las alertas de Sentry y el Bot de Telegram, validando un token secreto. Los flujos críticos de pago reciben contexto adicional para facilitar el diagnóstico.

**Tech Stack:** `@sentry/nextjs`, Telegram Bot API (fetch nativo), Vitest para tests.

---

## Variables de entorno necesarias

Antes de ejecutar cualquier tarea de código, estas variables deben estar en `.env`:

```
NEXT_PUBLIC_SENTRY_DSN=          # DSN del proyecto en sentry.io
SENTRY_ORG=                      # Slug de organización en Sentry
SENTRY_PROJECT=                  # Nombre del proyecto en Sentry
SENTRY_AUTH_TOKEN=               # Auth token para subir source maps (Settings > Auth Tokens)
TELEGRAM_BOT_TOKEN=              # Token del bot (de @BotFather)
TELEGRAM_CHAT_ID=                # ID del chat/grupo donde llegan las alertas
MONITORING_WEBHOOK_SECRET=       # String aleatorio para proteger el endpoint webhook
```

---

## Mapa de archivos

| Acción | Archivo | Responsabilidad |
|--------|---------|----------------|
| Crear | `sentry.client.config.ts` | Init Sentry en el navegador |
| Crear | `sentry.server.config.ts` | Init Sentry en Node.js (server components, API routes) |
| Crear | `sentry.edge.config.ts` | Init Sentry en edge runtime |
| Crear | `instrumentation.ts` | Hook de Next.js para cargar Sentry en servidor/edge |
| Modificar | `next.config.mjs` | Envolver config con `withSentryConfig` |
| Crear | `lib/monitoring/telegram.ts` | Función de envío de alertas a Telegram |
| Crear | `app/api/monitoring/webhook/route.ts` | Recibe webhooks de Sentry y reenvía a Telegram |
| Modificar | `app/api/payments/paid/route.ts` | Añadir contexto Sentry al flujo de pago |
| Modificar | `app/api/payments/submissions/route.ts` | Añadir contexto Sentry a confirmación de pago |
| Crear | `tests/monitoring/telegram.test.ts` | Tests del módulo Telegram |
| Crear | `tests/monitoring/webhook.test.ts` | Tests del endpoint webhook |
| Modificar | `.env.example` | Documentar las nuevas variables |

---

## TAREA 1 — Preparación manual (sin código)

> Pasos manuales que deben completarse antes de tocar el código.

**Sentry:**

- [ ] **Crear cuenta en sentry.io** (plan Developer — gratuito)
- [ ] **Crear nuevo proyecto:** Plataforma → Next.js. Nombre → `ferdi-coach`.
- [ ] **Copiar el DSN** (Settings > Projects > ferdi-coach > Client Keys) → `NEXT_PUBLIC_SENTRY_DSN`
- [ ] **Crear Auth Token** (Settings > Auth Tokens > Create New Token, scope: `project:releases`, `org:read`) → `SENTRY_AUTH_TOKEN`
- [ ] **Anotar** el slug de organización (`SENTRY_ORG`) y nombre de proyecto (`SENTRY_PROJECT`) de la URL de Sentry

**Telegram:**

- [ ] **Crear bot:** Habla con @BotFather en Telegram → `/newbot` → nombre `Ferdy Coach Monitor` → usuario `ferdy_coach_monitor_bot` (o similar). Guarda el token → `TELEGRAM_BOT_TOKEN`
- [ ] **Obtener Chat ID:** Envía cualquier mensaje al bot, luego abre en el navegador `https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates`. El campo `message.chat.id` es el `TELEGRAM_CHAT_ID`
- [ ] **Generar secreto webhook:** Ejecuta `openssl rand -hex 32` en el servidor y guarda el resultado → `MONITORING_WEBHOOK_SECRET`

**Añadir todas las variables al `.env` del servidor antes de continuar.**

---

## TAREA 2 — Instalar Sentry SDK

**Archivos:**
- Modificar: `package.json` (via npm install)

- [ ] **Instalar el paquete**

```bash
npm install @sentry/nextjs
```

Resultado esperado: `@sentry/nextjs` aparece en `dependencies` de `package.json`.

- [ ] **Verificar que no hay errores de instalación**

```bash
npm ls @sentry/nextjs
```

Resultado esperado: versión instalada sin peer dependency warnings críticos.

- [ ] **Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: instala @sentry/nextjs"
```

---

## TAREA 3 — Configurar Sentry (archivos de init)

**Archivos:**
- Crear: `sentry.client.config.ts`
- Crear: `sentry.server.config.ts`
- Crear: `sentry.edge.config.ts`
- Crear: `instrumentation.ts`
- Modificar: `next.config.mjs`

- [ ] **Crear `sentry.client.config.ts`**

```ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.05,
  integrations: [Sentry.replayIntegration()],
})
```

- [ ] **Crear `sentry.server.config.ts`**

```ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
})
```

- [ ] **Crear `sentry.edge.config.ts`**

```ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
})
```

- [ ] **Crear `instrumentation.ts`** en la raíz del proyecto

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config")
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config")
  }
}

export const onRequestError = Sentry.captureRequestError
```

> Nota: el import de `Sentry` en `instrumentation.ts` requiere añadir al inicio del archivo:
```ts
import * as Sentry from "@sentry/nextjs"
```

El archivo completo queda:

```ts
import * as Sentry from "@sentry/nextjs"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config")
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config")
  }
}

export const onRequestError = Sentry.captureRequestError
```

- [ ] **Modificar `next.config.mjs`** para envolver con `withSentryConfig`

Reemplazar el contenido completo por:

```mjs
import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  transpilePackages: ['three'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: false,
})
```

- [ ] **Verificar que el build no rompe**

```bash
npm run build
```

Resultado esperado: build exitoso. Puede aparecer un aviso de Sentry sobre source maps — es normal si `SENTRY_AUTH_TOKEN` no está en local.

- [ ] **Commit**

```bash
git add sentry.client.config.ts sentry.server.config.ts sentry.edge.config.ts instrumentation.ts next.config.mjs
git commit -m "feat: integra Sentry SDK con Next.js App Router"
```

---

## TAREA 4 — Módulo Telegram

**Archivos:**
- Crear: `lib/monitoring/telegram.ts`
- Crear: `tests/monitoring/telegram.test.ts`

- [ ] **Escribir el test primero** (`tests/monitoring/telegram.test.ts`)

```ts
import { describe, it, expect, vi, beforeEach } from "vitest"

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

describe("sendTelegramAlert", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-token")
    vi.stubEnv("TELEGRAM_CHAT_ID", "12345")
  })

  it("envía el mensaje a la API de Telegram", async () => {
    mockFetch.mockResolvedValue({ ok: true })
    const { sendTelegramAlert } = await import("@/lib/monitoring/telegram")

    await sendTelegramAlert("Error crítico en producción")

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token/sendMessage",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("Error crítico en producción"),
      })
    )
  })

  it("no lanza excepción si las variables de entorno no están definidas", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "")
    vi.stubEnv("TELEGRAM_CHAT_ID", "")
    const { sendTelegramAlert } = await import("@/lib/monitoring/telegram")

    await expect(sendTelegramAlert("test")).resolves.not.toThrow()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("loguea el error si Telegram devuelve !ok sin lanzar excepción", async () => {
    mockFetch.mockResolvedValue({ ok: false, text: async () => "Bad Request" })
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const { sendTelegramAlert } = await import("@/lib/monitoring/telegram")

    await expect(sendTelegramAlert("test")).resolves.not.toThrow()
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[telegram]"),
      expect.any(String)
    )
  })
})
```

- [ ] **Ejecutar el test para confirmar que falla**

```bash
npm test tests/monitoring/telegram.test.ts
```

Resultado esperado: FAIL — `Cannot find module '@/lib/monitoring/telegram'`

- [ ] **Crear `lib/monitoring/telegram.ts`**

```ts
export async function sendTelegramAlert(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn("[telegram] TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurados")
    return
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
  })

  if (!res.ok) {
    console.error("[telegram] Error al enviar alerta:", await res.text())
  }
}
```

- [ ] **Ejecutar el test para confirmar que pasa**

```bash
npm test tests/monitoring/telegram.test.ts
```

Resultado esperado: 3 tests PASS.

- [ ] **Commit**

```bash
git add lib/monitoring/telegram.ts tests/monitoring/telegram.test.ts
git commit -m "feat: añade módulo de alertas Telegram"
```

---

## TAREA 5 — Endpoint webhook (Sentry → Telegram)

**Archivos:**
- Crear: `app/api/monitoring/webhook/route.ts`
- Crear: `tests/monitoring/webhook.test.ts`

- [ ] **Escribir el test primero** (`tests/monitoring/webhook.test.ts`)

```ts
import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "@/app/api/monitoring/webhook/route"

vi.mock("@/lib/monitoring/telegram", () => ({
  sendTelegramAlert: vi.fn().mockResolvedValue(undefined),
}))

import { sendTelegramAlert } from "@/lib/monitoring/telegram"

const SECRET = "test-secret-abc"

function makeRequest(body: unknown, secret?: string): Request {
  const url = secret
    ? `http://localhost/api/monitoring/webhook?secret=${secret}`
    : `http://localhost/api/monitoring/webhook`
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/monitoring/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv("MONITORING_WEBHOOK_SECRET", SECRET)
  })

  it("rechaza la petición si el secreto es incorrecto", async () => {
    const res = await POST(makeRequest({}, "wrong-secret"))
    expect(res.status).toBe(401)
  })

  it("rechaza la petición si no hay secreto", async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(401)
  })

  it("llama a sendTelegramAlert con el título del issue de Sentry", async () => {
    const payload = {
      data: {
        issue: {
          title: "TypeError: Cannot read properties of undefined",
          level: "error",
          web_url: "https://ferdi-coach.sentry.io/issues/123/",
          project: { name: "ferdi-coach" },
        },
      },
    }

    const res = await POST(makeRequest(payload, SECRET))
    expect(res.status).toBe(200)
    expect(sendTelegramAlert).toHaveBeenCalledWith(
      expect.stringContaining("TypeError: Cannot read properties of undefined")
    )
  })

  it("responde 200 aunque sendTelegramAlert falle (no bloquear a Sentry)", async () => {
    vi.mocked(sendTelegramAlert).mockRejectedValueOnce(new Error("network error"))
    const payload = { data: { issue: { title: "Error", level: "error" } } }

    const res = await POST(makeRequest(payload, SECRET))
    expect(res.status).toBe(200)
  })
})
```

- [ ] **Ejecutar el test para confirmar que falla**

```bash
npm test tests/monitoring/webhook.test.ts
```

Resultado esperado: FAIL — `Cannot find module '@/app/api/monitoring/webhook/route'`

- [ ] **Crear `app/api/monitoring/webhook/route.ts`**

```ts
import { NextResponse } from "next/server"
import { sendTelegramAlert } from "@/lib/monitoring/telegram"

export const runtime = "nodejs"

function formatSentryAlert(body: any): string {
  const issue = body?.data?.issue ?? body?.data?.event ?? {}
  const title = issue.title ?? body?.message ?? "Error desconocido"
  const level = (issue.level ?? "error").toUpperCase()
  const project = issue.project?.name ?? body?.project_name ?? "ferdi-coach"
  const url = issue.web_url ?? issue.permalink ?? ""

  const lines = [
    `🚨 <b>Error en producción</b>`,
    ``,
    `<b>Nivel:</b> ${level}`,
    `<b>Proyecto:</b> ${project}`,
    `<b>Error:</b> ${title}`,
  ]
  if (url) lines.push(`<b>Sentry:</b> ${url}`)
  return lines.join("\n")
}

export async function POST(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get("secret")
  const expectedSecret = process.env.MONITORING_WEBHOOK_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 })
  }

  try {
    const message = formatSentryAlert(body)
    await sendTelegramAlert(message)
  } catch (err) {
    console.error("[monitoring/webhook] Error al enviar alerta:", err)
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Ejecutar el test para confirmar que pasa**

```bash
npm test tests/monitoring/webhook.test.ts
```

Resultado esperado: 4 tests PASS.

- [ ] **Commit**

```bash
git add app/api/monitoring/webhook/route.ts tests/monitoring/webhook.test.ts
git commit -m "feat: añade endpoint webhook Sentry → Telegram"
```

---

## TAREA 6 — Instrumentar flujo de pagos

**Archivos:**
- Modificar: `app/api/payments/paid/route.ts` (línea 57 — catch block)
- Modificar: `app/api/payments/submissions/route.ts` (líneas 16, 41 — catch blocks)

- [ ] **Modificar `app/api/payments/paid/route.ts`**

Añadir el import al inicio:
```ts
import * as Sentry from "@sentry/nextjs"
```

Reemplazar el catch principal (líneas 56-61 actuales):
```ts
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "BAD_REQUEST", details: err.flatten() }, { status: 400 })
    }
    Sentry.captureException(err, {
      tags: { flow: "payment", step: "submission" },
    })
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
```

- [ ] **Modificar `app/api/payments/submissions/route.ts`**

Añadir el import al inicio:
```ts
import * as Sentry from "@sentry/nextjs"
```

Reemplazar el catch del PATCH (el que tiene `INTERNAL_ERROR`, líneas ~42-50 actuales):
```ts
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
    }
    Sentry.captureException(err, {
      tags: { flow: "payment", step: "confirmation" },
    })
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
```

Reemplazar el catch del GET (el que tiene `INTERNAL_ERROR`):
```ts
  } catch (err) {
    if (err instanceof AuthzError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    Sentry.captureException(err, {
      tags: { flow: "payment", step: "list" },
    })
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
```

- [ ] **Verificar que el build sigue limpio**

```bash
npm run build
```

Resultado esperado: build exitoso sin errores.

- [ ] **Commit**

```bash
git add app/api/payments/paid/route.ts app/api/payments/submissions/route.ts
git commit -m "feat: añade contexto Sentry a rutas críticas de pago"
```

---

## TAREA 7 — Actualizar .env.example

**Archivos:**
- Modificar: `.env.example`

- [ ] **Añadir las nuevas variables a `.env.example`**

Añadir al final del archivo:

```
# Monitorización — Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

# Monitorización — Alertas Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
MONITORING_WEBHOOK_SECRET=
```

- [ ] **Commit**

```bash
git add .env.example
git commit -m "chore: documenta variables de entorno de monitorización"
```

---

## TAREA 8 — Deploy y verificación

- [ ] **Ejecutar todos los tests**

```bash
npm test
```

Resultado esperado: todos los tests PASS.

- [ ] **Build de producción**

```bash
npm run build
```

Resultado esperado: build exitoso.

- [ ] **Reiniciar PM2**

```bash
pm2 restart ferdy-web
```

- [ ] **Configurar alerta en Sentry**

En sentry.io → Proyecto ferdi-coach → Alerts → Create Alert Rule:
- Tipo: Issue Alert
- Condición: `An issue is seen` + `The issue's level is equal to error`
- Entorno: `production`
- Acción: Send a notification via webhooks
- URL del webhook: `https://ferdycoachdesamor.com/api/monitoring/webhook?secret=<MONITORING_WEBHOOK_SECRET>`
- Nombre: `Errores críticos → Telegram`

- [ ] **Enviar un error de prueba para verificar el flujo completo**

Desde el navegador en producción, abrir la consola y ejecutar:
```js
throw new Error("Test Sentry → Telegram")
```

Resultado esperado:
1. El error aparece en el dashboard de Sentry (sentry.io)
2. Llega una alerta al chat de Telegram en menos de 1 minuto

- [ ] **Verificar Core Web Vitals en Sentry**

En sentry.io → Performance → Web Vitals. Debería aparecer data tras una visita a la web en producción.

---

## Resumen de variables de entorno añadidas

| Variable | Dónde obtenerla | Visible en cliente |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | sentry.io → Settings → Client Keys | Sí (por diseño) |
| `SENTRY_ORG` | URL de sentry.io | No |
| `SENTRY_PROJECT` | Nombre del proyecto en Sentry | No |
| `SENTRY_AUTH_TOKEN` | sentry.io → Settings → Auth Tokens | No |
| `TELEGRAM_BOT_TOKEN` | @BotFather en Telegram | No |
| `TELEGRAM_CHAT_ID` | `getUpdates` de la Bot API | No |
| `MONITORING_WEBHOOK_SECRET` | Generado localmente (`openssl rand -hex 32`) | No |
