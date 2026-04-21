import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/monitoring/telegram", () => ({
  sendTelegramAlert: vi.fn().mockResolvedValue(undefined),
}))

import { sendTelegramAlert } from "@/lib/monitoring/telegram"
import { POST } from "@/app/api/monitoring/webhook/route"

const SECRET = "test-secret-abc"

function makeRequest(body: unknown, secret?: string): Request {
  const url = secret
    ? `http://localhost/api/monitoring/webhook?secret=${secret}`
    : `http://localhost/api/monitoring/webhook`
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/monitoring/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv("MONITORING_WEBHOOK_SECRET", SECRET)
  })

  it("rechaza la petición si el secreto es incorrecto", async () => {
    const res = await POST(makeRequest({}, "wrong-secret"))
    expect(res.status).toBe(401)
  })

  it("rechaza la petición si no hay secreto", async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(401)
  })

  it("llama a sendTelegramAlert con el título del issue de Sentry", async () => {
    const payload = {
      data: {
        issue: {
          title: "TypeError: Cannot read properties of undefined",
          level: "error",
          web_url: "https://ferdi-coach.sentry.io/issues/123/",
          project: { name: "ferdi-coach" },
        },
      },
    }

    const res = await POST(makeRequest(payload, SECRET))
    expect(res.status).toBe(200)
    expect(sendTelegramAlert).toHaveBeenCalledWith(
      expect.stringContaining("TypeError: Cannot read properties of undefined")
    )
  })

  it("responde 200 aunque sendTelegramAlert falle (no bloquear a Sentry)", async () => {
    vi.mocked(sendTelegramAlert).mockRejectedValueOnce(new Error("network error"))
    const payload = { data: { issue: { title: "Error", level: "error" } } }

    const res = await POST(makeRequest(payload, SECRET))
    expect(res.status).toBe(200)
  })
})
