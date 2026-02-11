import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const getServerSessionMock = vi.fn()

vi.mock("next-auth", () => {
  return {
    getServerSession: getServerSessionMock,
  }
})

let tmpDir: string
let tmpContentDir: string

function seedProducts(contentDir: string) {
  const sessionsDir = path.join(contentDir, "products", "sessions")
  const guidesDir = path.join(contentDir, "products", "guides")
  fs.mkdirSync(sessionsDir, { recursive: true })
  fs.mkdirSync(guidesDir, { recursive: true })

  fs.writeFileSync(
    path.join(sessionsDir, "sesion-individual.md"),
    [
      "---",
      "title: Sesión individual",
      "subtype: individual",
      "price: 50",
      "features:",
      "  - A",
      "---",
      "Descripción",
      "",
    ].join("\n"),
    "utf8",
  )

  fs.writeFileSync(
    path.join(guidesDir, "guia-pago.md"),
    [
      "---",
      "title: Guía de pago",
      "price: 20",
      "features:",
      "  - A",
      "fileUrl: /fake.pdf",
      "---",
      "Sinopsis",
      "",
    ].join("\n"),
    "utf8",
  )
}

beforeEach(() => {
  vi.resetModules()
  getServerSessionMock.mockReset()
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-payments-routes-"))
  tmpContentDir = path.join(tmpDir, "content")
  fs.mkdirSync(tmpContentDir, { recursive: true })
  seedProducts(tmpContentDir)

  process.env.CONTENT_DIR = tmpContentDir
  process.env.PAYMENTS_DIR = path.join(tmpDir, "payments")
})

afterEach(() => {
  delete process.env.CONTENT_DIR
  delete process.env.PAYMENTS_DIR
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("payments routes", () => {
  it("POST /api/payments/paid stores a pending submission", async () => {
    const { POST } = await import("../app/api/payments/paid/route")
    const { listPaymentSubmissions } = await import("../lib/payments-storage")

    const req = new Request("http://localhost/api/payments/paid", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productId: "sesion-individual",
        payerName: "Nombre Apellido",
        payerEmail: "x@example.com",
        payerPhone: "+34 600 000 000",
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.id).toBeTruthy()
    expect(data.status).toBe("pending")

    const subs = listPaymentSubmissions()
    expect(subs.length).toBe(1)
    expect(subs[0].productId).toBe("sesion-individual")
    expect(subs[0].conceptShort).toBe("individual")
    expect(subs[0].payerPhone).toBe("+34 600 000 000")
  })

  it("POST /api/payments/paid rejects invalid email", async () => {
    const { POST } = await import("../app/api/payments/paid/route")

    const req = new Request("http://localhost/api/payments/paid", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productId: "sesion-individual",
        payerName: "Nombre Apellido",
        payerEmail: "not-an-email",
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe("BAD_REQUEST")
  })

  it("POST /api/payments/paid rejects unknown product", async () => {
    const { POST } = await import("../app/api/payments/paid/route")

    const req = new Request("http://localhost/api/payments/paid", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productId: "unknown",
        payerName: "Nombre Apellido",
        payerEmail: "x@example.com",
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe("UNKNOWN_PRODUCT")
  })

  it("PUT /api/payments/config requires admin", async () => {
    const { PUT } = await import("../app/api/payments/config/route")

    getServerSessionMock.mockResolvedValueOnce(null)

    const req = new Request("http://localhost/api/payments/config", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ iban: "ES123" }),
    })
    const res = await PUT(req)
    expect(res.status).toBe(401)
  })

  it("PUT /api/payments/config stores normalized iban when admin", async () => {
    const { PUT, GET } = await import("../app/api/payments/config/route")

    getServerSessionMock.mockResolvedValue({ user: { role: "admin", email: "admin@example.com" } })

    const putReq = new Request("http://localhost/api/payments/config", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ iban: "es12  3456" }),
    })
    const putRes = await PUT(putReq)
    expect(putRes.status).toBe(200)
    const putData = await putRes.json()
    expect(putData.iban).toBe("ES123456")

    const getRes = await GET()
    expect(getRes.status).toBe(200)
    const getData = await getRes.json()
    expect(getData.iban).toBe("ES123456")
  })

  it("GET/PATCH /api/payments/submissions are admin-only", async () => {
    const route = await import("../app/api/payments/submissions/route")

    getServerSessionMock.mockResolvedValueOnce(null)
    const getRes = await route.GET()
    expect(getRes.status).toBe(401)

    getServerSessionMock.mockResolvedValueOnce({ user: { role: "admin", email: "admin@example.com" } })
    const patchReq = new Request("http://localhost/api/payments/submissions", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: "missing", status: "confirmed" }),
    })
    const patchRes = await route.PATCH(patchReq)
    expect(patchRes.status).toBe(404)
  })
})
