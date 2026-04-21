import type { PaymentSubmission } from "@/lib/payments"
import { getPaymentsConfig } from "@/lib/payments-storage"
import { resend, EMAIL_FROM, COACH_EMAIL } from "@/lib/email/resendClient"

export async function sendPaymentConfirmation(submission: PaymentSubmission): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  const config = getPaymentsConfig()

  await Promise.allSettled([
    resend.emails.send({
      from: EMAIL_FROM,
      to: submission.payerEmail,
      subject: `Hemos recibido tu solicitud — ${submission.productTitle}`,
      html: buildClientEmail(submission, config.iban),
    }),
    resend.emails.send({
      from: EMAIL_FROM,
      to: COACH_EMAIL,
      subject: `Nueva solicitud de pago — ${submission.payerName}`,
      html: buildCoachEmail(submission),
    }),
  ])
}

function buildClientEmail(s: PaymentSubmission, iban: string): string {
  return `
    <p>Hola ${s.payerName},</p>
    <p>Hemos recibido tu solicitud para <strong>${s.productTitle}</strong>.</p>
    <p>Para completar la reserva, realiza la transferencia:</p>
    <ul>
      <li><strong>IBAN:</strong> ${iban}</li>
      <li><strong>Importe:</strong> ${s.amountEuro} €</li>
      <li><strong>Concepto:</strong> ${s.conceptShort} - ${s.payerName}</li>
    </ul>
    <p>En cuanto confirmemos el pago te lo haremos saber.</p>
    <p>— Ferdy Coach</p>
  `
}

function buildCoachEmail(s: PaymentSubmission): string {
  return `
    <p>Nueva solicitud de pago recibida.</p>
    <ul>
      <li><strong>Cliente:</strong> ${s.payerName} (${s.payerEmail})</li>
      ${s.payerPhone ? `<li><strong>Teléfono:</strong> ${s.payerPhone}</li>` : ""}
      <li><strong>Producto:</strong> ${s.productTitle}</li>
      <li><strong>Importe:</strong> ${s.amountEuro} €</li>
      <li><strong>Concepto:</strong> ${s.conceptShort} - ${s.payerName}</li>
      <li><strong>Fecha:</strong> ${new Date(s.createdAtIso).toLocaleString("es-ES")}</li>
    </ul>
  `
}
