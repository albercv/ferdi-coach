import { beforeEach, describe, expect, it, vi } from "vitest"

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

describe("sendTelegramAlert", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-token")
    vi.stubEnv("TELEGRAM_CHAT_ID", "12345")
  })

  it("envía el mensaje a la API de Telegram", async () => {
    mockFetch.mockResolvedValue({ ok: true })
    const { sendTelegramAlert } = await import("@/lib/monitoring/telegram")

    await sendTelegramAlert("Error crítico en producción")

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token/sendMessage",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("Error crítico en producción"),
      })
    )
  })

  it("no lanza excepción si las variables de entorno no están definidas", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "")
    vi.stubEnv("TELEGRAM_CHAT_ID", "")
    const { sendTelegramAlert } = await import("@/lib/monitoring/telegram")

    await expect(sendTelegramAlert("test")).resolves.not.toThrow()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("loguea el error si Telegram devuelve !ok sin lanzar excepción", async () => {
    mockFetch.mockResolvedValue({ ok: false, text: async () => "Bad Request" })
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const { sendTelegramAlert } = await import("@/lib/monitoring/telegram")

    await expect(sendTelegramAlert("test")).resolves.not.toThrow()
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[telegram]"),
      expect.any(String)
    )
  })
})
