import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

describe("about-section media urls", () => {
  it("uses videoUrl and posterImageUrl as-is when provided", async () => {
    const { AboutSection } = await import("../components/sections/about-section")

    const html = renderToStaticMarkup(
      React.createElement(AboutSection, {
        about: {
          title: "Sobre mí",
          description: "D",
          credentials: [],
          videoUrl: "/uploads/about/v--x.mp4",
          posterImageUrl: "/uploads/about/p--x.webp",
        },
      }),
    )

    expect(html).toContain('src="/uploads/about/v--x.mp4"')
    expect(html).toContain('poster="/uploads/about/p--x.webp"')
  })

  it("falls back to hardcoded video and poster when missing", async () => {
    const { AboutSection } = await import("../components/sections/about-section")

    const html = renderToStaticMarkup(
      React.createElement(AboutSection, {
        about: {
          title: "Sobre mí",
          description: "D",
          credentials: [],
        },
      }),
    )

    expect(html).toContain('src="/ferdy-presentation.mp4"')
    expect(html).toContain('poster="/logo2.webp"')
  })
})

