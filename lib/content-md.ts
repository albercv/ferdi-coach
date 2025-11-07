import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type Testimonial = {
  name: string
  age: number
  rating: number
  text: string
  video?: string
  image?: string
}

export type FAQItem = {
  id: string
  position: number
  question: string
  answer: string
}

export type AboutContent = {
  title: string
  description: string
  credentials: string[]
}

const CONTENT_DIR = path.join(process.cwd(), "content")

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
    // Ordena por prefijo numérico si existe (e.g. 001-, 002-)
    .sort((a, b) => {
      const an = parseInt(a.split("-")[0], 10)
      const bn = parseInt(b.split("-")[0], 10)
      if (!isNaN(an) && !isNaN(bn)) return an - bn
      return a.localeCompare(b)
    })
  return files.map((f) => path.join(dir, f))
}

export function getTestimonials(): Testimonial[] {
  const dir = path.join(CONTENT_DIR, "testimonials")
  const files = listMarkdownFiles(dir)
  const testimonials: Testimonial[] = files.map((filePath) => {
    const { data, content } = readMarkdownFile(filePath)
    return {
      name: String(data.name || ""),
      age: Number(data.age || 0),
      rating: Number(data.rating || 0),
      text: content,
      video: data.video ? String(data.video) : undefined,
      image: data.image ? String(data.image) : undefined,
    }
  })
  return testimonials
}

export function getFAQ(): { title: string; subtitle?: string; items: FAQItem[] } {
  // Primero intentamos leer un único archivo faq.md
  const singleFilePath = path.join(CONTENT_DIR, "faq.md")
  if (fs.existsSync(singleFilePath)) {
    const { data } = readMarkdownFile(singleFilePath)
    const title = String(data.title || "Preguntas frecuentes sobre coaching para superar rupturas")
    const subtitle = data.subtitle ? String(data.subtitle) : "Resuelve tus dudas sobre el proceso de sanación emocional tras una ruptura"
    const itemsRaw = Array.isArray(data.items) ? data.items : []
    const items: FAQItem[] = itemsRaw
      .map((it: any, idx: number) => ({
        id: String(it?.id ?? String(idx + 1).padStart(3, "0")),
        position: Number(it?.position ?? idx + 1),
        question: String(it?.question || ""),
        answer: String(it?.answer || ""),
      }))
      .filter((it) => it.question && it.answer)

    return { title, subtitle, items }
  }

  // Si no existe, leemos la carpeta content/faq como antes
  const dir = path.join(CONTENT_DIR, "faq")
  const files = listMarkdownFiles(dir)
  const items: FAQItem[] = files.map((filePath, idx) => {
    const { data, content } = readMarkdownFile(filePath)
    const base = path.basename(filePath, ".md")
    const numPrefix = parseInt(base.split("-")[0], 10)
    return {
      id: base,
      position: !isNaN(numPrefix) ? numPrefix : idx + 1,
      question: String(data.question || ""),
      answer: content,
    }
  })
  return {
    title: "Preguntas frecuentes sobre coaching para superar rupturas",
    subtitle: "Resuelve tus dudas sobre el proceso de sanación emocional tras una ruptura",
    items,
  }
}

export function getAbout(): AboutContent {
  const filePath = path.join(CONTENT_DIR, "about.md")
  const { data, content } = readMarkdownFile(filePath)
  return {
    title: String(data.title || "Sobre mí"),
    description: content,
    credentials: Array.isArray(data.credentials) ? data.credentials.map(String) : [],
  }
}

// Añadir función de escritura para 'Sobre mí'
export function setAbout(about: AboutContent) {
  const filePath = path.join(CONTENT_DIR, "about.md")

  // Aseguramos que el directorio exista
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true })
  }

  const escapeYaml = (s: string) => s.replace(/"/g, '\\"')
  const credentialsYaml = (about.credentials || [])
    .map((c) => `  - "${escapeYaml(String(c))}"`)
    .join("\n")

  const frontmatter = `---\n` +
    `title: "${escapeYaml(about.title)}"\n` +
    `credentials:\n` +
    (credentialsYaml ? `${credentialsYaml}\n` : "") +
    `---\n`

  const body = `${(about.description || "").trim()}\n`

  fs.writeFileSync(filePath, frontmatter + body, "utf8")
}

