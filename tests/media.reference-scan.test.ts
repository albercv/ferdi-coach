import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { countUrlReferencesInContent } from "../lib/media/reference-scan"

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-refscan-"))
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("countUrlReferencesInContent", () => {
  it("counts exact url occurrences in .md files", async () => {
    const contentRoot = path.join(tmpDir, "content")
    fs.mkdirSync(contentRoot, { recursive: true })

    const url = "/uploads/about/x.png"

    fs.writeFileSync(path.join(contentRoot, "a.md"), `x ${url} y ${url} z`, "utf8")
    fs.writeFileSync(path.join(contentRoot, "b.md"), `solo ${url}`, "utf8")
    fs.writeFileSync(path.join(contentRoot, "c.txt"), `${url} ${url} ${url}`, "utf8")

    await expect(countUrlReferencesInContent({ contentRoot, url })).resolves.toBe(3)
  })

  it("returns 0 when contentRoot does not exist", async () => {
    const contentRoot = path.join(tmpDir, "missing-content")
    await expect(
      countUrlReferencesInContent({ contentRoot, url: "/uploads/a.png" }),
    ).resolves.toBe(0)
  })

  it("throws for invalid url", async () => {
    const contentRoot = path.join(tmpDir, "content")
    fs.mkdirSync(contentRoot, { recursive: true })

    await expect(countUrlReferencesInContent({ contentRoot, url: "" })).rejects.toThrow()
    await expect(countUrlReferencesInContent({ contentRoot, url: "uploads/a.png" })).rejects.toThrow()
  })
})
