import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { addProductItem, deleteProductItem, getProducts, setProductItem } from "@/lib/products-md"

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
      const updated = setProductItem(body)
      return NextResponse.json({ success: true, data: updated })
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
    const updated = setProductItem(body)
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