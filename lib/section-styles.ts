import fs from "fs"
import path from "path"
import matter from "gray-matter"

import {
  SECTION_KEYS,
  isValidColorValue,
  type SectionStyles,
} from "@/lib/section-styles-shared"

export {
  SECTION_KEYS,
  PALETTE,
  isValidColorValue,
  resolveColor,
} from "@/lib/section-styles-shared"
export type {
  SectionKey,
  PaletteToken,
  SectionStyles,
} from "@/lib/section-styles-shared"

const FILE_PATH = path.join(process.cwd(), "content", "section-styles.md")

function emptyStyles(): SectionStyles {
  return SECTION_KEYS.reduce((acc, key) => {
    acc[key] = ""
    return acc
  }, {} as SectionStyles)
}

export function getSectionStyles(): SectionStyles {
  if (!fs.existsSync(FILE_PATH)) return emptyStyles()
  const raw = fs.readFileSync(FILE_PATH, "utf8")
  const { data } = matter(raw)
  const out = emptyStyles()
  for (const key of SECTION_KEYS) {
    const v = (data as Record<string, unknown>)[key]
    if (typeof v === "string" && isValidColorValue(v)) {
      out[key] = v
    }
  }
  return out
}

export function setSectionStyles(next: Partial<SectionStyles>): SectionStyles {
  const current = getSectionStyles()
  const merged: SectionStyles = { ...current }
  for (const key of SECTION_KEYS) {
    const v = next[key]
    if (v === undefined) continue
    if (!isValidColorValue(v)) {
      throw new Error(`Color inválido para "${key}": ${String(v)}`)
    }
    merged[key] = v
  }

  const dir = path.dirname(FILE_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const escapeYaml = (s: string) => s.replace(/"/g, '\\"')
  const fm =
    `---\n` +
    SECTION_KEYS.map((key) => `${key}: "${escapeYaml(merged[key])}"`).join("\n") +
    `\n---\n` +
    `Configuración de color de fondo por sección de la home.\n` +
    `\n` +
    `Cada clave acepta:\n` +
    `- "primary" → color primario de la marca (negro #0d0d0d)\n` +
    `- "secondary" → color secundario (blanco #ffffff)\n` +
    `- "tertiary" → color de acento (oro #b6ac69)\n` +
    `- Un valor hexadecimal arbitrario (ej. "#1a1a1a")\n` +
    `- Cadena vacía → usa el fondo por defecto del componente\n`

  fs.writeFileSync(FILE_PATH, fm, "utf8")
  return merged
}
