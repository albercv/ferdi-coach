import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/image", () => {
  return {
    default: (props: any) => React.createElement("img", props),
  }
})

describe("testimonial-card media urls", () => {
  it("renders video when videoUrl is provided", async () => {
    const { TestimonialCard } = await import("../components/ui/testimonial-card")
    const html = renderToStaticMarkup(
      React.createElement(TestimonialCard, {
        name: "A",
        age: 30,
        text: "t",
        rating: 5,
        videoUrl: "/uploads/testimonials/a/v--x.mp4",
      }),
    )

    expect(html).toContain("<video")
    expect(html).toContain('src="/uploads/testimonials/a/v--x.mp4"')
  })

  it("renders image when imageUrl is provided", async () => {
    const { TestimonialCard } = await import("../components/ui/testimonial-card")
    const html = renderToStaticMarkup(
      React.createElement(TestimonialCard, {
        name: "A",
        age: 30,
        text: "t",
        rating: 5,
        imageUrl: "/uploads/testimonials/a/i--x.webp",
      }),
    )

    expect(html).toContain("<img")
    expect(html).toContain('src="/uploads/testimonials/a/i--x.webp"')
  })
})

