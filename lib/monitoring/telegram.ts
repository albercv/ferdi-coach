export async function sendTelegramAlert(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn("[telegram] TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurados")
    return
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
  })

  if (!res.ok) {
    console.error("[telegram] Error al enviar alerta:", await res.text())
  }
}
