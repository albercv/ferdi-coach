"use client"

import { Section } from "@/components/ui/section"
import { PricingCard } from "@/components/ui/pricing-card"
import type { GuideProduct } from "@/lib/products-md"
import { useMemo, useState } from "react"
import type { PaymentProductRef } from "@/lib/payments"
import { PaymentDialog } from "@/components/payments/PaymentDialog"

export function GuidesSection({ guides }: { guides: GuideProduct[] }) {
  // Eliminamos siteContent, usamos los datos dinámicos

  const [activePaidProduct, setActivePaidProduct] = useState<PaymentProductRef | null>(null)
  const open = useMemo(() => activePaidProduct !== null, [activePaidProduct])

  const funSynopses: Record<string, string> = {
    "Guía del Contacto Cero":
      "Cuando tu ex es como ese WiFi público: parece tentador, pero sabes que no te conviene. Aprende a desconectarte con estilo (y sin recaídas).",
    "Workbook de Sanación Emocional":
      "El cuaderno que no te juzga: ejercicios simples para llorar lo justo, reír a tiempo y reconstruirte sin mensajes a las 2 a.m.",
    "Kit de Emergencia Emocional":
      "Para esos momentos de 'abro Instagram y me pongo peor'. Herramientas rápidas para sobrevivir a oleadas de nostalgia y otras catástrofes emocionales.",
  }

  return (
    <Section id="guias" aria-labelledby="guias-title" className="bg-background">
      <div className="text-center mb-12">
        <h2 id="guias-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          Guías gratuitas
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Recursos descargables para comenzar tu proceso de sanación
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {guides.map((guide, index) => (
          <PricingCard
            key={guide.id || index}
            title={guide.title}
            description={guide.miniDescription}
            price={String(guide.price)}
            features={guide.features}
            ctaText={Number(guide.price || 0) > 0 ? "Pagar" : "Descargar ahora"}
            ctaHref={Number(guide.price || 0) > 0 ? undefined : (guide.fileUrl || "/fake.pdf")}
            onCtaClick={
              Number(guide.price || 0) > 0
                ? () =>
                    setActivePaidProduct({
                      kind: "guide",
                      id: guide.id,
                      title: guide.title,
                      priceEuro: Number(guide.price || 0),
                    })
                : undefined
            }
            flipOnHover={true}
            backSynopsis={guide.synopsis || funSynopses[guide.title] || guide.miniDescription}
            backCoverSrc={guide.coverImageUrl ?? "/logo2.webp"}
          />
        ))}
      </div>

      {activePaidProduct && (
        <PaymentDialog
          product={activePaidProduct}
          open={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setActivePaidProduct(null)
          }}
        />
      )}
    </Section>
  )
}
