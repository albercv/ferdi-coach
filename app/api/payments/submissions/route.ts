import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { assertAdmin, AuthzError } from "@/lib/auth/assertAdmin"
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
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}

const PatchSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["pending", "confirmed", "failed"]),
})

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    assertAdmin(session)

    const body = PatchSchema.parse(await req.json())
    const updated = updatePaymentSubmissionStatus({
      id: body.id,
      status: body.status,
      updatedByEmail: session?.user?.email ?? undefined,
    })
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
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}
