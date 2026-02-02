import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("next-auth", () => {
  return {
    getServerSession: vi.fn(async () => ({ user: { role: "admin", email: "admin@example.com" } })),
  }
})

let tmpDir: string
const originalCwd = process.cwd()

beforeEach(() => {
  vi.resetModules()
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-content-api-media-cleanup-"))
  process.chdir(tmpDir)
})

afterEach(() => {
  process.chdir(originalCwd)
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("content APIs media cleanup", () => {
  it("deletes old /uploads url when hero background is replaced", async () => {
    const publicDir = path.join(tmpDir, "public")
    const filePath = path.join(publicDir, "uploads", "hero", "old.webp")
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, new Uint8Array([1]))

    const { setHero } = await import("../lib/content-md")
    setHero({
      title: "T",
      subtitle: "S",
      ctaPrimary: "C",
      ctaSecondary: "C2",
      bullets: [],
      backgroundImageUrl: "/uploads/hero/old.webp",
    })

    const { PUT } = await import("../app/api/content/hero/route")
    const res = await PUT(
      new Request("http://localhost/api/content/hero", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "T",
          subtitle: "S",
          ctaPrimary: "C",
          ctaSecondary: "C2",
          bullets: [],
          backgroundImageUrl: "",
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(fs.existsSync(filePath)).toBe(false)
  })

  it("does not delete old /uploads url when still referenced in other MD", async () => {
    const publicDir = path.join(tmpDir, "public")
    const filePath = path.join(publicDir, "uploads", "hero", "old.webp")
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, new Uint8Array([1]))

    const contentDir = path.join(tmpDir, "content")
    fs.mkdirSync(contentDir, { recursive: true })
    fs.writeFileSync(
      path.join(contentDir, "other.md"),
      "ref /uploads/hero/old.webp",
      "utf8",
    )

    const { setHero } = await import("../lib/content-md")
    setHero({
      title: "T",
      subtitle: "S",
      ctaPrimary: "C",
      ctaSecondary: "C2",
      bullets: [],
      backgroundImageUrl: "/uploads/hero/old.webp",
    })

    const { PUT } = await import("../app/api/content/hero/route")
    const res = await PUT(
      new Request("http://localhost/api/content/hero", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "T",
          subtitle: "S",
          ctaPrimary: "C",
          ctaSecondary: "C2",
          bullets: [],
          backgroundImageUrl: "",
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it("deletes old /uploads url when guide fileUrl is replaced", async () => {
    const publicDir = path.join(tmpDir, "public")
    const filePath = path.join(publicDir, "uploads", "products", "guides", "g1", "old.pdf")
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, new Uint8Array([1]))

    const { addProductItem } = await import("../lib/products-md")
    const created = addProductItem({
      kind: "guide",
      id: "g1",
      position: 1,
      title: "Guía 1",
      miniDescription: "D",
      price: 1,
      features: [],
      fileUrl: "/uploads/products/guides/g1/old.pdf",
      synopsis: "S",
    })

    const { PUT } = await import("../app/api/content/products/route")
    const res = await PUT(
      new Request("http://localhost/api/content/products", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...created,
          fileUrl: "/fake.pdf",
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(fs.existsSync(filePath)).toBe(false)
  })
})

