# Emails Transaccionales — Plan de Implementación (fase 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir emails estilizados para todos los estados del flujo de pago y lógica de recordatorio/expiración en el dashboard.

**Architecture:** Un módulo `lib/email/templates.ts` centraliza todos los templates HTML con el estilo de la marca (inline CSS). El `emailService.ts` orquesta los envíos. El endpoint PATCH de submissions se extiende para soportar la acción `remind` además de cambios de estado. El dashboard muestra la fecha de inicio y botones condicionales según los días transcurridos.

**Tech Stack:** Resend SDK, HTML emails con inline CSS, Next.js App Router, Vitest.

---

## Colores inline para emails

```
background wrapper: #f5f5f5
card background:    #ffffff
header background:  #0d0d0d
accent/gold:        #b6ac69
text primary:       #0d0d0d
text muted:         #6b7280
border:             #e5e5e5
```

Logo URL: `https://ferdycoachdesamor.com/logo2.webp`

---

## Mapa de archivos

| Acción | Archivo | Responsabilidad |
|--------|---------|----------------|
| Crear | `lib/email/templates.ts` | Wrapper HTML + 5 builders de template |
| Modificar | `lib/email/emailService.ts` | Añadir sendPaymentConfirmed, sendPaymentFailed, sendPaymentReminder; refactorizar sendPaymentConfirmation |
| Modificar | `app/api/payments/submissions/route.ts` | Trigger emails en cambio de estado + acción remind |
| Modificar | `components/dashboard/PaymentsTab.tsx` | Mostrar fecha inicio, botones condicionales, acción recordatorio |

---

## TAREA 1 — Templates HTML de email

**Archivos:**
- Crear: `lib/email/templates.ts`

### Descripción

Todos los emails comparten el mismo wrapper visual (cabecera negra con logo, contenido blanco, pie de página). Cada builder devuelve `{ subject: string; html: string }`.

Los 5 builders:
1. `buildConfirmacionPagoEmail(submission, iban)` — confirmación al cliente al registrar pago
2. `buildCoachNotificationEmail(submission)` — notificación interna al coach
3. `buildPagoComprobadoEmail(submission)` — al cliente cuando el coach confirma
4. `buildRecordatorioPagoEmail(submission, iban)` — recordatorio al cliente si no ha llegado el pago
5. `buildPagoFallidoEmail(submission)` — al cliente cuando el coach marca como fallido

- [ ] **Crear `lib/email/templates.ts`**

```ts
import type { PaymentSubmission } from "@/lib/payments"

interface EmailTemplate {
  subject: string
  html: string
}

function buildWrapper(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:#0d0d0d;padding:24px;text-align:center;">
            <img src="https://ferdycoachdesamor.com/logo2.webp" alt="Ferdy Coach" height="48" style="display:block;margin:0 auto;" />
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;color:#0d0d0d;font-size:15px;line-height:1.6;">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="background:#f9f9f9;padding:16px 40px;text-align:center;border-top:1px solid #e5e5e5;">
            <p style="margin:0;font-size:12px;color:#6b7280;">Ferdy Coach · ferdycoachdesamor.com</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Si tienes alguna duda, responde directamente a este email.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function accentBlock(text: string): string {
  return `<div style="border-left:4px solid #b6ac69;padding:12px 16px;background:#faf9f4;margin:16px 0;font-size:14px;">${text}</div>`
}

export function buildConfirmacionPagoEmail(s: PaymentSubmission, iban: string): EmailTemplate {
  return {
    subject: `Hemos recibido tu solicitud — ${s.productTitle}`,
    html: buildWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0d0d0d;">Solicitud recibida</h2>
      <p>Hola <strong>${s.payerName}</strong>,</p>
      <p>Hemos registrado tu solicitud para <strong>${s.productTitle}</strong>. Para confirmar tu plaza, realiza la transferencia bancaria con los siguientes datos:</p>
      ${accentBlock(`
        <strong>IBAN:</strong> ${iban}<br/>
        <strong>Importe:</strong> ${s.amountEuro} €<br/>
        <strong>Concepto:</strong> ${s.conceptShort} - ${s.payerName}
      `)}
      <p>En cuanto verifiquemos el ingreso te lo confirmaremos por email. Si tienes cualquier duda, responde a este mensaje.</p>
      <p>Gracias por confiar en mí,<br/><strong>Ferdy</strong></p>
    `),
  }
}

