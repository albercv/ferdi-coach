import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { LocalPublicStorage } from "../lib/media/storage/LocalPublicStorage"

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-media-list-"))
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("LocalPublicStorage.list", () => {
  it("lists files recursively under a prefix", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    const fileA = path.join(tmpPublic, "uploads", "about", "a.png")
    const fileB = path.join(tmpPublic, "uploads", "about", "nested", "b.pdf")
    fs.mkdirSync(path.dirname(fileA), { recursive: true })
    fs.mkdirSync(path.dirname(fileB), { recursive: true })
    fs.writeFileSync(fileA, new Uint8Array([1]))
    fs.writeFileSync(fileB, new Uint8Array([1, 2]))

    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    const results = await storage.list("/uploads/about")

    expect(results.map((r) => r.url)).toEqual([
      "/uploads/about/a.png",
      "/uploads/about/nested/b.pdf",
    ])

    const map = new Map(results.map((r) => [r.url, r]))
    expect(map.get("/uploads/about/a.png")?.size).toBe(1)
    expect(map.get("/uploads/about/nested/b.pdf")?.size).toBe(2)
    expect(typeof map.get("/uploads/about/a.png")?.lastModifiedMs).toBe("number")
  })

  it("returns [] when directory does not exist", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    fs.mkdirSync(tmpPublic, { recursive: true })

    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    await expect(storage.list("/uploads/missing")).resolves.toEqual([])
  })

  it("throws for invalid prefixUrl", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    fs.mkdirSync(tmpPublic, { recursive: true })

    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    await expect(storage.list("/static")).rejects.toThrow(/uploads/i)
  })

  it("throws for traversal attempts", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    fs.mkdirSync(tmpPublic, { recursive: true })

    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    await expect(storage.list("/uploads/../x")).rejects.toThrow(/\.\./)
  })
})
