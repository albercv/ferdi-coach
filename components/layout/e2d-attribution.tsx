"use client"

import Image from "next/image"
import { useState } from "react"
import { Mail, MessageCircle } from "lucide-react"

const E2D_EMAIL = "hello@evolve2digital.com"
const E2D_WHATSAPP_NUMBER = "34605497639"
const E2D_WHATSAPP_URL = `https://wa.me/${E2D_WHATSAPP_NUMBER}`

export function E2dAttribution() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="relative inline-block overflow-hidden rounded-lg p-[2px]">
        <span aria-hidden="true" className="e2d-attribution-border" />

        <button
          type="button"
          aria-expanded={isOpen}
          aria-label="Mostrar formas de contacto de Evolve2Digital"
          onClick={() => setIsOpen((prev) => !prev)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          className="relative flex items-center gap-2 rounded-md bg-neutral-200/95 px-3 py-1.5 text-left text-sm text-neutral-800"
        >
          <Image
            src="/e2d-favicon.ico"
            alt=""
            width={14}
            height={14}
            className="shrink-0"
          />
          <span className="whitespace-nowrap font-medium">
            Diseñado por Evolve2Digital
          </span>
        </button>
      </div>

      {/* Bridge: keeps hover continuous between box and tooltip */}
      <div
        aria-hidden="true"
        className={`absolute bottom-full left-0 right-0 h-3 ${
          isOpen ? "block" : "hidden"
        }`}
      />

      <div
        role="tooltip"
        className={`absolute bottom-full left-1/2 z-50 mb-2 w-max -translate-x-1/2 rounded-md bg-neutral-900 px-3 py-2 text-xs text-neutral-100 shadow-lg ring-1 ring-white/10 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1.5">
          <a
            href={`mailto:${E2D_EMAIL}`}
            className="inline-flex items-center gap-2 hover:underline"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {E2D_EMAIL}
          </a>
          <a
            href={E2D_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:underline"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            +34 605 497 639
          </a>
        </div>
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
      </div>
    </div>
  )
}
