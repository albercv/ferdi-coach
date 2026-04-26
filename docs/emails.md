---
title: "Sistema de emails transaccionales"
description: "Resend, plantillas React, triggers y debugging."
category: "dev"
tags: ["email", "resend", "transaccional", "plantillas"]
audience: ["dev", "user"]
order: 40
---

# Emails transaccionales

## Proveedor

[Resend](https://resend.com) — SDK oficial (`resend@^6`). Las plantillas se escriben en React (TSX) y Resend las renderiza a HTML.

## Variables de entorno

| Variable | Para qué |
|---|---|
| `RESEND_API_KEY` | Clave de API (`re_...`) |
| `COACH_NOTIFICATION_EMAIL` | Email donde llegan las notificaciones internas |
| `EMAIL_FROM` | Remitente verificado en Resend (ej. `noreply@ferdycoachdesamor.com`) |

Si falta `RESEND_API_KEY`, el cliente devuelve `null` y `emailService` registra el intento sin enviar (no rompe la app).

## Triggers

| Evento | Función | Plantilla |
|---|---|---|
| Cliente envía formulario de pago | `sendSubmissionEmails(submission)` | `ConfirmacionCompra.tsx` (cliente) y `NotificacionCoach.tsx` (coach) |
| Coach marca pago como `confirmed` | `sendDeliveryEmail(submission)` | `EntregaProducto.tsx` (con guía adjunta o instrucciones de sesión) |

## Estructura de carpetas

```
lib/email/
  resendClient.ts          Singleton del cliente
  emailService.ts          Funciones públicas (las llaman las routes)
  templates/
    ConfirmacionCompra.tsx
    NotificacionCoach.tsx
    EntregaProducto.tsx
```

## Adjuntar PDF de la guía

`EntregaProducto.tsx` recibe el path del PDF (`content/uploads/...`), lo lee con `fs.readFile`, lo codifica en base64 y lo pasa a Resend como `attachments`. Esto evita servir el PDF públicamente.

## Debugging

1. Mirar el dashboard de Resend → Activity → filtrar por destinatario.
2. Si el email aparece como **delivered** pero no llega: revisar SPAM y verificar SPF + DKIM del dominio.
3. Si el email **no aparece** en Resend: revisar logs del servidor (`pm2 logs ferdy-web`). Buscar `"[email]"`.
4. Si el envío bloquea la respuesta HTTP: las llamadas a `sendSubmissionEmails` deben ser `void` (fire-and-forget).

## Sandbox vs producción

En sandbox de Resend solo puedes enviar a tu propio email. Para enviar a clientes reales necesitas **dominio verificado**. La verificación lleva ~30 min (DNS propagation).
