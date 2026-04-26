import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { assertAdmin, AuthzError } from "@/lib/auth/assertAdmin"
import { getDocsList } from "@/lib/docs"

export async function GET() {
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
    const docs = getDocsList()
    return NextResponse.json({ docs })
  } catch (err) {
    console.error("[api/docs][GET]", err)
    return NextResponse.json(
      { error: "No se pudo leer la lista de documentos" },
      { status: 500 },
    )
  }
}
