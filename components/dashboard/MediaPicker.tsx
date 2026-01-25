"use client"

import { useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText } from "lucide-react"

export type MediaPickerProps = {
  label: string
  value?: string | null
  scope: "hero" | "about" | "testimonials" | "products" | "global"
  entitySlug?: string
  productSubscope?: "guides" | "sessions"
  accept?: string
  onChange: (url: string | null) => void
}

function isVideoUrl(url: string): boolean {
  const u = url.toLowerCase()
  return u.endsWith(".mp4")
}

function isPdfUrl(url: string): boolean {
  const u = url.toLowerCase()
  return u.endsWith(".pdf")
}

export function MediaPicker(props: MediaPickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accept = useMemo(() => {
    return props.accept ?? "image/*,video/mp4,application/pdf"
  }, [props.accept])

  const value = props.value ?? null

  async function onUpload() {
    if (!selectedFile) {
      setError("Selecciona un archivo")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const fd = new FormData()
      fd.set("file", selectedFile)
      fd.set("scope", props.scope)
      if (props.entitySlug) fd.set("entitySlug", props.entitySlug)
      if (props.productSubscope) fd.set("productSubscope", props.productSubscope)

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: fd,
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const message = data && typeof data.error === "string" ? data.error : "UPLOAD_FAILED"
        throw new Error(message)
      }

      const url = data && typeof data.url === "string" ? data.url : null
      if (!url) throw new Error("INVALID_RESPONSE")

      setSelectedFile(null)
      if (inputRef.current) inputRef.current.value = ""
      props.onChange(url)
    } catch (err) {
      const message = err instanceof Error ? err.message : "UPLOAD_FAILED"
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  function onRemove() {
    setError(null)
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ""
    props.onChange(null)
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>{props.label}</Label>
        {value ? (
          <div className="space-y-2">
            {isVideoUrl(value) ? (
              <video className="w-full rounded-md border" controls src={value} />
            ) : isPdfUrl(value) ? (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <a
                  className="underline"
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir PDF
                </a>
              </div>
            ) : (
              <img
                className="max-h-48 w-auto rounded-md border object-contain"
                src={value}
                alt={props.label}
              />
            )}
            <div className="text-xs text-muted-foreground break-all">{value}</div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">Sin archivo</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null
            setSelectedFile(file)
            setError(null)
          }}
          disabled={uploading}
        />

        <div className="flex gap-2">
          <Button type="button" onClick={onUpload} disabled={uploading || !selectedFile}>
            {uploading ? "Subiendo..." : "Subir"}
          </Button>
          <Button type="button" variant="secondary" onClick={onRemove} disabled={uploading}>
            Quitar
          </Button>
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}
      </div>
    </div>
  )
}

