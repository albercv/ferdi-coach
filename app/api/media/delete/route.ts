import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { assertAdmin } from "@/lib/auth/assertAdmin"
import { MediaService } from "@/lib/media/mediaService"

export const runtime = 'nodejs';

export async function DELETE(req: Request) {
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
    const body = await req.json().catch(() => null)
    const url = body?.url ? String(body.url) : ""

    if (!url.startsWith("/uploads/")) {
      return NextResponse.json({ error: "INVALID_URL" }, { status: 400 })
    }

    const media = new MediaService()
    const res = await media.tryDeleteIfUnreferenced(url)

    if (res.deleted === false && res.reason === "still-referenced") {
      return NextResponse.json(res, { status: 409 })
    }

    return NextResponse.json(res)
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : "DELETE_FAILED"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
