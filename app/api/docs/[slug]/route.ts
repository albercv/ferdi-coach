import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { assertAdmin, AuthzError } from "@/lib/auth/assertAdmin"
import { getDoc } from "@/lib/docs"

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions)
  try {
    assertAdmin(session)
  } catch (err) {
    if (err instanceof AuthzError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    throw err
  }

  try {
    const doc = getDoc(params.slug)
    if (!doc) {
      return NextResponse.json(
        { error: "Documento no encontrado" },
        { status: 404 },
      )
    }
    return NextResponse.json({ doc })
  } catch (err) {
    console.error("[api/docs/:slug][GET]", err)
    return NextResponse.json(
      { error: "No se pudo leer el documento" },
      { status: 500 },
    )
  }
}
