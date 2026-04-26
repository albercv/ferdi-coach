import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

let tmpDir: string
let tmpContentDir: string
const originalCwd = process.cwd()

beforeEach(() => {
  vi.resetModules()
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-payments-"))
  process.chdir(tmpDir)
  tmpContentDir = path.join(tmpDir, "content")
  fs.mkdirSync(tmpContentDir, { recursive: true })
  process.env.CONTENT_DIR = tmpContentDir
})

afterEach(() => {
  process.chdir(originalCwd)
  delete process.env.CONTENT_DIR
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

  it("captura productFileUrl de la guía en el momento de crear la submission", async () => {
    const { createPaymentSubmission, listPaymentSubmissions } = await import("../lib/payments-storage")

    createPaymentSubmission({
      product: { kind: "guide", id: "g1", title: "Guía de prueba", priceEuro: 30 },
      payerName: "Nombre",
      payerEmail: "x@example.com",
      productFileUrl: "/uploads/products/guides/g1/guia-v1.pdf",
    })

    const subs = listPaymentSubmissions()
    expect(subs[0].productFileUrl).toBe("/uploads/products/guides/g1/guia-v1.pdf")
  })

  it("listActiveSubmissionsReferencingFileUrl filtra por estado no terminal", async () => {
    const {
      createPaymentSubmission,
      updatePaymentSubmissionStatus,
      listActiveSubmissionsReferencingFileUrl,
    } = await import("../lib/payments-storage")

    const url = "/uploads/products/guides/g-active/guia.pdf"

    const a = createPaymentSubmission({
      product: { kind: "guide", id: "g-active", title: "Guía", priceEuro: 30 },
      payerName: "A",
      payerEmail: "a@example.com",
      productFileUrl: url,
    })
    const b = createPaymentSubmission({
      product: { kind: "guide", id: "g-active", title: "Guía", priceEuro: 30 },
      payerName: "B",
      payerEmail: "b@example.com",
      productFileUrl: url,
    })
    const c = createPaymentSubmission({
      product: { kind: "guide", id: "g-active", title: "Guía", priceEuro: 30 },
      payerName: "C",
      payerEmail: "c@example.com",
      productFileUrl: url,
    })

    // a se queda pending; b overdue; c confirmed (terminal)
    updatePaymentSubmissionStatus({ id: b.id, status: "overdue" })
    updatePaymentSubmissionStatus({ id: c.id, status: "confirmed" })

    const active = listActiveSubmissionsReferencingFileUrl(url)
    expect(active.length).toBe(2)
    expect(active.map((s) => s.id).sort()).toEqual([a.id, b.id].sort())
  })

  it("countTerminalSubmissionRefsMatchingFileUrl cuenta sólo confirmed y failed", async () => {
    const {
      createPaymentSubmission,
      updatePaymentSubmissionStatus,
      countTerminalSubmissionRefsMatchingFileUrl,
    } = await import("../lib/payments-storage")

    const url = "/uploads/products/guides/g-term/guia.pdf"

    const p = createPaymentSubmission({
      product: { kind: "guide", id: "g-term", title: "Guía", priceEuro: 30 },
      payerName: "P",
      payerEmail: "p@example.com",
      productFileUrl: url,
    })
    const q = createPaymentSubmission({
      product: { kind: "guide", id: "g-term", title: "Guía", priceEuro: 30 },
      payerName: "Q",
      payerEmail: "q@example.com",
      productFileUrl: url,
    })

    updatePaymentSubmissionStatus({ id: p.id, status: "confirmed" })
    updatePaymentSubmissionStatus({ id: q.id, status: "failed" })

    expect(countTerminalSubmissionRefsMatchingFileUrl(url)).toBe(2)
  })
})