export function buildCoachNotificationEmail(s: PaymentSubmission): EmailTemplate {
  return {
    subject: `Nueva solicitud de pago — ${s.payerName}`,
    html: buildWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0d0d0d;">Nueva solicitud de pago</h2>
      ${accentBlock(`
        <strong>Cliente:</strong> ${s.payerName}<br/>
        <strong>Email:</strong> ${s.payerEmail}<br/>
        ${s.payerPhone ? `<strong>Teléfono:</strong> ${s.payerPhone}<br/>` : ""}
        <strong>Producto:</strong> ${s.productTitle}<br/>
        <strong>Importe:</strong> ${s.amountEuro} €<br/>
        <strong>Concepto:</strong> ${s.conceptShort} - ${s.payerName}<br/>
        <strong>Fecha:</strong> ${new Date(s.createdAtIso).toLocaleString("es-ES")}
      `)}
      <p>Accede al <a href="https://ferdycoachdesamor.com/dashboard" style="color:#b6ac69;">dashboard</a> para gestionar el pago.</p>
    `),
  }
}

export function buildPagoComprobadoEmail(s: PaymentSubmission): EmailTemplate {
  const isSession = s.productKind === "session"
  return {
    subject: `Pago confirmado — ${s.productTitle}`,
    html: buildWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0d0d0d;">¡Pago confirmado!</h2>
      <p>Hola <strong>${s.payerName}</strong>,</p>
      <p>Hemos confirmado el ingreso correspondiente a <strong>${s.productTitle}</strong>.</p>
      ${isSession
        ? `<p>En breve me pondré en contacto contigo para coordinar los próximos pasos.</p>`
        : `<p>Tu guía estará disponible en breve. Te enviaremos un email con el acceso.</p>`
      }
      <p>Gracias por tu confianza,<br/><strong>Ferdy</strong></p>
    `),
  }
}

export function buildRecordatorioPagoEmail(s: PaymentSubmission, iban: string): EmailTemplate {
  return {
    subject: `Recordatorio de pago — ${s.productTitle}`,
    html: buildWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0d0d0d;">Recordatorio de transferencia</h2>
      <p>Hola <strong>${s.payerName}</strong>,</p>
      <p>Te escribimos porque registraste una solicitud para <strong>${s.productTitle}</strong> y aún no hemos recibido la transferencia.</p>
      ${accentBlock(`
        <strong>IBAN:</strong> ${iban}<br/>
        <strong>Importe:</strong> ${s.amountEuro} €<br/>
        <strong>Concepto:</strong> ${s.conceptShort} - ${s.payerName}
      `)}
      <p>Si ya realizaste el ingreso, ignora este mensaje — puede que aún esté procesándose. Si tienes algún problema, responde a este email y te ayudamos.</p>
      <p>Un saludo,<br/><strong>Ferdy</strong></p>
    `),
  }
}

export function buildPagoFallidoEmail(s: PaymentSubmission): EmailTemplate {
  return {
    subject: `Solicitud cancelada — ${s.productTitle}`,
    html: buildWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0d0d0d;">Solicitud cancelada</h2>
      <p>Hola <strong>${s.payerName}</strong>,</p>
      <p>Lamentablemente no hemos recibido el ingreso correspondiente a tu solicitud de <strong>${s.productTitle}</strong>, por lo que la hemos cancelado.</p>
      <p>Si crees que esto es un error o quieres volver a intentarlo, responde a este email y lo resolvemos.</p>
      <p>Un saludo,<br/><strong>Ferdy</strong></p>
    `),
  }
}
```

- [ ] **Commit**

```bash
git add lib/email/templates.ts
git commit -m "feat: añade templates HTML estilizados para todos los emails de pago"
```

---

## TAREA 2 — Refactorizar emailService con los nuevos templates

**Archivos:**
- Modificar: `lib/email/emailService.ts`

- [ ] **Reemplazar el contenido de `lib/email/emailService.ts`**

```ts
import type { PaymentSubmission } from "@/lib/payments"
import { getPaymentsConfig } from "@/lib/payments-storage"
import { resend, EMAIL_FROM, COACH_EMAIL } from "@/lib/email/resendClient"
import {
  buildConfirmacionPagoEmail,
  buildCoachNotificationEmail,
  buildPagoComprobadoEmail,
  buildRecordatorioPagoEmail,
  buildPagoFallidoEmail,
} from "@/lib/email/templates"

