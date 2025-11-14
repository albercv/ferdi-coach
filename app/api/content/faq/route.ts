import { NextResponse } from "next/server"
import { getFAQ, setFAQItem, addFAQItem, deleteFAQItem } from "@/lib/content-md"

export async function GET() {
  try {
    const faq = getFAQ()
    return NextResponse.json(faq)
  } catch (e) {
    console.error("GET /api/content/faq failed", e)
    return NextResponse.json({ error: "No se pudo leer las FAQs" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const id = String(body?.id || "").trim()
    const question = String(body?.question || "").trim()
    const answer = String(body?.answer || "").trim()
    const positionRaw = body?.position
    const position = typeof positionRaw === "number" ? positionRaw : Number(positionRaw || 1)

    if (!id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 })
    }
    if (!question) {
      return NextResponse.json({ error: "La pregunta no puede estar vacía" }, { status: 400 })
    }
    if (!answer) {
      return NextResponse.json({ error: "La respuesta no puede estar vacía" }, { status: 400 })
    }
    if (!Number.isFinite(position) || position < 1) {
      return NextResponse.json({ error: "La posición debe ser un número >= 1" }, { status: 400 })
    }

    setFAQItem({ id, question, answer, position })

    // Devolvemos el item actualizado y el listado para facilitar refrescos en cliente
    const faq = getFAQ()
    const updated = faq.items.find((it) => it.id === id)
    return NextResponse.json({ ok: true, item: updated, faq })
  } catch (e: any) {
    console.error("PUT /api/content/faq failed", e)
    const message = typeof e?.message === "string" ? e.message : "No se pudo guardar la FAQ"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const id = body?.id ? String(body.id).trim() : undefined
    const question = String(body?.question || "").trim()
    const answer = String(body?.answer || "").trim()
    const positionRaw = body?.position
    const position = typeof positionRaw === "number" ? positionRaw : Number(positionRaw || 0)

    if (!question) return NextResponse.json({ error: "La pregunta no puede estar vacía" }, { status: 400 })
    if (!answer) return NextResponse.json({ error: "La respuesta no puede estar vacía" }, { status: 400 })
    if (position && (!Number.isFinite(position) || position < 1)) {
      return NextResponse.json({ error: "La posición debe ser un número >= 1" }, { status: 400 })
    }

    // Fallback de actualización: si viene id, tratamos POST como update
    if (id) {
      const pos = position || 1
      if (!Number.isFinite(pos) || pos < 1) {
        return NextResponse.json({ error: "La posición debe ser un número >= 1" }, { status: 400 })
      }
      setFAQItem({ id, question, answer, position: pos })
      const faq = getFAQ()
      const updated = faq.items.find((it) => it.id === id)
      return NextResponse.json({ ok: true, item: updated, faq })
    }

    const created = addFAQItem({ id, question, answer, position: position || undefined })
    const faq = getFAQ()
    return NextResponse.json({ ok: true, item: created, faq })
  } catch (e: any) {
    console.error("POST /api/content/faq failed", e)
    const message = typeof e?.message === "string" ? e.message : "No se pudo crear la FAQ"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = String(searchParams.get("id") || "").trim()
    if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

    deleteFAQItem(id)
    const faq = getFAQ()
    return NextResponse.json({ ok: true, faq })
  } catch (e: any) {
    console.error("DELETE /api/content/faq failed", e)
    const message = typeof e?.message === "string" ? e.message : "No se pudo eliminar la FAQ"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}