import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { assertAdmin } from "@/lib/auth/assertAdmin"
import { getBreaker, setBreaker, BreakerContent } from "@/lib/content-md"

export async function GET() {
  try {
    const breaker = getBreaker()
    return NextResponse.json(breaker)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error leyendo breaker" }, { status: 500 })
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
    const text = String(body?.text || "").trim()
    if (!text) return NextResponse.json({ error: "text es requerido" }, { status: 400 })

    const kickerRaw = body?.kicker
    const kicker = typeof kickerRaw === "string" ? kickerRaw.trim() : ""

    const next: BreakerContent = { text, kicker: kicker || undefined }
    setBreaker(next)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error guardando breaker" }, { status: 500 })
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
    const text = String(body?.text || "").trim()
    if (!text) return NextResponse.json({ error: "text es requerido" }, { status: 400 })

    const kickerRaw = body?.kicker
    const kicker = typeof kickerRaw === "string" ? kickerRaw.trim() : ""

    const next: BreakerContent = { text, kicker: kicker || undefined }
    setBreaker(next)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Error guardando breaker" }, { status: 500 })
  }
}
