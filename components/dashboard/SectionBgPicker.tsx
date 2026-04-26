"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { Check, Pipette, X } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import {
  INNER_ONLY_SECTIONS,
  PALETTE,
  resolveColor,
  type PaletteToken,
  type SectionKey,
  type SectionStyles,
} from "@/lib/section-styles-shared"

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const EVENT_NAME = "ferdy:section-bg-change"

type ChangeDetail = { section: SectionKey; value: string; resolved: string | null }

function emitChange(section: SectionKey, value: string) {
  const resolved = resolveColor(value)
  window.dispatchEvent(
    new CustomEvent<ChangeDetail>(EVENT_NAME, {
      detail: { section, value, resolved },
    }),
  )
}

function tokenFromValue(value: string): PaletteToken | null {
  const lower = value.toLowerCase()
  if (
    lower === "white" ||
    lower === "gold" ||
    lower === "green" ||
    lower === "gray"
  ) {
    return lower
  }
  return null
}

function checkColorFor(hex: string): string {
  const normalized = hex.replace("#", "")
  if (normalized.length !== 6) return "#0d0d0d"
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? "#0d0d0d" : "#ffffff"
}

type SectionBgPickerProps = {
  section: SectionKey
}

export function SectionBgPicker({ section }: SectionBgPickerProps) {
  const { toast } = useToast()
  const [value, setValue] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const colorInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch("/api/section-styles")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ styles: SectionStyles }>
      })
      .then(({ styles }) => {
        if (cancelled) return
        const current = styles[section] || ""
        setValue(current)
        emitChange(section, current)
      })
      .catch((err) => {
        console.error("[SectionBgPicker] load", err)
        if (!cancelled)
          toast({
            title: "No se pudo cargar el color",
            description: section,
          })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [section, toast])

  const persist = async (next: string) => {
    setValue(next)
    emitChange(section, next)
    setSaving(true)
    try {
      const res = await fetch("/api/section-styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ styles: { [section]: next } }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || `HTTP ${res.status}`)
      }
      const data = (await res.json()) as { styles: SectionStyles }
      const stored = data.styles[section] || ""
      setValue(stored)
      emitChange(section, stored)
    } catch (err) {
      console.error("[SectionBgPicker] save", err)
      toast({
        title: "Error al guardar",
        description: (err as Error).message,
      })
    } finally {
      setSaving(false)
    }
  }

  const activeToken = tokenFromValue(value)
  const previewHex = resolveColor(value)
  const isCustom = !!previewHex && !activeToken
  const disabled = saving || loading

  const onPickToken = (token: PaletteToken) => {
    if (disabled) return
    void persist(token)
  }
  const onClear = () => {
    if (disabled) return
    void persist("")
  }
  const onNativePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    void persist(e.target.value)
  }

  return (
    <div className="flex items-center flex-wrap gap-2 px-3 py-2 rounded-md border border-dashed border-border bg-[color-mix(in_srgb,var(--accent)_3%,transparent)]">
      <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
        Fondo
      </span>

      {(Object.keys(PALETTE) as PaletteToken[]).map((token) => {
        const swatch = PALETTE[token]
        const isActive = activeToken === token
        return (
          <button
            key={token}
            type="button"
            disabled={disabled}
            onClick={() => onPickToken(token)}
            title={swatch.label}
            aria-label={swatch.label}
            aria-pressed={isActive}
            className={`group relative size-7 rounded-full border-2 transition-all ${
              isActive
                ? "border-[var(--accent)] scale-110 shadow-md"
                : "border-border hover:border-foreground/40 hover:scale-105"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ background: swatch.hex }}
          >
            {isActive && (
              <Check
                className="absolute inset-0 m-auto size-3.5"
                style={{ color: checkColorFor(swatch.hex) }}
                strokeWidth={3}
              />
            )}
          </button>
        )
      })}

      <span className="h-6 w-px bg-border" aria-hidden />

      <label
        title="Color personalizado"
        className={`relative size-7 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center overflow-hidden ${
          isCustom
            ? "border-[var(--accent)] scale-110 shadow-md"
            : "border-border hover:border-foreground/40 hover:scale-105"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        style={{
          background: isCustom
            ? previewHex
            : "conic-gradient(from 0deg, #ff5757, #ffbd59, #b6ac69, #6ed5ff, #c46df3, #ff5757)",
        }}
      >
        {!isCustom && (
          <Pipette className="size-3 text-white drop-shadow" strokeWidth={2.5} />
        )}
        {isCustom && (
          <Check
            className="size-3.5 text-white drop-shadow"
            strokeWidth={3}
          />
        )}
        <input
          ref={colorInputRef}
          type="color"
          className="sr-only"
          value={isCustom ? previewHex : "#b6ac69"}
          onChange={onNativePicker}
          disabled={disabled}
        />
      </label>

      <button
        type="button"
        disabled={disabled || !value}
        onClick={onClear}
        className="size-7 rounded-full border-2 border-border hover:border-foreground/40 transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        title="Sin color"
        aria-label="Sin color"
      >
        <X className="size-3.5 text-muted-foreground" />
      </button>

      <span className="ml-auto text-[11px] font-mono text-muted-foreground">
        {previewHex || "—"}
      </span>
    </div>
  )
}

type SectionBgPreviewProps = {
  section: SectionKey
  className?: string
  children: ReactNode
}

export function SectionBgPreview({
  section,
  className,
  children,
}: SectionBgPreviewProps) {
  const [color, setColor] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ChangeDetail>).detail
      if (!detail || detail.section !== section) return
      setColor(detail.resolved)
    }
    window.addEventListener(EVENT_NAME, handler as EventListener)
    return () => window.removeEventListener(EVENT_NAME, handler as EventListener)
  }, [section])

  const innerOnly = INNER_ONLY_SECTIONS.has(section)
  const style: CSSProperties | undefined = color
    ? innerOnly
      ? ({ ["--section-bg" as string]: color } as CSSProperties)
      : ({
          backgroundColor: color,
          ["--section-bg" as string]: color,
        } as CSSProperties)
    : undefined

  return (
    <div
      className={`section-bg-preview transition-colors duration-300 ${className || ""}`}
      style={style}
      data-section-bg={section}
    >
      {children}
    </div>
  )
}
