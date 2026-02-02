import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

let tmpDir: string
const originalCwd = process.cwd()

beforeEach(() => {
  vi.resetModules()
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-"))
  process.chdir(tmpDir)
})

afterEach(() => {
  process.chdir(originalCwd)
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("products-md media urls", () => {
  it("parses guides coverImageUrl without breaking fileUrl", async () => {
    const dir = path.join(tmpDir, "content", "products", "guides")
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, "001-g.md"),
      `---
title: "G"
miniDescription: "M"
price: 1
features:
  - "a"
fileUrl: "/uploads/products/guides/g/f--x.pdf"
coverImageUrl: "/uploads/products/guides/g/c--x.webp"
position: 1
---
syn
`,
      "utf8",
    )

    const { getGuides } = await import("../lib/products-md")
    const [g] = getGuides()
    expect(g.fileUrl).toBe("/uploads/products/guides/g/f--x.pdf")
    expect(g.coverImageUrl).toBe("/uploads/products/guides/g/c--x.webp")
  })

  it("writes guides coverImageUrl as-is", async () => {
    const { addProductItem } = await import("../lib/products-md")
    const created = addProductItem({
      kind: "guide",
      title: "G",
      miniDescription: "M",
      price: 1,
      features: [],
      fileUrl: "/uploads/products/guides/g/f--x.pdf",
      coverImageUrl: "/uploads/products/guides/g/c--x.webp",
      synopsis: "syn",
      position: 1,
    })

    expect(created.kind).toBe("guide")

    const raw = fs.readFileSync(
      path.join(tmpDir, "content", "products", "guides", `${created.id}.md`),
      "utf8",
    )
    expect(raw).toContain('coverImageUrl: "/uploads/products/guides/g/c--x.webp"')
  })

  it("parses sessions imageUrl", async () => {
    const dir = path.join(tmpDir, "content", "products", "sessions")
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, "001-s.md"),
      `---
subtype: "individual"
title: "S"
price: 1
features: []
imageUrl: "/uploads/products/sessions/s/i--x.webp"
position: 1
---
desc
`,
      "utf8",
    )

    const { getSessions } = await import("../lib/products-md")
    const [s] = getSessions()
    expect(s.imageUrl).toBe("/uploads/products/sessions/s/i--x.webp")
  })

  it("writes sessions imageUrl as-is", async () => {
    const { addProductItem } = await import("../lib/products-md")
    const created = addProductItem({
      kind: "session",
      subtype: "individual",
      title: "S",
      description: "desc",
      price: 1,
      features: [],
      imageUrl: "/uploads/products/sessions/s/i--x.webp",
      position: 1,
    })

    expect(created.kind).toBe("session")

    const raw = fs.readFileSync(
      path.join(tmpDir, "content", "products", "sessions", `${created.id}.md`),
      "utf8",
    )
    expect(raw).toContain('imageUrl: "/uploads/products/sessions/s/i--x.webp"')
  })
})

