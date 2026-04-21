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