export async function sendPaymentConfirmation(submission: PaymentSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  const { iban } = getPaymentsConfig()
  const clientEmail = buildConfirmacionPagoEmail(submission, iban)
  const coachEmail = buildCoachNotificationEmail(submission)

  await Promise.allSettled([
    resend.emails.send({ from: EMAIL_FROM, to: submission.payerEmail, subject: clientEmail.subject, html: clientEmail.html }),
    resend.emails.send({ from: EMAIL_FROM, to: COACH_EMAIL, subject: coachEmail.subject, html: coachEmail.html }),
  ])
}

export async function sendPaymentConfirmed(submission: PaymentSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  const template = buildPagoComprobadoEmail(submission)
  await resend.emails.send({ from: EMAIL_FROM, to: submission.payerEmail, subject: template.subject, html: template.html })
}

export async function sendPaymentReminder(submission: PaymentSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  const { iban } = getPaymentsConfig()
  const template = buildRecordatorioPagoEmail(submission, iban)
  await resend.emails.send({ from: EMAIL_FROM, to: submission.payerEmail, subject: template.subject, html: template.html })
}

export async function sendPaymentFailed(submission: PaymentSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  const template = buildPagoFallidoEmail(submission)
  await resend.emails.send({ from: EMAIL_FROM, to: submission.payerEmail, subject: template.subject, html: template.html })
}
```

- [ ] **Commit**

```bash
git add lib/email/emailService.ts
git commit -m "refactor: emailService usa templates centralizados y añade confirmed/failed/reminder"
```

---

## TAREA 3 — Extender API PATCH de submissions

**Archivos:**
- Modificar: `app/api/payments/submissions/route.ts`

Los cambios son:
1. El schema PATCH acepta `action: "remind"` como alternativa a `status`.
2. Cuando `status === "confirmed"` → `void sendPaymentConfirmed(updated)`
3. Cuando `status === "failed"` → `void sendPaymentFailed(updated)`
4. Cuando `action === "remind"` → busca la submission y llama `void sendPaymentReminder(submission)`

- [ ] **Reemplazar el contenido de `app/api/payments/submissions/route.ts`**

```ts
import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { assertAdmin, AuthzError } from "@/lib/auth/assertAdmin"
import { sendPaymentConfirmed, sendPaymentFailed, sendPaymentReminder } from "@/lib/email/emailService"
import { listPaymentSubmissions, updatePaymentSubmissionStatus } from "@/lib/payments-storage"

