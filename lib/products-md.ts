import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type ProductKind = "guide" | "session"

export type ProductBase = {
  id: string
  position: number
  featuredSpot?: 1 | 2 | 3
  mostPopular?: boolean
}

export type GuideProduct = ProductBase & {
  kind: "guide"
  title: string
  miniDescription: string
  price: number
  features: string[]
  fileUrl: string
  coverImageUrl?: string
  synopsis: string
}

export type SessionSubtype = "individual" | "program4"

export type SessionProduct = ProductBase & {
  kind: "session"
  subtype: SessionSubtype
  title: string
  description: string
  price: number
  features: string[]
  imageUrl?: string
  notes?: string
  addon?: string
}

export type ProductItem = GuideProduct | SessionProduct

const CONTENT_DIR = path.join(process.cwd(), "content")
const PRODUCTS_DIR = path.join(CONTENT_DIR, "products")
const GUIDES_DIR = path.join(PRODUCTS_DIR, "guides")
const SESSIONS_DIR = path.join(PRODUCTS_DIR, "sessions")

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function readMarkdownFile(filePath: string) {
  const file = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(file)
  return { data, content: content.trim() }
}

function listMarkdownFiles(dir: string) {
  if (!fs.existsSync(dir)) return []
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort((a, b) => {
      const an = parseInt(a.split("-")[0], 10)
      const bn = parseInt(b.split("-")[0], 10)
      if (!isNaN(an) && !isNaN(bn)) return an - bn
      return a.localeCompare(b)
    })
  return files.map((f) => path.join(dir, f))
}

function normalizePositions<T extends ProductBase>(items: T[]): T[] {
  const sorted = [...items].sort((a, b) => {
    const pa = Number(a.position || 0)
    const pb = Number(b.position || 0)
    if (pa !== pb) return pa - pb
    return String(a.id).localeCompare(String(b.id))
  })
  return sorted.map((it, idx) => ({ ...it, position: idx + 1 }))
}

export function getGuides(): GuideProduct[] {
  const files = listMarkdownFiles(GUIDES_DIR)
  const items: GuideProduct[] = files.map((filePath, idx) => {
    const { data, content } = readMarkdownFile(filePath)
    const base = path.basename(filePath, ".md")
    const numPrefix = parseInt(base.split("-")[0], 10)
    const posFm = Number((data as any).position)
    const position = Number.isFinite(posFm) ? posFm : (!isNaN(numPrefix) ? numPrefix : idx + 1)
    const item: GuideProduct = {
      id: base,
      kind: "guide",
      position,
      title: String((data as any).title || ""),
      miniDescription: String((data as any).miniDescription || ""),
      price: Number((data as any).price || 0),
      features: Array.isArray((data as any).features) ? (data as any).features.map(String) : [],
      fileUrl: String((data as any).fileUrl || "/fake.pdf"),
      coverImageUrl: (data as any).coverImageUrl ? String((data as any).coverImageUrl) : undefined,
      synopsis: content,
      featuredSpot: (data as any).featuredSpot ? Number((data as any).featuredSpot) as 1|2|3 : undefined,
      mostPopular: Boolean((data as any).mostPopular || false),
    }
    return item
  }).sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
  return items
}

export function getSessions(): SessionProduct[] {
  const files = listMarkdownFiles(SESSIONS_DIR)
  const items: SessionProduct[] = files.map((filePath, idx) => {
    const { data, content } = readMarkdownFile(filePath)
    const base = path.basename(filePath, ".md")
    const numPrefix = parseInt(base.split("-")[0], 10)
    const posFm = Number((data as any).position)
    const position = Number.isFinite(posFm) ? posFm : (!isNaN(numPrefix) ? numPrefix : idx + 1)
    const item: SessionProduct = {
      id: base,
      kind: "session",
      subtype: ((data as any).subtype === "program4" ? "program4" : "individual"),
      position,
      title: String((data as any).title || ""),
      description: content || String((data as any).description || ""),
      price: Number((data as any).price || 0),
      features: Array.isArray((data as any).features) ? (data as any).features.map(String) : [],
      imageUrl: (data as any).imageUrl ? String((data as any).imageUrl) : undefined,
      notes: (data as any).notes ? String((data as any).notes) : undefined,
      addon: (data as any).addon ? String((data as any).addon) : undefined,
      featuredSpot: (data as any).featuredSpot ? Number((data as any).featuredSpot) as 1|2|3 : undefined,
      mostPopular: Boolean((data as any).mostPopular || false),
    }
    return item
  }).sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
  return items
}

export function getProducts() {
  return {
    guides: getGuides(),
    sessions: getSessions(),
  }
}

