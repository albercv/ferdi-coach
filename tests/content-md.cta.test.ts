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

describe("content-md CTA", () => {
  it("returns defaults when content/cta.md does not exist", async () => {
    const { getCTA } = await import("../lib/content-md")
    const cta = getCTA()

    expect(cta.title).toBeTruthy()
    expect(cta.description).toBeTruthy()
    expect(cta.buttonText).toBeTruthy()
  })

  it("writes and reads CTA content", async () => {
    const { getCTA, setCTA } = await import("../lib/content-md")

    setCTA({
      title: "CTA título",
      description: "CTA descripción\ncon dos líneas",
      buttonText: "Reservar sesión",
    })

    const cta = getCTA()
    expect(cta).toEqual({
      title: "CTA título",
      description: "CTA descripción\ncon dos líneas",
      buttonText: "Reservar sesión",
    })
  })

  it("preserves quotes in title and buttonText", async () => {
    const { getCTA, setCTA } = await import("../lib/content-md")

    setCTA({
      title: "Dijo \"hola\"",
      description: "Texto",
      buttonText: "\"Reservar\" ahora",
    })

    const cta = getCTA()
    expect(cta.title).toBe("Dijo \"hola\"")
    expect(cta.buttonText).toBe("\"Reservar\" ahora")
  })
})
