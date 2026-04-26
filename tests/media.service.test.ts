import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

let tmpDir: string

async function loadMedia() {
  const { MediaService } = await import("../lib/media/mediaService")
  const { LocalPublicStorage } = await import("../lib/media/storage/LocalPublicStorage")
  return { MediaService, LocalPublicStorage }
}

beforeEach(() => {
  vi.resetModules()
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-media-service-"))
})

afterEach(() => {
  delete process.env.CONTENT_DIR
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("MediaService", () => {
  it("uploads a file to the expected scope directory", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    const tmpContent = path.join(tmpDir, "content")
    fs.mkdirSync(tmpPublic, { recursive: true })
    fs.mkdirSync(tmpContent, { recursive: true })

    const { MediaService, LocalPublicStorage } = await loadMedia()
    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    const service = new MediaService({ storage, contentRoot: tmpContent })

    const result = await service.upload({
      bytes: new Uint8Array([1, 2, 3]),
      originalName: "x.png",
      mimeType: "image/png",
      sizeBytes: 3,
      scope: "about",
    })

    expect(result.url.startsWith("/uploads/about/")).toBe(true)
    expect(result.kind).toBe("image")

    const filename = path.posix.basename(result.url)
    const filePath = path.join(tmpPublic, "uploads", "about", filename)
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it("tryDeleteIfUnreferenced deletes when not referenced", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    const tmpContent = path.join(tmpDir, "content")
    fs.mkdirSync(tmpPublic, { recursive: true })
    fs.mkdirSync(tmpContent, { recursive: true })

    const filePath = path.join(tmpPublic, "uploads", "about", "x.png")
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, new Uint8Array([1]))

    const { MediaService, LocalPublicStorage } = await loadMedia()
    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    const service = new MediaService({ storage, contentRoot: tmpContent })

    await expect(service.tryDeleteIfUnreferenced("/uploads/about/x.png")).resolves.toEqual({
      deleted: true,
    })

    expect(fs.existsSync(filePath)).toBe(false)
  })

  it("tryDeleteIfUnreferenced does not delete when still referenced", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    const tmpContent = path.join(tmpDir, "content")
    fs.mkdirSync(tmpPublic, { recursive: true })
    fs.mkdirSync(tmpContent, { recursive: true })

    const url = "/uploads/about/y.png"
    const filePath = path.join(tmpPublic, "uploads", "about", "y.png")
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, new Uint8Array([1]))
    fs.writeFileSync(path.join(tmpContent, "a.md"), `ref ${url}`, "utf8")

    const { MediaService, LocalPublicStorage } = await loadMedia()
    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    const service = new MediaService({ storage, contentRoot: tmpContent })

    await expect(service.tryDeleteIfUnreferenced(url)).resolves.toEqual({
      deleted: false,
      reason: "still-referenced",
    })

    expect(fs.existsSync(filePath)).toBe(true)
  })

  it("bloquea borrado si hay submission activa (pending) que referencia el fichero", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    const tmpContent = path.join(tmpDir, "content")
    fs.mkdirSync(tmpPublic, { recursive: true })
    fs.mkdirSync(tmpContent, { recursive: true })
    process.env.CONTENT_DIR = tmpContent

    const url = "/uploads/products/guides/g1/guia.pdf"
    const filePath = path.join(tmpPublic, "uploads", "products", "guides", "g1", "guia.pdf")
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, new Uint8Array([1]))

    const { createPaymentSubmission } = await import("../lib/payments-storage")
    createPaymentSubmission({
      product: { kind: "guide", id: "g1", title: "Guía", priceEuro: 30 },
      payerName: "A",
      payerEmail: "a@example.com",
      productFileUrl: url,
    })

    const { MediaService, LocalPublicStorage } = await loadMedia()
    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    const service = new MediaService({ storage, contentRoot: tmpContent })

    await expect(service.tryDeleteIfUnreferenced(url)).resolves.toEqual({
      deleted: false,
      reason: "referenced-by-active-payments",
    })
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it("permite borrado si sólo hay submissions terminales (confirmed/failed) referenciando el fichero", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    const tmpContent = path.join(tmpDir, "content")
    fs.mkdirSync(tmpPublic, { recursive: true })
    fs.mkdirSync(tmpContent, { recursive: true })
    process.env.CONTENT_DIR = tmpContent

    const url = "/uploads/products/guides/g2/guia.pdf"
    const filePath = path.join(tmpPublic, "uploads", "products", "guides", "g2", "guia.pdf")
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, new Uint8Array([1]))

    const { createPaymentSubmission, updatePaymentSubmissionStatus } = await import("../lib/payments-storage")
    const s1 = createPaymentSubmission({
      product: { kind: "guide", id: "g2", title: "Guía", priceEuro: 30 },
      payerName: "A",
      payerEmail: "a@example.com",
      productFileUrl: url,
    })
    const s2 = createPaymentSubmission({
      product: { kind: "guide", id: "g2", title: "Guía", priceEuro: 30 },
      payerName: "B",
      payerEmail: "b@example.com",
      productFileUrl: url,
    })
    updatePaymentSubmissionStatus({ id: s1.id, status: "confirmed" })
    updatePaymentSubmissionStatus({ id: s2.id, status: "failed" })

    const { MediaService, LocalPublicStorage } = await loadMedia()
    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    const service = new MediaService({ storage, contentRoot: tmpContent })

    await expect(service.tryDeleteIfUnreferenced(url)).resolves.toEqual({
      deleted: true,
    })
    expect(fs.existsSync(filePath)).toBe(false)
  })

  it("bloquea borrado si un .md de producto lo referencia aunque todas las submissions sean terminales", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    const tmpContent = path.join(tmpDir, "content")
    fs.mkdirSync(tmpPublic, { recursive: true })
    fs.mkdirSync(tmpContent, { recursive: true })
    process.env.CONTENT_DIR = tmpContent

    const url = "/uploads/products/guides/g3/guia.pdf"
    const filePath = path.join(tmpPublic, "uploads", "products", "guides", "g3", "guia.pdf")
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, new Uint8Array([1]))

    // Simulamos un .md de producto que sigue referenciando el fichero
    const productMd = path.join(tmpContent, "products", "guides", "g3.md")
    fs.mkdirSync(path.dirname(productMd), { recursive: true })
    fs.writeFileSync(productMd, `---\nfileUrl: "${url}"\n---\n`, "utf8")

    const { createPaymentSubmission, updatePaymentSubmissionStatus } = await import("../lib/payments-storage")
    const s = createPaymentSubmission({
      product: { kind: "guide", id: "g3", title: "Guía", priceEuro: 30 },
      payerName: "A",
      payerEmail: "a@example.com",
      productFileUrl: url,
    })
    updatePaymentSubmissionStatus({ id: s.id, status: "confirmed" })

    const { MediaService, LocalPublicStorage } = await loadMedia()
    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    const service = new MediaService({ storage, contentRoot: tmpContent })

    await expect(service.tryDeleteIfUnreferenced(url)).resolves.toEqual({
      deleted: false,
      reason: "still-referenced",
    })
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it("lists objects using the storage adapter", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    const tmpContent = path.join(tmpDir, "content")
    fs.mkdirSync(tmpPublic, { recursive: true })
    fs.mkdirSync(tmpContent, { recursive: true })

    const { MediaService, LocalPublicStorage } = await loadMedia()
    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    const service = new MediaService({ storage, contentRoot: tmpContent })

    const r1 = await service.upload({
      bytes: new Uint8Array([1]),
      originalName: "a.png",
      mimeType: "image/png",
      sizeBytes: 1,
      scope: "about",
    })

    const r2 = await service.upload({
      bytes: new Uint8Array([1, 2]),
      originalName: "b.png",
      mimeType: "image/png",
      sizeBytes: 2,
      scope: "about",
    })

    const list = await service.list("/uploads/about")
    const urls = list.map((x) => x.url)

    expect(urls).toContain(r1.url)
    expect(urls).toContain(r2.url)
  })
})
