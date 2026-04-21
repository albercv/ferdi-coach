import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import type { PaymentProductRef } from "@/lib/payments"
import { createPaymentSubmission } from "@/lib/payments-storage"
import { getProducts } from "@/lib/products-md"

export const runtime = "nodejs"

const PostSchema = z.object({
  productId: z.string().trim().min(1).max(80),
  payerName: z.string().trim().min(2).max(80),
  payerEmail: z.string().trim().email().max(120),
  payerPhone: z
    .string()
    .trim()
    .min(7)
    .max(30)
    .regex(/^[0-9+()\s-]+$/)
    .optional(),
})

function resolveProductRefById(productId: string): PaymentProductRef | null {
  const { guides, sessions } = getProducts()
  const g = guides.find((it) => it.id === productId)
  if (g) {
    return { kind: "guide", id: g.id, title: g.title, priceEuro: Number(g.price || 0) }
  }
  const s = sessions.find((it) => it.id === productId)
  if (s) {
    return { kind: "session", id: s.id, subtype: s.subtype, title: s.title, priceEuro: Number(s.price || 0) }
  }
  return null
}

export async function POST(req: Request) {
  try {
    const body = PostSchema.parse(await req.json())
    const product = resolveProductRefById(body.productId)
    if (!product) {
      return NextResponse.json({ error: "UNKNOWN_PRODUCT" }, { status: 400 })
    }

    if (!Number.isFinite(product.priceEuro) || product.priceEuro <= 0) {
      return NextResponse.json({ error: "INVALID_AMOUNT" }, { status: 400 })
    }

    const created = createPaymentSubmission({
      product,
      payerName: body.payerName,
      payerEmail: body.payerEmail,
      payerPhone: body.payerPhone,
    })

    return NextResponse.json({ id: created.id, status: created.status })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "BAD_REQUEST", details: err.flatten() }, { status: 400 })
    }
    Sentry.captureException(err, { tags: { flow: "payment", step: "submission" } })
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}
