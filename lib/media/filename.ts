import crypto from "node:crypto"

export const ALLOWED_EXTENSIONS: ReadonlySet<string> = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "avif",
  "mp4",
  "pdf",
])

export function sanitizeBasename(name: string): string {
  const trimmed = name.trim().toLowerCase()

  const lastDotIndex = trimmed.lastIndexOf(".")
  const withoutExt = lastDotIndex > -1 ? trimmed.slice(0, lastDotIndex) : trimmed

  const withDashes = withoutExt.replace(/[\s_]+/g, "-")
  const onlyAllowedChars = withDashes.replace(/[^a-z0-9-]/g, "")
  const collapsedDashes = onlyAllowedChars.replace(/-+/g, "-")
  const finalName = collapsedDashes.replace(/^-+/, "").replace(/-+$/, "")

  return finalName || "file"
}

export function getSafeExt(inputExtOrFilename: string): string {
  const value = inputExtOrFilename.trim().toLowerCase()

  const lastDotIndex = value.lastIndexOf(".")
  const ext = lastDotIndex > -1 ? value.slice(lastDotIndex + 1) : value

  if (!ext) {
    throw new Error("Missing file extension")
  }

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`Extension '${ext}' is not allowed`)
  }

  return ext
}

export function buildUniqueFilename(originalName: string, forcedExt?: string): string {
  const base = sanitizeBasename(originalName)
  const ext = forcedExt ? getSafeExt(forcedExt) : getSafeExt(originalName)
  const suffix = crypto.randomUUID().slice(0, 8)

  return `${base}--${suffix}.${ext}`
}
