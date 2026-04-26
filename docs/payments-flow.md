---
title: "Flujo de pagos"
description: "Pago por transferencia, estados, emails disparados y arquitectura de submissions."
category: "dev"
tags: ["pagos", "transferencia", "submissions", "iban"]
audience: ["dev", "user"]
order: 30
---

# Flujo de pagos

## Modelo de pago

Ferdy Coach **no usa pasarela de pago**. El cobro es por **transferencia bancaria** al IBAN configurado en `content/payments/config.md`. Esto simplifica el cumplimiento PCI a cambio de un paso manual de verificación.

## Diagrama de estados

```
[ Cliente abre PaymentDialog ]
            │
            ▼
[ Rellena formulario + acepta condiciones ]
            │
            ▼
   POST /api/payments/paid           ──► Crea submission con status="awaiting_proof"
            │
            ▼
[ Resend envía 2 emails ]
   ├─ ConfirmacionCompra.tsx → cliente
   └─ NotificacionCoach.tsx  → coach
            │
            ▼
[ Coach revisa banco y entra al dashboard, tab Pagos ]
            │
            ▼
   PATCH /api/payments/submissions { id, status: "confirmed" }
            │
            ▼
[ Resend envía EntregaProducto.tsx ]
   ├─ Si producto = guía → email con enlace/adjunto
   └─ Si producto = sesión → email con instrucciones de reserva
            │
            ▼
        ✅ done
```

## Submissions: persistencia

Cada solicitud se guarda como un fichero individual en:

```
content/payments/submissions/<id>.md
```

Frontmatter típico:

```yaml
---
id: "sub_1714117200_abc123"
createdAt: "2026-04-26T10:00:00Z"
status: "awaiting_proof"
amount: 49
currency: "EUR"
productSlug: "guia-primeros-30-dias"
productKind: "guide"
buyer:
  name: "..."
  email: "..."
  phone: "..."
---
Notas opcionales del cliente.
```

> ⚠️ **Crítico**: este directorio NO se versiona en git. Antes de cada deploy: backup. Ver [Despliegue](#/deployment).

## Endpoints

| Método | Ruta | Quién | Para qué |
|---|---|---|---|
| `POST` | `/api/payments/paid` | público | Crea submission y dispara emails |
| `GET` | `/api/payments/submissions` | admin | Lista submissions |
| `PATCH` | `/api/payments/submissions` | admin | Cambia estado de una submission |
| `GET` | `/api/cron/payments-transitions` | cron (token) | Expira pendientes ≥30 días |

Todos los endpoints `admin` están protegidos con `assertAdmin`. El cron requiere el header `x-cron-secret` igual a `process.env.CRON_SECRET`.

## Detalles de implementación

- `lib/payments-storage.ts` — read/write de submissions, atómico vía `fs.writeFileSync`.
- `lib/payments.ts` — cálculo de importes, validaciones, slugs.
- `components/payments/PaymentDialog.tsx` — modal con formulario.
- `lib/email/emailService.ts` — funciones `sendSubmissionEmails()` y `sendDeliveryEmail()`.

## Errores frecuentes

- **El cliente paga y no recibe email**: revisar logs de Resend (dashboard de su web). La causa habitual es dominio no verificado.
- **Submission no aparece en el dashboard**: posiblemente `content/payments/submissions/` no existe en producción. Crear el directorio y reiniciar PM2.
