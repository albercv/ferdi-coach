import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type Testimonial = {
  id: string
  position: number
  name: string
  age: number
  rating: number
  text: string
  mediaUrl?: string
  videoUrl?: string
  imageUrl?: string
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
  videoUrl?: string
  posterImageUrl?: string
}

export type HeroBullet = {
  id: string
  position: number
  icon: string
  text: string
}

export type HeroContent = {
  title: string
  subtitle: string
  ctaPrimary: string
  ctaSecondary?: string
  bullets: HeroBullet[]
  backgroundImageUrl?: string
}

export type CTAContent = {
  title: string
  description: string
  buttonText: string
}

export type BreakerContent = {
  text: string
  kicker?: string
}

export type ForWhoCard = {
  id: string
  position: number
  icon: string
  title: string
  description: string
}

export type ForWhoContent = {
  title: string
  subtitle: string
  ctaText: string
  ctaHref: string
  cards: ForWhoCard[]
}

function resolveContentDir(): string {
  const fromEnv = process.env.CONTENT_DIR?.trim()
  if (fromEnv) {
    return path.isAbsolute(fromEnv) ? fromEnv : path.join(process.cwd(), fromEnv)
  }

  const localOverride = path.join(process.cwd(), "content.local")
  if (fs.existsSync(localOverride)) return localOverride

  return path.join(process.cwd(), "content")
}

const CONTENT_DIR = resolveContentDir()

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
  const testimonials: Testimonial[] = files.map((filePath, idx) => {
    const { data, content } = readMarkdownFile(filePath)
    const base = path.basename(filePath, ".md")
    const numPrefix = parseInt(base.split("-")[0], 10)
    const posFm = Number((data as any).position)
    const position = Number.isFinite(posFm) ? posFm : (!isNaN(numPrefix) ? numPrefix : idx + 1)

    const mediaUrlRaw = (data as any).mediaUrl ? String((data as any).mediaUrl) : undefined

    const videoLegacy = (data as any).video ? String((data as any).video) : undefined
    const imageLegacy = (data as any).image ? String((data as any).image) : undefined

    const videoUrlRaw = (data as any).videoUrl ? String((data as any).videoUrl) : undefined
    const imageUrlRaw = (data as any).imageUrl ? String((data as any).imageUrl) : undefined

    const videoUrl = videoUrlRaw ?? (videoLegacy ? `/${videoLegacy}.mp4` : undefined)
    const imageUrl = imageUrlRaw ?? (imageLegacy ? `/${imageLegacy}.png` : undefined)

    const mediaUrl =
      mediaUrlRaw ??
      videoUrlRaw ??
      imageUrlRaw ??
      (videoLegacy ? `/${videoLegacy}.mp4` : undefined) ??
      (imageLegacy ? `/${imageLegacy}.png` : undefined)

    return {
      id: base,
      position,
      name: String((data as any).name || ""),
      age: Number((data as any).age || 0),
      rating: Number((data as any).rating || 0),
      text: content,
      mediaUrl,
      videoUrl,
      imageUrl,
      video: videoLegacy,
      image: imageLegacy,
    }
  }).sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
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
    videoUrl: (data as any).videoUrl ? String((data as any).videoUrl) : undefined,
    posterImageUrl: (data as any).posterImageUrl ? String((data as any).posterImageUrl) : undefined,
  }
}

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
    (about.videoUrl ? `videoUrl: "${escapeYaml(about.videoUrl)}"\n` : "") +
    (about.posterImageUrl ? `posterImageUrl: "${escapeYaml(about.posterImageUrl)}"\n` : "") +
    `credentials:\n` +
    (credentialsYaml ? `${credentialsYaml}\n` : "") +
    `---\n`

  const body = `${(about.description || "").trim()}\n`

  fs.writeFileSync(filePath, frontmatter + body, "utf8")
}

