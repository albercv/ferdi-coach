import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { assertAdmin, AuthzError } from "@/lib/auth/assertAdmin"
import { getSectionStyles, setSectionStyles } from "@/lib/section-styles"
import {
  SECTION_KEYS,
  isValidColorValue,
  type SectionKey,
  type SectionStyles,
} from "@/lib/section-styles-shared"

export async function GET() {
  try {
    const styles = getSectionStyles()
    return NextResponse.json({ styles })
  } catch (err) {
    console.error("[api/section-styles][GET]", err)
    return NextResponse.json(
      { error: "No se pudo leer la configuración de colores" },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  try {
    assertAdmin(session)
  } catch (err) {
    if (err instanceof AuthzError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    throw err
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const payload = (body as { styles?: Partial<SectionStyles> })?.styles
  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { error: "Falta el campo 'styles'" },
      { status: 400 },
    )
  }

  const sanitized: Partial<SectionStyles> = {}
  for (const key of SECTION_KEYS) {
    const value = (payload as Record<string, unknown>)[key]
    if (value === undefined) continue
    if (!isValidColorValue(value)) {
      return NextResponse.json(
        { error: `Color inválido para "${key}"` },
        { status: 400 },
      )
    }
    sanitized[key as SectionKey] = value
  }

  try {
    const next = setSectionStyles(sanitized)
    return NextResponse.json({ styles: next })
  } catch (err) {
    console.error("[api/section-styles][POST]", err)
    return NextResponse.json(
      { error: "No se pudo guardar la configuración" },
      { status: 500 },
    )
  }
}
