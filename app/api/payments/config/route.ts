import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { assertAdmin, AuthzError } from "@/lib/auth/assertAdmin"
import { getPaymentsConfig, setPaymentsIban } from "@/lib/payments-storage"

export const runtime = "nodejs"

export async function GET() {
  const config = getPaymentsConfig()
  return NextResponse.json(config)
}

const PutSchema = z.object({
  iban: z.string().trim().min(8).max(64),
})

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    assertAdmin(session)

    const body = PutSchema.parse(await req.json())
    const updated = setPaymentsIban(body.iban)
    return NextResponse.json(updated)
  } catch (err) {
    if (err instanceof AuthzError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "BAD_REQUEST", details: err.flatten() }, { status: 400 })
    }
    Sentry.captureException(err, { tags: { flow: "content-write", route: "payments-config", method: "PUT" } })
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}