function normalizePositions<T extends { position: number }>(items: T[]): T[] {
  return items
    .sort((a, b) => a.position - b.position)
    .map((it, idx) => ({ ...it, position: idx + 1 }))
}

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
      return `  - id: "${it.id}"\n    position: ${it.position}\n    question: "${q}"\n    answer: "${a}"`
    })
    .join("\n")

  const frontmatter = `---\n` +
    `title: "${escapeYaml(String(parsed.data.title || "Preguntas frecuentes sobre coaching para superar rupturas"))}"\n` +
    `subtitle: "${escapeYaml(String(parsed.data.subtitle || "Resuelve tus dudas sobre el proceso de sanación emocional tras una ruptura"))}"\n` +
    `items:\n${itemsYaml}\n` +
    `---\n`

  fs.writeFileSync(filePath, frontmatter, "utf8")
}

export function addFAQItem(newItem: { id?: string; position?: number; question: string; answer: string }) {
  const filePath = path.join(CONTENT_DIR, "faq.md")
  if (!fs.existsSync(filePath)) {
    throw new Error("faq.md no existe. Crea el archivo antes de añadir FAQs.")
  }
  const file = fs.readFileSync(filePath, "utf8")
  const parsed = matter(file)
  const itemsRaw = Array.isArray(parsed.data.items) ? parsed.data.items : []

  const existing: FAQItem[] = itemsRaw.map((it: any, idx: number) => ({
    id: String(it?.id ?? String(idx + 1).padStart(3, "0")),
    position: Number(it?.position ?? idx + 1),
    question: String(it?.question || ""),
    answer: String(it?.answer || ""),
  }))

  const id = newItem.id ? String(newItem.id) : String(Date.now())
  const desired = newItem.position && Number.isFinite(newItem.position)
    ? Math.max(1, Math.min(Number(newItem.position), existing.length + 1))
    : existing.length + 1

  const inserted = [
    ...existing.slice(0, desired - 1),
    { id, position: desired, question: newItem.question, answer: newItem.answer },
    ...existing.slice(desired - 1),
  ]

  const nextItems = normalizePositions(inserted)

  const escapeYaml = (s: string) => s.replace(/"/g, '\\"')
  const itemsYaml = nextItems
    .map((it) => {
      const q = escapeYaml(it.question)
      const a = escapeYaml(it.answer)
      return `  - id: "${it.id}"\n    position: ${it.position}\n    question: "${q}"\n    answer: "${a}"`
    })
    .join("\n")

  const frontmatter = `---\n` +
    `title: "${escapeYaml(String(parsed.data.title || "Preguntas frecuentes sobre coaching para superar rupturas"))}"\n` +
    `subtitle: "${escapeYaml(String(parsed.data.subtitle || "Resuelve tus dudas sobre el proceso de sanación emocional tras una ruptura"))}"\n` +
    `items:\n${itemsYaml}\n` +
    `---\n`

  fs.writeFileSync(filePath, frontmatter, "utf8")

  return nextItems.find((it) => it.id === id) as FAQItem
}

export function deleteFAQItem(id: string) {
  const filePath = path.join(CONTENT_DIR, "faq.md")
  if (!fs.existsSync(filePath)) {
    throw new Error("faq.md no existe. Crea el archivo antes de eliminar FAQs.")
  }
  const file = fs.readFileSync(filePath, "utf8")
  const parsed = matter(file)
  const itemsRaw = Array.isArray(parsed.data.items) ? parsed.data.items : []

  const existing: FAQItem[] = itemsRaw.map((it: any, idx: number) => ({
    id: String(it?.id ?? String(idx + 1).padStart(3, "0")),
    position: Number(it?.position ?? idx + 1),
    question: String(it?.question || ""),
    answer: String(it?.answer || ""),
  }))

  const filtered = existing.filter((it) => it.id !== id)
  const nextItems = normalizePositions(filtered)

  const escapeYaml = (s: string) => s.replace(/"/g, '\\"')
  const itemsYaml = nextItems
    .map((it) => {
      const q = escapeYaml(it.question)
      const a = escapeYaml(it.answer)
      return `  - id: "${it.id}"\n    position: ${it.position}\n    question: "${q}"\n    answer: "${a}"`
    })
    .join("\n")

  const frontmatter = `---\n` +
    `title: "${escapeYaml(String(parsed.data.title || "Preguntas frecuentes sobre coaching para superar rupturas"))}"\n` +
    `subtitle: "${escapeYaml(String(parsed.data.subtitle || "Resuelve tus dudas sobre el proceso de sanación emocional tras una ruptura"))}"\n` +
    `items:\n${itemsYaml}\n` +
    `---\n`

  fs.writeFileSync(filePath, frontmatter, "utf8")
}

const HERO_FILE = path.join(CONTENT_DIR, "hero.md")
const CTA_FILE = path.join(CONTENT_DIR, "cta.md")
const BREAKER_FILE = path.join(CONTENT_DIR, "breaker.md")
const FOR_WHO_FILE = path.join(CONTENT_DIR, "for-who.md")

function ensureContentDir() {
  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true })
}

