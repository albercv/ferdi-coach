"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { PricingCard } from "@/components/ui/pricing-card"
import type { GuideProduct, SessionProduct } from "@/lib/products-md"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { MediaPicker } from "@/components/dashboard/MediaPicker"
import { MediaLibraryTab } from "@/components/dashboard/MediaLibraryTab"
import { MediaSectionCard } from "@/components/dashboard/MediaSectionCard"
import { CheckCircle, Wrench, Handshake, SlidersHorizontal, Star, Heart, Shield, Users, ArrowRight, Sparkles, Target, Timer, MessageSquare } from "lucide-react"

function escapeProductSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { status } = useSession()

  // Proteger acceso: si no hay sesión, redirige al login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  // Evitar BFCache al volver atrás tras logout: revalida sesión y redirige si no hay
  useEffect(() => {
    const onPageShow = () => {
      if (status === "unauthenticated") {
        router.replace("/login")
      }
    }
    window.addEventListener("pageshow", onPageShow)
    return () => window.removeEventListener("pageshow", onPageShow)
  }, [status, router])
  const [aboutTitle, setAboutTitle] = useState("")
  const [aboutDescription, setAboutDescription] = useState("")
  const [aboutCredentialsText, setAboutCredentialsText] = useState("")
  const [savingAbout, setSavingAbout] = useState(false)
  const [aboutVideoUrl, setAboutVideoUrl] = useState("")
  const [aboutPosterImageUrl, setAboutPosterImageUrl] = useState("")
  const [savingFaq, setSavingFaq] = useState(false)
  const [faqItems, setFaqItems] = useState<Array<{ id: string; position: number; question: string; answer: string }>>([])
  const [selectedFaqId, setSelectedFaqId] = useState<string | null>(null)
  const [editingQuestion, setEditingQuestion] = useState("")
  const [editingAnswer, setEditingAnswer] = useState("")
  const [editingPosition, setEditingPosition] = useState<number>(1)
  const [editingId, setEditingId] = useState("") // visible solo en edición, readonly
  // Nuevos estados para creación y eliminación de FAQs
  const [creatingFaq, setCreatingFaq] = useState(false)
  const [deletingFaq, setDeletingFaq] = useState(false)
  const [createQuestion, setCreateQuestion] = useState("")
  const [createAnswer, setCreateAnswer] = useState("")
  const [createPosition, setCreatePosition] = useState<number>(1)
  // --- Testimonials state ---
  const [testimonials, setTestimonials] = useState<Array<{ id: string; position: number; name: string; age: number; rating: number; text: string; mediaUrl?: string; videoUrl?: string; imageUrl?: string; video?: string; image?: string }>>([])
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<string | null>(null)
  const [editingTestimonialId, setEditingTestimonialId] = useState<string>("")
  const [editingTName, setEditingTName] = useState("")
  const [editingTAge, setEditingTAge] = useState<number>(0)
  const [editingTRating, setEditingTRating] = useState<number>(5)
  const [editingTText, setEditingTText] = useState("")
  const [editingTMediaUrl, setEditingTMediaUrl] = useState("")
  const [editingTPosition, setEditingTPosition] = useState<number>(1)
  const [savingTestimonial, setSavingTestimonial] = useState(false)
  const [creatingTestimonial, setCreatingTestimonial] = useState(false)
  const [deletingTestimonial, setDeletingTestimonial] = useState(false)
  const [createTName, setCreateTName] = useState("")
  const [createTAge, setCreateTAge] = useState<number>(0)
  const [createTRating, setCreateTRating] = useState<number>(5)
  const [createTText, setCreateTText] = useState("")
  const [createTMediaUrl, setCreateTMediaUrl] = useState("")
  const [createTPosition, setCreateTPosition] = useState<number>(1)

  // --- Products state ---
  const [guides, setGuides] = useState<GuideProduct[]>([])
  const [sessions, setSessions] = useState<SessionProduct[]>([])

  // Vista previa: controlar apertura del borrador al abrir el panel de creación
  const [openGuidesDraftPreview, setOpenGuidesDraftPreview] = useState(false)
  const [openSessionsDraftPreview, setOpenSessionsDraftPreview] = useState(false)
  const [showGuidesBack, setShowGuidesBack] = useState(false)
  const [howItWorksUrlAdvanced, setHowItWorksUrlAdvanced] = useState(false)

  // Crear Guía
  const [cgTitle, setCgTitle] = useState("")
  const [cgMini, setCgMini] = useState("")
  const [cgPrice, setCgPrice] = useState<number>(0)
  const [cgFeaturesText, setCgFeaturesText] = useState("")
  const [cgFileUrl, setCgFileUrl] = useState("/fake.pdf")
  const [cgCoverImageUrl, setCgCoverImageUrl] = useState("")
  const [cgSynopsis, setCgSynopsis] = useState("")
  const [cgPosition, setCgPosition] = useState<number>(1)
  const [cgFeaturedSpot, setCgFeaturedSpot] = useState<number | undefined>(undefined)
  const [cgMostPopular, setCgMostPopular] = useState<boolean>(false)
  const [creatingGuide, setCreatingGuide] = useState(false)

  // Editar Guía
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null)
  const [egId, setEgId] = useState("")
  const [egTitle, setEgTitle] = useState("")
  const [egMini, setEgMini] = useState("")
  const [egPrice, setEgPrice] = useState<number>(0)
  const [egFeaturesText, setEgFeaturesText] = useState("")
  const [egFileUrl, setEgFileUrl] = useState("/fake.pdf")
  const [egCoverImageUrl, setEgCoverImageUrl] = useState("")
  const [egSynopsis, setEgSynopsis] = useState("")
  const [egPosition, setEgPosition] = useState<number>(1)
  const [egFeaturedSpot, setEgFeaturedSpot] = useState<number | undefined>(undefined)
  const [egMostPopular, setEgMostPopular] = useState<boolean>(false)
  const [savingGuide, setSavingGuide] = useState(false)
  const [deletingGuide, setDeletingGuide] = useState(false)

  // Crear Sesión
  const [csSubtype, setCsSubtype] = useState<"individual" | "program4">("individual")
  const [csTitle, setCsTitle] = useState("")
  const [csDesc, setCsDesc] = useState("")
  const [csPrice, setCsPrice] = useState<number>(0)
  const [csFeaturesText, setCsFeaturesText] = useState("")
  const [csImageUrl, setCsImageUrl] = useState("")
  const [csNotes, setCsNotes] = useState("")
  const [csAddon, setCsAddon] = useState("")
  const [csPosition, setCsPosition] = useState<number>(1)
  const [csFeaturedSpot, setCsFeaturedSpot] = useState<number | undefined>(undefined)
  const [csMostPopular, setCsMostPopular] = useState<boolean>(false)
  const [creatingSession, setCreatingSession] = useState(false)

  // Editar Sesión
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [esId, setEsId] = useState("")
  const [esSubtype, setEsSubtype] = useState<"individual" | "program4">("individual")
  const [esTitle, setEsTitle] = useState("")
  const [esDesc, setEsDesc] = useState("")
  const [esPrice, setEsPrice] = useState<number>(0)
  const [esFeaturesText, setEsFeaturesText] = useState("")
  const [esImageUrl, setEsImageUrl] = useState("")
  const [esNotes, setEsNotes] = useState("")
  const [esAddon, setEsAddon] = useState("")
  const [esPosition, setEsPosition] = useState<number>(1)
  const [esFeaturedSpot, setEsFeaturedSpot] = useState<number | undefined>(undefined)
  const [esMostPopular, setEsMostPopular] = useState<boolean>(false)
  const [savingSession, setSavingSession] = useState(false)
  const [deletingSession, setDeletingSession] = useState(false)

  // --- Hero state ---
  const [heroTitle, setHeroTitle] = useState("")
  const [heroSubtitle, setHeroSubtitle] = useState("")
  const [heroCtaPrimary, setHeroCtaPrimary] = useState("")
  const [heroCtaSecondary, setHeroCtaSecondary] = useState("")
  const [heroBackgroundImageUrl, setHeroBackgroundImageUrl] = useState("")
  const [heroBackgroundImageUrlFromServer, setHeroBackgroundImageUrlFromServer] = useState("")
  const [heroBullets, setHeroBullets] = useState<Array<{ id: string; position: number; icon: string; text: string }>>([])
  const [selectedBulletId, setSelectedBulletId] = useState<string | null>(null)
  const [ebId, setEbId] = useState("")
  const [ebIcon, setEbIcon] = useState("check-circle")
  const [ebText, setEbText] = useState("")
  const [ebPosition, setEbPosition] = useState<number>(1)
  const [cbIcon, setCbIcon] = useState("check-circle")
  const [cbText, setCbText] = useState("")
  const [cbPosition, setCbPosition] = useState<number>(1)
  const [creatingBullet, setCreatingBullet] = useState(false)
  const [deletingBullet, setDeletingBullet] = useState(false)
  const [savingHero, setSavingHero] = useState(false)

  // --- CTA state ---
  const [ctaTitle, setCtaTitle] = useState("")
  const [ctaDescription, setCtaDescription] = useState("")
  const [ctaButtonText, setCtaButtonText] = useState("")
  const [savingCta, setSavingCta] = useState(false)

  // --- Breaker state ---
  const [breakerKicker, setBreakerKicker] = useState("Un alto aquí")
  const [breakerText, setBreakerText] = useState("")
  const [savingBreaker, setSavingBreaker] = useState(false)

  const heroIconMap = {
    "check-circle": CheckCircle,
    wrench: Wrench,
    handshake: Handshake,
    "sliders-horizontal": SlidersHorizontal,
    star: Star,
    heart: Heart,
    shield: Shield,
    users: Users,
    "arrow-right": ArrowRight,
    sparkles: Sparkles,
    target: Target,
    timer: Timer,
    "message-square": MessageSquare,
  } as const

  const HERO_ICON_KEYS = [
    "check-circle",
    "wrench",
    "handshake",
    "sliders-horizontal",
    "star",
    "heart",
    "shield",
    "users",
    "arrow-right",
    "sparkles",
    "target",
    "timer",
    "message-square",
  ] as const

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const res = await fetch("/api/content/about", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load about content")
        const data = await res.json()
        setAboutTitle(data.title ?? "")
        setAboutDescription(data.description ?? "")
        setAboutCredentialsText(Array.isArray(data.credentials) ? data.credentials.join("\n") : "")
        setAboutVideoUrl(typeof data.videoUrl === "string" ? data.videoUrl : "")
        setAboutPosterImageUrl(typeof data.posterImageUrl === "string" ? data.posterImageUrl : "")
      } catch (e) {
        toast({ title: "Error", description: "No se pudo cargar 'Sobre mí'" })
      }
    }
    const loadFAQs = async () => {
      try {
        const res = await fetch("/api/content/faq", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load FAQs")
        const data = await res.json()
        const items = Array.isArray(data.items) ? data.items : []
        setFaqItems(items)
        if (items.length > 0) {
          setSelectedFaqId(items[0].id)
          setEditingQuestion(items[0].question)
          setEditingAnswer(items[0].answer)
          setEditingPosition(items[0].position ?? 1)
          setEditingId(items[0].id)
        }
      } catch (e) {
        toast({ title: "Error", description: "No se pudieron cargar las FAQs" })
      }
    }
    const loadTestimonials = async () => {
      try {
        const res = await fetch("/api/content/testimonials", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load Testimonials")
        const data = await res.json()
        const items = Array.isArray(data.items) ? data.items : []
        setTestimonials(items)
        // Dejar todo plegado por defecto (sin selección inicial)
      } catch (e) {
        toast({ title: "Error", description: "No se pudieron cargar los testimonios" })
      }
    }
    const loadHero = async () => {
      try {
        const res = await fetch("/api/content/hero", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load Hero")
        const data = await res.json()
        setHeroTitle(String(data.title ?? ""))
        setHeroSubtitle(String(data.subtitle ?? ""))
        setHeroCtaPrimary(String(data.ctaPrimary ?? ""))
        setHeroCtaSecondary(data.ctaSecondary ? String(data.ctaSecondary) : "")
        setHeroBackgroundImageUrl(data.backgroundImageUrl ? String(data.backgroundImageUrl) : "")
        setHeroBackgroundImageUrlFromServer(data.backgroundImageUrl ? String(data.backgroundImageUrl) : "")
        const bullets = Array.isArray(data.bullets) ? data.bullets : []
        setHeroBullets(bullets)
        if (bullets.length > 0) {
          setSelectedBulletId(bullets[0].id)
          setEbId(bullets[0].id)
          setEbIcon(String(bullets[0].icon || "check-circle"))
          setEbText(String(bullets[0].text || ""))
          setEbPosition(Number(bullets[0].position || 1))
        }
      } catch (e) {
        toast({ title: "Error", description: "No se pudo cargar el Hero" })
      }
    }
    const loadCta = async () => {
      try {
        const res = await fetch("/api/content/cta", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load CTA")
        const data = await res.json()
        setCtaTitle(String(data.title ?? ""))
        setCtaDescription(String(data.description ?? ""))
        setCtaButtonText(String(data.buttonText ?? ""))
      } catch (e) {
        toast({ title: "Error", description: "No se pudo cargar el CTA" })
      }
    }

    const loadBreaker = async () => {
      try {
        const res = await fetch("/api/content/breaker", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load breaker")
        const data = await res.json()
        setBreakerKicker(String(data.kicker ?? "Un alto aquí"))
        setBreakerText(String(data.text ?? ""))
      } catch (e) {
        toast({ title: "Error", description: "No se pudo cargar la frase" })
      }
    }
    loadAbout()
    loadFAQs()
    loadTestimonials()
    loadHero()
    loadCta()
    loadBreaker()
  }, [toast])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const handleSaveAbout = async () => {
    setSavingAbout(true)
    try {
      const credentials = aboutCredentialsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)

      const res = await fetch("/api/content/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: aboutTitle,
          description: aboutDescription,
          credentials,
          videoUrl: aboutVideoUrl?.trim() || undefined,
          posterImageUrl: aboutPosterImageUrl?.trim() || undefined,
        }),
      })

      if (!res.ok) throw new Error(await res.text())

      toast({ title: "Guardado", description: "Se actualizó la sección 'Sobre mí' correctamente." })
    } catch (e) {
      toast({ title: "Error al guardar", description: "Revisa los campos e inténtalo de nuevo." })
    } finally {
      setSavingAbout(false)
    }
  }

  const handleSaveCta = async () => {
    setSavingCta(true)
    try {
      const res = await fetch("/api/content/cta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: ctaTitle,
          description: ctaDescription,
          buttonText: ctaButtonText,
        }),
      })

      if (!res.ok) throw new Error(await res.text())

      toast({ title: "Guardado", description: "Se actualizó el CTA correctamente." })
    } catch (e) {
      toast({ title: "Error al guardar", description: "Revisa los campos e inténtalo de nuevo." })
    } finally {
      setSavingCta(false)
    }
  }

  const handleSaveBreaker = async () => {
    setSavingBreaker(true)
    try {
      const res = await fetch("/api/content/breaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kicker: breakerKicker,
          text: breakerText,
        }),
      })

      if (!res.ok) throw new Error(await res.text())

      toast({ title: "Guardado", description: "Se actualizó la frase correctamente." })
    } catch (e) {
      toast({ title: "Error al guardar", description: "Revisa el texto e inténtalo de nuevo." })
    } finally {
      setSavingBreaker(false)
    }
  }

  // --- Hero helpers & handlers ---
  const normalizeHeroPositions = (
    items: Array<{ id: string; position: number; icon: string; text: string }>
  ) => {
    return items
      .slice()
      .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
      .map((it, idx) => ({ ...it, position: idx + 1 }))
  }

  const handleSelectBullet = (id: string) => {
    setSelectedBulletId(id)
    const b = heroBullets.find((it) => it.id === id)
    if (b) {
      setEbId(b.id)
      setEbIcon(b.icon || "check-circle")
      setEbText(b.text || "")
      setEbPosition(Number(b.position || 1))
    }
  }

  const handleCreateHeroBullet = () => {
    if (!cbText.trim()) {
      toast({ title: "Texto requerido", description: "Introduce el texto del bullet" })
      return
    }
    const id = String(Date.now())
    const desired = Math.max(1, Math.min(Number(cbPosition || 1), heroBullets.length + 1))
    const inserted = [
      ...heroBullets.slice(0, desired - 1),
      { id, position: desired, icon: cbIcon || "check-circle", text: cbText.trim() },
      ...heroBullets.slice(desired - 1),
    ]
    const next = normalizeHeroPositions(inserted)
    setHeroBullets(next)
    setCreatingBullet(false)
    setCbIcon("check-circle")
    setCbText("")
    setCbPosition(next.length + 1)
    toast({ title: "Añadido", description: "Bullet creado en borrador. Recuerda GUARDAR el Hero para persistir." })
  }

  const handleSaveHeroBullet = () => {
    if (!selectedBulletId) return
    if (!ebText.trim()) {
      toast({ title: "Texto requerido", description: "Introduce el texto del bullet" })
      return
    }
    const rest = heroBullets.filter((it) => it.id !== selectedBulletId)
    const desired = Math.max(1, Math.min(Number(ebPosition || 1), rest.length + 1))
    rest.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
    const inserted = [
      ...rest.slice(0, desired - 1),
      { id: selectedBulletId, position: desired, icon: ebIcon || "check-circle", text: ebText.trim() },
      ...rest.slice(desired - 1),
    ]
    const next = normalizeHeroPositions(inserted)
    setHeroBullets(next)
    toast({ title: "Actualizado", description: "Bullet actualizado en borrador. Recuerda GUARDAR el Hero para persistir." })
  }

  const handleDeleteHeroBullet = () => {
    if (!selectedBulletId) return
    const filtered = heroBullets.filter((it) => it.id !== selectedBulletId)
    const next = normalizeHeroPositions(filtered)
    setHeroBullets(next)
    if (next.length > 0) {
      handleSelectBullet(next[0].id)
    } else {
      setSelectedBulletId(null)
      setEbId("")
      setEbIcon("check-circle")
      setEbText("")
      setEbPosition(1)
    }
    setDeletingBullet(false)
    toast({ title: "Eliminado", description: "Bullet eliminado en borrador. Recuerda GUARDAR el Hero para persistir." })
  }

  const handleSaveHero = async () => {
    if (!heroTitle.trim() || !heroSubtitle.trim() || !heroCtaPrimary.trim()) {
      toast({ title: "Campos requeridos", description: "Título, subtítulo y CTA principal son obligatorios." })
      return
    }
    setSavingHero(true)
    try {
      const body = {
        title: heroTitle.trim(),
        subtitle: heroSubtitle.trim(),
        backgroundImageUrl: heroBackgroundImageUrl?.trim() || undefined,
        ctaPrimary: heroCtaPrimary.trim(),
        ctaSecondary: heroCtaSecondary?.trim() || undefined,
        bullets: normalizeHeroPositions(heroBullets).filter((b) => b.text && b.text.trim()),
      }
      const res = await fetch("/api/content/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(await res.text())
      toast({ title: "Guardado", description: "Se actualizó el Hero correctamente." })
    } catch (e) {
      toast({ title: "Error al guardar", description: "Revisa los campos e inténtalo de nuevo." })
    } finally {
      setSavingHero(false)
    }
  }

  const handleSaveFaq = async () => {
    if (!selectedFaqId) return
    // Validación: la posición no puede duplicarse
    const posInUse = faqItems.some((it) => it.id !== (editingId || selectedFaqId) && Number(it.position) === Number(editingPosition))
    if (posInUse) {
      toast({ title: "Posición en uso", description: "Ya existe una FAQ con esa posición. Elige otra." })
      return
    }
    setSavingFaq(true)
    try {
      const payload = {
        id: editingId || selectedFaqId,
        question: editingQuestion,
        answer: editingAnswer,
        position: editingPosition,
      }
      const res = await fetch("/api/content/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const updated = data?.item ?? payload
      setFaqItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
      toast({ title: "Guardado", description: "La FAQ se guardó en Markdown correctamente." })
    } catch (e) {
      toast({ title: "Error al guardar FAQ", description: "No se pudo guardar. Revisa los campos e inténtalo." })
    } finally {
      setSavingFaq(false)
    }
  }

  // Actualiza posición sugerida de la nueva FAQ cuando cambia el listado
  useEffect(() => {
    const nextPos = Math.max(
      1,
      faqItems.reduce((max, it) => {
        const p = Number(it?.position || 0)
        return Number.isFinite(p) ? Math.max(max, p) : max
      }, 0) + 1
    )
    setCreatePosition(nextPos)
  }, [faqItems])

  const handleCreateFaq = async () => {
    // Validación: la posición no puede duplicarse
    const posInUse = faqItems.some((it) => Number(it.position) === Number(createPosition))
    if (posInUse) {
      toast({ title: "Posición en uso", description: "Ya existe una FAQ con esa posición. Elige otra." })
      return
    }
    setCreatingFaq(true)
    try {
      const payload = {
        question: createQuestion,
        answer: createAnswer,
        position: createPosition,
      }
      const res = await fetch("/api/content/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const created = data?.item
      if (Array.isArray(data?.faq?.items)) {
        setFaqItems(data.faq.items)
      } else if (created) {
        setFaqItems((prev) => [...prev, created])
      }
      if (created) {
        setSelectedFaqId(created.id)
        setEditingId(created.id)
        setEditingQuestion(created.question)
        setEditingAnswer(created.answer)
        setEditingPosition(created.position ?? 1)
      }
      setCreateQuestion("")
      setCreateAnswer("")
      toast({ title: "Creada", description: "La nueva FAQ se ha añadido correctamente." })
    } catch (e) {
      toast({ title: "Error al crear FAQ", description: "No se pudo crear. Revisa los campos e inténtalo." })
    } finally {
      setCreatingFaq(false)
    }
  }

  const handleDeleteFaq = async (id: string) => {
    if (!id) return
    setDeletingFaq(true)
    try {
      const res = await fetch(`/api/content/faq?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const items = Array.isArray(data?.faq?.items) ? data.faq.items : []
      setFaqItems(items)
      const next = items[0]
      if (next) {
        setSelectedFaqId(next.id)
        setEditingId(next.id)
        setEditingQuestion(next.question)
        setEditingAnswer(next.answer)
        setEditingPosition(next.position ?? 1)
      } else {
        setSelectedFaqId(null)
        setEditingId("")
        setEditingQuestion("")
        setEditingAnswer("")
        setEditingPosition(1)
      }
      toast({ title: "Eliminada", description: "La FAQ ha sido eliminada." })
    } catch (e) {
      toast({ title: "Error al eliminar FAQ", description: "No se pudo eliminar. Inténtalo de nuevo." })
    } finally {
      setDeletingFaq(false)
    }
  }

  // --- Productos: carga y handlers ---
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/content/products", { cache: "no-store" })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const gs: GuideProduct[] = Array.isArray(data?.data?.guides) ? data.data.guides : []
      const ss: SessionProduct[] = Array.isArray(data?.data?.sessions) ? data.data.sessions : []
      setGuides(gs)
      setSessions(ss)
    } catch (e) {
      toast({ title: "Error", description: "No se pudieron cargar los productos" })
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Posición sugerida para nuevas creaciones
  useEffect(() => {
    const nextG = Math.max(
      1,
      guides.reduce((max, it) => {
        const p = Number(it?.position || 0)
        return Number.isFinite(p) ? Math.max(max, p) : max
      }, 0) + 1
    )
    setCgPosition(nextG)
  }, [guides])

  useEffect(() => {
    const nextS = Math.max(
      1,
      sessions.reduce((max, it) => {
        const p = Number(it?.position || 0)
        return Number.isFinite(p) ? Math.max(max, p) : max
      }, 0) + 1
    )
    setCsPosition(nextS)
  }, [sessions])

  const isAllowedHowItWorksUrl = (url: string) => {
    const value = String(url || "").trim()
    return value.startsWith("/") || value.startsWith("https://")
  }

  const cgFileUrlInvalid = Boolean(String(cgFileUrl || "").trim()) && !isAllowedHowItWorksUrl(String(cgFileUrl || "").trim())
  const egFileUrlInvalid = Boolean(String(egFileUrl || "").trim()) && !isAllowedHowItWorksUrl(String(egFileUrl || "").trim())

  const handleCreateGuide = async () => {
    // Validación
    if (!cgTitle.trim()) {
      toast({ title: "Falta título", description: "La guía necesita un título." })
      return
    }

    const normalizedFileUrl = String(cgFileUrl || "/fake.pdf").trim() || "/fake.pdf"
    if (!isAllowedHowItWorksUrl(normalizedFileUrl)) {
      toast({ title: "URL inválida", description: "La URL debe empezar por / o por https://" })
      return
    }

    const features = cgFeaturesText.split(/\n|,/).map((s) => s.trim()).filter(Boolean)
    const posInUse = guides.some((it) => Number(it.position) === Number(cgPosition))
    if (posInUse) {
      toast({ title: "Posición en uso", description: "Ya existe una guía con esa posición. Elige otra." })
      return
    }
    setCreatingGuide(true)
    try {
      const payload = {
        kind: "guide",
        title: cgTitle,
        miniDescription: cgMini,
        price: Number(cgPrice || 0),
        features,
        fileUrl: normalizedFileUrl,
        coverImageUrl: cgCoverImageUrl || undefined,
        synopsis: cgSynopsis,
        position: Number(cgPosition || 1),
        featuredSpot: cgFeaturedSpot ? Number(cgFeaturedSpot) : undefined,
        mostPopular: Boolean(cgMostPopular),
      }
      const res = await fetch("/api/content/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const created: GuideProduct | undefined = data?.data
      if (created) {
        setGuides((prev) => {
          const next = [...prev, created].sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
          return next
        })
        setSelectedGuideId(created.id)
        setEgId(created.id)
        setEgTitle(created.title)
        setEgMini(created.miniDescription)
        setEgPrice(created.price)
        setEgFeaturesText(created.features.join("\n"))
        setEgFileUrl(created.fileUrl)
        setEgCoverImageUrl(created.coverImageUrl || "")
        setEgSynopsis(created.synopsis)
        setEgPosition(created.position)
        setEgFeaturedSpot(created.featuredSpot)
        setEgMostPopular(Boolean(created.mostPopular))
      }
      // Reset creación
      setCgTitle("")
      setCgMini("")
      setCgPrice(0)
      setCgFeaturesText("")
      setCgFileUrl("/fake.pdf")
      setCgCoverImageUrl("")
      setCgSynopsis("")
      setCgFeaturedSpot(undefined)
      setCgMostPopular(false)
      toast({ title: "Guía creada", description: "Se ha añadido la guía." })
    } catch (e) {
      toast({ title: "Error al crear guía", description: "No se pudo crear. Revisa los campos." })
    } finally {
      setCreatingGuide(false)
    }
  }

  const handleSaveGuide = async () => {
    const id = egId || selectedGuideId
    if (!id) return

    const normalizedFileUrl = String(egFileUrl || "/fake.pdf").trim() || "/fake.pdf"
    if (!isAllowedHowItWorksUrl(normalizedFileUrl)) {
      toast({ title: "URL inválida", description: "La URL debe empezar por / o por https://" })
      return
    }

    const features = egFeaturesText.split(/\n|,/).map((s) => s.trim()).filter(Boolean)
    const posInUse = guides.some((it) => it.id !== id && Number(it.position) === Number(egPosition))
    if (posInUse) {
      toast({ title: "Posición en uso", description: "Ya existe una guía con esa posición." })
      return
    }
    setSavingGuide(true)
    try {
      const payload = {
        id,
        kind: "guide",
        title: egTitle,
        miniDescription: egMini,
        price: Number(egPrice || 0),
        features,
        fileUrl: normalizedFileUrl,
        coverImageUrl: egCoverImageUrl || undefined,
        synopsis: egSynopsis,
        position: Number(egPosition || 1),
        featuredSpot: egFeaturedSpot ? Number(egFeaturedSpot) : undefined,
        mostPopular: Boolean(egMostPopular),
      }
      const res = await fetch("/api/content/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const updated: GuideProduct | undefined = data?.data
      if (updated) {
        setGuides((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
        setSelectedGuideId(updated.id)
      }
      toast({ title: "Guía guardada", description: "Se guardó correctamente." })
    } catch (e) {
      toast({ title: "Error al guardar guía", description: "No se pudo guardar. Revisa los campos." })
    } finally {
      setSavingGuide(false)
    }
  }

  const handleDeleteGuide = async (id: string) => {
    if (!id) return
    setDeletingGuide(true)
    try {
      const res = await fetch(`/api/content/products?id=${encodeURIComponent(id)}&kind=guide`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      // Actualizar estado
      setGuides((prev) => prev.filter((it) => it.id !== id))
      // Reset selección si se borró el actual
      if (selectedGuideId === id) {
        setSelectedGuideId(null)
        setEgId("")
        setEgTitle("")
        setEgMini("")
        setEgPrice(0)
        setEgFeaturesText("")
        setEgFileUrl("/fake.pdf")
        setEgCoverImageUrl("")
        setEgSynopsis("")
        setEgPosition(1)
        setEgFeaturedSpot(undefined)
        setEgMostPopular(false)
      }
      toast({ title: "Guía eliminada", description: "Se ha borrado correctamente." })
    } catch (e) {
      toast({ title: "Error al eliminar guía", description: "No se pudo eliminar." })
    } finally {
      setDeletingGuide(false)
    }
  }

  const handleCreateSession = async () => {
    if (!csTitle.trim()) {
      toast({ title: "Falta título", description: "La sesión necesita un título." })
      return
    }
    const features = csFeaturesText.split(/\n|,/).map((s) => s.trim()).filter(Boolean)
    const posInUse = sessions.some((it) => Number(it.position) === Number(csPosition))
    if (posInUse) {
      toast({ title: "Posición en uso", description: "Ya existe una sesión con esa posición. Elige otra." })
      return
    }
    setCreatingSession(true)
    try {
      const payload = {
        kind: "session",
        subtype: csSubtype,
        title: csTitle,
        description: csDesc,
        price: Number(csPrice || 0),
        features,
        imageUrl: csImageUrl || undefined,
        notes: csNotes || undefined,
        addon: csSubtype === "program4" ? (csAddon || undefined) : undefined,
        position: Number(csPosition || 1),
        featuredSpot: csFeaturedSpot ? Number(csFeaturedSpot) : undefined,
        mostPopular: Boolean(csMostPopular),
      }
      const res = await fetch("/api/content/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const created: SessionProduct | undefined = data?.data
      if (created) {
        setSessions((prev) => {
          const next = [...prev, created].sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
          return next
        })
        setSelectedSessionId(created.id)
        setEsId(created.id)
        setEsSubtype(created.subtype)
        setEsTitle(created.title)
        setEsDesc(created.description)
        setEsPrice(created.price)
        setEsFeaturesText(created.features.join("\n"))
        setEsImageUrl(created.imageUrl || "")
        setEsNotes(created.notes || "")
        setEsAddon(created.addon || "")
        setEsPosition(created.position)
        setEsFeaturedSpot(created.featuredSpot)
        setEsMostPopular(Boolean(created.mostPopular))
      }
      // Reset creación
      setCsSubtype("individual")
      setCsTitle("")
      setCsDesc("")
      setCsPrice(0)
      setCsFeaturesText("")
      setCsImageUrl("")
      setCsNotes("")
      setCsAddon("")
      setCsFeaturedSpot(undefined)
      setCsMostPopular(false)
      toast({ title: "Sesión creada", description: "Se ha añadido la sesión." })
    } catch (e) {
      toast({ title: "Error al crear sesión", description: "No se pudo crear. Revisa los campos." })
    } finally {
      setCreatingSession(false)
    }
  }

  const handleSaveSession = async () => {
    const id = esId || selectedSessionId
    if (!id) return
    const features = esFeaturesText.split(/\n|,/).map((s) => s.trim()).filter(Boolean)
    const posInUse = sessions.some((it) => it.id !== id && Number(it.position) === Number(esPosition))
    if (posInUse) {
      toast({ title: "Posición en uso", description: "Ya existe una sesión con esa posición." })
      return
    }
    setSavingSession(true)
    try {
      const payload = {
        id,
        kind: "session",
        subtype: esSubtype,
        title: esTitle,
        description: esDesc,
        price: Number(esPrice || 0),
        features,
        imageUrl: esImageUrl || undefined,
        notes: esNotes || undefined,
        addon: esSubtype === "program4" ? (esAddon || undefined) : undefined,
        position: Number(esPosition || 1),
        featuredSpot: esFeaturedSpot ? Number(esFeaturedSpot) : undefined,
        mostPopular: Boolean(esMostPopular),
      }
      const res = await fetch("/api/content/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const updated: SessionProduct | undefined = data?.data
      if (updated) {
        setSessions((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
        setSelectedSessionId(updated.id)
      }
      toast({ title: "Sesión guardada", description: "Se guardó correctamente." })
    } catch (e) {
      toast({ title: "Error al guardar sesión", description: "No se pudo guardar. Revisa los campos." })
    } finally {
      setSavingSession(false)
    }
  }

  const handleDeleteSession = async (id: string) => {
    if (!id) return
    setDeletingSession(true)
    try {
      const res = await fetch(`/api/content/products?id=${encodeURIComponent(id)}&kind=session`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      setSessions((prev) => prev.filter((it) => it.id !== id))
      if (selectedSessionId === id) {
        setSelectedSessionId(null)
        setEsId("")
        setEsSubtype("individual")
        setEsTitle("")
        setEsDesc("")
        setEsPrice(0)
        setEsFeaturesText("")
        setEsImageUrl("")
        setEsNotes("")
        setEsAddon("")
        setEsPosition(1)
        setEsFeaturedSpot(undefined)
        setEsMostPopular(false)
      }
      toast({ title: "Sesión eliminada", description: "Se ha borrado correctamente." })
    } catch (e) {
      toast({ title: "Error al eliminar sesión", description: "No se pudo eliminar." })
    } finally {
      setDeletingSession(false)
    }
  }

  // --- Handlers Testimonials ---
  useEffect(() => {
    const nextPosT = Math.max(
      1,
      testimonials.reduce((max, it) => {
        const p = Number(it?.position || 0)
        return Number.isFinite(p) ? Math.max(max, p) : max
      }, 0) + 1
    )
    setCreateTPosition(nextPosT)
  }, [testimonials])

  const handleSaveTestimonial = async () => {
    if (!selectedTestimonialId) return
    const posInUse = testimonials.some((it) => it.id !== (editingTestimonialId || selectedTestimonialId) && Number(it.position) === Number(editingTPosition))
    if (posInUse) {
      toast({ title: "Posición en uso", description: "Ya existe un testimonio con esa posición. Elige otra." })
      return
    }
    setSavingTestimonial(true)
    try {
      const payload = {
        id: editingTestimonialId || selectedTestimonialId,
        name: editingTName,
        age: editingTAge,
        rating: editingTRating,
        text: editingTText,
        mediaUrl: editingTMediaUrl || undefined,
        position: editingTPosition,
      }
      const res = await fetch("/api/content/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const updated = data?.item ?? payload
      setTestimonials((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
      toast({ title: "Guardado", description: "El testimonio se guardó correctamente." })
    } catch (e) {
      toast({ title: "Error al guardar", description: "No se pudo guardar el testimonio." })
    } finally {
      setSavingTestimonial(false)
    }
  }

  const handleCreateTestimonial = async () => {
    const posInUse = testimonials.some((it) => Number(it.position) === Number(createTPosition))
    if (posInUse) {
      toast({ title: "Posición en uso", description: "Ya existe un testimonio con esa posición. Elige otra." })
      return
    }
    setCreatingTestimonial(true)
    try {
      const payload = {
        name: createTName,
        age: createTAge,
        rating: createTRating,
        text: createTText,
        mediaUrl: createTMediaUrl || undefined,
        position: createTPosition,
      }
      const res = await fetch("/api/content/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const created = data?.item
      const items = Array.isArray(data?.items) ? data.items : []
      if (items.length) setTestimonials(items)
      else if (created) setTestimonials((prev) => [...prev, created])
      if (created) {
        setSelectedTestimonialId(created.id)
        setEditingTestimonialId(created.id)
        setEditingTName(created.name)
        setEditingTAge(created.age)
        setEditingTRating(created.rating)
        setEditingTText(created.text)
        setEditingTMediaUrl(created.mediaUrl || "")
        setEditingTPosition(created.position ?? 1)
      }
      setCreateTName("")
      setCreateTAge(0)
      setCreateTRating(5)
      setCreateTText("")
      setCreateTMediaUrl("")
      toast({ title: "Creado", description: "El testimonio se ha añadido correctamente." })
    } catch (e) {
      toast({ title: "Error al crear", description: "No se pudo crear el testimonio." })
    } finally {
      setCreatingTestimonial(false)
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!id) return
    setDeletingTestimonial(true)
    try {
      const res = await fetch(`/api/content/testimonials?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const items = Array.isArray(data?.items) ? data.items : []
      setTestimonials(items)
      const next = items[0]
      if (next) {
        setSelectedTestimonialId(next.id)
        setEditingTestimonialId(next.id)
        setEditingTName(next.name)
        setEditingTAge(next.age)
        setEditingTRating(next.rating)
        setEditingTText(next.text)
        setEditingTMediaUrl(next.mediaUrl || "")
        setEditingTPosition(next.position ?? 1)
      } else {
        setSelectedTestimonialId(null)
        setEditingTestimonialId("")
        setEditingTName("")
        setEditingTAge(0)
        setEditingTRating(5)
        setEditingTText("")
        setEditingTMediaUrl("")
        setEditingTPosition(1)
      }
      toast({ title: "Eliminado", description: "El testimonio ha sido eliminado." })
    } catch (e) {
      toast({ title: "Error al eliminar", description: "No se pudo eliminar el testimonio." })
    } finally {
      setDeletingTestimonial(false)
    }
  }

  return (
    <main className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-3 mt-4">
            <Button asChild variant="outline">
              <Link href="/">Volver a Home</Link>
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hero" className="">
          <TabsList className="bg-card text-foreground shadow-sm border rounded-md">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="breaker">Frase destacada</TabsTrigger>
            <TabsTrigger value="products">Cómo funciona</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonios</TabsTrigger>
            <TabsTrigger value="about">Sobre mí</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="media" className="mt-6">
            <MediaLibraryTab />
          </TabsContent>

          {/* Hero Tab */}
          <TabsContent value="hero" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Izquierda: formulario */}
              <Card>
                <CardHeader>
                  <CardTitle>Editar Hero</CardTitle>
                  <CardDescription>Gestiona el título, subtítulo, CTAs y bullets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Título</Label>
                    <Input id="hero-title" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Título del hero" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Subtítulo</Label>
                    <Textarea id="hero-subtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="Subtítulo del hero" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero-cta-primary">Botón principal</Label>
                      <Input id="hero-cta-primary" value={heroCtaPrimary} onChange={(e)=> setHeroCtaPrimary(e.target.value)} placeholder="Reservar sesión" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero-cta-secondary">Botón secundario (opcional)</Label>
                      <Input id="hero-cta-secondary" value={heroCtaSecondary} onChange={(e)=> setHeroCtaSecondary(e.target.value)} placeholder="Ver servicios" />
                    </div>
                  </div>

                  <MediaSectionCard title="Imagen de fondo" compact>
                    <MediaPicker
                      label="Imagen de fondo"
                      scope="hero"
                      value={heroBackgroundImageUrl}
                      accept="image/*"
                      onChange={(url) => setHeroBackgroundImageUrl(url ?? "")}
                    />
                  </MediaSectionCard>

                  <div className="border rounded-md">
                    {/* Crear bullet */}
                    <details className="group" open={creatingBullet} onToggle={(e)=> setCreatingBullet((e.currentTarget as HTMLDetailsElement).open)}>
                      <summary className={`flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5 ${creatingBullet ? "bg-accent/10": ""}`}>
                        <span>Añadir bullet</span>
                        <span className="text-muted-foreground" />
                      </summary>
                      <div className="px-3 pb-3 pt-1 space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Icono</Label>
                             <HoverCard openDelay={100} closeDelay={100}>
                               <HoverCardTrigger asChild>
                                 <Button type="button" variant="outline" className="justify-start gap-2">
                                   {(() => {
                                     const Icon = (heroIconMap[cbIcon as keyof typeof heroIconMap] ?? CheckCircle)
                                     return <Icon className="h-3 w-3" />
                                   })()}
                                   <span className="text-xs">{cbIcon}</span>
                                 </Button>
                               </HoverCardTrigger>
                               <HoverCardContent align="start" className="w-[240px] p-2">
                                 <div className="grid grid-cols-4 gap-2">
                                   {HERO_ICON_KEYS.map((key) => {
                                     const Icon = heroIconMap[key] ?? CheckCircle
                                     const selected = cbIcon === key
                                     return (
                                       <Button
                                         key={key}
                                         type="button"
                                         variant={selected ? "default" : "outline"}
                                         onClick={() => setCbIcon(key)}
                                         className="h-8 px-2 justify-center"
                                         aria-pressed={selected}
                                       >
                                         <Icon className="h-3 w-3" />
                                       </Button>
                                     )
                                   })}
                                 </div>
                               </HoverCardContent>
                             </HoverCard>
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label htmlFor="new-bullet-text">Texto</Label>
                            <Input id="new-bullet-text" value={cbText} onChange={(e)=> setCbText(e.target.value)} placeholder="Texto del bullet" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-bullet-pos">Posición</Label>
                          <Input id="new-bullet-pos" type="number" min={1} value={cbPosition} onChange={(e)=> setCbPosition(Number(e.target.value) || 1)} />
                        </div>
                        <Button onClick={handleCreateHeroBullet} className="bg-primary text-primary-foreground">Crear</Button>
                      </div>
                    </details>

                    {/* Listado y edición */}
                    {heroBullets.length === 0 ? (
                      <div className="p-3">
                        <p className="text-sm text-muted-foreground">No hay bullets.</p>
                      </div>
                    ) : (
                      <>
                        {heroBullets.map((b) => (
                          <details
                            key={b.id}
                            className="group"
                            onToggle={(e) => {
                              const opened = (e.currentTarget as HTMLDetailsElement).open
                              if (opened) {
                                handleSelectBullet(b.id)
                              } else if (selectedBulletId === b.id) {
                                setSelectedBulletId(null)
                              }
                            }}
                            open={selectedBulletId === b.id}
                          >
                            <summary className={`flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5 ${selectedBulletId === b.id ? "bg-accent/10" : ""}`}>
                              <span className="text-balance">{b.text.slice(0, 60)}...</span>
                              <span className="text-muted-foreground" />
                            </summary>
                            <div className="px-3 pb-3 pt-1 space-y-3">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`b-id-${b.id}`}>ID</Label>
                                  <Input id={`b-id-${b.id}`} value={ebId} disabled aria-disabled="true" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`b-position-${b.id}`}>Posición</Label>
                                  <Input id={`b-position-${b.id}`} type="number" min={1} value={ebPosition} onChange={(e)=> setEbPosition(Number(e.target.value) || 1)} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Icono</Label>
                                   <HoverCard openDelay={100} closeDelay={100}>
                                     <HoverCardTrigger asChild>
                                       <Button type="button" variant="outline" className="justify-start gap-2">
                                         {(() => {
                                           const Icon = (heroIconMap[ebIcon as keyof typeof heroIconMap] ?? CheckCircle)
                                           return <Icon className="h-3 w-3" />
                                         })()}
                                         <span className="text-xs">{ebIcon}</span>
                                       </Button>
                                     </HoverCardTrigger>
                                     <HoverCardContent align="start" className="w-[240px] p-2">
                                       <div className="grid grid-cols-4 gap-2">
                                         {HERO_ICON_KEYS.map((key) => {
                                           const Icon = heroIconMap[key] ?? CheckCircle
                                           const selected = ebIcon === key
                                           return (
                                             <Button
                                               key={key}
                                               type="button"
                                               variant={selected ? "default" : "outline"}
                                               onClick={() => setEbIcon(key)}
                                               className="h-8 px-2 justify-center"
                                               aria-pressed={selected}
                                             >
                                               <Icon className="h-3 w-3" />
                                             </Button>
                                           )
                                         })}
                                       </div>
                                     </HoverCardContent>
                                   </HoverCard>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`b-text-${b.id}`}>Texto</Label>
                                <Textarea id={`b-text-${b.id}`} value={ebText} onChange={(e)=> setEbText(e.target.value)} />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleSaveHeroBullet} className="bg-primary text-primary-foreground">Actualizar</Button>
                                <Button variant="outline" onClick={() => {
                                  const original = heroBullets.find((it) => it.id === b.id)
                                  if (!original) return
                                  setEbId(original.id)
                                  setEbIcon(original.icon || "check-circle")
                                  setEbText(original.text || "")
                                  setEbPosition(original.position || 1)
                                }}>Revertir</Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={deletingBullet}>{deletingBullet ? "Eliminando..." : "Eliminar"}</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Eliminar bullet</AlertDialogTitle>
                                      <AlertDialogDescription>Esta acción es irreversible.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={handleDeleteHeroBullet} disabled={deletingBullet} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        {deletingBullet ? "Eliminando..." : "Eliminar"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </details>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSaveHero} disabled={savingHero} className="bg-primary text-primary-foreground">{savingHero ? "Guardando..." : "Guardar Hero"}</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Derecha: Vista previa */}
              <Card>
                <CardHeader>
                  <CardTitle>Vista previa</CardTitle>
                  <CardDescription>Así se verá en Home</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 rounded-md border overflow-hidden">
                    <img
                      className="h-40 w-full object-cover"
                      src={
                        (heroBackgroundImageUrl?.trim() || undefined) ??
                        (heroBackgroundImageUrlFromServer?.trim() || undefined) ??
                        "/hero-img-v1.png"
                      }
                      alt="Imagen de fondo del Hero"
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">{heroTitle || "Título del hero"}</h2>
                    <p className="text-muted-foreground">{heroSubtitle || "Subtítulo del hero..."}</p>
                    <div className="space-y-2">
                      <p className="font-medium">Te ayudo con</p>
                      <ul className="space-y-2">
                        {heroBullets.map((b) => {
                          const Icon = heroIconMap[(b.icon as keyof typeof heroIconMap) ?? "check-circle"] ?? CheckCircle
                          return (
                            <li key={b.id} className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-accent" />
                              <span>{b.text}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                    <div className="flex gap-3">
                      <Button>{heroCtaPrimary || "CTA principal"}</Button>
                      {heroCtaSecondary ? <Button variant="outline">{heroCtaSecondary}</Button> : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Izquierda: Añadir nuevo y edición dentro del mismo contenedor, todo plegable */}
              <Card>
                <CardHeader>
                  <CardTitle>Gestionar testimonios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md divide-y">
                    {/* Añadir nuevo como ítem plegable */}
                    <details
                      className="group"
                      onToggle={(e) => {
                        const opened = (e.currentTarget as HTMLDetailsElement).open
                        const NEW_ID = "__new__"
                        if (opened) {
                          setSelectedTestimonialId(NEW_ID)
                        } else if (selectedTestimonialId === NEW_ID) {
                          setSelectedTestimonialId(null)
                        }
                      }}
                      open={selectedTestimonialId === "__new__"}
                    >
                      <summary className={`flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5 ${selectedTestimonialId === "__new__" ? "bg-accent/10" : ""}`}>
                        <span className="text-balance">Añadir nuevo testimonio</span>
                        <span className="text-muted-foreground"></span>
                      </summary>
                      <div className="px-3 pb-3 pt-1 space-y-3">
                        {/* Formulario de creación */}
                        <div className="space-y-2">
                          <Label htmlFor="new-t-name">Nombre</Label>
                          <Input id="new-t-name" placeholder="Nombre" value={createTName} onChange={(e) => setCreateTName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-t-age">Edad</Label>
                            <Input id="new-t-age" type="number" min={0} placeholder="Edad" value={createTAge} onChange={(e) => setCreateTAge(Number(e.target.value) || 0)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-t-rating">Rating (0-5)</Label>
                            <Input id="new-t-rating" type="number" min={0} max={5} placeholder="Rating" value={createTRating} onChange={(e) => setCreateTRating(Number(e.target.value) || 0)} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-t-text">Texto del testimonio</Label>
                          <Textarea id="new-t-text" placeholder="Texto del testimonio" value={createTText} onChange={(e) => setCreateTText(e.target.value)} />
                        </div>
                        <MediaSectionCard title="Media" description="Imagen o vídeo del testimonio" compact>
                          <div className="w-full max-w-2xl">
                            {createTName.trim() ? (
                              <MediaPicker
                                label="Media (imagen o vídeo mp4)"
                                scope="testimonials"
                                entitySlug={escapeProductSlug(createTName)}
                                value={createTMediaUrl}
                                accept="image/*,video/mp4"
                                onChange={(url) => setCreateTMediaUrl(url ?? "")}
                              />
                            ) : (
                              <div className="text-xs text-muted-foreground">Escribe un nombre para habilitar la subida de archivos.</div>
                            )}
                          </div>
                        </MediaSectionCard>
                        <div className="space-y-2">
                          <Label htmlFor="new-t-position">Posición</Label>
                          <Input id="new-t-position" type="number" min={1} value={createTPosition} onChange={(e) => setCreateTPosition(Number(e.target.value) || 1)} />
                        </div>
                        <Button onClick={handleCreateTestimonial} disabled={creatingTestimonial} className="bg-primary text-primary-foreground">
                          {creatingTestimonial ? "Creando..." : "Crear"}
                        </Button>
                      </div>
                    </details>

                    {/* Listado y edición de testimonios */}
                    {testimonials.length === 0 ? (
                      <div className="p-3">
                        <p className="text-sm text-muted-foreground">No hay testimonios disponibles.</p>
                      </div>
                    ) : (
                      <>
                        {testimonials.map((t) => (
                          <details
                            key={t.id}
                            className="group"
                            onToggle={(e) => {
                              const opened = (e.currentTarget as HTMLDetailsElement).open
                              if (opened) {
                                setSelectedTestimonialId(t.id)
                                setEditingTestimonialId(t.id)
                                setEditingTName(t.name)
                                setEditingTAge(t.age)
                                setEditingTRating(t.rating)
                                setEditingTText(t.text)
                                setEditingTMediaUrl(t.mediaUrl || "")
                                setEditingTPosition(t.position ?? 1)
                              } else if (selectedTestimonialId === t.id) {
                                setSelectedTestimonialId(null)
                              }
                            }}
                            open={selectedTestimonialId === t.id}
                          >
                            <summary className={`flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5 ${selectedTestimonialId === t.id ? "bg-accent/10" : ""}`}>
                              <span className="text-balance">{t.name} ({t.age}) — {t.text.slice(0, 40)}...</span>
                              <span className="text-muted-foreground" />
                            </summary>
                            <div className="px-3 pb-3 pt-1 space-y-3">
                              {/* Formulario de edición */}
                              <div className="space-y-2">
                                <Label htmlFor={`t-id-${t.id}`}>ID (no editable)</Label>
                                <Input id={`t-id-${t.id}`} value={editingTestimonialId} disabled aria-disabled="true" aria-label="ID" />
                                <p className="text-xs text-muted-foreground">Este campo no se puede editar.</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`t-position-${t.id}`}>Posición</Label>
                                  <Input id={`t-position-${t.id}`} type="number" min={1} value={editingTPosition} onChange={(e) => setEditingTPosition(Number(e.target.value) || 1)} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`t-rating-${t.id}`}>Rating (0-5)</Label>
                                  <Input id={`t-rating-${t.id}`} type="number" min={0} max={5} value={editingTRating} onChange={(e) => setEditingTRating(Number(e.target.value) || 0)} />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`t-name-${t.id}`}>Nombre</Label>
                                  <Input id={`t-name-${t.id}`} value={editingTName} onChange={(e) => setEditingTName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`t-age-${t.id}`}>Edad</Label>
                                  <Input id={`t-age-${t.id}`} type="number" min={0} value={editingTAge} onChange={(e) => setEditingTAge(Number(e.target.value) || 0)} />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`t-text-${t.id}`}>Texto</Label>
                                <Textarea id={`t-text-${t.id}`} value={editingTText} onChange={(e) => setEditingTText(e.target.value)} />
                              </div>
                              <MediaSectionCard title="Media" description="Imagen o vídeo del testimonio" compact>
                                <div className="w-full max-w-2xl">
                                  <MediaPicker
                                    label="Media (imagen o vídeo mp4)"
                                    scope="testimonials"
                                    entitySlug={t.id}
                                    value={editingTMediaUrl}
                                    accept="image/*,video/mp4"
                                    onChange={(url) => setEditingTMediaUrl(url ?? "")}
                                  />
                                </div>
                              </MediaSectionCard>
                              <div className="flex gap-2">
                                <Button onClick={handleSaveTestimonial} disabled={savingTestimonial} className="bg-primary text-primary-foreground">{savingTestimonial ? "Guardando..." : "Guardar"}</Button>
                                <Button variant="outline" onClick={() => {
                                  const original = testimonials.find((it) => it.id === t.id)
                                  if (!original) return
                                  setEditingTName(original.name)
                                  setEditingTAge(original.age)
                                  setEditingTRating(original.rating)
                                  setEditingTText(original.text)
                                  setEditingTMediaUrl(original.mediaUrl || "")
                                  setEditingTPosition(original.position ?? 1)
                                }}>Revertir</Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={deletingTestimonial}>{deletingTestimonial ? "Eliminando..." : "Eliminar"}</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Eliminar testimonio</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción es irreversible. Se eliminará el testimonio del contenido.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteTestimonial(t.id)} disabled={deletingTestimonial} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        {deletingTestimonial ? "Eliminando..." : "Eliminar"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </details>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Derecha: Visualización sincronizada, también plegada */}
              <Card>
                <CardHeader>
                  <CardTitle>Visualización de testimonios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md divide-y">
                    {/* Vista previa del nuevo testimonio (borrador) */}
                    <details open={selectedTestimonialId === "__new__"} className="group">
                      <summary className={`flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5 ${selectedTestimonialId === "__new__" ? "bg-accent/10" : ""}`}>
                        <span className="text-balance">{createTName || "(Nuevo)"} {createTAge ? `(${createTAge})` : ""} — {(createTText || "").slice(0, 40)}...</span>
                        <span className="text-muted-foreground" />
                      </summary>
                      <div className="px-3 pb-3 pt-1">
                        <TestimonialCard
                          name={createTName || "Nombre"}
                          age={createTAge || 0}
                          text={createTText || "Texto del testimonio"}
                          rating={createTRating || 5}
                          mediaUrl={createTMediaUrl || undefined}
                        />
                      </div>
                    </details>

                    {/* Vista previa de cada testimonio existente */}
                    {testimonials.map((t) => (
                      <details key={t.id} open={selectedTestimonialId === t.id} className="group">
                        <summary className={`flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5 ${selectedTestimonialId === t.id ? "bg-accent/10" : ""}`}>
                          <span className="text-balance">{t.name} ({t.age}) — {t.text.slice(0, 40)}...</span>
                          <span className="text-muted-foreground" />
                        </summary>
                        <div className="px-3 pb-3 pt-1">
                          <TestimonialCard
                            name={selectedTestimonialId === t.id ? (editingTName || t.name) : t.name}
                            age={selectedTestimonialId === t.id ? (editingTAge || t.age) : t.age}
                            text={selectedTestimonialId === t.id ? (editingTText || t.text) : t.text}
                            rating={selectedTestimonialId === t.id ? (editingTRating || t.rating) : t.rating}
                            mediaUrl={selectedTestimonialId === t.id ? ((editingTMediaUrl || t.mediaUrl) || undefined) : t.mediaUrl}
                          />
                        </div>
                      </details>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-6">
            <div className="space-y-8">
              {/* Guías */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Izquierda: Crear y editar Guías */}
                <Card>
                  <CardHeader>
                    <CardTitle>Guías (crear/editar)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Crear nueva guía */}
                    <details className="group" onToggle={(e) => setOpenGuidesDraftPreview((e.currentTarget as HTMLDetailsElement).open)}>
                      <summary className="flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium rounded-md hover:bg-accent/5 group-open:bg-accent/10">
                        <span>Crear nueva guía</span>
                        <span className="text-xs text-muted-foreground group-open:hidden">+</span>
                        <span className="text-xs text-muted-foreground hidden group-open:inline">-</span>
                      </summary>
                      <div className="space-y-3 border rounded-md p-3 mt-2">
                        <div className="space-y-2">
                          <Label htmlFor="new-guide-title">Título</Label>
                          <Input id="new-guide-title" value={cgTitle} onChange={(e) => setCgTitle(e.target.value)} placeholder="Título de la guía" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-guide-mini">Mini-descripción</Label>
                          <Textarea id="new-guide-mini" value={cgMini} onChange={(e) => setCgMini(e.target.value)} placeholder="Mini-descripción (frente de la tarjeta)" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-guide-features">Características (una por línea o separadas por coma)</Label>
                          <Textarea id="new-guide-features" value={cgFeaturesText} onChange={(e) => setCgFeaturesText(e.target.value)} placeholder={"Ej.: • PDF descargable\n• Ejercicios prácticos\n• Consejos expertos"} />
                        </div>
                      <MediaSectionCard title="Media / Archivos" compact>
                        <div className="w-full max-w-2xl space-y-4">
                          {cgTitle.trim() ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <MediaPicker
                                label="Portada (imagen)"
                                scope="products"
                                productSubscope="guides"
                                entitySlug={escapeProductSlug(cgTitle)}
                                value={cgCoverImageUrl}
                                accept="image/*"
                                onChange={(url) => setCgCoverImageUrl(url ?? "")}
                              />
                              <MediaPicker
                                label="Archivo (PDF)"
                                scope="products"
                                productSubscope="guides"
                                entitySlug={escapeProductSlug(cgTitle)}
                                value={cgFileUrl}
                                accept="application/pdf"
                                onChange={(url) => setCgFileUrl(url ?? "")}
                              />
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">Escribe un título para habilitar la subida de archivos.</div>
                          )}

                          <div className="flex items-center justify-between gap-3">
                            <Label htmlFor="how-it-works-url-advanced-create" className="text-sm">Avanzado</Label>
                            <Switch
                              id="how-it-works-url-advanced-create"
                              checked={howItWorksUrlAdvanced}
                              onCheckedChange={(v) => setHowItWorksUrlAdvanced(Boolean(v))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="new-guide-file">URL del archivo (PDF)</Label>
                            <Input
                              id="new-guide-file"
                              value={cgFileUrl}
                              onChange={(e) => setCgFileUrl(e.target.value)}
                              placeholder="/fake.pdf"
                              readOnly={!howItWorksUrlAdvanced}
                            />
                            {cgFileUrlInvalid ? (
                              <p className="text-xs text-destructive">La URL debe empezar por / o por https://</p>
                            ) : null}
                          </div>
                        </div>
                      </MediaSectionCard>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="new-guide-price">Precio (€)</Label>
                            <Input id="new-guide-price" type="number" value={cgPrice} onChange={(e) => setCgPrice(Number(e.target.value) || 0)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-guide-position">Posición</Label>
                            <Input id="new-guide-position" type="number" min={1} value={cgPosition} onChange={(e) => setCgPosition(Number(e.target.value) || 1)} />
                            <p className="text-[11px] text-muted-foreground">Se normaliza automáticamente al guardar.</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-guide-synopsis">Sinopsis (cara trasera)</Label>
                          <Textarea id="new-guide-synopsis" value={cgSynopsis} onChange={(e) => setCgSynopsis(e.target.value)} placeholder="Texto de sinopsis" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 items-end">
                          <div className="space-y-2">
                            <Label>Featured spot (Cómo funciona)</Label>
                            <Select onValueChange={(v) => setCgFeaturedSpot(v === "none" ? undefined : Number(v))}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sin featured" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Sin featured</SelectItem>
                                <SelectItem value="1">Izquierda (1)</SelectItem>
                                <SelectItem value="2">Centro (2)</SelectItem>
                                <SelectItem value="3">Derecha (3)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="new-guide-pop" checked={cgMostPopular} onCheckedChange={(c) => setCgMostPopular(!!c)} />
                            <Label htmlFor="new-guide-pop">Más popular</Label>
                          </div>
                        </div>
                      <Button onClick={handleCreateGuide} disabled={creatingGuide || cgFileUrlInvalid} className="bg-primary text-primary-foreground">{creatingGuide ? "Creando..." : "Crear guía"}</Button>
                      </div>
                    </details>

                    {/* Lista de guías */}
                    {guides.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No hay guías todavía.</p>
                    ) : (
                      <div className="border rounded-md divide-y">
                        {guides.map((g) => (
                          <details
                            key={g.id}
                            className="group"
                            onToggle={(e) => {
                              const opened = (e.currentTarget as HTMLDetailsElement).open
                              if (opened) {
                                setSelectedGuideId(g.id)
                                setEgId(g.id)
                                setEgTitle(g.title)
                                setEgMini(g.miniDescription)
                                setEgPrice(g.price)
                                setEgFeaturesText(g.features.join("\n"))
                                setEgFileUrl(g.fileUrl)
                                setEgCoverImageUrl(g.coverImageUrl || "")
                                setEgSynopsis(g.synopsis)
                                setEgPosition(g.position)
                                setEgFeaturedSpot(g.featuredSpot)
                                setEgMostPopular(Boolean(g.mostPopular))
                              } else if (selectedGuideId === g.id) {
                                setSelectedGuideId(null)
                              }
                            }}
                            open={selectedGuideId === g.id}
                          >
                            <summary className={`flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5 ${selectedGuideId === g.id ? "bg-accent/10" : ""}`}>
                              <span className="text-balance">{g.title} — €{g.price}</span>
                              <span className="text-muted-foreground" />
                            </summary>
                            <div className="px-3 pb-3 pt-1 space-y-3">
                              {selectedGuideId === g.id ? (
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <Label>ID (no editable)</Label>
                                    <Input value={egId} disabled aria-disabled="true" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <Label>Posición</Label>
                                      <Input type="number" min={1} value={egPosition} onChange={(e) => setEgPosition(Number(e.target.value) || 1)} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Precio (€)</Label>
                                      <Input type="number" value={egPrice} onChange={(e) => setEgPrice(Number(e.target.value) || 0)} />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Título</Label>
                                    <Input value={egTitle} onChange={(e) => setEgTitle(e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Mini-descripción</Label>
                                    <Textarea value={egMini} onChange={(e) => setEgMini(e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Características</Label>
                                    <Textarea value={egFeaturesText} onChange={(e) => setEgFeaturesText(e.target.value)} />
                                  </div>
                                  <MediaSectionCard title="Media / Archivos" compact>
                                    <div className="w-full max-w-2xl space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <MediaPicker
                                          label="Portada (imagen)"
                                          scope="products"
                                          productSubscope="guides"
                                          entitySlug={egId || g.id}
                                          value={egCoverImageUrl}
                                          accept="image/*"
                                          onChange={(url) => setEgCoverImageUrl(url ?? "")}
                                        />
                                        <MediaPicker
                                          label="Archivo (PDF)"
                                          scope="products"
                                          productSubscope="guides"
                                          entitySlug={egId || g.id}
                                          value={egFileUrl}
                                          accept="application/pdf"
                                          onChange={(url) => setEgFileUrl(url ?? "")}
                                        />
                                      </div>

                                      <div className="flex items-center justify-between gap-3">
                                        <Label htmlFor="how-it-works-url-advanced-edit" className="text-sm">Avanzado</Label>
                                        <Switch
                                          id="how-it-works-url-advanced-edit"
                                          checked={howItWorksUrlAdvanced}
                                          onCheckedChange={(v) => setHowItWorksUrlAdvanced(Boolean(v))}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label>URL del archivo (PDF)</Label>
                                        <Input
                                          value={egFileUrl}
                                          onChange={(e) => setEgFileUrl(e.target.value)}
                                          readOnly={!howItWorksUrlAdvanced}
                                        />
                                        {egFileUrlInvalid ? (
                                          <p className="text-xs text-destructive">La URL debe empezar por / o por https://</p>
                                        ) : null}
                                      </div>
                                    </div>
                                  </MediaSectionCard>
                                  <div className="space-y-2">
                                    <Label>Sinopsis</Label>
                                    <Textarea value={egSynopsis} onChange={(e) => setEgSynopsis(e.target.value)} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 items-end">
                                    <div className="space-y-2">
                                      <Label>Featured spot</Label>
                                      <Select value={String(egFeaturedSpot ?? "none")} onValueChange={(v) => setEgFeaturedSpot(v === "none" ? undefined : Number(v))}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Sin featured" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="none">Sin featured</SelectItem>
                                          <SelectItem value="1">Izquierda (1)</SelectItem>
                                          <SelectItem value="2">Centro (2)</SelectItem>
                                          <SelectItem value="3">Derecha (3)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox id={`guide-pop-${g.id}`} checked={egMostPopular} onCheckedChange={(c) => setEgMostPopular(!!c)} />
                                      <Label htmlFor={`guide-pop-${g.id}`}>Más popular</Label>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 flex-wrap">
                                    <Button onClick={handleSaveGuide} disabled={savingGuide || egFileUrlInvalid} className="bg-primary text-primary-foreground">{savingGuide ? "Guardando..." : "Guardar"}</Button>
                                    <Button variant="outline" onClick={() => {
                                      const original = guides.find((it) => it.id === g.id)
                                      if (!original) return
                                      setEgTitle(original.title)
                                      setEgMini(original.miniDescription)
                                      setEgPrice(original.price)
                                      setEgFeaturesText(original.features.join("\n"))
                                      setEgFileUrl(original.fileUrl)
                                      setEgCoverImageUrl(original.coverImageUrl || "")
                                      setEgSynopsis(original.synopsis)
                                      setEgPosition(original.position)
                                      setEgFeaturedSpot(original.featuredSpot)
                                      setEgMostPopular(Boolean(original.mostPopular))
                                    }}>Revertir</Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" disabled={deletingGuide}>{deletingGuide ? "Eliminando..." : "Eliminar"}</Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Eliminar guía</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Esta acción es irreversible. Se eliminará la guía del contenido.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteGuide(g.id)}>Eliminar</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </details>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Derecha: Vista previa de Guías */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vista previa (Guías)</CardTitle>
                    <CardAction>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="toggle-guides-back" className="text-xs text-muted-foreground">Ver reverso</Label>
                        <Switch id="toggle-guides-back" checked={showGuidesBack} onCheckedChange={(v) => setShowGuidesBack(Boolean(v))} />
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md divide-y">
                      {/* Vista previa del borrador */}
                      <details className="group" open={openGuidesDraftPreview}>
                        <summary className="flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5">
                          <span className="text-balance">(Borrador) {cgTitle || "Nueva guía"} — €{cgPrice || 0}</span>
                          <span className="text-muted-foreground" />
                        </summary>
                        <div className="px-3 pb-3 pt-1">
                          <PricingCard
                            title={cgTitle || "Título"}
                            description={cgMini || "Mini-descripción"}
                            price={String(Number(cgPrice || 0))}
                            features={cgFeaturesText.split(/\n|,/).map((s) => s.trim()).filter(Boolean)}
                            ctaText="Descargar ahora"
                            ctaHref={cgFileUrl || "/fake.pdf"}
                            popular={cgMostPopular}
                            flipOnHover
                            initialFlipped={showGuidesBack}
                            backSynopsis={cgSynopsis || "Sinopsis de la guía"}
                            backCoverSrc={cgCoverImageUrl || "/logo2.webp"}
                            forceSimpleFlip
                          />
                        </div>
                      </details>

                      {/* Vista previa de cada guía existente */}
                      {guides.map((g) => (
                        <details key={g.id} open={selectedGuideId === g.id} className="group">
                          <summary className={`flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5 ${selectedGuideId === g.id ? "bg-accent/10" : ""}`}>
                            <span className="text-balance">{g.title} — €{g.price}</span>
                            <span className="text-muted-foreground" />
                          </summary>
                          <div className="px-3 pb-3 pt-1">
                            <PricingCard
                              title={selectedGuideId === g.id ? (egTitle || g.title) : g.title}
                              description={selectedGuideId === g.id ? (egMini || g.miniDescription) : g.miniDescription}
                              price={String(selectedGuideId === g.id ? Number(egPrice || g.price) : g.price)}
                              features={selectedGuideId === g.id ? (egFeaturesText.split(/\n|,/).map((s) => s.trim()).filter(Boolean)) : g.features}
                              ctaText="Descargar ahora"
                              ctaHref={selectedGuideId === g.id ? (egFileUrl || g.fileUrl) : g.fileUrl}
                              popular={selectedGuideId === g.id ? Boolean(egMostPopular) : Boolean(g.mostPopular)}
                              flipOnHover
                              initialFlipped={showGuidesBack}
                              backSynopsis={selectedGuideId === g.id ? (egSynopsis || g.synopsis) : g.synopsis}
                              backCoverSrc={
                                selectedGuideId === g.id
                                  ? ((egCoverImageUrl || g.coverImageUrl) || "/logo2.webp")
                                  : (g.coverImageUrl || "/logo2.webp")
                              }
                              forceSimpleFlip
                            />
                          </div>
                        </details>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sesiones */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Izquierda: Crear y editar Sesiones */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sesiones (crear/editar)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Crear nueva sesión */}
                    <details className="group" onToggle={(e) => setOpenSessionsDraftPreview((e.currentTarget as HTMLDetailsElement).open)}>
                      <summary className="flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium rounded-md hover:bg-accent/5 group-open:bg-accent/10">
                        <span>Crear nueva sesión</span>
                        <span className="text-xs text-muted-foreground group-open:hidden">+</span>
                        <span className="text-xs text-muted-foreground hidden group-open:inline">-</span>
                      </summary>
                      <div className="space-y-3 border rounded-md p-3 mt-2">
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Select value={csSubtype} onValueChange={(v) => setCsSubtype(v as any)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Sesión individual</SelectItem>
                              <SelectItem value="program4">Programa 4 semanas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-session-title">Título</Label>
                          <Input id="new-session-title" value={csTitle} onChange={(e) => setCsTitle(e.target.value)} placeholder="Título de la sesión" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-session-desc">Descripción</Label>
                          <Textarea id="new-session-desc" value={csDesc} onChange={(e) => setCsDesc(e.target.value)} placeholder="Descripción (texto principal)" />
                        </div>
                        <MediaSectionCard title="Media / Archivos" compact>
                          <div className="w-full max-w-2xl">
                            {csTitle.trim() ? (
                              <MediaPicker
                                label="Imagen"
                                scope="products"
                                productSubscope="sessions"
                                entitySlug={escapeProductSlug(csTitle)}
                                value={csImageUrl}
                                accept="image/*"
                                onChange={(url) => setCsImageUrl(url ?? "")}
                              />
                            ) : (
                              <div className="text-xs text-muted-foreground">Escribe un título para habilitar la subida de imagen.</div>
                            )}
                          </div>
                        </MediaSectionCard>
                        <div className="space-y-2">
                          <Label htmlFor="new-session-features">Características (una por línea o separadas por coma)</Label>
                          <Textarea id="new-session-features" value={csFeaturesText} onChange={(e) => setCsFeaturesText(e.target.value)} placeholder={"Ej.: • 60 minutos\n• Soporte por email\n• Material de trabajo"} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="new-session-price">Precio (€)</Label>
                            <Input id="new-session-price" type="number" value={csPrice} onChange={(e) => setCsPrice(Number(e.target.value) || 0)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-session-position">Posición</Label>
                            <Input id="new-session-position" type="number" min={1} value={csPosition} onChange={(e) => setCsPosition(Number(e.target.value) || 1)} />
                            <p className="text-[11px] text-muted-foreground">Se normaliza automáticamente al guardar.</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-session-notes">Notas importantes (clarificación)</Label>
                          <Textarea id="new-session-notes" value={csNotes} onChange={(e) => setCsNotes(e.target.value)} placeholder="Ej.: No soy psicólogo, sino coach..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-session-addon">Addon (solo para programa 4 semanas)</Label>
                          <Input id="new-session-addon" value={csAddon} onChange={(e) => setCsAddon(e.target.value)} placeholder="Ej.: 2 sesiones extra de seguimiento" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 items-end">
                          <div className="space-y-2">
                            <Label>Featured spot (Cómo funciona)</Label>
                            <Select value={String(csFeaturedSpot ?? "none")} onValueChange={(v) => setCsFeaturedSpot(v === "none" ? undefined : Number(v))}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sin featured" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Sin featured</SelectItem>
                                <SelectItem value="1">Izquierda (1)</SelectItem>
                                <SelectItem value="2">Centro (2)</SelectItem>
                                <SelectItem value="3">Derecha (3)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="new-session-pop" checked={csMostPopular} onCheckedChange={(c) => setCsMostPopular(!!c)} />
                            <Label htmlFor="new-session-pop">Más popular</Label>
                          </div>
                        </div>
                        <Button onClick={handleCreateSession} disabled={creatingSession} className="bg-primary text-primary-foreground">{creatingSession ? "Creando..." : "Crear sesión"}</Button>
                      </div>
                    </details>

                    {/* Lista de sesiones */}
                    {sessions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No hay sesiones todavía.</p>
                    ) : (
                      <div className="border rounded-md divide-y">
                        {sessions.map((s) => (
                          <details
                            key={s.id}
                            className="group"
                            onToggle={(e) => {
                              const opened = (e.currentTarget as HTMLDetailsElement).open
                              if (opened) {
                                setSelectedSessionId(s.id)
                                setEsId(s.id)
                                setEsSubtype(s.subtype)
                                setEsTitle(s.title)
                                setEsDesc(s.description)
                                setEsPrice(s.price)
                                setEsFeaturesText(s.features.join("\n"))
                                setEsImageUrl(s.imageUrl || "")
                                setEsNotes(s.notes || "")
                                setEsAddon(s.addon || "")
                                setEsPosition(s.position)
                                setEsFeaturedSpot(s.featuredSpot)
                                setEsMostPopular(Boolean(s.mostPopular))
                              } else if (selectedSessionId === s.id) {
                                setSelectedSessionId(null)
                              }
                            }}
                            open={selectedSessionId === s.id}
                          >
                            <summary className={`flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5 ${selectedSessionId === s.id ? "bg-accent/10" : ""}`}>
                              <span className="text-balance">{s.title} — €{s.price}</span>
                              <span className="text-muted-foreground" />
                            </summary>
                            <div className="px-3 pb-3 pt-1 space-y-3">
                              {selectedSessionId === s.id ? (
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <Label>ID (no editable)</Label>
                                    <Input value={esId} disabled aria-disabled="true" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <Label>Tipo</Label>
                                      <Select value={esSubtype} onValueChange={(v) => setEsSubtype(v as any)}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Selecciona tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="individual">Sesión individual</SelectItem>
                                          <SelectItem value="program4">Programa 4 semanas</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Posición</Label>
                                      <Input type="number" min={1} value={esPosition} onChange={(e) => setEsPosition(Number(e.target.value) || 1)} />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Título</Label>
                                    <Input value={esTitle} onChange={(e) => setEsTitle(e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Descripción</Label>
                                    <Textarea value={esDesc} onChange={(e) => setEsDesc(e.target.value)} />
                                  </div>
                                  <MediaSectionCard title="Media / Archivos" compact>
                                    <div className="w-full max-w-2xl">
                                      <MediaPicker
                                        label="Imagen"
                                        scope="products"
                                        productSubscope="sessions"
                                        entitySlug={esId || s.id}
                                        value={esImageUrl}
                                        accept="image/*"
                                        onChange={(url) => setEsImageUrl(url ?? "")}
                                      />
                                    </div>
                                  </MediaSectionCard>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <Label>Precio (€)</Label>
                                      <Input type="number" value={esPrice} onChange={(e) => setEsPrice(Number(e.target.value) || 0)} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Addon (solo program4)</Label>
                                      <Input value={esAddon} onChange={(e) => setEsAddon(e.target.value)} />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Características</Label>
                                    <Textarea value={esFeaturesText} onChange={(e) => setEsFeaturesText(e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Notas importantes</Label>
                                    <Textarea value={esNotes} onChange={(e) => setEsNotes(e.target.value)} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 items-end">
                                    <div className="space-y-2">
                                      <Label>Featured spot</Label>
                                      <Select value={String(esFeaturedSpot ?? "none")} onValueChange={(v) => setEsFeaturedSpot(v === "none" ? undefined : Number(v))}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Sin featured" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="none">Sin featured</SelectItem>
                                          <SelectItem value="1">Izquierda (1)</SelectItem>
                                          <SelectItem value="2">Centro (2)</SelectItem>
                                          <SelectItem value="3">Derecha (3)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox id={`session-pop-${s.id}`} checked={esMostPopular} onCheckedChange={(c) => setEsMostPopular(!!c)} />
                                      <Label htmlFor={`session-pop-${s.id}`}>Más popular</Label>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 flex-wrap">
                                    <Button onClick={handleSaveSession} disabled={savingSession} className="bg-primary text-primary-foreground">{savingSession ? "Guardando..." : "Guardar"}</Button>
                                    <Button variant="outline" onClick={() => {
                                      const original = sessions.find((it) => it.id === s.id)
                                      if (!original) return
                                      setEsSubtype(original.subtype)
                                      setEsTitle(original.title)
                                      setEsDesc(original.description)
                                      setEsPrice(original.price)
                                      setEsFeaturesText(original.features.join("\n"))
                                      setEsImageUrl(original.imageUrl || "")
                                      setEsNotes(original.notes || "")
                                      setEsAddon(original.addon || "")
                                      setEsPosition(original.position)
                                      setEsFeaturedSpot(original.featuredSpot)
                                      setEsMostPopular(Boolean(original.mostPopular))
                                    }}>Revertir</Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" disabled={deletingSession}>{deletingSession ? "Eliminando..." : "Eliminar"}</Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Eliminar sesión</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Esta acción es irreversible. Se eliminará la sesión del contenido.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteSession(s.id)}>Eliminar</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </details>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Derecha: Vista previa de Sesiones */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vista previa (Sesiones)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md divide-y">
                      {/* Vista previa del borrador */}
                      <details className="group" open={openSessionsDraftPreview}>
                        <summary className="flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5">
                          <span className="text-balance">(Borrador) {csTitle || "Nueva sesión"} — €{csPrice || 0}</span>
                          <span className="text-muted-foreground" />
                        </summary>
                        <div className="px-3 pb-3 pt-1">
                          {/* Card que replica exactamente la de la home */}
                          <Card className={`relative ${csSubtype === "program4" ? "border-primary" : ""} group flex flex-col h-full`}>
                            {csSubtype === "program4" && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-primary text-primary-foreground relative flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full red-dot-pulse relative"></div>
                                  Más Popular
                                </Badge>
                              </div>
                            )}
                            <CardHeader>
                              <CardTitle className="text-2xl">{csTitle || "Título"}</CardTitle>
                              <CardDescription className="text-base">{csDesc || "Descripción"}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2 text-sm">{csSubtype === "program4" ? "Incluye:" : "Qué incluye:"}</h4>
                                <ul className={csSubtype === "program4" ? "space-y-2" : "space-y-1"}>
                                  {csFeaturesText.split(/\n|,/).map((s) => s.trim()).filter(Boolean).slice(0, csSubtype === "program4" ? undefined : 4).map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      {csSubtype === "program4" ? (
                                        <div>
                                          <span className="text-xs font-medium">{item}</span>
                                        </div>
                                      ) : (
                                        <span className="text-xs">{item}</span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {!!csAddon && csSubtype === "program4" && (
                                <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                                  <p className="text-xs"><strong>Addon:</strong> {csAddon}</p>
                                </div>
                              )}
                              {!!csNotes && (
                                <div className="bg-blue-50 p-2 rounded text-center">
                                  <p className="text-xs text-blue-700"><strong>Notas importantes:</strong> {csNotes}</p>
                                </div>
                              )}
                              <div className="bg-secondary/30 p-3 rounded-lg mt-auto">
                                <div className="text-center mb-2">
                                  <div className="text-xl font-bold">€{csPrice || 0}</div>
                                  {csSubtype === "individual" && (
                                    <p className="text-xs text-muted-foreground">Precio por sesión individual</p>
                                  )}
                                </div>
                                <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                                  {csSubtype === "program4" ? "Empezar programa" : "Reservar ahora"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </details>

                      {/* Vista previa de cada sesión */}
                      {sessions.map((s) => (
                        <details key={s.id} open={selectedSessionId === s.id} className="group">
                          <summary className={`flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5 ${selectedSessionId === s.id ? "bg-accent/10" : ""}`}>
                            <span className="text-balance">{s.title} — €{s.price}</span>
                            <span className="text-muted-foreground" />
                          </summary>
                          <div className="px-3 pb-3 pt-1">
                            <Card className={`relative ${(selectedSessionId === s.id ? esSubtype : s.subtype) === "program4" ? "border-primary" : ""} group flex flex-col h-full`}>
                              {(selectedSessionId === s.id ? esSubtype : s.subtype) === "program4" && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                  <Badge className="bg-primary text-primary-foreground relative flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full red-dot-pulse relative"></div>
                                    Más Popular
                                  </Badge>
                                </div>
                              )}
                              <CardHeader>
                                <CardTitle className="text-2xl">{selectedSessionId === s.id ? (esTitle || s.title) : s.title}</CardTitle>
                                <CardDescription className="text-base">{selectedSessionId === s.id ? (esDesc || s.description) : s.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="flex-1 flex flex-col space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2 text-sm">{(selectedSessionId === s.id ? esSubtype : s.subtype) === "program4" ? "Incluye:" : "Qué incluye:"}</h4>
                                  <ul className={(selectedSessionId === s.id ? esSubtype : s.subtype) === "program4" ? "space-y-2" : "space-y-1"}>
                                    {(selectedSessionId === s.id ? esFeaturesText.split(/\n|,/).map((x) => x.trim()).filter(Boolean) : s.features).slice(0, (selectedSessionId === s.id ? (esSubtype === "program4" ? undefined : 4) : (s.subtype === "program4" ? undefined : 4))).map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        {(selectedSessionId === s.id ? esSubtype : s.subtype) === "program4" ? (
                                          <div>
                                            <span className="text-xs font-medium">{item}</span>
                                          </div>
                                        ) : (
                                          <span className="text-xs">{item}</span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                {(selectedSessionId === s.id ? (esSubtype === "program4" && !!esAddon) : (s.subtype === "program4" && !!s.addon)) && (
                                  <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                                    <p className="text-xs"><strong>Addon:</strong> {selectedSessionId === s.id ? esAddon : (s.addon || "")}</p>
                                  </div>
                                )}
                                {(selectedSessionId === s.id ? !!esNotes : !!s.notes) && (
                                  <div className="bg-blue-50 p-2 rounded text-center">
                                    <p className="text-xs text-blue-700"><strong>Notas importantes:</strong> {selectedSessionId === s.id ? esNotes : (s.notes || "")}</p>
                                  </div>
                                )}
                                <div className="bg-secondary/30 p-3 rounded-lg mt-auto">
                                  <div className="text-center mb-2">
                                    <div className="text-xl font-bold">€{selectedSessionId === s.id ? (Number(esPrice || s.price)) : s.price}</div>
                                    {(selectedSessionId === s.id ? esSubtype : s.subtype) === "individual" && (
                                      <p className="text-xs text-muted-foreground">Precio por sesión individual</p>
                                    )}
                                  </div>
                                  <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                                    {(selectedSessionId === s.id ? esSubtype : s.subtype) === "program4" ? "Empezar programa" : "Reservar ahora"}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </details>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Editar Sobre mí</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="about-title">Título</Label>
                    <Input id="about-title" placeholder="Título" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about-description">Descripción</Label>
                    <Textarea id="about-description" placeholder="Descripción" value={aboutDescription} onChange={(e) => setAboutDescription(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about-credentials">Credenciales (una por línea)</Label>
                    <Textarea id="about-credentials" placeholder={"Credenciales (una por línea)"} value={aboutCredentialsText} onChange={(e) => setAboutCredentialsText(e.target.value)} />
                  </div>
                  <MediaSectionCard title="Media" description="Vídeo y póster de la sección" compact>
                    <div className="w-full max-w-2xl overflow-hidden [&_video]:max-h-48 [&_video]:w-full [&_video]:object-contain">
                      <MediaPicker
                        label="Video (mp4)"
                        scope="about"
                        value={aboutVideoUrl}
                        accept="video/mp4"
                        onChange={(url) => setAboutVideoUrl(url ?? "")}
                      />
                    </div>
                    <div className="w-full max-w-2xl overflow-hidden [&_img]:max-h-48">
                      <MediaPicker
                        label="Poster (imagen)"
                        scope="about"
                        value={aboutPosterImageUrl}
                        accept="image/*"
                        onChange={(url) => setAboutPosterImageUrl(url ?? "")}
                      />
                    </div>
                  </MediaSectionCard>
                  <Button onClick={handleSaveAbout} disabled={savingAbout} className="bg-primary text-primary-foreground">
                    {savingAbout ? "Guardando..." : "Guardar"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vista previa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aboutVideoUrl ? (
                      <div className="rounded-md border overflow-hidden">
                        <video
                          className="w-full max-h-64 object-contain"
                          controls
                          src={aboutVideoUrl}
                          poster={aboutPosterImageUrl || undefined}
                        />
                      </div>
                    ) : aboutPosterImageUrl ? (
                      <div className="rounded-md border overflow-hidden">
                        <img className="w-full max-h-64 object-contain" src={aboutPosterImageUrl} alt="Media Sobre mí" />
                      </div>
                    ) : null}
                    <h3 className="text-xl font-semibold">{aboutTitle || "(Sin título)"}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{aboutDescription || "(Sin descripción)"}</p>
                    <div>
                      <p className="font-semibold mb-2">Credenciales</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {aboutCredentialsText
                          .split("\n")
                          .map((c) => c.trim())
                          .filter(Boolean)
                          .map((c, i) => (
                            <li key={i}>• {c}</li>
                          ))}
                      </ul>
                    </div>
                    <p className="text-xs text-muted-foreground">El video y el botón de reserva se muestran en la página principal.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Breaker Tab */}
          <TabsContent value="breaker" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Editar frase</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="breaker-kicker">Kicker</Label>
                    <Input
                      id="breaker-kicker"
                      placeholder="Un alto aquí"
                      value={breakerKicker}
                      onChange={(e) => setBreakerKicker(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breaker-text">Frase</Label>
                    <Textarea
                      id="breaker-text"
                      placeholder="Escribe una frase corta y contundente"
                      value={breakerText}
                      onChange={(e) => setBreakerText(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveBreaker} disabled={savingBreaker} className="bg-primary text-primary-foreground">
                    {savingBreaker ? "Guardando..." : "Guardar"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vista previa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mx-auto max-w-4xl">
                    <div className="relative rounded-2xl bg-background border border-border shadow-lg px-5 py-6 md:px-10 md:py-8 text-center">
                      <div aria-hidden className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-background border border-border border-b-0 border-r-0" />

                      <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1">
                        <span className="text-xs md:text-sm font-medium tracking-wide uppercase text-accent">{breakerKicker?.trim() || "Un alto aquí"}</span>
                      </div>

                      <p className="mt-4 text-xl md:text-3xl font-semibold tracking-tight text-balance text-foreground">
                        <span className="text-muted-foreground">&ldquo;</span>
                        <span className="px-1">{breakerText || "(Sin frase)"}</span>
                        <span className="text-muted-foreground">&rdquo;</span>
                      </p>

                      <div className="mt-5 flex justify-center">
                        <div className="h-px w-20 bg-border" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CTA Tab */}
          <TabsContent value="cta" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Editar CTA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta-title">Título</Label>
                    <Input id="cta-title" placeholder="Título" value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-description">Descripción</Label>
                    <Textarea id="cta-description" placeholder="Descripción" value={ctaDescription} onChange={(e) => setCtaDescription(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-button">Texto del botón</Label>
                    <Input id="cta-button" placeholder="Reservar sesión" value={ctaButtonText} onChange={(e) => setCtaButtonText(e.target.value)} />
                  </div>
                  <Button onClick={handleSaveCta} disabled={savingCta} className="bg-primary text-primary-foreground">
                    {savingCta ? "Guardando..." : "Guardar"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vista previa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-balance">{ctaTitle || "(Sin título)"}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{ctaDescription || "(Sin descripción)"}</p>
                    <div>
                      <Button className="w-full" size="lg">
                        {ctaButtonText || "CTA"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>FAQs (editar)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium rounded-md hover:bg-accent/5 group-open:bg-accent/10">
                       <span>Crear nueva FAQ</span>
                       <span className="text-xs text-muted-foreground group-open:hidden">+</span>
                       <span className="text-xs text-muted-foreground hidden group-open:inline">-</span>
                     </summary>
                     <div className="space-y-3 border rounded-md p-3 mt-2">
                       <div className="space-y-2">
                         <Label htmlFor="new-faq-question">Pregunta</Label>
                         <Input id="new-faq-question" value={createQuestion} onChange={(e) => setCreateQuestion(e.target.value)} placeholder="Escribe la pregunta" />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="new-faq-answer">Respuesta</Label>
                         <Textarea id="new-faq-answer" value={createAnswer} onChange={(e) => setCreateAnswer(e.target.value)} placeholder="Escribe la respuesta" />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="new-faq-position">Posición</Label>
                         <Input id="new-faq-position" type="number" min={1} value={createPosition} onChange={(e) => setCreatePosition(Number(e.target.value) || 1)} />
                       </div>
                       <div className="text-xs text-muted-foreground">El ID se generará automáticamente.</div>
                       <Button onClick={handleCreateFaq} disabled={creatingFaq} className="bg-primary text-primary-foreground">{creatingFaq ? "Creando..." : "Crear"}</Button>
                     </div>
                   </details>
                  {/* Lista de preguntas con respuesta plegada/desplegable y edición solo de la seleccionada */}
                  <div>
                    {faqItems.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No hay FAQs disponibles.</p>
                    ) : (
                      <div className="border rounded-md divide-y">
                        {faqItems.map((item) => (
                          <details
                            key={item.id}
                            className="group"
                            onToggle={(e) => {
                              const opened = (e.currentTarget as HTMLDetailsElement).open
                              if (opened) {
                                setSelectedFaqId(item.id)
                                setEditingQuestion(item.question)
                                setEditingAnswer(item.answer)
                                setEditingPosition(item.position ?? 1)
                                setEditingId(item.id)
                              } else if (selectedFaqId === item.id) {
                                setSelectedFaqId(null)
                              }
                            }}
                            open={selectedFaqId === item.id}
                          >
                            <summary className={`flex cursor-pointer items-center justify-between p-3 text-left text-sm font-medium hover:bg-accent/5 ${selectedFaqId === item.id ? "bg-accent/10" : ""}`}>
                              <span className="text-balance">{item.question}</span>
                              <span className="text-muted-foreground" />
                            </summary>
                            <div className="px-3 pb-3 pt-1 space-y-3">
                              {selectedFaqId === item.id ? (
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <Label htmlFor={`faq-id-${item.id}`}>ID (no editable)</Label>
                                    <Input
                                      id={`faq-id-${item.id}`}
                                      value={editingId}
                                      disabled
                                      aria-disabled="true"
                                      aria-label="ID"
                                      title="ID de la FAQ (no editable)"
                                    />
                                    <p className="text-xs text-muted-foreground">Este campo no se puede editar.</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`faq-position-${item.id}`}>Posición</Label>
                                    <Input
                                      id={`faq-position-${item.id}`}
                                      value={editingPosition}
                                      onChange={(e) => setEditingPosition(Number(e.target.value) || 0)}
                                      type="number"
                                      min={1}
                                      aria-label="Posición"
                                      placeholder="Posición"
                                      title="Posición (editable, usado para orden futuro)"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`faq-question-${item.id}`}>Pregunta</Label>
                                    <Input
                                      id={`faq-question-${item.id}`}
                                      value={editingQuestion}
                                      onChange={(e) => setEditingQuestion(e.target.value)}
                                      placeholder="Pregunta"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`faq-answer-${item.id}`}>Respuesta</Label>
                                    <Textarea
                                      id={`faq-answer-${item.id}`}
                                      value={editingAnswer}
                                      onChange={(e) => setEditingAnswer(e.target.value)}
                                      placeholder="Respuesta"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={handleSaveFaq} disabled={savingFaq} className="bg-primary text-primary-foreground">{savingFaq ? "Guardando..." : "Guardar"}</Button>
                                    <Button variant="outline" onClick={() => {
                                      // Restablecer valores del item actual
                                      const original = faqItems.find((it) => it.id === item.id)
                                      if (!original) return
                                      setEditingQuestion(original.question)
                                      setEditingAnswer(original.answer)
                                      setEditingPosition(original.position ?? 1)
                                    }}>Revertir</Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" disabled={deletingFaq}>{deletingFaq ? "Eliminando..." : "Eliminar"}</Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Eliminar FAQ</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Esta acción es irreversible. Se eliminará la pregunta y su respuesta del contenido.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteFaq(item.id)} disabled={deletingFaq} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            {deletingFaq ? "Eliminando..." : "Eliminar"}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-muted-foreground text-pretty leading-relaxed whitespace-pre-line">{item.answer}</p>
                              )}
                            </div>
                          </details>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vista previa de FAQ</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedFaqId ? (
                    (() => {
                      const current = faqItems.find((it) => it.id === selectedFaqId)
                      if (!current) return <p className="text-sm text-muted-foreground">Selecciona una FAQ para ver la vista previa.</p>
                      return (
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-balance">{editingQuestion || current.question}</h3>
                          <p className="text-muted-foreground whitespace-pre-line text-pretty">{editingAnswer || current.answer}</p>
                          <div className="text-xs text-muted-foreground">
                            <p><span className="font-semibold">ID:</span> {editingId}</p>
                            <p><span className="font-semibold">Posición:</span> {editingPosition}</p>
                          </div>
                        </div>
                      )
                    })()
                  ) : (
                    <p className="text-sm text-muted-foreground">Selecciona una FAQ para ver la vista previa.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
