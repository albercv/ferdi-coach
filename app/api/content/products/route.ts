import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { addProductItem, deleteProductItem, getProducts, setProductItem } from "@/lib/products-md"
import { MediaService } from "@/lib/media/mediaService"

const media = new MediaService()

function isAllowedHowItWorksUrl(url: string) {
  const value = String(url || "").trim()
  return value.startsWith("/") || value.startsWith("https://")
}

function assertValidUrlField(fieldName: string, value: unknown) {
  if (value === undefined || value === null) return
  if (typeof value !== "string") throw new Error(`'${fieldName}' debe ser string`)
  const normalized = value.trim()
  if (!normalized) return
  if (!isAllowedHowItWorksUrl(normalized)) {
    throw new Error(`URL inválida en '${fieldName}': debe empezar por / o por https://`)
  }
}

async function tryCleanupReplacedUrl(oldUrl: string | undefined, newUrl: string | undefined) {
  if (!oldUrl) return
  if (oldUrl === newUrl) return
  if (!oldUrl.startsWith("/uploads/")) return

  try {
    await media.tryDeleteIfUnreferenced(oldUrl)
  } catch (err) {
    console.warn("products media cleanup failed", { url: oldUrl, err })
  }
}

async function tryCleanupProductMedia(args: {
  before: any | undefined
  after: any | undefined
}) {
  const { before, after } = args
  if (!before || !after) return

  if (before.kind === "guide" && after.kind === "guide") {
    await tryCleanupReplacedUrl(before.coverImageUrl, after.coverImageUrl)
    await tryCleanupReplacedUrl(before.fileUrl, after.fileUrl)
    return
  }

  if (before.kind === "session" && after.kind === "session") {
    await tryCleanupReplacedUrl(before.imageUrl, after.imageUrl)
  }
}

export async function GET() {
  try {
    const products = getProducts()
    return NextResponse.json({ success: true, data: products })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 })
  }
  try {
    const body = await req.json()
    // Fallback de actualización: si viene id en el body, tratamos POST como update
    if (body && body.id) {
      const productsBefore = getProducts()
      const before = (productsBefore.guides.find((g) => g.id === body.id) || productsBefore.sessions.find((s) => s.id === body.id))

      const kind = (body?.kind || before?.kind || "guide") as "guide" | "session"
      if (kind === "guide") {
        assertValidUrlField("fileUrl", body?.fileUrl)
        assertValidUrlField("coverImageUrl", body?.coverImageUrl)
      } else {
        assertValidUrlField("imageUrl", body?.imageUrl)
      }

      const updated = setProductItem(body)
      await tryCleanupProductMedia({ before, after: updated })
      return NextResponse.json({ success: true, data: updated })
    }

    const kind = (body?.kind === "session" ? "session" : "guide") as "guide" | "session"
    if (kind === "guide") {
      assertValidUrlField("fileUrl", body?.fileUrl)
      assertValidUrlField("coverImageUrl", body?.coverImageUrl)
    } else {
      assertValidUrlField("imageUrl", body?.imageUrl)
    }

    const created = addProductItem(body)
    return NextResponse.json({ success: true, data: created })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 })
  }
  try {
    const body = await req.json()

    const productsBefore = getProducts()
    const before = (productsBefore.guides.find((g) => g.id === body?.id) || productsBefore.sessions.find((s) => s.id === body?.id))

    const kind = (body?.kind || before?.kind || "guide") as "guide" | "session"
    if (kind === "guide") {
      assertValidUrlField("fileUrl", body?.fileUrl)
      assertValidUrlField("coverImageUrl", body?.coverImageUrl)
    } else {
      assertValidUrlField("imageUrl", body?.imageUrl)
    }

    const updated = setProductItem(body)
    await tryCleanupProductMedia({ before, after: updated })
    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id") || ""
    const kind = (searchParams.get("kind") as any) || undefined
    if (!id) throw new Error("Falta 'id' para borrar producto")
    deleteProductItem(id, kind)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 400 })
  }
}
