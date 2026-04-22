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

export function buildPagoFallidoEmail(s: PaymentSubmission, iban: string): EmailTemplate {
  return {
    subject: `Tienes 3 días para completar tu pago — ${s.productTitle}`,
    html: buildWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0d0d0d;">Aún estás a tiempo</h2>
      <p>Hola <strong>${s.payerName}</strong>,</p>
      <p>Todavía no hemos recibido la transferencia correspondiente a <strong>${s.productTitle}</strong>. Tienes <strong>3 días</strong> para realizarla antes de que procedamos a cancelar la solicitud.</p>
      ${accentBlock(`
        <strong>IBAN:</strong> ${iban}<br/>
        <strong>Importe:</strong> ${s.amountEuro} €<br/>
        <strong>Concepto:</strong> ${s.conceptShort} - ${s.payerName}
      `)}
      <p>Si ya realizaste el ingreso o tienes algún problema, responde a este email y lo resolvemos.</p>
      <p>Un saludo,<br/><strong>Ferdy</strong></p>
    `),
  }
}

export function buildPagoCanceladoEmail(s: PaymentSubmission): EmailTemplate {
  return {
    subject: `Solicitud cancelada — ${s.productTitle}`,
    html: buildWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0d0d0d;">Solicitud cancelada</h2>
      <p>Hola <strong>${s.payerName}</strong>,</p>
      <p>Hemos cancelado tu solicitud de <strong>${s.productTitle}</strong> al no haber recibido el pago en el plazo establecido.</p>
      <p><strong>Por favor, no realices ya ninguna transferencia</strong> para esta solicitud, ya que no podría ser procesada.</p>
      <p>Si deseas retomar el proceso, puedes volver a hacer una reserva desde la web en cualquier momento.</p>
      <p>Un saludo,<br/><strong>Ferdy</strong></p>
    `),
  }
}
