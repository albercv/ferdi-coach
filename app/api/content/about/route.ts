import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { assertAdmin } from "@/lib/auth/assertAdmin"
import { getAbout, setAbout } from "@/lib/content-md"
import { MediaService } from "@/lib/media/mediaService"

const media = new MediaService()

async function tryCleanupReplacedUrl(oldUrl: string | undefined, newUrl: string | undefined) {
  if (!oldUrl) return
  if (oldUrl === newUrl) return
  if (!oldUrl.startsWith("/uploads/")) return

  try {
    await media.tryDeleteIfUnreferenced(oldUrl)
  } catch (err) {
    console.warn("about media cleanup failed", { url: oldUrl, err })
  }
}

export async function GET() {
  try {
    const about = getAbout()
    return NextResponse.json(about)
  } catch (e) {
    console.error("GET /api/content/about failed", e)
    return NextResponse.json({ error: "No se pudo leer el contenido de 'Sobre mí'" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  try {
    assertAdmin(session)
  } catch {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  try {
    const before = getAbout()
    const body = await req.json()
    const title = typeof body.title === "string" ? body.title.trim() : ""
    const description = typeof body.description === "string" ? body.description : ""
    const credentials = Array.isArray(body.credentials)
      ? body.credentials.filter((x: any) => typeof x === "string").map((s: string) => s.trim()).filter(Boolean)
      : []
    const videoUrl = typeof body?.videoUrl === "string" && body.videoUrl.trim()
      ? String(body.videoUrl).trim()
      : undefined
    const posterImageUrl = typeof body?.posterImageUrl === "string" && body.posterImageUrl.trim()
      ? String(body.posterImageUrl).trim()
      : undefined

    if (!title || !description) {
      return NextResponse.json(
        { error: "Los campos 'title' y 'description' son requeridos" },
        { status: 400 }
      )
    }

    setAbout({ title, description, credentials, videoUrl, posterImageUrl })
    await tryCleanupReplacedUrl(before.videoUrl, videoUrl)
    await tryCleanupReplacedUrl(before.posterImageUrl, posterImageUrl)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("PUT /api/content/about failed", e)
    Sentry.captureException(e, { tags: { flow: "content-write", route: "about", method: "PUT" } })
    return NextResponse.json({ error: "No se pudo actualizar el contenido de 'Sobre mí'" }, { status: 500 })
  }
}

// POST fallback para entornos que bloquean PUT (WAF/CDN/Proxy)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  try {
    assertAdmin(session)
  } catch {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  try {
    const before = getAbout()
    const body = await req.json()
    const title = typeof body.title === "string" ? body.title.trim() : ""
    const description = typeof body.description === "string" ? body.description : ""
    const credentials = Array.isArray(body.credentials)
      ? body.credentials.filter((x: any) => typeof x === "string").map((s: string) => s.trim()).filter(Boolean)
      : []
    const videoUrl = typeof body?.videoUrl === "string" && body.videoUrl.trim()
      ? String(body.videoUrl).trim()
      : undefined
    const posterImageUrl = typeof body?.posterImageUrl === "string" && body.posterImageUrl.trim()
      ? String(body.posterImageUrl).trim()
      : undefined

    if (!title || !description) {
      return NextResponse.json(
        { error: "Los campos 'title' y 'description' son requeridos" },
        { status: 400 }
      )
    }

    setAbout({ title, description, credentials, videoUrl, posterImageUrl })
    await tryCleanupReplacedUrl(before.videoUrl, videoUrl)
    await tryCleanupReplacedUrl(before.posterImageUrl, posterImageUrl)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("POST /api/content/about failed", e)
    Sentry.captureException(e, { tags: { flow: "content-write", route: "about", method: "POST" } })
    return NextResponse.json({ error: "No se pudo actualizar el contenido de 'Sobre mí'" }, { status: 500 })
  }
}