function escapeYaml(s: string) {
  return s.replace(/"/g, '\\"')
}

export function getHero(): HeroContent {
  if (!fs.existsSync(HERO_FILE)) {
    const defaultHero: HeroContent = {
      title: "Transformación personal tras una ruptura: empieza a sanar desde dentro",
      subtitle: "Coach emocional especializado en procesos de duelo amoroso. Te acompaño para recuperar tu bienestar, autoestima y paz mental después de una separación.",
      ctaPrimary: "Reservar sesión gratuita",
      ctaSecondary: "Ver servicios",
      bullets: [
        { id: "1", position: 1, icon: "wrench", text: "Duelo amoroso y sanación emocional" },
        { id: "2", position: 2, icon: "handshake", text: "Dependencia emocional y límites sanos" },
        { id: "3", position: 3, icon: "sliders-horizontal", text: "Autoestima y confianza personal" },
      ],
    }
    return defaultHero
  }

  const { data } = readMarkdownFile(HERO_FILE)
  const bulletsRaw = Array.isArray((data as any).bullets) ? (data as any).bullets : []
  const bullets: HeroBullet[] = bulletsRaw
    .map((it: any, idx: number) => ({
      id: String(it?.id ?? String(idx + 1)),
      position: Number(it?.position ?? idx + 1),
      icon: String(it?.icon || "check-circle"),
      text: String(it?.text || ""),
    }))
    .filter((b: HeroBullet) => b.text)
    .sort((a: HeroBullet, b: HeroBullet) => a.position - b.position)

  return {
    title: String((data as any).title || ""),
    subtitle: String((data as any).subtitle || ""),
    ctaPrimary: String((data as any).ctaPrimary || "Reservar"),
    ctaSecondary: (data as any).ctaSecondary ? String((data as any).ctaSecondary) : undefined,
    bullets,
    backgroundImageUrl: (data as any).backgroundImageUrl ? String((data as any).backgroundImageUrl) : undefined,
  }
}

export function getCTA(): CTAContent {
  const defaults: CTAContent = {
    title: "No tienes que pasar por esto solo",
    description: "En 60 minutos puedes tener un plan para esta semana y volver a respirar con calma.",
    buttonText: "Reservar sesión",
  }

  if (!fs.existsSync(CTA_FILE)) {
    return defaults
  }

  const { data, content } = readMarkdownFile(CTA_FILE)
  return {
    title: String((data as any).title || defaults.title),
    description: content || String((data as any).description || defaults.description),
    buttonText: String((data as any).buttonText || defaults.buttonText),
  }
}

export function getBreaker(): BreakerContent {
  const defaults: BreakerContent = {
    text: "No estás roto: estás despertando.",
    kicker: "Un alto aquí",
  }

  if (!fs.existsSync(BREAKER_FILE)) {
    return defaults
  }

  const { data, content } = readMarkdownFile(BREAKER_FILE)
  const text = (content || String((data as any).text || "")).trim()
  const kicker = String((data as any).kicker || "").trim()
  return {
    text: text || defaults.text,
    kicker: kicker || defaults.kicker,
  }
}

export function getForWho(): ForWhoContent {
  const defaults: ForWhoContent = {
    title: "¿Acabas de terminar una relación?",
    subtitle: "Si te identificas con alguna de estas situaciones, puedo ayudarte a superar tu ruptura de pareja",
    ctaText: "Quiero salir de este bucle",
    ctaHref: "#reservar",
    cards: [
      {
        id: "1",
        position: 1,
        icon: "heart-crack",
        title: "Ruptura reciente",
        description:
          "Acabas de terminar una relación y sientes que no puedes seguir adelante. El dolor emocional es intenso y necesitas apoyo profesional para procesar el duelo amoroso.",
      },
      {
        id: "2",
        position: 2,
        icon: "clock",
        title: "Dependencia emocional",
        description:
          "Tienes dificultades para establecer límites sanos en tus relaciones. Sientes que necesitas constantemente la validación de tu ex pareja o de otros para sentirte bien contigo mismo.",
      },
      {
        id: "3",
        position: 3,
        icon: "users",
        title: "Patrones tóxicos",
        description:
          "Repites los mismos errores en tus relaciones amorosas. Quieres romper con patrones de dependencia emocional y construir relaciones más sanas en el futuro.",
      },
      {
        id: "4",
        position: 4,
        icon: "target",
        title: "Baja autoestima",
        description:
          "La ruptura ha afectado tu autoestima y confianza personal. Necesitas recuperar tu amor propio y aprender a valorarte independientemente de una relación de pareja.",
      },
    ],
  }

  if (!fs.existsSync(FOR_WHO_FILE)) {
    return defaults
  }

  const { data } = readMarkdownFile(FOR_WHO_FILE)
  const cardsRaw = Array.isArray((data as any).cards) ? (data as any).cards : []
  const cards: ForWhoCard[] = cardsRaw
    .map((it: any, idx: number) => ({
      id: String(it?.id ?? String(idx + 1)),
      position: Number(it?.position ?? idx + 1),
      icon: String(it?.icon || "heart-crack"),
      title: String(it?.title || "").trim(),
      description: String(it?.description || "").trim(),
    }))
    .filter((c: ForWhoCard) => !!c.title && !!c.description)
    .sort((a: ForWhoCard, b: ForWhoCard) => a.position - b.position)

  const title = String((data as any).title || "").trim()
  const subtitle = String((data as any).subtitle || "").trim()
  const ctaText = String((data as any).ctaText || "").trim()
  const ctaHref = String((data as any).ctaHref || "").trim()

  return {
    title: title || defaults.title,
    subtitle: subtitle || defaults.subtitle,
    ctaText: ctaText || defaults.ctaText,
    ctaHref: ctaHref || defaults.ctaHref,
    cards: cards.length ? cards : defaults.cards,
  }
}

export function setHero(hero: HeroContent) {
  ensureContentDir()
  const fmBullets = normalizePositions(hero.bullets || [])
    .map((it) => `  - id: "${escapeYaml(String(it.id))}"\n    position: ${it.position}\n    icon: "${escapeYaml(String(it.icon || "check-circle"))}"\n    text: "${escapeYaml(String(it.text || ""))}"`)
    .join("\n")
  const frontmatter = `---\n` +
    `title: "${escapeYaml(hero.title)}"\n` +
    `subtitle: "${escapeYaml(hero.subtitle)}"\n` +
    (hero.backgroundImageUrl ? `backgroundImageUrl: "${escapeYaml(hero.backgroundImageUrl)}"\n` : "") +
    `ctaPrimary: "${escapeYaml(hero.ctaPrimary)}"\n` +
    (hero.ctaSecondary ? `ctaSecondary: "${escapeYaml(hero.ctaSecondary)}"\n` : "") +
    (fmBullets ? `bullets:\n${fmBullets}\n` : "bullets: []\n") +
    `---\n`

  fs.writeFileSync(HERO_FILE, frontmatter, "utf8")
}

export function setCTA(cta: CTAContent) {
  ensureContentDir()
  const frontmatter = `---\n` +
    `title: "${escapeYaml(cta.title)}"\n` +
    `buttonText: "${escapeYaml(cta.buttonText)}"\n` +
    `---\n`

  const body = `${(cta.description || "").trim()}\n`
  fs.writeFileSync(CTA_FILE, frontmatter + body, "utf8")
}

export function setBreaker(breaker: BreakerContent) {
  ensureContentDir()
  const kicker = String(breaker.kicker || "").trim()
  const frontmatter = `---\n` +
    (kicker ? `kicker: "${escapeYaml(kicker)}"\n` : "") +
    `---\n`
  const body = `${String(breaker.text || "").trim()}\n`
  fs.writeFileSync(BREAKER_FILE, frontmatter + body, "utf8")
}

export function setForWho(forWho: ForWhoContent) {
  ensureContentDir()

  const cardsYaml = normalizePositions(forWho.cards || [])
    .map((it) => {
      return (
        `  - id: "${escapeYaml(String(it.id))}"\n` +
        `    position: ${it.position}\n` +
        `    icon: "${escapeYaml(String(it.icon || "heart-crack"))}"\n` +
        `    title: "${escapeYaml(String(it.title || ""))}"\n` +
        `    description: "${escapeYaml(String(it.description || ""))}"`
      )
    })
    .join("\n")

  const frontmatter =
    `---\n` +
    `title: "${escapeYaml(forWho.title)}"\n` +
    `subtitle: "${escapeYaml(forWho.subtitle)}"\n` +
    `ctaText: "${escapeYaml(forWho.ctaText)}"\n` +
    `ctaHref: "${escapeYaml(forWho.ctaHref)}"\n` +
    (cardsYaml ? `cards:\n${cardsYaml}\n` : "cards: []\n") +
    `---\n`

  fs.writeFileSync(FOR_WHO_FILE, frontmatter, "utf8")
}

export function addHeroBullet(newItem: { id?: string; position?: number; icon?: string; text: string }): HeroBullet {
  const current = getHero()
  const id = newItem.id ? String(newItem.id) : String(Date.now())
  const desired = newItem.position && Number.isFinite(newItem.position!)
    ? Math.max(1, Math.min(Number(newItem.position), current.bullets.length + 1))
    : current.bullets.length + 1
  const inserted = [
    ...current.bullets.slice(0, desired - 1),
    { id, position: desired, icon: String(newItem.icon || "check-circle"), text: newItem.text },
    ...current.bullets.slice(desired - 1),
  ]
  const next = { ...current, bullets: normalizePositions(inserted) }
  setHero(next)
  return next.bullets.find((b) => b.id === id) as HeroBullet
}

export function setHeroBulletItem(updated: HeroBullet) {
  const current = getHero()
  const rest = current.bullets.filter((b) => b.id !== updated.id)
  const desired = Math.max(1, Math.min(Number(updated.position || 1), rest.length + 1))
  rest.sort((a: HeroBullet, b: HeroBullet) => a.position - b.position || a.id.localeCompare(b.id))
  const inserted = [
    ...rest.slice(0, desired - 1),
    { id: updated.id, position: desired, icon: String(updated.icon || "check-circle"), text: String(updated.text || "") },
    ...rest.slice(desired - 1),
  ]
  const next = { ...current, bullets: normalizePositions(inserted) }
  setHero(next)
  return next.bullets.find((b) => b.id === updated.id) as HeroBullet
}

export function deleteHeroBulletItem(id: string) {
  const current = getHero()
  const filtered = current.bullets.filter((b) => b.id !== id)
  const next = { ...current, bullets: normalizePositions(filtered) }
  setHero(next)
}

// --- Testimonials helpers (existing) ---
function normalizeTestimonialPositions(items: Testimonial[]): Testimonial[] {
  return items
    .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
    .map((t, idx) => ({ ...t, position: idx + 1 }))
}

function writeTestimonialFile(dir: string, t: Testimonial) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const escapeYaml = (s: string) => s.replace(/"/g, '\\"')
  const fm = `---\n` +
    `name: "${escapeYaml(t.name)}"\n` +
    `age: ${t.age}\n` +
    `rating: ${t.rating}\n` +
    `position: ${t.position}\n` +
    (t.mediaUrl ? `mediaUrl: "${escapeYaml(t.mediaUrl)}"\n` : "") +
    (!t.mediaUrl && t.videoUrl ? `videoUrl: "${escapeYaml(t.videoUrl)}"\n` : "") +
    (!t.mediaUrl && t.imageUrl ? `imageUrl: "${escapeYaml(t.imageUrl)}"\n` : "") +
    (!t.mediaUrl && t.video ? `video: "${escapeYaml(t.video)}"\n` : "") +
    (!t.mediaUrl && t.image ? `image: "${escapeYaml(t.image)}"\n` : "") +
    `---\n` +
    `${t.text.trim()}\n`
  const filePath = path.join(dir, `${t.id}.md`)
  fs.writeFileSync(filePath, fm, "utf8")
}

export function addTestimonialItem(newItem: {
  id?: string
  position?: number
  name: string
  age: number
  rating: number
  text: string
  mediaUrl?: string
  videoUrl?: string
  imageUrl?: string
  video?: string
  image?: string
}) {
  const dir = path.join(CONTENT_DIR, "testimonials")
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const files = listMarkdownFiles(dir)
  const items: Testimonial[] = files.map((filePath, idx) => {
    const { data, content } = readMarkdownFile(filePath)
    const base = path.basename(filePath, ".md")
    const numPrefix = parseInt(base.split("-")[0], 10)
    const posFm = Number((data as any).position)
    const position = Number.isFinite(posFm) ? posFm : (!isNaN(numPrefix) ? numPrefix : idx + 1)
    const item: Testimonial = {
      id: base,
      position,
      name: String((data as any).name || ""),
      age: Number((data as any).age || 0),
      rating: Number((data as any).rating || 0),
      text: content,
      mediaUrl: (data as any).mediaUrl ? String((data as any).mediaUrl) : undefined,
      videoUrl: (data as any).videoUrl ? String((data as any).videoUrl) : undefined,
      imageUrl: (data as any).imageUrl ? String((data as any).imageUrl) : undefined,
      video: (data as any).video ? String((data as any).video) : undefined,
      image: (data as any).image ? String((data as any).image) : undefined,
    }
    return item
  })

  const normalizedMediaUrl = newItem.mediaUrl ? String(newItem.mediaUrl).trim() : undefined

  const id = newItem.id ? String(newItem.id) : String(Date.now())
  const desired = newItem.position && Number.isFinite(newItem.position)
    ? Math.max(1, Math.min(Number(newItem.position), items.length + 1))
    : items.length + 1

  const inserted = [
    ...items.slice(0, desired - 1),
    {
      id,
      position: desired,
      name: newItem.name,
      age: Math.max(0, Number(newItem.age || 0)),
      rating: Math.max(0, Math.min(5, Number(newItem.rating || 0))),
      text: newItem.text,
      mediaUrl: normalizedMediaUrl,
      videoUrl: normalizedMediaUrl ? undefined : newItem.videoUrl,
      imageUrl: normalizedMediaUrl ? undefined : newItem.imageUrl,
      video: normalizedMediaUrl ? undefined : newItem.video,
      image: normalizedMediaUrl ? undefined : newItem.image,
    },
    ...items.slice(desired - 1),
  ]

  const normalized = normalizeTestimonialPositions(inserted)
  for (const t of normalized) {
    writeTestimonialFile(dir, t)
  }

  return normalized.find((t) => t.id === id) as Testimonial
}

export function setTestimonialItem(updated: Testimonial) {
  const dir = path.join(CONTENT_DIR, "testimonials")
  const files = listMarkdownFiles(dir)
  const items: Testimonial[] = files.map((filePath, idx) => {
    const { data, content } = readMarkdownFile(filePath)
    const base = path.basename(filePath, ".md")
    const numPrefix = parseInt(base.split("-")[0], 10)
    const posFm = Number((data as any).position)
    const position = Number.isFinite(posFm) ? posFm : (!isNaN(numPrefix) ? numPrefix : idx + 1)
    const item: Testimonial = {
      id: base,
      position,
      name: String((data as any).name || ""),
      age: Number((data as any).age || 0),
      rating: Number((data as any).rating || 0),
      text: content,
      mediaUrl: (data as any).mediaUrl ? String((data as any).mediaUrl) : undefined,
      videoUrl: (data as any).videoUrl ? String((data as any).videoUrl) : undefined,
      imageUrl: (data as any).imageUrl ? String((data as any).imageUrl) : undefined,
      video: (data as any).video ? String((data as any).video) : undefined,
      image: (data as any).image ? String((data as any).image) : undefined,
    }
    return item
  })

  const normalizedMediaUrl = updated.mediaUrl ? String(updated.mediaUrl).trim() : undefined

  const rest = items.filter((t) => t.id !== updated.id)
  const desired = Math.max(1, Math.min(Number(updated.position || 1), rest.length + 1))
  rest.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))

  const inserted = [
    ...rest.slice(0, desired - 1),
    {
      id: updated.id,
      position: desired,
      name: String(updated.name || ""),
      age: Math.max(0, Number(updated.age || 0)),
      rating: Math.max(0, Math.min(5, Number(updated.rating || 0))),
      text: String(updated.text || "").trim(),
      mediaUrl: normalizedMediaUrl,
      videoUrl: normalizedMediaUrl ? undefined : (updated.videoUrl ? String(updated.videoUrl).trim() : undefined),
      imageUrl: normalizedMediaUrl ? undefined : (updated.imageUrl ? String(updated.imageUrl).trim() : undefined),
      video: normalizedMediaUrl ? undefined : (updated.video ? String(updated.video).trim() : undefined),
      image: normalizedMediaUrl ? undefined : (updated.image ? String(updated.image).trim() : undefined),
    },
    ...rest.slice(desired - 1),
  ]

  const normalized = normalizeTestimonialPositions(inserted)
  for (const t of normalized) {
    writeTestimonialFile(dir, t)
  }

  return normalized.find((t) => t.id === updated.id) as Testimonial
}

