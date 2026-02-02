import { NextResponse } from "next/server"
import { getTestimonials, addTestimonialItem, setTestimonialItem, deleteTestimonialItem } from "@/lib/content-md"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { assertAdmin } from "@/lib/auth/assertAdmin"
import { MediaService } from "@/lib/media/mediaService"

const media = new MediaService()

async function tryCleanupReplacedUrl(oldUrl: string | undefined, newUrl: string | undefined) {
  if (!oldUrl) return
  if (oldUrl === newUrl) return
  if (!oldUrl.startsWith("/uploads/")) return

  try {
    await media.tryDeleteIfUnreferenced(oldUrl)
  } catch (err) {
    console.warn("testimonials media cleanup failed", { url: oldUrl, err })
  }
}

export async function GET() {
  try {
    const items = getTestimonials()
    return NextResponse.json({ items })
  } catch (e) {
    console.error("GET /api/content/testimonials failed", e)
    return NextResponse.json({ error: "No se pudo leer los testimonios" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
      assertAdmin(session)
    } catch {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    }

    const body = await req.json()
    const id = body?.id ? String(body.id).trim() : undefined
    const name = String(body?.name || "").trim()
    const text = String(body?.text || "").trim()
    const ageRaw = body?.age
    const ratingRaw = body?.rating
    const positionRaw = body?.position
    const mediaUrl = typeof body?.mediaUrl === "string" && body.mediaUrl.trim()
      ? String(body.mediaUrl).trim()
      : undefined
    const video = body?.video ? String(body.video).trim() : undefined
    const image = body?.image ? String(body.image).trim() : undefined
    const videoUrl = typeof body?.videoUrl === "string" && body.videoUrl.trim()
      ? String(body.videoUrl).trim()
      : undefined
    const imageUrl = typeof body?.imageUrl === "string" && body.imageUrl.trim()
      ? String(body.imageUrl).trim()
      : undefined

    const age = typeof ageRaw === "number" ? ageRaw : Number(ageRaw || 0)
    const rating = typeof ratingRaw === "number" ? ratingRaw : Number(ratingRaw || 0)
    const position = typeof positionRaw === "number" ? positionRaw : Number(positionRaw || 0)

    if (!name) return NextResponse.json({ error: "El nombre no puede estar vacío" }, { status: 400 })
    if (!text) return NextResponse.json({ error: "El texto del testimonio no puede estar vacío" }, { status: 400 })
    if (!Number.isFinite(age) || age < 0) {
      return NextResponse.json({ error: "La edad debe ser un número válido" }, { status: 400 })
    }
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      return NextResponse.json({ error: "El rating debe estar entre 0 y 5" }, { status: 400 })
    }
    if (position && (!Number.isFinite(position) || position < 1)) {
      return NextResponse.json({ error: "La posición debe ser un número >= 1" }, { status: 400 })
    }

    // Fallback de actualización: si viene id, tratamos POST como update
    if (id) {
      const before = getTestimonials().find((t) => t.id === id)
      const pos = position || 1
      if (!Number.isFinite(pos) || pos < 1) {
        return NextResponse.json({ error: "La posición debe ser un número >= 1" }, { status: 400 })
      }
      const updated = setTestimonialItem({ id, name, age, rating, text, mediaUrl, videoUrl, imageUrl, video, image, position: pos })
      await tryCleanupReplacedUrl(before?.mediaUrl, mediaUrl)
      await tryCleanupReplacedUrl(before?.videoUrl, videoUrl)
      await tryCleanupReplacedUrl(before?.imageUrl, imageUrl)
      const items = getTestimonials()
      return NextResponse.json({ ok: true, item: updated, items })
    }

    const created = addTestimonialItem({ id, name, age, rating, text, mediaUrl, videoUrl, imageUrl, video, image, position: position || undefined })
    const items = getTestimonials()
    return NextResponse.json({ ok: true, item: created, items })
  } catch (e: any) {
    console.error("POST /api/content/testimonials failed", e)
    const message = typeof e?.message === "string" ? e.message : "No se pudo crear el testimonio"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
      assertAdmin(session)
    } catch {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    }

    const body = await req.json()
    const id = String(body?.id || "").trim()
    const name = String(body?.name || "").trim()
    const text = String(body?.text || "").trim()
    const ageRaw = body?.age
    const ratingRaw = body?.rating
    const positionRaw = body?.position
    const mediaUrl = typeof body?.mediaUrl === "string" && body.mediaUrl.trim()
      ? String(body.mediaUrl).trim()
      : undefined
    const video = body?.video ? String(body.video).trim() : undefined
    const image = body?.image ? String(body.image).trim() : undefined
    const videoUrl = typeof body?.videoUrl === "string" && body.videoUrl.trim()
      ? String(body.videoUrl).trim()
      : undefined
    const imageUrl = typeof body?.imageUrl === "string" && body.imageUrl.trim()
      ? String(body.imageUrl).trim()
      : undefined

    const age = typeof ageRaw === "number" ? ageRaw : Number(ageRaw || 0)
    const rating = typeof ratingRaw === "number" ? ratingRaw : Number(ratingRaw || 0)
    const position = typeof positionRaw === "number" ? positionRaw : Number(positionRaw || 1)

    if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })
    if (!name) return NextResponse.json({ error: "El nombre no puede estar vacío" }, { status: 400 })
    if (!text) return NextResponse.json({ error: "El texto del testimonio no puede estar vacío" }, { status: 400 })
    if (!Number.isFinite(age) || age < 0) {
      return NextResponse.json({ error: "La edad debe ser un número válido" }, { status: 400 })
    }
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      return NextResponse.json({ error: "El rating debe estar entre 0 y 5" }, { status: 400 })
    }
    if (!Number.isFinite(position) || position < 1) {
      return NextResponse.json({ error: "La posición debe ser un número >= 1" }, { status: 400 })
    }

    const before = getTestimonials().find((t) => t.id === id)
    const updated = setTestimonialItem({ id, name, age, rating, text, mediaUrl, videoUrl, imageUrl, video, image, position })
    await tryCleanupReplacedUrl(before?.mediaUrl, mediaUrl)
    await tryCleanupReplacedUrl(before?.videoUrl, videoUrl)
    await tryCleanupReplacedUrl(before?.imageUrl, imageUrl)
    const items = getTestimonials()
    return NextResponse.json({ ok: true, item: updated, items })
  } catch (e: any) {
    console.error("PUT /api/content/testimonials failed", e)
    const message = typeof e?.message === "string" ? e.message : "No se pudo guardar el testimonio"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
      assertAdmin(session)
    } catch {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = String(searchParams.get("id") || "").trim()
    if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 })

    deleteTestimonialItem(id)
    const items = getTestimonials()
    return NextResponse.json({ ok: true, items })
  } catch (e: any) {
    console.error("DELETE /api/content/testimonials failed", e)
    const message = typeof e?.message === "string" ? e.message : "No se pudo eliminar el testimonio"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
