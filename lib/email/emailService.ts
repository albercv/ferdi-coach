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
