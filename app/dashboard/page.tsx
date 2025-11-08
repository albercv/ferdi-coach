"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { TestimonialCard } from "@/components/ui/testimonial-card"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [aboutTitle, setAboutTitle] = useState("")
  const [aboutDescription, setAboutDescription] = useState("")
  const [aboutCredentialsText, setAboutCredentialsText] = useState("")
  const [savingAbout, setSavingAbout] = useState(false)
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
  const [testimonials, setTestimonials] = useState<Array<{ id: string; position: number; name: string; age: number; rating: number; text: string; video?: string; image?: string }>>([])
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<string | null>(null)
  const [editingTestimonialId, setEditingTestimonialId] = useState<string>("")
  const [editingTName, setEditingTName] = useState("")
  const [editingTAge, setEditingTAge] = useState<number>(0)
  const [editingTRating, setEditingTRating] = useState<number>(5)
  const [editingTText, setEditingTText] = useState("")
  const [editingTVideo, setEditingTVideo] = useState("")
  const [editingTImage, setEditingTImage] = useState("")
  const [editingTPosition, setEditingTPosition] = useState<number>(1)
  const [savingTestimonial, setSavingTestimonial] = useState(false)
  const [creatingTestimonial, setCreatingTestimonial] = useState(false)
  const [deletingTestimonial, setDeletingTestimonial] = useState(false)
  const [createTName, setCreateTName] = useState("")
  const [createTAge, setCreateTAge] = useState<number>(0)
  const [createTRating, setCreateTRating] = useState<number>(5)
  const [createTText, setCreateTText] = useState("")
  const [createTVideo, setCreateTVideo] = useState("")
  const [createTImage, setCreateTImage] = useState("")
  const [createTPosition, setCreateTPosition] = useState<number>(1)

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const res = await fetch("/api/content/about", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load about content")
        const data = await res.json()
        setAboutTitle(data.title ?? "")
        setAboutDescription(data.description ?? "")
        setAboutCredentialsText(Array.isArray(data.credentials) ? data.credentials.join("\n") : "")
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
    loadAbout()
    loadFAQs()
    loadTestimonials()
  }, [toast])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  const handleSaveAbout = async () => {
    setSavingAbout(true)
    try {
      const credentials = aboutCredentialsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)

      const res = await fetch("/api/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: aboutTitle,
          description: aboutDescription,
          credentials,
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
        method: "PUT",
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
        video: editingTVideo || undefined,
        image: editingTImage || undefined,
        position: editingTPosition,
      }
      const res = await fetch("/api/content/testimonials", {
        method: "PUT",
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
        video: createTVideo || undefined,
        image: createTImage || undefined,
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
        setEditingTVideo(created.video || "")
        setEditingTImage(created.image || "")
        setEditingTPosition(created.position ?? 1)
      }
      setCreateTName("")
      setCreateTAge(0)
      setCreateTRating(5)
      setCreateTText("")
      setCreateTVideo("")
      setCreateTImage("")
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
        setEditingTVideo(next.video || "")
        setEditingTImage(next.image || "")
        setEditingTPosition(next.position ?? 1)
      } else {
        setSelectedTestimonialId(null)
        setEditingTestimonialId("")
        setEditingTName("")
        setEditingTAge(0)
        setEditingTRating(5)
        setEditingTText("")
        setEditingTVideo("")
        setEditingTImage("")
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
          <h1 className="text-3xl font-bold">Dashboard (Mock)</h1>
          <p className="text-muted-foreground">Este panel es un mockup sin funcionalidad real. Más adelante se securizará con Google Sign-In.</p>
          <div className="flex gap-3 mt-4">
            <Button asChild variant="outline">
              <Link href="/">Volver a Home</Link>
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="testimonials" className="">
          <TabsList className="bg-card text-foreground shadow-sm border rounded-md">
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">Sobre mí</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

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
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-t-video">Video (slug, sin .mp4)</Label>
                            <Input id="new-t-video" placeholder="p.ej. ferdy-presentation" value={createTVideo} onChange={(e) => setCreateTVideo(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-t-image">Imagen (slug, sin .png)</Label>
                            <Input id="new-t-image" placeholder="p.ej. hero-img-v2" value={createTImage} onChange={(e) => setCreateTImage(e.target.value)} />
                          </div>
                        </div>
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
                                setEditingTVideo(t.video || "")
                                setEditingTImage(t.image || "")
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
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`t-video-${t.id}`}>Video (slug)</Label>
                                  <Input id={`t-video-${t.id}`} value={editingTVideo} onChange={(e) => setEditingTVideo(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`t-image-${t.id}`}>Imagen (slug)</Label>
                                  <Input id={`t-image-${t.id}`} value={editingTImage} onChange={(e) => setEditingTImage(e.target.value)} />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleSaveTestimonial} disabled={savingTestimonial} className="bg-primary text-primary-foreground">{savingTestimonial ? "Guardando..." : "Guardar"}</Button>
                                <Button variant="outline" onClick={() => {
                                  const original = testimonials.find((it) => it.id === t.id)
                                  if (!original) return
                                  setEditingTName(original.name)
                                  setEditingTAge(original.age)
                                  setEditingTRating(original.rating)
                                  setEditingTText(original.text)
                                  setEditingTVideo(original.video || "")
                                  setEditingTImage(original.image || "")
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
                          video={createTVideo || undefined}
                          image={createTImage || undefined}
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
                            video={selectedTestimonialId === t.id ? ((editingTVideo || t.video) || undefined) : t.video}
                            image={selectedTestimonialId === t.id ? ((editingTImage || t.image) || undefined) : t.image}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crear producto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Nombre del producto (ebook, sesión, programa)" />
                  <Textarea placeholder="Descripción" />
                  <Input placeholder="Precio (€)" />
                  <Button disabled className="bg-primary text-primary-foreground">Guardar (mock)</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Productos actuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Ebook "Guía del Contacto Cero" — 0€</li>
                    <li>• Sesión Individual — 97€</li>
                    <li>• Programa 4 Semanas — 297€</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Editar "Sobre mí"</CardTitle>
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