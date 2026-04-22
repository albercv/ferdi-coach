import fs from "node:fs"
import path from "node:path"

import * as Sentry from "@sentry/nextjs"

import type { PaymentSubmission } from "@/lib/payments"
import { getPaymentsConfig } from "@/lib/payments-storage"
import { resend, EMAIL_FROM, COACH_EMAIL } from "@/lib/email/resendClient"
import {
  buildConfirmacionPagoEmail,
  buildCoachNotificationEmail,
  buildPagoComprobadoEmail,
  buildRecordatorioPagoEmail,
  buildPagoFallidoEmail,
  buildPagoCanceladoEmail,
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

function resolvePublicFilePath(url: string): string {
  const normalized = url.replace(/^\/+/, "")
  return path.join(process.cwd(), "public", normalized)
}

function loadGuideAttachment(
  submission: PaymentSubmission,
): { filename: string; content: Buffer } | null {
  if (submission.productKind !== "guide") return null
  const url = submission.productFileUrl
  if (!url) {
    Sentry.captureMessage("sendPaymentConfirmed: guía sin productFileUrl", {
      level: "warning",
      tags: { flow: "email-delivery" },
      extra: { submissionId: submission.id, productId: submission.productId },
    })
    return null
  }
  const filePath = resolvePublicFilePath(url)
  if (!fs.existsSync(filePath)) {
    Sentry.captureException(new Error(`Guía PDF no encontrada en disco: ${filePath}`), {
      tags: { flow: "email-delivery" },
      extra: { submissionId: submission.id, productId: submission.productId, url },
    })
    return null
  }
  const content = fs.readFileSync(filePath)
  const baseName = submission.productTitle?.trim() || "guia"
  return { filename: `${baseName}.pdf`, content }
}

export async function sendPaymentConfirmed(submission: PaymentSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  // Para guías, intentamos adjuntar el PDF referenciado al hacer el submit.
  // Si la guía no está disponible, NO enviamos un email que prometa adjunto
  // que no existe — en su lugar disparamos alerta a Sentry y dejamos que el
  // coach gestione el caso manualmente.
  const attachment = submission.productKind === "guide" ? loadGuideAttachment(submission) : null
  if (submission.productKind === "guide" && !attachment) {
    return
  }

  const template = buildPagoComprobadoEmail(submission, { guideAttached: !!attachment })
  await resend.emails.send({
    from: EMAIL_FROM,
    to: submission.payerEmail,
    subject: template.subject,
    html: template.html,
    ...(attachment ? { attachments: [attachment] } : {}),
  })
}

export async function sendPaymentReminder(submission: PaymentSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  const { iban } = getPaymentsConfig()
  const template = buildRecordatorioPagoEmail(submission, iban)
  await resend.emails.send({ from: EMAIL_FROM, to: submission.payerEmail, subject: template.subject, html: template.html })
}

export async function sendPaymentFailed(submission: PaymentSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  const { iban } = getPaymentsConfig()
  const template = buildPagoFallidoEmail(submission, iban)
  await resend.emails.send({ from: EMAIL_FROM, to: submission.payerEmail, subject: template.subject, html: template.html })
}

export async function sendPaymentCancelled(submission: PaymentSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  const template = buildPagoCanceladoEmail(submission)
  await resend.emails.send({ from: EMAIL_FROM, to: submission.payerEmail, subject: template.subject, html: template.html })
}
