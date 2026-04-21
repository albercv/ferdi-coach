import { NextResponse } from "next/server"

import { sendTelegramAlert } from "@/lib/monitoring/telegram"

export const runtime = "nodejs"

function formatSentryAlert(body: unknown): string {
  const root = body as Record<string, unknown>
  const data = root?.data as Record<string, unknown> | undefined
  const event = (data?.event ?? data?.issue ?? {}) as Record<string, unknown>

  const title = (event.title ?? root?.message ?? "Error desconocido") as string
  const level = ((event.level ?? "error") as string).toUpperCase()
  const rule = (data?.triggered_rule ?? "") as string
  const url = (event.web_url ?? event.permalink ?? "") as string

  const lines = [
    `🚨 <b>Error en producción — ferdi-coach</b>`,
    ``,
    `<b>Nivel:</b> ${level}`,
    `<b>Error:</b> ${title}`,
  ]
  if (rule) lines.push(`<b>Regla:</b> ${rule}`)
  if (url) lines.push(`<b>Sentry:</b> ${url}`)
  return lines.join("\n")
}

export async function POST(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get("secret")
  const expectedSecret = process.env.MONITORING_WEBHOOK_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 })
  }

  try {
    const message = formatSentryAlert(body)
    await sendTelegramAlert(message)
  } catch (err) {
    console.error("[monitoring/webhook] Error al enviar alerta:", err)
  }

  return NextResponse.json({ ok: true })
}
