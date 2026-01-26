import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/image", () => {
  return {
    default: (props: any) => React.createElement("img", props),
  }
})

describe("testimonial-card media urls", () => {
  it("renders video when mediaUrl is mp4", async () => {
    const { TestimonialCard } = await import("../components/ui/testimonial-card")
    const html = renderToStaticMarkup(
      React.createElement(TestimonialCard, {
        name: "A",
        age: 30,
        text: "t",
        rating: 5,
        mediaUrl: "/uploads/testimonials/a/v--x.mp4",
      }),
    )

    expect(html).toContain("<video")
    expect(html).toContain('src="/uploads/testimonials/a/v--x.mp4"')
  })

  it("renders image when mediaUrl is non-mp4", async () => {
    const { TestimonialCard } = await import("../components/ui/testimonial-card")
    const html = renderToStaticMarkup(
      React.createElement(TestimonialCard, {
        name: "A",
        age: 30,
        text: "t",
        rating: 5,
        mediaUrl: "/uploads/testimonials/a/i--x.webp",
      }),
    )

    expect(html).toContain("<img")
    expect(html).toContain('src="/uploads/testimonials/a/i--x.webp"')
  })

  it("renders fallback when mediaUrl is missing", async () => {
    const { TestimonialCard } = await import("../components/ui/testimonial-card")
    const html = renderToStaticMarkup(
      React.createElement(TestimonialCard, {
        name: "A",
        age: 30,
        text: "t",
        rating: 5,
      }),
    )

    expect(html).toContain('src="/logo2.webp"')
  })
})
