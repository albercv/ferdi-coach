import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { MediaService } from "../lib/media/mediaService"
import { LocalPublicStorage } from "../lib/media/storage/LocalPublicStorage"

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-media-service-"))
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("MediaService", () => {
  it("uploads a file to the expected scope directory", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    const tmpContent = path.join(tmpDir, "content")
    fs.mkdirSync(tmpPublic, { recursive: true })
    fs.mkdirSync(tmpContent, { recursive: true })

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
