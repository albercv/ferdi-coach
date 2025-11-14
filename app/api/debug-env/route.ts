import { NextResponse } from "next/server"

export async function GET() {
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