import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { LocalPublicStorage } from "../lib/media/storage/LocalPublicStorage"

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-media-"))
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("LocalPublicStorage.save", () => {
  it("saves bytes and returns the expected URL", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    fs.mkdirSync(tmpPublic, { recursive: true })

    const storage = new LocalPublicStorage({ publicDir: tmpPublic })

    const result = await storage.save({
      bytes: new Uint8Array([1, 2, 3]),
      dirRelToPublic: "uploads/about",
      filename: "x--abcd1234.png",
    })

    expect(result.url).toBe("/uploads/about/x--abcd1234.png")
    expect(result.size).toBe(3)

    const expectedPath = path.join(tmpPublic, "uploads", "about", "x--abcd1234.png")
    expect(fs.existsSync(expectedPath)).toBe(true)
    expect(fs.statSync(expectedPath).size).toBe(3)
  })

  it("rejects dirRelToPublic outside uploads", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    fs.mkdirSync(tmpPublic, { recursive: true })

    const storage = new LocalPublicStorage({ publicDir: tmpPublic })

    await expect(
      storage.save({
        bytes: new Uint8Array([1, 2, 3]),
        dirRelToPublic: "static/about",
        filename: "x--abcd1234.png",
      }),
    ).rejects.toThrow(/dirRelToPublic must start/i)
  })

  it("rejects dangerous filenames", async () => {
    const tmpPublic = path.join(tmpDir, "public")
    fs.mkdirSync(tmpPublic, { recursive: true })

    const storage = new LocalPublicStorage({ publicDir: tmpPublic })

    await expect(
      storage.save({
        bytes: new Uint8Array([1, 2, 3]),
        dirRelToPublic: "uploads/about",
        filename: "../a.png",
      }),
    ).rejects.toThrow()

    await expect(
      storage.save({
        bytes: new Uint8Array([1, 2, 3]),
        dirRelToPublic: "uploads/about",
        filename: "a/b.png",
      }),
    ).rejects.toThrow()
  })
})
