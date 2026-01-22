import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session || role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : null,
    AUTH_ADMIN_EMAIL: process.env.AUTH_ADMIN_EMAIL || null,
    AUTH_ADMIN_PASSWORD: process.env.AUTH_ADMIN_PASSWORD ? "set" : null,
    AUTH_ADMIN_NAME: process.env.AUTH_ADMIN_NAME || null,
    AUTH_USER_EMAIL: process.env.AUTH_USER_EMAIL || null,
    AUTH_USER_PASSWORD: process.env.AUTH_USER_PASSWORD ? "set" : null,
    AUTH_USER_NAME: process.env.AUTH_USER_NAME || null,
  })
}