export const runtime = "nodejs"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    assertAdmin(session)
    return NextResponse.json({ submissions: listPaymentSubmissions() })
  } catch (err) {
    if (err instanceof AuthzError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    Sentry.captureException(err, { tags: { flow: "payment", step: "list" } })
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}

const PatchSchema = z.union([
  z.object({
    id: z.string().trim().min(1),
    status: z.enum(["pending", "confirmed", "failed"]),
  }),
  z.object({
    id: z.string().trim().min(1),
    action: z.literal("remind"),
  }),
])

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    assertAdmin(session)

    const body = PatchSchema.parse(await req.json())

    if ("action" in body && body.action === "remind") {
      const submission = listPaymentSubmissions().find((s) => s.id === body.id)
      if (!submission) {
        return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
      }
      void sendPaymentReminder(submission)
      return NextResponse.json({ ok: true })
    }

    const updated = updatePaymentSubmissionStatus({
      id: body.id,
      status: body.status,
      updatedByEmail: session?.user?.email ?? undefined,
    })

    if (body.status === "confirmed") void sendPaymentConfirmed(updated)
    if (body.status === "failed") void sendPaymentFailed(updated)

    return NextResponse.json({ submission: updated })
  } catch (err) {
    if (err instanceof AuthzError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "BAD_REQUEST", details: err.flatten() }, { status: 400 })
    }
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
    }
    Sentry.captureException(err, { tags: { flow: "payment", step: "confirmation" } })
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}
```

- [ ] **Commit**

```bash
git add app/api/payments/submissions/route.ts
git commit -m "feat: PATCH submissions soporta acción remind y dispara emails en cambio de estado"
```

---

## TAREA 4 — Dashboard: fecha de inicio y botones condicionales

**Archivos:**
- Modificar: `components/dashboard/PaymentsTab.tsx`

Cambios:
1. Añadir helpers `daysSince(iso)` y `formatDate(iso)`.
2. Mostrar fecha y hora de inicio en cada tarjeta.
3. Para submissions `pending`:
   - Siempre: botón "Comprobado"
   - `daysSince >= 2 && daysSince < 5`: botón "Recordatorio" (no cambia estado, llama `action: "remind"`)
   - `daysSince >= 5`: botón "Fallido"
   - `daysSince < 2`: solo botón "Comprobado"
4. Para submissions `confirmed` o `failed`: botón "Reabrir" (vuelve a pending, sin email).
5. Estado de carga propio para el botón "Recordatorio" (no bloquea el resto de la UI).

- [ ] **Reemplazar el contenido de `components/dashboard/PaymentsTab.tsx`**

```tsx
"use client"

import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { PaymentSubmission } from "@/lib/payments"

type StatusFilter = "all" | "pending" | "confirmed" | "failed"

function formatEuro(amount: number): string {
  return `${Number.isFinite(amount) ? amount.toFixed(0) : "0"}€`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
}

function statusBadge(status: PaymentSubmission["status"]) {
  if (status === "confirmed") return <Badge className="bg-green-600 hover:bg-green-600 text-white">Comprobado</Badge>
  if (status === "failed") return <Badge className="bg-red-600 hover:bg-red-600 text-white">Fallido</Badge>
  return <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white">Pendiente</Badge>
}