function writeGuideFile(t: GuideProduct) {
  ensureDir(GUIDES_DIR)
  const escapeYaml = (s: string) => s.replace(/"/g, '\\"')
  const front = [
    `title: "${escapeYaml(t.title)}"`,
    `miniDescription: "${escapeYaml(t.miniDescription)}"`,
    `price: ${Number(t.price || 0)}`,
    `features:`,
    ...(t.features || []).map((f) => `  - "${escapeYaml(String(f))}"`),
    `fileUrl: "${escapeYaml(t.fileUrl || "/fake.pdf")}"`,
    ...(t.coverImageUrl ? [`coverImageUrl: "${escapeYaml(t.coverImageUrl)}"`] : []),
    `position: ${Number(t.position || 0)}`,
    ...(t.featuredSpot ? [`featuredSpot: ${Number(t.featuredSpot)}`] : []),
    ...(t.mostPopular ? [`mostPopular: true`] : []),
  ].join("\n")
  const fm = `---\n${front}\n---\n`
  const body = `${String(t.synopsis || "").trim()}\n`
  const filePath = path.join(GUIDES_DIR, `${t.id}.md`)
  fs.writeFileSync(filePath, fm + body, "utf8")
}

function writeSessionFile(t: SessionProduct) {
  ensureDir(SESSIONS_DIR)
  const escapeYaml = (s: string) => s.replace(/"/g, '\\"')
  const front = [
    `subtype: "${t.subtype}"`,
    `title: "${escapeYaml(t.title)}"`,
    `price: ${Number(t.price || 0)}`,
    `features:`,
    ...(t.features || []).map((f) => `  - "${escapeYaml(String(f))}"`),
    ...(t.imageUrl ? [`imageUrl: "${escapeYaml(t.imageUrl)}"`] : []),
    ...(t.notes ? [`notes: "${escapeYaml(t.notes)}"`] : []),
    ...(t.addon ? [`addon: "${escapeYaml(t.addon)}"`] : []),
    `position: ${Number(t.position || 0)}`,
    ...(t.featuredSpot ? [`featuredSpot: ${Number(t.featuredSpot)}`] : []),
    ...(t.mostPopular ? [`mostPopular: true`] : []),
  ].join("\n")
  const fm = `---\n${front}\n---\n`
  const body = `${String(t.description || "").trim()}\n`
  const filePath = path.join(SESSIONS_DIR, `${t.id}.md`)
  fs.writeFileSync(filePath, fm + body, "utf8")
}

function escapeSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export function addProductItem(input: any): ProductItem {
  const kind: ProductKind = input?.kind === "session" ? "session" : "guide"
  const desired = Math.max(1, Number(input?.position || 1))

  if (kind === "guide") {
    const existing = getGuides()
    let id = String(input?.id || "").trim()
    if (!id) id = escapeSlug(String(input?.title || "nueva-guia")) || `guide-${existing.length + 1}`
    if (existing.some((e) => e.id === id)) throw new Error(`Ya existe una guía con id '${id}'`)

    const newItem: GuideProduct = {
      id,
      kind: "guide",
      position: Math.min(desired, existing.length + 1),
      title: String(input?.title || "").trim(),
      miniDescription: String(input?.miniDescription || "").trim(),
      price: Number(input?.price || 0),
      features: Array.isArray(input?.features) ? input.features.map(String) : [],
      fileUrl: String(input?.fileUrl || "/fake.pdf").trim(),
      coverImageUrl: input?.coverImageUrl ? String(input.coverImageUrl).trim() : undefined,
      synopsis: String(input?.synopsis || "").trim(),
      featuredSpot: input?.featuredSpot ? Number(input.featuredSpot) as 1|2|3 : undefined,
      mostPopular: Boolean(input?.mostPopular || false),
    }

    if (!newItem.title) throw new Error("El título no puede estar vacío")
    // Insertar y normalizar posiciones
    const inserted = [
      ...existing.map((it) => ({ ...it, position: it.position >= newItem.position ? it.position + 1 : it.position })),
      newItem,
    ]
    const normalized = normalizePositions(inserted)
    // Escribir todos
    normalized.forEach((it) => writeGuideFile(it))
    return normalized.find((it) => it.id === id) as GuideProduct
  } else {
    const existing = getSessions()
    let id = String(input?.id || "").trim()
    if (!id) id = escapeSlug(String(input?.title || "nueva-sesion")) || `session-${existing.length + 1}`
    if (existing.some((e) => e.id === id)) throw new Error(`Ya existe una sesión con id '${id}'`)

    const subtype: SessionSubtype = input?.subtype === "program4" ? "program4" : "individual"

    const newItem: SessionProduct = {
      id,
      kind: "session",
      subtype,
      position: Math.min(desired, existing.length + 1),
      title: String(input?.title || "").trim(),
      description: String(input?.description || "").trim(),
      price: Number(input?.price || 0),
      features: Array.isArray(input?.features) ? input.features.map(String) : [],
      imageUrl: input?.imageUrl ? String(input.imageUrl).trim() : undefined,
      notes: input?.notes ? String(input.notes).trim() : undefined,
      addon: input?.addon ? String(input.addon).trim() : undefined,
      featuredSpot: input?.featuredSpot ? Number(input.featuredSpot) as 1|2|3 : undefined,
      mostPopular: Boolean(input?.mostPopular || false),
    }

    if (!newItem.title) throw new Error("El título no puede estar vacío")
    // Insertar y normalizar posiciones
    const inserted = [
      ...existing.map((it) => ({ ...it, position: it.position >= newItem.position ? it.position + 1 : it.position })),
      newItem,
    ]
    const normalized = normalizePositions(inserted)
    normalized.forEach((it) => writeSessionFile(it))
    return normalized.find((it) => it.id === id) as SessionProduct
  }
}

function findKindById(id: string): ProductKind | null {
  const g = getGuides()
  if (g.some((it) => it.id === id)) return "guide"
  const s = getSessions()
  if (s.some((it) => it.id === id)) return "session"
  return null
}

export function setProductItem(updated: any): ProductItem {
  const id = String(updated?.id || "").trim()
  const kind: ProductKind = updated?.kind || findKindById(id) || "guide"

  if (kind === "guide") {
    const existing = getGuides()
    if (!existing.some((it) => it.id === id)) throw new Error(`No se encontró la guía '${id}'`)
    const desired = Math.max(1, Math.min(Number(updated?.position || 1), existing.length))
    const rest = existing.filter((e) => e.id !== id).sort((a,b) => a.position - b.position || a.id.localeCompare(b.id))
    const inserted: GuideProduct[] = [...rest]
    const newItem: GuideProduct = {
      id,
      kind: "guide",
      position: desired,
      title: String(updated?.title || "").trim(),
      miniDescription: String(updated?.miniDescription || "").trim(),
      price: Number(updated?.price || 0),
      features: Array.isArray(updated?.features) ? updated.features.map(String) : [],
      fileUrl: String(updated?.fileUrl || "/fake.pdf").trim(),
      coverImageUrl: updated?.coverImageUrl ? String(updated.coverImageUrl).trim() : undefined,
      synopsis: String(updated?.synopsis || "").trim(),
      featuredSpot: updated?.featuredSpot ? Number(updated.featuredSpot) as 1|2|3 : undefined,
      mostPopular: Boolean(updated?.mostPopular || false),
    }
    inserted.splice(desired - 1, 0, newItem)
    const normalized = normalizePositions(inserted)
    normalized.forEach((it) => writeGuideFile(it))
    return normalized.find((it) => it.id === id) as GuideProduct
  } else {
    const existing = getSessions()
    if (!existing.some((it) => it.id === id)) throw new Error(`No se encontró la sesión '${id}'`)
    const desired = Math.max(1, Math.min(Number(updated?.position || 1), existing.length))
    const rest = existing.filter((e) => e.id !== id).sort((a,b) => a.position - b.position || a.id.localeCompare(b.id))
    const inserted: SessionProduct[] = [...rest]
    const newItem: SessionProduct = {
      id,
      kind: "session",
      subtype: (updated?.subtype === "program4" ? "program4" : "individual"),
      position: desired,
      title: String(updated?.title || "").trim(),
      description: String(updated?.description || "").trim(),
      price: Number(updated?.price || 0),
      features: Array.isArray(updated?.features) ? updated.features.map(String) : [],
      imageUrl: updated?.imageUrl ? String(updated.imageUrl).trim() : undefined,
      notes: updated?.notes ? String(updated.notes).trim() : undefined,
      addon: updated?.addon ? String(updated.addon).trim() : undefined,
      featuredSpot: updated?.featuredSpot ? Number(updated.featuredSpot) as 1|2|3 : undefined,
      mostPopular: Boolean(updated?.mostPopular || false),
    }
    inserted.splice(desired - 1, 0, newItem)
    const normalized = normalizePositions(inserted)
    normalized.forEach((it) => writeSessionFile(it))
    return normalized.find((it) => it.id === id) as SessionProduct
  }
}

export function deleteProductItem(id: string, kind?: ProductKind) {
  const resolvedKind = kind || findKindById(id)
  if (!resolvedKind) throw new Error(`No se encontró el producto '${id}'`)

  if (resolvedKind === "guide") {
    const existing = getGuides()
    const nextItems = existing.filter((e) => e.id !== id)
    if (nextItems.length === existing.length) throw new Error(`No se encontró la guía '${id}'`)
    const normalized = normalizePositions(nextItems)
    const filePath = path.join(GUIDES_DIR, `${id}.md`)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    normalized.forEach((it) => writeGuideFile(it))
  } else {
    const existing = getSessions()
    const nextItems = existing.filter((e) => e.id !== id)
    if (nextItems.length === existing.length) throw new Error(`No se encontró la sesión '${id}'`)
    const normalized = normalizePositions(nextItems)
    const filePath = path.join(SESSIONS_DIR, `${id}.md`)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    normalized.forEach((it) => writeSessionFile(it))
  }
}
