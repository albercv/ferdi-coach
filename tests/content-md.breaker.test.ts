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

describe("content-md breaker", () => {
  it("returns defaults when content/breaker.md does not exist", async () => {
    const { getBreaker } = await import("../lib/content-md")
    const breaker = getBreaker()
    expect(breaker.text).toBeTruthy()
  })

  it("writes and reads breaker text", async () => {
    const { getBreaker, setBreaker } = await import("../lib/content-md")

    setBreaker({ text: "No es amor si te apaga." })
    const breaker = getBreaker()

    expect(breaker).toEqual({ text: "No es amor si te apaga." })
  })

  it("trims breaker text on save", async () => {
    const { getBreaker, setBreaker } = await import("../lib/content-md")

    setBreaker({ text: "   Respira. Vuelve a ti.   " })
    const breaker = getBreaker()

    expect(breaker.text).toBe("Respira. Vuelve a ti.")
  })
})

