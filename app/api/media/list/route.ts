import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { assertAdmin } from "@/lib/auth/assertAdmin"
import { MediaService } from "@/lib/media/mediaService"

export const runtime = 'nodejs';

export async function GET(req: Request) {
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
    const { searchParams } = new URL(req.url)
    const prefix = searchParams.get("prefix") ?? "/uploads"

    if (!prefix.startsWith("/uploads")) {
      return NextResponse.json({ error: "INVALID_PREFIX" }, { status: 400 })
    }

    const media = new MediaService()
    const items = await media.list(prefix)

    return NextResponse.json(items)
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : "LIST_FAILED"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
