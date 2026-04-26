import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type DocAudience = "dev" | "user"
export type DocCategory = "general" | "dev" | "user" | "ops"

export type DocMeta = {
  slug: string
  title: string
  description: string
  category: DocCategory
  tags: string[]
  audience: DocAudience[]
  order: number
}

export type Doc = DocMeta & {
  content: string
}

const DOCS_DIR = path.join(process.cwd(), "docs")

const VALID_CATEGORIES: ReadonlySet<DocCategory> = new Set([
  "general",
  "dev",
  "user",
  "ops",
])

const VALID_AUDIENCES: ReadonlySet<DocAudience> = new Set(["dev", "user"])

function listDocFiles(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return []
  return fs
    .readdirSync(DOCS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(DOCS_DIR, file))
}

function parseCategory(value: unknown): DocCategory {
  const raw = String(value || "general").toLowerCase()
  return VALID_CATEGORIES.has(raw as DocCategory)
    ? (raw as DocCategory)
    : "general"
}

function parseAudience(value: unknown): DocAudience[] {
  if (!Array.isArray(value)) return ["dev", "user"]
  const filtered = value
    .map((item) => String(item).toLowerCase())
    .filter((item): item is DocAudience =>
      VALID_AUDIENCES.has(item as DocAudience),
    )
  return filtered.length > 0 ? filtered : ["dev", "user"]
}

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => String(item).trim()).filter(Boolean)
}

function buildMeta(filePath: string): DocMeta | null {
  const slug = path.basename(filePath, ".md")
  const raw = fs.readFileSync(filePath, "utf8")
  const { data } = matter(raw)
  const fm = data as Record<string, unknown>

  const title = String(fm.title || slug).trim()
  if (!title) return null

  return {
    slug,
    title,
    description: String(fm.description || "").trim(),
    category: parseCategory(fm.category),
    tags: parseTags(fm.tags),
    audience: parseAudience(fm.audience),
    order: Number.isFinite(Number(fm.order)) ? Number(fm.order) : 999,
  }
}

export function getDocsList(): DocMeta[] {
  return listDocFiles()
    .map(buildMeta)
    .filter((meta): meta is DocMeta => meta !== null)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}

export function getDoc(slug: string): Doc | null {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null

  const filePath = path.join(DOCS_DIR, `${slug}.md`)
  const resolved = path.resolve(filePath)
  if (!resolved.startsWith(path.resolve(DOCS_DIR) + path.sep)) return null
  if (!fs.existsSync(resolved)) return null

  const meta = buildMeta(resolved)
  if (!meta) return null

  const raw = fs.readFileSync(resolved, "utf8")
  const { content } = matter(raw)

  return { ...meta, content: content.trim() }
}
