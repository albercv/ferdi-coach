"use client"

import { Section } from "@/components/ui/section"
import { PricingCard } from "@/components/ui/pricing-card"
import type { GuideProduct } from "@/lib/products-md"

export function GuidesSection({ guides }: { guides: GuideProduct[] }) {
  // Eliminamos siteContent, usamos los datos dinámicos

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
            ctaText="Descargar ahora"
            ctaHref={guide.fileUrl || "/fake.pdf"}
            flipOnHover={true}
            backSynopsis={guide.synopsis || funSynopses[guide.title] || guide.miniDescription}
            backCoverSrc={guide.coverImageUrl ?? "/logo2.webp"}
          />
        ))}
      </div>
    </Section>
  )
}
