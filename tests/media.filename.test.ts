import { describe, expect, it } from "vitest"

import {
  buildUniqueFilename,
  getSafeExt,
  sanitizeBasename,
} from "../lib/media/filename"

describe("media filename", () => {
  describe("sanitizeBasename", () => {
    it("sanitizes a basic filename", () => {
      expect(sanitizeBasename("My Photo.png")).toBe("my-photo")
    })

    it("handles weird spacing and underscores", () => {
      expect(sanitizeBasename(" weird__Name ")).toBe("weird-name")
    })

    it("returns file when empty after sanitization", () => {
      expect(sanitizeBasename("....")).toBe("file")
    })

    it("collapses multiple dashes", () => {
      expect(sanitizeBasename("a---b")).toBe("a-b")
    })
  })

  describe("getSafeExt", () => {
    it("accepts extension without dot", () => {
      expect(getSafeExt("png")).toBe("png")
    })

    it("accepts extension with dot and normalizes case", () => {
      expect(getSafeExt(".JPG")).toBe("jpg")
    })

    it("accepts filename and returns extension", () => {
      expect(getSafeExt("photo.WeBp")).toBe("webp")
    })

    it("throws when there is no extension", () => {
      expect(() => getSafeExt("noext")).toThrow()
    })

    it("throws when extension is not allowed", () => {
      expect(() => getSafeExt("file.exe")).toThrow()
    })
  })

  describe("buildUniqueFilename", () => {
    it("includes '--' and ends with the original extension", () => {
      const name = buildUniqueFilename("x.png")
      expect(name).toContain("--")
      expect(name).toMatch(/^x--[0-9a-f]{8}\.png$/)
    })

    it("uses forcedExt when provided", () => {
      const name = buildUniqueFilename("x.png", "pdf")
      expect(name).toMatch(/^x--[0-9a-f]{8}\.pdf$/)
    })
  })
})
