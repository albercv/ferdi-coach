export const SECTION_KEYS = [
  "breaker",
  "forWho",
  "sessions",
  "guides",
  "testimonials",
  "about",
  "faqs",
  "cta",
] as const

export type SectionKey = (typeof SECTION_KEYS)[number]

export type PaletteToken = "white" | "gold" | "green" | "gray"

export const PALETTE: Record<PaletteToken, { hex: string; label: string }> = {
  white: { hex: "#ffffff", label: "Blanco" },
  gold: { hex: "#b6ac69", label: "Dorado" },
  green: { hex: "#517e61", label: "Verde" },
  gray: { hex: "#d1d5db", label: "Gris" },
}

/**
 * Sections whose chosen color must NOT paint the surrounding wrapper —
 * the color is only exposed as `--section-bg` so an inner element
 * (e.g. the breaker card) can opt in via `var(--section-bg, ...)`.
 */
export const INNER_ONLY_SECTIONS: ReadonlySet<SectionKey> = new Set(["breaker"])

export type SectionStyles = Record<SectionKey, string>

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
const TOKEN_RE = /^(white|gold|green|gray)$/i

export function isValidColorValue(value: unknown): value is string {
  if (typeof value !== "string") return false
  if (value === "") return true
  return TOKEN_RE.test(value) || HEX_RE.test(value)
}

export function resolveColor(value: string | undefined | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  const lower = trimmed.toLowerCase()
  if (lower === "white") return PALETTE.white.hex
  if (lower === "gold") return PALETTE.gold.hex
  if (lower === "green") return PALETTE.green.hex
  if (lower === "gray") return PALETTE.gray.hex
  if (HEX_RE.test(trimmed)) return trimmed
  return null
}
