import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const getServerSessionMock = vi.fn()

vi.mock("next-auth", () => {
  return {
    getServerSession: getServerSessionMock,
  }
})

let tmpDir: string
let tmpContentDir: string

beforeEach(() => {
  vi.resetModules()
  getServerSessionMock.mockReset()
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ferdy-coach-for-who-"))
  tmpContentDir = path.join(tmpDir, "content")
  fs.mkdirSync(tmpContentDir, { recursive: true })
  process.env.CONTENT_DIR = tmpContentDir
})

afterEach(() => {
  delete process.env.CONTENT_DIR
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("for-who markdown storage", () => {
  it("returns defaults when for-who.md is missing", async () => {
    const { getForWho } = await import("../lib/content-md")
    const got = getForWho()
    expect(got.title).toBeTruthy()
    expect(got.subtitle).toBeTruthy()
    expect(got.ctaText).toBeTruthy()
    expect(got.ctaHref).toBeTruthy()
    expect(got.cards.length).toBeGreaterThan(0)
  })

  it("writes normalized card positions", async () => {
    const { setForWho } = await import("../lib/content-md")
    setForWho({
      title: "T",
      subtitle: "S",
      ctaText: "CTA",
      ctaHref: "#x",
      cards: [
        { id: "b", position: 10, icon: "users", title: "B", description: "DB" },
        { id: "a", position: 1, icon: "heart-crack", title: "A", description: "DA" },
      ],
    })

    const raw = fs.readFileSync(path.join(tmpContentDir, "for-who.md"), "utf8")
    expect(raw).toContain('title: "T"')
    expect(raw).toContain('ctaText: "CTA"')
    expect(raw).toContain("position: 1")
    expect(raw).toContain("position: 2")
  })
})

describe("for-who API route", () => {
  it("POST requires admin session", async () => {
    const { POST } = await import("../app/api/content/for-who/route")
    getServerSessionMock.mockResolvedValueOnce(null)

    const req = new Request("http://localhost/api/content/for-who", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "T",
        subtitle: "S",
        ctaText: "CTA",
        ctaHref: "#x",
        cards: [{ id: "1", position: 1, icon: "heart-crack", title: "A", description: "D" }],
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it("POST stores content when admin", async () => {
    const route = await import("../app/api/content/for-who/route")
    getServerSessionMock.mockResolvedValue({ user: { role: "admin", email: "admin@example.com" } })

    const postReq = new Request("http://localhost/api/content/for-who", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "T",
        subtitle: "S",
        ctaText: "CTA",
        ctaHref: "#x",
        cards: [{ id: "1", position: 1, icon: "heart-crack", title: "A", description: "D" }],
      }),
    })
    const postRes = await route.POST(postReq)
    expect(postRes.status).toBe(200)

    const getRes = await route.GET()
    expect(getRes.status).toBe(200)
    const data = await getRes.json()
    expect(data.title).toBe("T")
    expect(data.ctaText).toBe("CTA")
    expect(Array.isArray(data.cards)).toBe(true)
    expect(data.cards[0].title).toBe("A")
  })
})

describe("ForWhoSection component", () => {
  it("renders cards and CTA from props", async () => {
    const { ForWhoSection } = await import("../components/sections/for-who-section")
    const html = renderToStaticMarkup(
      React.createElement(ForWhoSection, {
        forWho: {
          title: "¿Acabas de terminar una relación?",
          subtitle: "Sub",
          ctaText: "Ir",
          ctaHref: "#go",
          cards: [{ id: "1", position: 1, icon: "target", title: "Card", description: "Desc" }],
        },
      }),
    )

    expect(html).toContain("¿Acabas de terminar una relación?")
    expect(html).toContain("Card")
    expect(html).toContain('href="#go"')
    expect(html).toContain(">Ir</a>")
  })
})