export function deleteTestimonialItem(id: string) {
  const dir = path.join(CONTENT_DIR, "testimonials")
  const files = listMarkdownFiles(dir)
  const items: Testimonial[] = files.map((filePath, idx) => {
    const { data, content } = readMarkdownFile(filePath)
    const base = path.basename(filePath, ".md")
    const numPrefix = parseInt(base.split("-")[0], 10)
    const posFm = Number((data as any).position)
    const position = Number.isFinite(posFm) ? posFm : (!isNaN(numPrefix) ? numPrefix : idx + 1)
    const item: Testimonial = {
      id: base,
      position,
      name: String((data as any).name || ""),
      age: Number((data as any).age || 0),
      rating: Number((data as any).rating || 0),
      text: content,
      mediaUrl: (data as any).mediaUrl ? String((data as any).mediaUrl) : undefined,
      videoUrl: (data as any).videoUrl ? String((data as any).videoUrl) : undefined,
      imageUrl: (data as any).imageUrl ? String((data as any).imageUrl) : undefined,
      video: (data as any).video ? String((data as any).video) : undefined,
      image: (data as any).image ? String((data as any).image) : undefined,
    }
    return item
  })

  const filtered = items.filter((t) => t.id !== id)
  const normalized = normalizeTestimonialPositions(filtered)
  for (const t of normalized) {
    writeTestimonialFile(dir, t)
  }

  // Borramos el fichero antiguo si existía
  const fileToDelete = path.join(dir, `${id}.md`)
  if (fs.existsSync(fileToDelete)) fs.unlinkSync(fileToDelete)
}
