import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { LocalPublicStorage } from "../lib/media/storage/LocalPublicStorage"

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-media-delete-"))
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("LocalPublicStorage.deleteByUrl", () => {
  it("deletes an existing file and returns true", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    const filePath = path.join(tmpPublic, "uploads", "about", "x.png")
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, new Uint8Array([1, 2, 3]))

    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    await expect(storage.deleteByUrl("/uploads/about/x.png")).resolves.toBe(true)
    expect(fs.existsSync(filePath)).toBe(false)
  })

  it("returns false when the file does not exist", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    fs.mkdirSync(tmpPublic, { recursive: true })

    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    await expect(storage.deleteByUrl("/uploads/about/nope.png")).resolves.toBe(false)
  })

  it("throws for invalid url", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    fs.mkdirSync(tmpPublic, { recursive: true })

    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    await expect(storage.deleteByUrl("/static/a.png")).rejects.toThrow(/uploads/i)
  })

  it("throws for traversal attempts", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    fs.mkdirSync(tmpPublic, { recursive: true })

    const storage = new LocalPublicStorage({ publicDir: tmpPublic })
    await expect(storage.deleteByUrl("/uploads/../x")).rejects.toThrow(/\.\./)
    await expect(storage.deleteByUrl("/uploads/%2e%2e/x")).rejects.toThrow(/\.\./)
  })
})
