import { ALLOWED_EXTENSIONS, getSafeExt } from "./filename"

export type MediaKind = "image" | "video" | "document"

export const DEFAULT_LIMITS: Readonly<{
  imageBytes: number
  videoBytes: number
  documentBytes: number
}> = {
  imageBytes: 10 * 1024 * 1024,
  documentBytes: 30 * 1024 * 1024,
  videoBytes: 200 * 1024 * 1024,
}

export function inferKindFromExt(ext: string): MediaKind {
  const normalizedExt = getSafeExt(ext)

  if (
    normalizedExt === "png" ||
    normalizedExt === "jpg" ||
    normalizedExt === "jpeg" ||
    normalizedExt === "webp" ||
    normalizedExt === "avif"
  ) {
    return "image"
  }

  if (normalizedExt === "mp4") {
    return "video"
  }

  if (normalizedExt === "pdf") {
    return "document"
  }

  if (ALLOWED_EXTENSIONS.has(normalizedExt)) {
    throw new Error(`Unsupported extension '${normalizedExt}'`)
  }

  throw new Error(`Extension '${normalizedExt}' is not allowed`)
}

export function isAllowedExt(ext: string): boolean {
  try {
    getSafeExt(ext)
    return true
  } catch {
    return false
  }
}

export function validateUploadMeta(args: {
  ext: string
  mimeType?: string
  sizeBytes: number
  limits?: Partial<typeof DEFAULT_LIMITS>
}): { kind: MediaKind; ext: string } {
  const normalizedExt = getSafeExt(args.ext)
  const kind = inferKindFromExt(normalizedExt)
  const limits = { ...DEFAULT_LIMITS, ...(args.limits ?? {}) }

  if (kind === "image" && args.sizeBytes > limits.imageBytes) {
    throw new Error(
      `File too large for kind 'image': ${args.sizeBytes} bytes (max ${limits.imageBytes})`,
    )
  }

  if (kind === "document" && args.sizeBytes > limits.documentBytes) {
    throw new Error(
      `File too large for kind 'document': ${args.sizeBytes} bytes (max ${limits.documentBytes})`,
    )
  }

  if (kind === "video" && args.sizeBytes > limits.videoBytes) {
    throw new Error(
      `File too large for kind 'video': ${args.sizeBytes} bytes (max ${limits.videoBytes})`,
    )
  }

  if (args.mimeType) {
    const mimeType = args.mimeType

    if (kind === "image" && !mimeType.startsWith("image/")) {
      throw new Error(`MIME type '${mimeType}' is not allowed for kind 'image'`)
    }

    if (kind === "video" && mimeType !== "video/mp4") {
      throw new Error(`MIME type '${mimeType}' is not allowed for kind 'video'`)
    }

    if (kind === "document" && mimeType !== "application/pdf") {
      throw new Error(`MIME type '${mimeType}' is not allowed for kind 'document'`)
    }
  }

  return { kind, ext: normalizedExt }
}
