import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

describe("guides-section back cover", () => {
  it("uses guide.coverImageUrl when provided", async () => {
    const { GuidesSection } = await import("../components/sections/guides-section")

    const html = renderToStaticMarkup(
      React.createElement(GuidesSection, {
        guides: [
          {
            id: "g-1",
            kind: "guide",
            position: 1,
            title: "G1",
            miniDescription: "M1",
            price: 0,
            features: [],
            fileUrl: "/fake.pdf",
            coverImageUrl: "/uploads/products/guides/g-1/c--x.webp",
            synopsis: "S1",
            mostPopular: false,
          },
        ],
      }),
    )

    expect(html).toContain('src="/uploads/products/guides/g-1/c--x.webp"')
    expect(html).not.toContain('src="/logo2.webp"')
  })

  it("falls back to /logo2.webp when guide.coverImageUrl is missing", async () => {
    const { GuidesSection } = await import("../components/sections/guides-section")

    const html = renderToStaticMarkup(
      React.createElement(GuidesSection, {
        guides: [
          {
            id: "g-2",
            kind: "guide",
            position: 1,
            title: "G2",
            miniDescription: "M2",
            price: 0,
            features: [],
            fileUrl: "/fake.pdf",
            synopsis: "S2",
            mostPopular: false,
          },
        ],
      }),
    )

    expect(html).toContain('src="/logo2.webp"')
  })
})
