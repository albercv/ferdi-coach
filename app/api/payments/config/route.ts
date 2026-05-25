import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { assertAdmin, AuthzError } from "@/lib/auth/assertAdmin"
import { getPaymentsConfig, setPaymentsConfig } from "@/lib/payments-storage"

export const runtime = "nodejs"

export async function GET() {
  const config = getPaymentsConfig()
  return NextResponse.json(config)
}

const SWIFT_REGEX = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/

const PutSchema = z.object({
  iban: z.string().trim().min(8).max(64),
  swift: z
    .string()
    .trim()
    .toUpperCase()
    .regex(SWIFT_REGEX, "SWIFT/BIC debe tener 8 u 11 caracteres alfanuméricos en mayúsculas")
    .optional()
    .or(z.literal("")),
  bankName: z.string().trim().max(128).optional().or(z.literal("")),
})

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    assertAdmin(session)

    const body = PutSchema.parse(await req.json())
    const updated = setPaymentsConfig({ iban: body.iban, swift: body.swift ?? "", bankName: body.bankName ?? "" })
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
