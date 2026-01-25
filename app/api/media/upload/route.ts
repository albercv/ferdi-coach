import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { assertAdmin } from "@/lib/auth/assertAdmin"
import { MediaService } from "@/lib/media/mediaService"

export const runtime = 'nodejs';

const ALLOWED_SCOPES = ["hero", "about", "testimonials", "products", "global"] as const
const PRODUCT_SUBSCOPES = ["guides", "sessions"] as const

type AllowedScope = (typeof ALLOWED_SCOPES)[number]
type ProductSubscope = (typeof PRODUCT_SUBSCOPES)[number]

function isAllowedScope(scope: string): scope is AllowedScope {
  return (ALLOWED_SCOPES as readonly string[]).includes(scope)
}

function isProductSubscope(value: string): value is ProductSubscope {
  return (PRODUCT_SUBSCOPES as readonly string[]).includes(value)
}

export async function POST(req: Request) {
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
    const fd = await req.formData()
    const file = fd.get("file")
    const scopeRaw = String(fd.get("scope") ?? "")
    const entitySlug = fd.get("entitySlug") ? String(fd.get("entitySlug")) : undefined
    const productSubscopeRaw = fd.get("productSubscope")
      ? String(fd.get("productSubscope"))
      : undefined

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "INVALID_FILE" }, { status: 400 })
    }

    if (!isAllowedScope(scopeRaw)) {
      return NextResponse.json({ error: "INVALID_SCOPE" }, { status: 400 })
    }

    if (scopeRaw === "testimonials") {
      if (!entitySlug) {
        return NextResponse.json({ error: "MISSING_ENTITY_SLUG" }, { status: 400 })
      }
    }

    let productSubscope: ProductSubscope | undefined
    if (scopeRaw === "products") {
      if (!entitySlug) {
        return NextResponse.json({ error: "MISSING_ENTITY_SLUG" }, { status: 400 })
      }
      if (!productSubscopeRaw) {
        return NextResponse.json({ error: "MISSING_PRODUCT_SUBSCOPE" }, { status: 400 })
      }
      if (!isProductSubscope(productSubscopeRaw)) {
        return NextResponse.json({ error: "INVALID_PRODUCT_SUBSCOPE" }, { status: 400 })
      }
      productSubscope = productSubscopeRaw
    }

    const buf = new Uint8Array(await file.arrayBuffer())

    const media = new MediaService()
    const result = await media.upload({
      bytes: buf,
      originalName: file.name,
      mimeType: file.type || undefined,
      sizeBytes: file.size,
      scope: scopeRaw as any,
      entitySlug,
      productSubscope: productSubscope as any,
    })

    return NextResponse.json(result)
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : "UPLOAD_FAILED"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
