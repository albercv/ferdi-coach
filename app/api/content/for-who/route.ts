import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { assertAdmin } from "@/lib/auth/assertAdmin"
import { ForWhoContent, getForWho, setForWho } from "@/lib/content-md"

export async function GET() {
  try {
    const content = getForWho()
    return NextResponse.json(content)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error leyendo for-who" }, { status: 500 })
  }
}

async function save(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    assertAdmin(session)
  } catch {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  try {
    const body = await req.json()

    const title = String(body?.title || "").trim()
    const subtitle = String(body?.subtitle || "").trim()
    const ctaText = String(body?.ctaText || "").trim()
    const ctaHref = String(body?.ctaHref || "").trim()

    if (!title) return NextResponse.json({ error: "title es requerido" }, { status: 400 })
    if (!subtitle) return NextResponse.json({ error: "subtitle es requerido" }, { status: 400 })
    if (!ctaText) return NextResponse.json({ error: "ctaText es requerido" }, { status: 400 })
    if (!ctaHref) return NextResponse.json({ error: "ctaHref es requerido" }, { status: 400 })

    const cardsRaw: any[] = Array.isArray(body?.cards) ? body.cards : []
    const cards = cardsRaw
      .map((c: any, idx: number) => ({
        id: String(c?.id ?? String(idx + 1)),
        position: Number(c?.position ?? idx + 1),
        icon: String(c?.icon || "heart-crack"),
        title: String(c?.title || "").trim(),
        description: String(c?.description || "").trim(),
      }))
      .filter((c) => !!c.title && !!c.description)
      .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
      .map((c, idx) => ({ ...c, position: idx + 1 }))

    if (cards.length === 0) return NextResponse.json({ error: "cards es requerido" }, { status: 400 })

    const next: ForWhoContent = {
      title,
      subtitle,
      ctaText,
      ctaHref,
      cards,
    }

    setForWho(next)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    Sentry.captureException(err, { tags: { flow: "content-write", route: "for-who" } })
    return NextResponse.json({ error: err?.message || "Error guardando for-who" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  return save(req)
}

export async function POST(req: Request) {
  return save(req)
}

