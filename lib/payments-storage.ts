import fs from "fs"
import path from "path"
import crypto from "crypto"

import type { PaymentStatus, PaymentSubmission, PaymentsConfig, PaymentProductRef } from "@/lib/payments"
import { buildPaymentConceptShort } from "@/lib/payments"

function resolvePaymentsDir(): string {
  const explicit = process.env.PAYMENTS_DIR?.trim()
  if (explicit) {
    return path.isAbsolute(explicit) ? explicit : path.join(process.cwd(), explicit)
  }

  const contentDir = process.env.CONTENT_DIR?.trim()
  if (contentDir) {
    const resolved = path.isAbsolute(contentDir) ? contentDir : path.join(process.cwd(), contentDir)
    return path.join(resolved, "payments")
  }

  return path.join(process.cwd(), "data", "payments")
}

const PAYMENTS_DIR = resolvePaymentsDir()
const CONFIG_PATH = path.join(PAYMENTS_DIR, "config.json")
const SUBMISSIONS_PATH = path.join(PAYMENTS_DIR, "submissions.json")

function ensureDir(): void {
  fs.mkdirSync(PAYMENTS_DIR, { recursive: true })
}

function atomicWriteFile(filePath: string, content: string): void {
  ensureDir()
  const tmp = `${filePath}.${crypto.randomUUID()}.tmp`
  fs.writeFileSync(tmp, content, "utf8")
  fs.renameSync(tmp, filePath)
}

function normalizeIban(raw: string): string {
  return raw.replace(/\s+/g, "").toUpperCase()
}

export function getPaymentsConfig(): PaymentsConfig {
  ensureDir()
  if (!fs.existsSync(CONFIG_PATH)) {
    return { iban: "", updatedAtIso: new Date(0).toISOString() }
  }
  const raw = fs.readFileSync(CONFIG_PATH, "utf8")
  const parsed = JSON.parse(raw)
  return {
    iban: typeof parsed?.iban === "string" ? parsed.iban : "",
    updatedAtIso: typeof parsed?.updatedAtIso === "string" ? parsed.updatedAtIso : new Date(0).toISOString(),
  }
}

export function setPaymentsIban(ibanRaw: string): PaymentsConfig {
  const iban = normalizeIban(ibanRaw)
  const next: PaymentsConfig = {
    iban,
    updatedAtIso: new Date().toISOString(),
  }
  atomicWriteFile(CONFIG_PATH, JSON.stringify(next, null, 2))
  return next
}

export function listPaymentSubmissions(): PaymentSubmission[] {
  ensureDir()
  if (!fs.existsSync(SUBMISSIONS_PATH)) return []
  const raw = fs.readFileSync(SUBMISSIONS_PATH, "utf8")
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) return []
  return parsed as PaymentSubmission[]
}

export function createPaymentSubmission(input: {
  product: PaymentProductRef
  payerName: string
  payerEmail: string
  payerPhone?: string
}): PaymentSubmission {
  const conceptShort = buildPaymentConceptShort(input.product)
  const submission: PaymentSubmission = {
    id: crypto.randomUUID(),
    createdAtIso: new Date().toISOString(),
    status: "pending",
    productId: input.product.id,
    productKind: input.product.kind,
    productSubtype: input.product.kind === "session" ? input.product.subtype : undefined,
    productTitle: input.product.title,
    amountEuro: input.product.priceEuro,
    conceptShort,
    payerName: input.payerName,
    payerEmail: input.payerEmail,
    payerPhone: input.payerPhone?.trim() ? input.payerPhone.trim() : undefined,
  }

  const existing = listPaymentSubmissions()
  const next = [submission, ...existing]
  atomicWriteFile(SUBMISSIONS_PATH, JSON.stringify(next, null, 2))
  return submission
}

export function updatePaymentSubmissionStatus(input: {
  id: string
  status: PaymentStatus
  updatedByEmail?: string
}): PaymentSubmission {
  const existing = listPaymentSubmissions()
  const idx = existing.findIndex((s) => s.id === input.id)
  if (idx < 0) throw new Error("NOT_FOUND")

  const current = existing[idx]
  const updated: PaymentSubmission = {
    ...current,
    status: input.status,
    statusUpdatedAtIso: new Date().toISOString(),
    statusUpdatedByEmail: input.updatedByEmail,
  }

  const next = [...existing]
  next[idx] = updated
  atomicWriteFile(SUBMISSIONS_PATH, JSON.stringify(next, null, 2))
  return updated
}