// Helper: normaliza posiciones asegurando unicidad y orden estable por position luego id
function normalizePositions(items: FAQItem[]): FAQItem[] {
  const sorted = [...items].sort((a, b) => {
    const pa = Number(a.position || 0)
    const pb = Number(b.position || 0)
    if (pa !== pb) return pa - pb
    return String(a.id).localeCompare(String(b.id))
  })
  return sorted.map((it, idx) => ({ ...it, position: idx + 1 }))
}

// Función para actualizar una FAQ por id en content/faq.md
export function setFAQItem(updated: FAQItem) {
  const filePath = path.join(CONTENT_DIR, "faq.md")

  if (!fs.existsSync(filePath)) {
    throw new Error("faq.md no existe. Crea el archivo antes de editar FAQs.")
  }

  const escapeYaml = (s: string) => s.replace(/"/g, '\\"')
  const file = fs.readFileSync(filePath, "utf8")
  const parsed = matter(file)

  const itemsRaw = Array.isArray(parsed.data.items) ? parsed.data.items : []

  // Mapeamos a items tipados y quitamos el que se actualiza
  const existing: FAQItem[] = itemsRaw.map((it: any, idx: number) => ({
    id: String(it?.id ?? String(idx + 1).padStart(3, "0")),
    position: Number(it?.position ?? idx + 1),
    question: String(it?.question || ""),
    answer: String(it?.answer || ""),
  }))

  const rest = existing.filter((it) => it.id !== updated.id)
  const desired = Math.max(1, Math.min(Number(updated.position || 1), rest.length + 1))

  // Ordenamos por posición y luego id para mantener estabilidad
  rest.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))

  // Insertamos actualizado en la posición deseada
  const inserted = [
    ...rest.slice(0, desired - 1),
    { id: updated.id, position: desired, question: updated.question, answer: updated.answer },
    ...rest.slice(desired - 1),
  ]

  const nextItems = normalizePositions(inserted)

  // Reconstruimos frontmatter
  const itemsYaml = nextItems
    .map((it) => {
      const q = escapeYaml(it.question)
      const a = escapeYaml(it.answer)
      return `  - id: "${it.id}"\n    position: ${it.position}\n    question: "${q}"\n    answer: >-\n      ${a}`
    })
    .join("\n")

  const frontmatter = `---\n` +
    `title: "${escapeYaml(String(parsed.data.title || "Preguntas frecuentes sobre coaching para superar rupturas"))}"\n` +
    `subtitle: "${escapeYaml(String(parsed.data.subtitle || "Resuelve tus dudas sobre el proceso de sanación emocional tras una ruptura"))}"\n` +
    `items:\n${itemsYaml}\n` +
    `---\n`

  const newContent = frontmatter
  fs.writeFileSync(filePath, newContent, "utf8")
}

