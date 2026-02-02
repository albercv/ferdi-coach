"use client"

import { useEffect, useMemo, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { File, FileText, FileVideo, ExternalLink } from "lucide-react"

import type { ListObject } from "@/lib/media/storage/StorageAdapter"

const PREFIX_OPTIONS = [
  "/uploads",
  "/uploads/hero",
  "/uploads/about",
  "/uploads/testimonials",
  "/uploads/products",
  "/uploads/global",
] as const

function getLowercaseExtensionFromUrl(url: string): string {
  const lastDotIndex = url.lastIndexOf(".")
  if (lastDotIndex === -1) return ""
  const ext = url.slice(lastDotIndex + 1).trim().toLowerCase()
  if (!ext) return ""
  return ext
}

function isImageExt(ext: string) {
  return ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp" || ext === "avif"
}

function isVideoExt(ext: string) {
  return ext === "mp4"
}

function isPdfExt(ext: string) {
  return ext === "pdf"
}

function formatSizeBytes(size: number): string {
  if (!Number.isFinite(size)) return "-"
  if (size < 1024) return `${size} B`
  const kb = size / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(1)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(1)} GB`
}

function formatLastModified(lastModifiedMs: number): string {
  if (!Number.isFinite(lastModifiedMs) || lastModifiedMs <= 0) return "-"
  const date = new Date(lastModifiedMs)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleString()
}

function PreviewCell({ url }: { url: string }) {
  const ext = getLowercaseExtensionFromUrl(url)
  const isImage = isImageExt(ext)
  const isVideo = isVideoExt(ext)
  const isPdf = isPdfExt(ext)

  if (isImage) {
    return (
      <div className="flex items-center gap-2">
        <img src={url} alt="" className="h-10 w-10 rounded object-cover border" />
      </div>
    )
  }

  if (isVideo) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileVideo className="h-4 w-4" />
        <span className="text-xs">mp4</span>
      </div>
    )
  }

  if (isPdf) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span className="text-xs">pdf</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <File className="h-4 w-4" />
      <span className="text-xs">file</span>
    </div>
  )
}

export function MediaLibraryTab() {
  const [prefix, setPrefix] = useState<string>("/uploads")
  const [items, setItems] = useState<ListObject[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Record<string, boolean>>({})
  const [actionMsg, setActionMsg] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    setActionMsg(null)
    setActionError(null)
  }, [prefix])

  useEffect(() => {
    const controller = new AbortController()

    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/media/list?prefix=${encodeURIComponent(prefix)}`, {
          signal: controller.signal,
          cache: "no-store",
        })

        if (!res.ok) {
          let serverError: string | undefined
          try {
            const body = await res.json()
            if (body && typeof body.error === "string") {
              serverError = body.error
            }
          } catch {
            serverError = undefined
          }

          setItems([])
          setError(serverError ? `Error ${res.status}: ${serverError}` : `Error ${res.status} al listar assets`)
          return
        }

        const data = await res.json()
        if (!Array.isArray(data)) {
          setItems([])
          setError(`Error ${res.status}: respuesta inválida`)
          return
        }

        const parsed: ListObject[] = data
          .filter((x: any) => x && typeof x.url === "string")
          .map((x: any) => ({
            url: String(x.url),
            size: typeof x.size === "number" ? x.size : Number(x.size) || 0,
            mimeType: typeof x.mimeType === "string" ? x.mimeType : undefined,
            lastModifiedMs: typeof x.lastModifiedMs === "number" ? x.lastModifiedMs : Number(x.lastModifiedMs) || 0,
          }))

        setItems(parsed)
      } catch (e: any) {
        if (e?.name === "AbortError") return
        setItems([])
        setError(typeof e?.message === "string" ? e.message : "Error al listar assets")
      } finally {
        setLoading(false)
      }
    }

    void run()

    return () => {
      controller.abort()
    }
  }, [prefix])

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.url.localeCompare(b.url))
  }, [items])

  const handleDelete = async (url: string) => {
    setDeleting((prev) => ({ ...prev, [url]: true }))
    setActionMsg(null)
    setActionError(null)

    try {
      const res = await fetch("/api/media/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const json = await res.json().catch(() => null)

      if (res.ok && json?.deleted === true) {
        setItems((prev) => prev.filter((x) => x.url !== url))
        setActionMsg("Archivo borrado.")
        setActionError(null)
        return
      }

      if ((json?.deleted === false && json?.reason === "still-referenced") || res.status === 409) {
        setActionMsg(null)
        setActionError("No se puede borrar: está referenciado en contenido.")
        return
      }

      setActionMsg(null)
      setActionError("No se pudo borrar el archivo.")
    } catch {
      setActionMsg(null)
      setActionError("No se pudo borrar el archivo.")
    } finally {
      setDeleting((prev) => {
        const next = { ...prev }
        delete next[url]
        return next
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>Lista assets bajo /uploads por prefix</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Prefix</Label>
            <Select value={prefix} onValueChange={setPrefix}>
              <SelectTrigger className="w-full sm:w-[360px]">
                <SelectValue placeholder="Selecciona un prefix" />
              </SelectTrigger>
              <SelectContent>
                {PREFIX_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <LoadingSpinner size="sm" />
              <span>Cargando…</span>
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          {actionMsg && (
            <div className="text-sm text-emerald-700">{actionMsg}</div>
          )}

          {actionError && (
            <div className="text-sm text-destructive">{actionError}</div>
          )}

          {!loading && !error && sortedItems.length === 0 && (
            <div className="text-sm text-muted-foreground">No hay archivos en este prefix</div>
          )}

          {sortedItems.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Last modified</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.map((item) => (
                  <TableRow key={item.url}>
                    <TableCell>
                      <PreviewCell url={item.url} />
                    </TableCell>
                    <TableCell className="max-w-[420px]">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <span className="truncate">{item.url}</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </a>
                    </TableCell>
                    <TableCell>{formatSizeBytes(item.size)}</TableCell>
                    <TableCell>{formatLastModified(item.lastModifiedMs)}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={!!deleting[item.url]}
                        onClick={() => handleDelete(item.url)}
                      >
                        {deleting[item.url] ? "Borrando…" : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