export function PaymentsTab() {
  const { toast } = useToast()
  const [iban, setIban] = useState("")
  const [savingIban, setSavingIban] = useState(false)
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [filter, setFilter] = useState<StatusFilter>("pending")
  const [remindingId, setRemindingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (filter === "all") return submissions
    return submissions.filter((s) => s.status === filter)
  }, [filter, submissions])

  async function loadAll() {
    setLoadingSubmissions(true)
    try {
      const [configRes, subsRes] = await Promise.all([
        fetch("/api/payments/config", { cache: "no-store" }),
        fetch("/api/payments/submissions", { cache: "no-store" }),
      ])
      if (configRes.ok) {
        const config = await configRes.json()
        if (typeof config?.iban === "string") setIban(config.iban)
      }
      if (subsRes.ok) {
        const data = await subsRes.json()
        if (Array.isArray(data?.submissions)) setSubmissions(data.submissions)
      }
    } finally {
      setLoadingSubmissions(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  async function saveIban() {
    const value = iban.trim()
    if (value.length < 8) {
      toast({ title: "IBAN inválido", description: "Introduce un IBAN válido." })
      return
    }
    setSavingIban(true)
    try {
      const res = await fetch("/api/payments/config", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ iban: value }),
      })
      if (!res.ok) {
        toast({ title: "No se pudo guardar", description: "Revisa que sigues logado como admin." })
        return
      }
      toast({ title: "Guardado", description: "IBAN actualizado." })
      await loadAll()
    } finally {
      setSavingIban(false)
    }
  }

  async function updateStatus(id: string, status: PaymentSubmission["status"]) {
    const prev = submissions
    setSubmissions((current) => current.map((s) => (s.id === id ? { ...s, status } : s)))
    try {
      const res = await fetch("/api/payments/submissions", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) {
        setSubmissions(prev)
        toast({ title: "No se pudo actualizar", description: "Inténtalo de nuevo." })
        return
      }
      const data = await res.json()
      if (data?.submission?.id) {
        setSubmissions((current) => current.map((s) => (s.id === id ? data.submission : s)))
      }
    } catch {
      setSubmissions(prev)
      toast({ title: "Error", description: "No se pudo conectar." })
    }
  }

  async function sendReminder(id: string) {
    setRemindingId(id)
    try {
      const res = await fetch("/api/payments/submissions", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, action: "remind" }),
      })
      if (!res.ok) {
        toast({ title: "No se pudo enviar", description: "Inténtalo de nuevo." })
        return
      }
      toast({ title: "Recordatorio enviado", description: "El email ha sido enviado al cliente." })
    } catch {
      toast({ title: "Error", description: "No se pudo conectar." })
    } finally {
      setRemindingId(null)
    }
  }

  function renderButtons(s: PaymentSubmission) {
    if (s.status !== "pending") {
      return (
        <Button size="sm" variant="outline" onClick={() => updateStatus(s.id, "pending")}>
          Reabrir
        </Button>
      )
    }

    const age = daysSince(s.createdAtIso)

    return (
      <>
        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(s.id, "confirmed")}>
          Comprobado
        </Button>
        {age >= 2 && age < 5 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => sendReminder(s.id)}
            disabled={remindingId === s.id}
          >
            {remindingId === s.id ? "Enviando..." : "Recordatorio"}
          </Button>
        )}
        {age >= 5 && (
          <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => updateStatus(s.id, "failed")}>
            Fallido
          </Button>
        )}
      </>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>IBAN para transferencias</CardTitle>
          <CardDescription>Este IBAN se muestra en los modales de pago.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="payments-iban">IBAN</Label>
            <Input id="payments-iban" value={iban} onChange={(e) => setIban(e.target.value)} placeholder="ES00...." />
          </div>
          <Button onClick={saveIban} disabled={savingIban} className="w-full sm:w-auto">
            {savingIban ? "Guardando..." : "Guardar"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagos</CardTitle>
          <CardDescription>Gestión de solicitudes de pago.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>Pendientes</Button>
            <Button variant={filter === "confirmed" ? "default" : "outline"} size="sm" onClick={() => setFilter("confirmed")}>Comprobados</Button>
            <Button variant={filter === "failed" ? "default" : "outline"} size="sm" onClick={() => setFilter("failed")}>Fallidos</Button>
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>Todos</Button>
            <Button variant="ghost" size="sm" onClick={loadAll} disabled={loadingSubmissions}>Recargar</Button>
          </div>

          {filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {loadingSubmissions ? "Cargando..." : "No hay pagos en este estado."}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((s) => (
                <div key={s.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{s.productTitle}</div>
                      <div className="text-xs text-muted-foreground">{formatEuro(s.amountEuro)} · {s.conceptShort}</div>
                    </div>
                    <div className="flex-shrink-0">{statusBadge(s.status)}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{s.payerName}</div>
                    <div className="text-muted-foreground break-all">{s.payerEmail}</div>
                    {s.payerPhone && <div className="text-muted-foreground">{s.payerPhone}</div>}
                    <div className="text-xs text-muted-foreground mt-1">Inicio: {formatDate(s.createdAtIso)}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {renderButtons(s)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add components/dashboard/PaymentsTab.tsx
git commit -m "feat: dashboard muestra fecha de inicio y botones condicionales por antigüedad"
```

---

## TAREA 5 — Build y deploy

- [ ] **Verificar build**

```bash
npm run build
```

Resultado esperado: build exitoso sin errores.

- [ ] **Deploy**

```bash
pm2 restart ferdy-web --update-env
```

- [ ] **Verificar flujo completo**

1. Hacer una compra de prueba → llega email estilizado al cliente + notificación al coach
2. En el dashboard → "Comprobado" → llega email de confirmación al cliente
3. Esperar 2 días (o ajustar `createdAtIso` manualmente en el `.md` de la submission para simular) → aparece botón "Recordatorio"
4. Pulsar "Recordatorio" → llega email de recordatorio al cliente
5. Con más de 5 días → aparece botón "Fallido" → pulsar → llega email de cancelación al cliente

---

## Lógica de botones — resumen visual

| Días desde inicio | Botones visibles (estado `pending`) |
|---|---|
| < 2 días | Comprobado |
| 2–5 días | Comprobado · Recordatorio |
| ≥ 5 días | Comprobado · Fallido |
| estado `confirmed` o `failed` | Reabrir |
