"use client"

import { useEffect, useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BookOpen, Search, Tag, Users, X } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

type DocAudience = "dev" | "user"
type DocCategory = "general" | "dev" | "user" | "ops"

type DocMeta = {
  slug: string
  title: string
  description: string
  category: DocCategory
  tags: string[]
  audience: DocAudience[]
  order: number
}

type Doc = DocMeta & { content: string }

const CATEGORY_LABEL: Record<DocCategory | "all", string> = {
  all: "Todas",
  general: "General",
  dev: "Desarrollo",
  user: "Usuario",
  ops: "Operaciones",
}

const AUDIENCE_LABEL: Record<DocAudience | "all", string> = {
  all: "Cualquiera",
  dev: "Desarrollador",
  user: "Usuario",
}

function highlight(text: string, query: string): React.ReactNode {
  const trimmed = query.trim()
  if (!trimmed) return text
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = text.split(new RegExp(`(${escaped})`, "ig"))
  return parts.map((part, idx) =>
    part.toLowerCase() === trimmed.toLowerCase() ? (
      <mark key={idx} className="bg-amber-200/60 rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      <span key={idx}>{part}</span>
    ),
  )
}

function matchesSearch(meta: DocMeta, body: string | undefined, q: string) {
  if (!q.trim()) return true
  const needle = q.trim().toLowerCase()
  const haystack = [
    meta.title,
    meta.description,
    meta.tags.join(" "),
    body || "",
  ]
    .join(" \n ")
    .toLowerCase()
  return haystack.includes(needle)
}

export function DocsTab() {
  const { toast } = useToast()
  const [docs, setDocs] = useState<DocMeta[]>([])
  const [bodies, setBodies] = useState<Record<string, string>>({})
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [activeDoc, setActiveDoc] = useState<Doc | null>(null)
  const [loadingList, setLoadingList] = useState(true)
  const [loadingDoc, setLoadingDoc] = useState(false)

  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<DocCategory | "all">("all")
  const [audience, setAudience] = useState<DocAudience | "all">("all")

  useEffect(() => {
    let cancelled = false
    setLoadingList(true)
    fetch("/api/docs")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ docs: DocMeta[] }>
      })
      .then((data) => {
        if (cancelled) return
        setDocs(data.docs)
        if (!activeSlug && data.docs[0]) setActiveSlug(data.docs[0].slug)
      })
      .catch((err) => {
        console.error("[DocsTab] list", err)
        if (!cancelled)
          toast({
            title: "No se pudo cargar la documentación",
            description: "Revisa tu sesión o vuelve a intentarlo.",
          })
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!activeSlug) {
      setActiveDoc(null)
      return
    }
    let cancelled = false
    setLoadingDoc(true)
    fetch(`/api/docs/${encodeURIComponent(activeSlug)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ doc: Doc }>
      })
      .then(({ doc }) => {
        if (cancelled) return
        setActiveDoc(doc)
        setBodies((prev) => ({ ...prev, [doc.slug]: doc.content }))
      })
      .catch((err) => {
        console.error("[DocsTab] doc", err)
        if (!cancelled)
          toast({
            title: "No se pudo cargar el documento",
            description: activeSlug,
          })
      })
      .finally(() => {
        if (!cancelled) setLoadingDoc(false)
      })
    return () => {
      cancelled = true
    }
  }, [activeSlug, toast])

  const filtered = useMemo(() => {
    return docs.filter((doc) => {
      if (category !== "all" && doc.category !== category) return false
      if (audience !== "all" && !doc.audience.includes(audience)) return false
      if (!matchesSearch(doc, bodies[doc.slug], query)) return false
      return true
    })
  }, [docs, query, category, audience, bodies])

  const groupedByCategory = useMemo(() => {
    const groups = new Map<DocCategory, DocMeta[]>()
    for (const doc of filtered) {
      const list = groups.get(doc.category) ?? []
      list.push(doc)
      groups.set(doc.category, list)
    }
    const order: DocCategory[] = ["general", "user", "dev", "ops"]
    return order
      .filter((cat) => groups.has(cat))
      .map((cat) => [cat, groups.get(cat)!] as const)
  }, [filtered])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="size-4" /> Documentación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar título, tag, contenido…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 pr-9"
                aria-label="Buscar documentos"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {(Object.keys(CATEGORY_LABEL) as Array<DocCategory | "all">).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-2 py-0.5 text-xs rounded-md border transition-colors ${
                      category === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {CATEGORY_LABEL[cat]}
                  </button>
                ),
              )}
            </div>

            <div className="flex flex-wrap gap-1 items-center">
              <Users className="size-3.5 text-muted-foreground" />
              {(Object.keys(AUDIENCE_LABEL) as Array<DocAudience | "all">).map(
                (aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setAudience(aud)}
                    className={`px-2 py-0.5 text-xs rounded-md border transition-colors ${
                      audience === aud
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {AUDIENCE_LABEL[aud]}
                  </button>
                ),
              )}
            </div>
          </div>

          <ScrollArea className="h-[60vh] pr-2">
            {loadingList ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                Sin resultados. Prueba a limpiar filtros.
              </p>
            ) : (
              <ul className="space-y-3">
                {groupedByCategory.map(([cat, items]) => (
                  <li key={cat}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 pb-1">
                      {CATEGORY_LABEL[cat]}
                    </p>
                    <ul className="space-y-1">
                      {items.map((doc) => {
                        const isActive = doc.slug === activeSlug
                        return (
                          <li key={doc.slug}>
                            <button
                              type="button"
                              onClick={() => setActiveSlug(doc.slug)}
                              className={`w-full text-left px-2 py-1.5 rounded-md text-sm border transition-colors ${
                                isActive
                                  ? "bg-accent/10 border-accent/40 text-foreground"
                                  : "bg-background border-transparent hover:bg-muted text-muted-foreground"
                              }`}
                            >
                              <span className="block font-medium text-foreground">
                                {highlight(doc.title, query)}
                              </span>
                              {doc.description && (
                                <span className="block text-xs text-muted-foreground line-clamp-2">
                                  {highlight(doc.description, query)}
                                </span>
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-base truncate">
                {activeDoc?.title || (loadingDoc ? "Cargando…" : "Selecciona un documento")}
              </CardTitle>
              {activeDoc?.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {activeDoc.description}
                </p>
              )}
            </div>
            {activeDoc && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(window.location.origin + "/dashboard?doc=" + activeDoc.slug)}
              >
                Copiar enlace
              </Button>
            )}
          </div>
          {activeDoc && (activeDoc.tags.length > 0 || activeDoc.audience.length > 0) && (
            <div className="flex flex-wrap gap-1.5 pt-3">
              {activeDoc.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  <Tag className="size-3" />
                  {tag}
                </Badge>
              ))}
              {activeDoc.audience.map((aud) => (
                <Badge key={aud} variant="outline">
                  {AUDIENCE_LABEL[aud]}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {loadingDoc ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : activeDoc ? (
            <article className="docs-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {activeDoc.content}
              </ReactMarkdown>
            </article>
          ) : (
            <p className="text-sm text-muted-foreground">
              Elige un documento del listado lateral para empezar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
