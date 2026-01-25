import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

describe("hero-section backgroundImageUrl", () => {
  it("uses backgroundImageUrl as-is when provided", async () => {
    const { HeroSection } = await import("../components/sections/hero-section")

    const html = renderToStaticMarkup(
      React.createElement(HeroSection, {
        hero: {
          title: "T",
          subtitle: "S",
          ctaPrimary: "C",
          bullets: [],
          backgroundImageUrl: "/uploads/hero/bg--x.webp",
        },
      }),
    )

    expect(html).toContain('src="/uploads/hero/bg--x.webp"')
  })

  it("falls back to hardcoded image when missing", async () => {
    const { HeroSection } = await import("../components/sections/hero-section")

    const html = renderToStaticMarkup(
      React.createElement(HeroSection, {
        hero: {
          title: "T",
          subtitle: "S",
          ctaPrimary: "C",
          bullets: [],
        },
      }),
    )

    expect(html).toContain('src="/hero-img-v1.png"')
  })
})

