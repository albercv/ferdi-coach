import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

let tmpDir: string

beforeEach(() => {
  vi.resetModules()
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-payments-"))
  process.env.PAYMENTS_DIR = path.join(tmpDir, "payments")
})

afterEach(() => {
  delete process.env.PAYMENTS_DIR
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("payments core", () => {
  it("returns empty config by default", async () => {
    const { getPaymentsConfig } = await import("../lib/payments-storage")
    const config = getPaymentsConfig()
    expect(config.iban).toBe("")
  })

  it("normalizes IBAN on save", async () => {
    const { setPaymentsIban, getPaymentsConfig } = await import("../lib/payments-storage")
    setPaymentsIban("es12  3456 7890  1234")
    const config = getPaymentsConfig()
    expect(config.iban).toBe("ES12345678901234")
  })

  it("creates and lists submissions", async () => {
    const { createPaymentSubmission, listPaymentSubmissions } = await import("../lib/payments-storage")

    createPaymentSubmission({
      product: { kind: "session", id: "s1", subtype: "individual", title: "Sesión", priceEuro: 50 },
      payerName: "Nombre Apellido",
      payerEmail: "x@example.com",
      payerPhone: " +34 600 000 000 ",
    })

    const subs = listPaymentSubmissions()
    expect(subs.length).toBe(1)
    expect(subs[0].status).toBe("pending")
    expect(subs[0].conceptShort).toBe("individual")
    expect(subs[0].payerPhone).toBe("+34 600 000 000")
  })

  it("builds concept short by product kind/subtype", async () => {
    const { buildPaymentConceptShort, buildPaymentConceptLine } = await import("../lib/payments")
    expect(
      buildPaymentConceptShort({ kind: "session", id: "s1", subtype: "individual", title: "Sesión", priceEuro: 50 }),
    ).toBe("individual")
    expect(
      buildPaymentConceptShort({ kind: "session", id: "s2", subtype: "program4", title: "Programa", priceEuro: 200 }),
    ).toBe("programa4")
    expect(buildPaymentConceptShort({ kind: "guide", id: "g1", title: "Guía", priceEuro: 20 })).toBe("guia")

    expect(buildPaymentConceptLine({
      product: { kind: "guide", id: "g1", title: "Guía de pago", priceEuro: 20 },
      payerName: "Ana",
    })).toBe("guia - Guía de pago - Ana")
  })

  it("updates status and persists", async () => {
    const { createPaymentSubmission, updatePaymentSubmissionStatus, listPaymentSubmissions } = await import("../lib/payments-storage")

    const created = createPaymentSubmission({
      product: { kind: "guide", id: "g1", title: "Guía", priceEuro: 20 },
      payerName: "Nombre Apellido",
      payerEmail: "x@example.com",
    })

    const updated = updatePaymentSubmissionStatus({ id: created.id, status: "confirmed", updatedByEmail: "admin@example.com" })
    expect(updated.status).toBe("confirmed")
    expect(updated.statusUpdatedAtIso).toBeTruthy()
    expect(updated.statusUpdatedByEmail).toBe("admin@example.com")

    const subs = listPaymentSubmissions()
    expect(subs[0].id).toBe(created.id)
    expect(subs[0].status).toBe("confirmed")
  })
})
