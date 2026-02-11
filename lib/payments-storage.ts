import fs from "fs"
import path from "path"
import crypto from "crypto"
import matter from "gray-matter"

import type { PaymentStatus, PaymentSubmission, PaymentsConfig, PaymentProductRef } from "@/lib/payments"
import { buildPaymentConceptShort } from "@/lib/payments"

function resolveContentDir(): string {
  const fromEnv = process.env.CONTENT_DIR?.trim()
  if (fromEnv) {
    return path.isAbsolute(fromEnv) ? fromEnv : path.join(process.cwd(), fromEnv)
  }

  const localOverride = path.join(process.cwd(), "content.local")
  if (fs.existsSync(localOverride)) return localOverride

  return path.join(process.cwd(), "content")
}

const CONTENT_DIR = resolveContentDir()
const PAYMENTS_DIR = path.join(CONTENT_DIR, "payments")
const SUBMISSIONS_DIR = path.join(PAYMENTS_DIR, "submissions")

const CONFIG_MD_PATH = path.join(PAYMENTS_DIR, "config.md")
const LEGACY_CONFIG_JSON_PATH = path.join(process.cwd(), "data", "payments", "config.json")

const LEGACY_SUBMISSIONS_JSON_PATH = path.join(process.cwd(), "data", "payments", "submissions.json")

function ensureDirs(): void {
  fs.mkdirSync(PAYMENTS_DIR, { recursive: true })
  fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true })
}

function atomicWriteFile(filePath: string, content: string): void {
  ensureDirs()
  const tmp = `${filePath}.${crypto.randomUUID()}.tmp`
  fs.writeFileSync(tmp, content, "utf8")
  fs.renameSync(tmp, filePath)
}

function stripUndefined(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) out[key] = value
  }
  return out
}

function atomicWriteMarkdownFile(filePath: string, data: Record<string, unknown>, content: string): void {
  const md = matter.stringify((content || "").trim() + "\n", stripUndefined(data))
  atomicWriteFile(filePath, md)
}

function normalizeIban(raw: string): string {
  return raw.replace(/\s+/g, "").toUpperCase()
}

export function getPaymentsConfig(): PaymentsConfig {
  ensureDirs()

  if (fs.existsSync(CONFIG_MD_PATH)) {
    const file = fs.readFileSync(CONFIG_MD_PATH, "utf8")
    const { data } = matter(file)
    return {
      iban: typeof (data as any)?.iban === "string" ? String((data as any).iban) : "",
      updatedAtIso:
        typeof (data as any)?.updatedAtIso === "string" ? String((data as any).updatedAtIso) : new Date(0).toISOString(),
    }
  }

  if (fs.existsSync(LEGACY_CONFIG_JSON_PATH)) {
    const raw = fs.readFileSync(LEGACY_CONFIG_JSON_PATH, "utf8")
    const parsed = JSON.parse(raw)
    const config: PaymentsConfig = {
      iban: typeof parsed?.iban === "string" ? parsed.iban : "",
      updatedAtIso: typeof parsed?.updatedAtIso === "string" ? parsed.updatedAtIso : new Date(0).toISOString(),
    }
    atomicWriteMarkdownFile(CONFIG_MD_PATH, config as any, "")
    return config
  }

  return { iban: "", updatedAtIso: new Date(0).toISOString() }
}

export function setPaymentsIban(ibanRaw: string): PaymentsConfig {
  const iban = normalizeIban(ibanRaw)
  const next: PaymentsConfig = {
    iban,
    updatedAtIso: new Date().toISOString(),
  }
  atomicWriteMarkdownFile(CONFIG_MD_PATH, next as any, "")
  return next
}

export function listPaymentSubmissions(): PaymentSubmission[] {
  ensureDirs()

  const files = fs
    .readdirSync(SUBMISSIONS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(SUBMISSIONS_DIR, f))

  if (files.length === 0 && fs.existsSync(LEGACY_SUBMISSIONS_JSON_PATH)) {
    const raw = fs.readFileSync(LEGACY_SUBMISSIONS_JSON_PATH, "utf8")
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      for (const entry of parsed as PaymentSubmission[]) {
        if (!entry?.id) continue
        const filePath = path.join(SUBMISSIONS_DIR, `${entry.id}.md`)
        if (fs.existsSync(filePath)) continue
        atomicWriteMarkdownFile(filePath, entry as any, "")
      }
    }
  }

  const finalFiles = fs
    .readdirSync(SUBMISSIONS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(SUBMISSIONS_DIR, f))

  const submissions = finalFiles
    .map((filePath) => {
      const file = fs.readFileSync(filePath, "utf8")
      const { data } = matter(file)
      return data as PaymentSubmission
    })
    .filter((s) => !!s?.id)
    .sort((a, b) => String(b.createdAtIso || "").localeCompare(String(a.createdAtIso || "")) || String(b.id).localeCompare(String(a.id)))

  return submissions
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

  const filePath = path.join(SUBMISSIONS_DIR, `${submission.id}.md`)
  atomicWriteMarkdownFile(filePath, submission as any, "")
  return submission
}

export function updatePaymentSubmissionStatus(input: {
  id: string
  status: PaymentStatus
  updatedByEmail?: string
}): PaymentSubmission {
  ensureDirs()
  const filePath = path.join(SUBMISSIONS_DIR, `${input.id}.md`)
  if (!fs.existsSync(filePath)) throw new Error("NOT_FOUND")

  const file = fs.readFileSync(filePath, "utf8")
  const parsed = matter(file)
  const current = parsed.data as PaymentSubmission
  const updated: PaymentSubmission = {
    ...current,
    status: input.status,
    statusUpdatedAtIso: new Date().toISOString(),
    statusUpdatedByEmail: input.updatedByEmail,
  }

  atomicWriteMarkdownFile(filePath, updated as any, "")
  return updated
}
