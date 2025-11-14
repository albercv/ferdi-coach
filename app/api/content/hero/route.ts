import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getHero, setHero, HeroContent } from "@/lib/content-md"

export async function GET() {
  try {
    const hero = getHero()
    return NextResponse.json(hero)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error leyendo hero" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Validación básica
    const title = String(body?.title || "").trim()
    const subtitle = String(body?.subtitle || "").trim()
    const ctaPrimary = String(body?.ctaPrimary || "").trim()
    const ctaSecondary = body?.ctaSecondary ? String(body?.ctaSecondary).trim() : undefined

    if (!title) return NextResponse.json({ error: "title es requerido" }, { status: 400 })
    if (!subtitle) return NextResponse.json({ error: "subtitle es requerido" }, { status: 400 })
    if (!ctaPrimary) return NextResponse.json({ error: "ctaPrimary es requerido" }, { status: 400 })

    const bulletsRaw: any[] = Array.isArray(body?.bullets) ? body.bullets : []
    const bullets = bulletsRaw
      .map((b: any, idx: number) => ({
        id: String(b?.id ?? String(idx + 1)),
        position: Number(b?.position ?? idx + 1),
        icon: String(b?.icon || "check-circle"),
        text: String(b?.text || "").trim(),
      }))
      .filter((b) => !!b.text)
      .sort((a, b) => a.position - b.position)
      .map((b, idx) => ({ ...b, position: idx + 1 }))

    const hero: HeroContent = {
      title,
      subtitle,
      ctaPrimary,
      ctaSecondary,
      bullets,
    }

    setHero(hero)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error guardando hero" }, { status: 500 })
  }
}

// POST fallback for environments that block PUT (e.g., certain proxies/WAF/CDN)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Validación básica (misma que en PUT)
    const title = String(body?.title || "").trim()
    const subtitle = String(body?.subtitle || "").trim()
    const ctaPrimary = String(body?.ctaPrimary || "").trim()
    const ctaSecondary = body?.ctaSecondary ? String(body?.ctaSecondary).trim() : undefined

    if (!title) return NextResponse.json({ error: "title es requerido" }, { status: 400 })
    if (!subtitle) return NextResponse.json({ error: "subtitle es requerido" }, { status: 400 })
    if (!ctaPrimary) return NextResponse.json({ error: "ctaPrimary es requerido" }, { status: 400 })

    const bulletsRaw: any[] = Array.isArray(body?.bullets) ? body.bullets : []
    const bullets = bulletsRaw
      .map((b: any, idx: number) => ({
        id: String(b?.id ?? String(idx + 1)),
        position: Number(b?.position ?? idx + 1),
        icon: String(b?.icon || "check-circle"),
        text: String(b?.text || "").trim(),
      }))
      .filter((b) => !!b.text)
      .sort((a, b) => a.position - b.position)
      .map((b, idx) => ({ ...b, position: idx + 1 }))

    const hero: HeroContent = {
      title,
      subtitle,
      ctaPrimary,
      ctaSecondary,
      bullets,
    }

    setHero(hero)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error guardando hero" }, { status: 500 })
  }
}