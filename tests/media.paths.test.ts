import { describe, expect, it } from "vitest"

import { resolveUploadDir, sanitizeSlug } from "../lib/media/paths"

describe("media paths", () => {
  describe("sanitizeSlug", () => {
    it("accepts allowed slugs", () => {
      expect(sanitizeSlug("abc-123_ok")).toBe("abc-123_ok")
    })

    it("rejects invalid slugs", () => {
      const invalidSlugs = [
        "../a",
        "a/b",
        "a b",
        "A B",
        "",
        "__..__",
        "a\\ b",
        "á",
        "a".repeat(81),
      ]

      for (const slug of invalidSlugs) {
        expect(() => sanitizeSlug(slug)).toThrow()
      }
    })
  })

  describe("resolveUploadDir", () => {
    it("resolves static scopes", () => {
      expect(resolveUploadDir({ scope: "hero" })).toBe("uploads/hero")
      expect(resolveUploadDir({ scope: "about" })).toBe("uploads/about")
      expect(resolveUploadDir({ scope: "global" })).toBe("uploads/global")
    })

    it("resolves testimonials scope with slug", () => {
      expect(resolveUploadDir({ scope: "testimonials", entitySlug: "Ana-G" })).toBe(
        "uploads/testimonials/ana-g",
      )
    })

    it("resolves products scope with subscope and slug", () => {
      expect(
        resolveUploadDir({
          scope: "products",
          productSubscope: "guides",
          entitySlug: "Guia-1",
        }),
      ).toBe("uploads/products/guides/guia-1")

      expect(
        resolveUploadDir({
          scope: "products",
          productSubscope: "sessions",
          entitySlug: "Sesion-2",
        }),
      ).toBe("uploads/products/sessions/sesion-2")
    })

    it("rejects testimonials without entitySlug", () => {
      expect(() => resolveUploadDir({ scope: "testimonials" })).toThrow(
        /entitySlug is required/i,
      )
    })

    it("rejects products without required fields", () => {
      expect(() => resolveUploadDir({ scope: "products" })).toThrow(/entitySlug is required/i)
      expect(() => resolveUploadDir({ scope: "products", entitySlug: "x" })).toThrow(
        /productSubscope is required/i,
      )
    })
  })
})
