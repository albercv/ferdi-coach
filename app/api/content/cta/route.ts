import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { assertAdmin } from "@/lib/auth/assertAdmin"
import { getCTA, setCTA, CTAContent } from "@/lib/content-md"

export async function GET() {
  try {
    const cta = getCTA()
    return NextResponse.json(cta)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error leyendo cta" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
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
    const description = String(body?.description || "").trim()
    const buttonText = String(body?.buttonText || "").trim()

    if (!title) return NextResponse.json({ error: "title es requerido" }, { status: 400 })
    if (!description) return NextResponse.json({ error: "description es requerido" }, { status: 400 })
    if (!buttonText) return NextResponse.json({ error: "buttonText es requerido" }, { status: 400 })

    const next: CTAContent = { title, description, buttonText }
    setCTA(next)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error guardando cta" }, { status: 500 })
  }
}

export async function POST(req: Request) {
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
    const description = String(body?.description || "").trim()
    const buttonText = String(body?.buttonText || "").trim()

    if (!title) return NextResponse.json({ error: "title es requerido" }, { status: 400 })
    if (!description) return NextResponse.json({ error: "description es requerido" }, { status: 400 })
    if (!buttonText) return NextResponse.json({ error: "buttonText es requerido" }, { status: 400 })

    const next: CTAContent = { title, description, buttonText }
    setCTA(next)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error guardando cta" }, { status: 500 })
  }
}
