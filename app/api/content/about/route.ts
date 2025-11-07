import { NextResponse } from "next/server"
import { getAbout, setAbout } from "@/lib/content-md"

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
  try {
    const body = await req.json()
    const title = typeof body.title === "string" ? body.title.trim() : ""
    const description = typeof body.description === "string" ? body.description : ""
    const credentials = Array.isArray(body.credentials)
      ? body.credentials.filter((x: any) => typeof x === "string").map((s: string) => s.trim()).filter(Boolean)
      : []

    if (!title || !description) {
      return NextResponse.json(
        { error: "Los campos 'title' y 'description' son requeridos" },
        { status: 400 }
      )
    }

    setAbout({ title, description, credentials })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("PUT /api/content/about failed", e)
    return NextResponse.json({ error: "No se pudo actualizar el contenido de 'Sobre mí'" }, { status: 500 })
  }
}