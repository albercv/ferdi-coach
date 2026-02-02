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

describe("content-md media urls", () => {
  it("parses hero backgroundImageUrl", async () => {
    fs.mkdirSync(path.join(tmpDir, "content"), { recursive: true })
    fs.writeFileSync(
      path.join(tmpDir, "content", "hero.md"),
      `---
title: "T"
subtitle: "S"
ctaPrimary: "C"
backgroundImageUrl: "/uploads/hero/bg--x.webp"
bullets: []
---
`,
      "utf8",
    )

    const { getHero } = await import("../lib/content-md")
    const hero = getHero()
    expect(hero.backgroundImageUrl).toBe("/uploads/hero/bg--x.webp")
  })

  it("writes hero backgroundImageUrl as-is", async () => {
    const { getHero, setHero } = await import("../lib/content-md")
    const base = getHero()
    setHero({ ...base, backgroundImageUrl: "/uploads/hero/bg--x.webp" })
    const raw = fs.readFileSync(path.join(tmpDir, "content", "hero.md"), "utf8")
    expect(raw).toContain('backgroundImageUrl: "/uploads/hero/bg--x.webp"')
  })

  it("parses about videoUrl and posterImageUrl", async () => {
    fs.mkdirSync(path.join(tmpDir, "content"), { recursive: true })
    fs.writeFileSync(
      path.join(tmpDir, "content", "about.md"),
      `---
title: "Sobre mí"
videoUrl: "/uploads/about/v--x.mp4"
posterImageUrl: "/uploads/about/p--x.webp"
credentials:
  - "c1"
---
body
`,
      "utf8",
    )

    const { getAbout } = await import("../lib/content-md")
    const about = getAbout()
    expect(about.videoUrl).toBe("/uploads/about/v--x.mp4")
    expect(about.posterImageUrl).toBe("/uploads/about/p--x.webp")
  })

  it("writes about videoUrl and posterImageUrl as-is", async () => {
    const { setAbout } = await import("../lib/content-md")
    setAbout({
      title: "T",
      description: "D",
      credentials: [],
      videoUrl: "/uploads/about/v--x.mp4",
      posterImageUrl: "/uploads/about/p--x.webp",
    })

    const raw = fs.readFileSync(path.join(tmpDir, "content", "about.md"), "utf8")
    expect(raw).toContain('videoUrl: "/uploads/about/v--x.mp4"')
    expect(raw).toContain('posterImageUrl: "/uploads/about/p--x.webp"')
  })

  it("computes testimonial videoUrl/imageUrl from legacy slugs", async () => {
    const dir = path.join(tmpDir, "content", "testimonials")
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, "001-a.md"),
      `---
name: "A"
age: 30
rating: 5
position: 1
video: "legacy-video"
image: "legacy-image"
---
text
`,
      "utf8",
    )

    const { getTestimonials } = await import("../lib/content-md")
    const [t] = getTestimonials()
    expect(t.video).toBe("legacy-video")
    expect(t.image).toBe("legacy-image")
    expect(t.videoUrl).toBe("/legacy-video.mp4")
    expect(t.imageUrl).toBe("/legacy-image.png")
  })

  it("prefers testimonial videoUrl/imageUrl over legacy", async () => {
    const dir = path.join(tmpDir, "content", "testimonials")
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, "001-a.md"),
      `---
name: "A"
age: 30
rating: 5
position: 1
videoUrl: "/uploads/testimonials/a/v--x.mp4"
imageUrl: "/uploads/testimonials/a/i--x.webp"
video: "legacy-video"
image: "legacy-image"
---
text
`,
      "utf8",
    )

    const { getTestimonials } = await import("../lib/content-md")
    const [t] = getTestimonials()
    expect(t.videoUrl).toBe("/uploads/testimonials/a/v--x.mp4")
    expect(t.imageUrl).toBe("/uploads/testimonials/a/i--x.webp")
    expect(t.video).toBe("legacy-video")
    expect(t.image).toBe("legacy-image")
  })

  it("prefers testimonial mediaUrl over videoUrl/imageUrl/legacy", async () => {
    const dir = path.join(tmpDir, "content", "testimonials")
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, "001-a.md"),
      `---
name: "A"
age: 30
rating: 5
position: 1
mediaUrl: "/uploads/testimonials/a/m--x.webp"
videoUrl: "/uploads/testimonials/a/v--x.mp4"
imageUrl: "/uploads/testimonials/a/i--x.webp"
video: "legacy-video"
image: "legacy-image"
---
text
`,
      "utf8",
    )

    const { getTestimonials } = await import("../lib/content-md")
    const [t] = getTestimonials()
    expect(t.mediaUrl).toBe("/uploads/testimonials/a/m--x.webp")
  })

  it("prefers testimonial videoUrl over imageUrl when mediaUrl missing", async () => {
    const dir = path.join(tmpDir, "content", "testimonials")
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, "001-a.md"),
      `---
name: "A"
age: 30
rating: 5
position: 1
videoUrl: "/uploads/testimonials/a/v--x.mp4"
imageUrl: "/uploads/testimonials/a/i--x.webp"
---
text
`,
      "utf8",
    )

    const { getTestimonials } = await import("../lib/content-md")
    const [t] = getTestimonials()
    expect(t.mediaUrl).toBe("/uploads/testimonials/a/v--x.mp4")
  })

  it("resolves testimonial mediaUrl from legacy video slug", async () => {
    const dir = path.join(tmpDir, "content", "testimonials")
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, "001-a.md"),
      `---
name: "A"
age: 30
rating: 5
position: 1
video: "abc"
---
text
`,
      "utf8",
    )

    const { getTestimonials } = await import("../lib/content-md")
    const [t] = getTestimonials()
    expect(t.mediaUrl).toBe("/abc.mp4")
  })

  it("resolves testimonial mediaUrl from legacy image slug when no video", async () => {
    const dir = path.join(tmpDir, "content", "testimonials")
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, "001-a.md"),
      `---
name: "A"
age: 30
rating: 5
position: 1
image: "img1"
---
text
`,
      "utf8",
    )

    const { getTestimonials } = await import("../lib/content-md")
    const [t] = getTestimonials()
    expect(t.mediaUrl).toBe("/img1.png")
  })

  it("returns testimonial mediaUrl undefined when no media fields exist", async () => {
    const dir = path.join(tmpDir, "content", "testimonials")
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, "001-a.md"),
      `---
name: "A"
age: 30
rating: 5
position: 1
---
text
`,
      "utf8",
    )

    const { getTestimonials } = await import("../lib/content-md")
    const [t] = getTestimonials()
    expect(t.mediaUrl).toBeUndefined()
  })

  it("writes testimonial videoUrl/imageUrl as-is", async () => {
    const { addTestimonialItem } = await import("../lib/content-md")
    const created = addTestimonialItem({
      name: "A",
      age: 30,
      rating: 5,
      text: "text",
      position: 1,
      videoUrl: "/uploads/testimonials/a/v--x.mp4",
      imageUrl: "/uploads/testimonials/a/i--x.webp",
    })

    const raw = fs.readFileSync(
      path.join(tmpDir, "content", "testimonials", `${created.id}.md`),
      "utf8",
    )

    expect(raw).toContain('videoUrl: "/uploads/testimonials/a/v--x.mp4"')
    expect(raw).toContain('imageUrl: "/uploads/testimonials/a/i--x.webp"')
  })

  it("writes testimonial mediaUrl and omits legacy fields", async () => {
    const { addTestimonialItem } = await import("../lib/content-md")
    const created = addTestimonialItem({
      name: "A",
      age: 30,
      rating: 5,
      text: "text",
      position: 1,
      mediaUrl: "/uploads/testimonials/a/m--x.mp4",
      videoUrl: "/uploads/testimonials/a/v--x.mp4",
      imageUrl: "/uploads/testimonials/a/i--x.webp",
      video: "legacy-video",
      image: "legacy-image",
    })

    const raw = fs.readFileSync(
      path.join(tmpDir, "content", "testimonials", `${created.id}.md`),
      "utf8",
    )

    expect(raw).toContain('mediaUrl: "/uploads/testimonials/a/m--x.mp4"')
    expect(raw).not.toContain("videoUrl:")
    expect(raw).not.toContain("imageUrl:")
    expect(raw).not.toContain("video:")
    expect(raw).not.toContain("image:")
  })
})
