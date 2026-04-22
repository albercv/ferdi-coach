import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"

import { sendPaymentFailed, sendPaymentReminder, sendPaymentCancelled } from "@/lib/email/emailService"
import { getSubmissionsForTransition, updatePaymentSubmissionStatus } from "@/lib/payments-storage"

export const runtime = "nodejs"

export async function GET(req: Request): Promise<NextResponse> {
  const secret = new URL(req.url).searchParams.get("secret")

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { toOverdue, toFailedWarning, toFailed } = getSubmissionsForTransition()
  const results = { overdue: 0, failedWarning: 0, failed: 0 }

  for (const sub of toOverdue) {
    try {
      const updated = updatePaymentSubmissionStatus({ id: sub.id, status: "overdue" })
      await sendPaymentReminder(updated)
      results.overdue++
    } catch (err) {
      console.error("[cron/payments] Error al pasar a overdue:", sub.id, err)
      Sentry.captureException(err, { tags: { flow: "cron", step: "overdue" } })
    }
  }

  for (const sub of toFailedWarning) {
    try {
      const updated = updatePaymentSubmissionStatus({ id: sub.id, status: "failed_warning" })
      await sendPaymentFailed(updated)
      results.failedWarning++
    } catch (err) {
      console.error("[cron/payments] Error al pasar a failed_warning:", sub.id, err)
      Sentry.captureException(err, { tags: { flow: "cron", step: "failed_warning" } })
    }
  }

  for (const sub of toFailed) {
    try {
      const updated = updatePaymentSubmissionStatus({ id: sub.id, status: "failed" })
      await sendPaymentCancelled(updated)
      results.failed++
    } catch (err) {
      console.error("[cron/payments] Error al pasar a failed:", sub.id, err)
      Sentry.captureException(err, { tags: { flow: "cron", step: "failed" } })
    }
  }

  console.info("[cron/payments] Transiciones completadas:", results)
  return NextResponse.json({ ok: true, ...results })
}
