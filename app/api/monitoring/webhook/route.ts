import { NextResponse } from "next/server"

import { sendTelegramAlert } from "@/lib/monitoring/telegram"

export const runtime = "nodejs"

function formatSentryAlert(body: unknown): string {
  const data = (body as Record<string, unknown>)?.data as Record<string, unknown> | undefined
  const issue = (data?.issue ?? data?.event ?? {}) as Record<string, unknown>
  const title = (issue.title ?? (body as Record<string, unknown>)?.message ?? "Error desconocido") as string
  const level = ((issue.level ?? "error") as string).toUpperCase()
  const project = ((issue.project as Record<string, unknown>)?.name ?? (body as Record<string, unknown>)?.project_name ?? "ferdi-coach") as string
  const url = (issue.web_url ?? issue.permalink ?? "") as string

  const lines = [
    `🚨 <b>Error en producción</b>`,
    ``,
    `<b>Nivel:</b> ${level}`,
    `<b>Proyecto:</b> ${project}`,
    `<b>Error:</b> ${title}`,
  ]
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
