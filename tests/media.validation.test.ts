import { describe, expect, it } from "vitest"

import {
  DEFAULT_LIMITS,
  inferKindFromExt,
  validateUploadMeta,
} from "../lib/media/validation"

describe("media validation", () => {
  describe("inferKindFromExt", () => {
    it("infers image", () => {
      expect(inferKindFromExt("png")).toBe("image")
      expect(inferKindFromExt(".JPG")).toBe("image")
    })

    it("infers video", () => {
      expect(inferKindFromExt("mp4")).toBe("video")
    })

    it("infers document", () => {
      expect(inferKindFromExt("pdf")).toBe("document")
    })

    it("throws for disallowed extensions", () => {
      expect(() => inferKindFromExt("exe")).toThrow()
    })
  })

  describe("validateUploadMeta size", () => {
    it("rejects oversized image", () => {
      expect(() =>
        validateUploadMeta({ ext: "png", sizeBytes: DEFAULT_LIMITS.imageBytes + 1 }),
      ).toThrow()
    })

    it("rejects oversized document", () => {
      expect(() =>
        validateUploadMeta({ ext: "pdf", sizeBytes: DEFAULT_LIMITS.documentBytes + 1 }),
      ).toThrow()
    })

    it("rejects oversized video", () => {
      expect(() =>
        validateUploadMeta({ ext: "mp4", sizeBytes: DEFAULT_LIMITS.videoBytes + 1 }),
      ).toThrow()
    })

    it("accepts small image", () => {
      expect(validateUploadMeta({ ext: "png", sizeBytes: 1 })).toEqual({
        kind: "image",
        ext: "png",
      })
    })
  })

  describe("validateUploadMeta mime mismatch", () => {
    it("rejects png with application/pdf", () => {
      expect(() =>
        validateUploadMeta({ ext: "png", mimeType: "application/pdf", sizeBytes: 1 }),
      ).toThrow()
    })

    it("rejects pdf with image/png", () => {
      expect(() =>
        validateUploadMeta({ ext: "pdf", mimeType: "image/png", sizeBytes: 1 }),
      ).toThrow()
    })

    it("rejects mp4 with non-mp4 video mime", () => {
      expect(() =>
        validateUploadMeta({ ext: "mp4", mimeType: "video/quicktime", sizeBytes: 1 }),
      ).toThrow()
    })
  })

  describe("validateUploadMeta mime ok", () => {
    it("accepts webp with image/webp", () => {
      expect(
        validateUploadMeta({ ext: "webp", mimeType: "image/webp", sizeBytes: 1 }),
      ).toEqual({ kind: "image", ext: "webp" })
    })

    it("accepts pdf with application/pdf", () => {
      expect(
        validateUploadMeta({ ext: "pdf", mimeType: "application/pdf", sizeBytes: 1 }),
      ).toEqual({ kind: "document", ext: "pdf" })
    })

    it("accepts mp4 with video/mp4", () => {
      expect(validateUploadMeta({ ext: "mp4", mimeType: "video/mp4", sizeBytes: 1 })).toEqual(
        { kind: "video", ext: "mp4" },
      )
    })
  })
})