// Crear una nueva FAQ y guardarla en content/faq.md (genera id si no se pasa)
export function addFAQItem(input: { id?: string; position?: number; question: string; answer: string }): FAQItem {
  const filePath = path.join(CONTENT_DIR, "faq.md")
  const escapeYaml = (s: string) => s.replace(/"/g, '\\"')

  // Si no existe faq.md, creamos una base mínima
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true })
  }
  if (!fs.existsSync(filePath)) {
    const baseFrontmatter = `---\n` +
      `title: "Preguntas frecuentes sobre coaching para superar rupturas"\n` +
      `subtitle: "Resuelve tus dudas sobre el proceso de sanación emocional tras una ruptura"\n` +
      `items:\n` +
      `---\n`
    fs.writeFileSync(filePath, baseFrontmatter, "utf8")
  }

  const file = fs.readFileSync(filePath, "utf8")
  const parsed = matter(file)
  const itemsRaw: any[] = Array.isArray(parsed.data.items) ? parsed.data.items : []

  const existingIds = itemsRaw.map((it: any, idx: number) => String(it?.id ?? String(idx + 1).padStart(3, "0")))
  let id = (input.id || "").trim()
  if (!id) {
    // Generamos id numérico de 3 dígitos (siguiente disponible)
    const numericIds = existingIds
      .map((s) => (/^\d+$/.test(s) ? parseInt(s, 10) : NaN))
      .filter((n) => Number.isFinite(n)) as number[]
    const next = (numericIds.length ? Math.max(...numericIds) : itemsRaw.length) + 1
    id = String(next).padStart(3, "0")
  } else {
    // Validamos duplicados
    if (existingIds.includes(id)) {
      throw new Error(`Ya existe una FAQ con id '${id}'`)
    }
  }

  // Construimos estado actual
  const existing: FAQItem[] = itemsRaw.map((it: any, idx: number) => ({
    id: String(it?.id ?? String(idx + 1).padStart(3, "0")),
    position: Number(it?.position ?? idx + 1),
    question: String(it?.question || ""),
    answer: String(it?.answer || ""),
  }))

  const desired = Math.max(1, Math.min(Number(input.position || 0) || existing.length + 1, existing.length + 1))
  // Ordenamos y hacemos hueco incrementando posiciones >= desired
  const rest = existing.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id)).map((it) => ({
    ...it,
    position: it.position >= desired ? it.position + 1 : it.position,
  }))

  const newItem: FAQItem = {
    id,
    position: desired,
    question: String(input.question || "").trim(),
    answer: String(input.answer || "").trim(),
  }

  if (!newItem.question) throw new Error("La pregunta no puede estar vacía")
  if (!newItem.answer) throw new Error("La respuesta no puede estar vacía")

  const inserted = [...rest, newItem]
  const nextItems = normalizePositions(inserted)

  // Reconstruimos frontmatter
  const itemsYaml = nextItems
    .map((it, idx) => {
      const q = escapeYaml(String(it.question || ""))
      const a = escapeYaml(String(it.answer || ""))
      const pid = String(it.id || String(idx + 1).padStart(3, "0"))
      const ppos = Number(it.position ?? idx + 1)
      return `  - id: "${pid}"\n    position: ${ppos}\n    question: "${q}"\n    answer: >-\n      ${a}`
    })
    .join("\n")

  const frontmatter = `---\n` +
    `title: "${escapeYaml(String(parsed.data.title || "Preguntas frecuentes sobre coaching para superar rupturas"))}"\n` +
    `subtitle: "${escapeYaml(String(parsed.data.subtitle || "Resuelve tus dudas sobre el proceso de sanación emocional tras una ruptura"))}"\n` +
    `items:\n${itemsYaml}\n` +
    `---\n`

  fs.writeFileSync(filePath, frontmatter, "utf8")
  return newItem
}

// Eliminar una FAQ por id en content/faq.md
export function deleteFAQItem(id: string) {
  const filePath = path.join(CONTENT_DIR, "faq.md")
  if (!fs.existsSync(filePath)) {
    throw new Error("faq.md no existe. Crea el archivo antes de editar FAQs.")
  }
  const escapeYaml = (s: string) => s.replace(/"/g, '\\"')
  const file = fs.readFileSync(filePath, "utf8")
  const parsed = matter(file)
  const itemsRaw: any[] = Array.isArray(parsed.data.items) ? parsed.data.items : []

  const existing: FAQItem[] = itemsRaw.map((it: any, idx: number) => ({
    id: String(it?.id ?? String(idx + 1).padStart(3, "0")),
    position: Number(it?.position ?? idx + 1),
    question: String(it?.question || ""),
    answer: String(it?.answer || ""),
  }))

  const nextItems = existing.filter((it) => it.id !== id)
  if (nextItems.length === existing.length) {
    throw new Error(`No se encontró la FAQ con id '${id}'`)
  }

  const normalized = normalizePositions(nextItems)

  const itemsYaml = normalized
    .map((it, idx) => {
      const q = escapeYaml(String(it.question || ""))
      const a = escapeYaml(String(it.answer || ""))
      const pid = String(it.id || String(idx + 1).padStart(3, "0"))
      const ppos = Number(it.position ?? idx + 1)
      return `  - id: "${pid}"\n    position: ${ppos}\n    question: "${q}"\n    answer: >-\n      ${a}`
    })
    .join("\n")

  const frontmatter = `---\n` +
    `title: "${escapeYaml(String(parsed.data.title || "Preguntas frecuentes sobre coaching para superar rupturas"))}"\n` +
    `subtitle: "${escapeYaml(String(parsed.data.subtitle || "Resuelve tus dudas sobre el proceso de sanación emocional tras una ruptura"))}"\n` +
    `items:\n${itemsYaml}\n` +
    `---\n`

  fs.writeFileSync(filePath, frontmatter, "utf8")
}