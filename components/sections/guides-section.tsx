"use client"

import { Section } from "@/components/ui/section"
import { PricingCard } from "@/components/ui/pricing-card"
import { siteContent } from "@/data/content"

export function GuidesSection() {
  const { guides } = siteContent

  const funSynopses: Record<string, string> = {
    "Guía del Contacto Cero":
      "Cuando tu ex es como ese WiFi público: parece tentador, pero sabes que no te conviene. Aprende a desconectarte con estilo (y sin recaídas).",
    "Workbook de Sanación Emocional":
      "El cuaderno que no te juzga: ejercicios simples para llorar lo justo, reír a tiempo y reconstruirte sin mensajes a las 2 a.m.",
    "Kit de Emergencia Emocional":
      "Para esos momentos de ‘abro Instagram y me pongo peor’. Herramientas rápidas para sobrevivir a oleadas de nostalgia y otras catástrofes emocionales.",
  }

  return (
    <Section id="guias" aria-labelledby="guias-title">
      <div className="text-center mb-12">
        <h2 id="guias-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          Guías digitales
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Recursos prácticos para acompañarte en tu proceso de sanación
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {guides.map((guide, index) => (
          <PricingCard
            key={index}
            title={guide.title}
            description={guide.description}
            price={guide.price}
            features={["Descarga inmediata", "Acceso de por vida", "Formato PDF", "Ejercicios prácticos"]}
            ctaText="Comprar guía"
            ctaHref="#comprar"
            flipOnHover
            backSynopsis={funSynopses[guide.title] ?? guide.description}
            backCoverSrc="/logo2.webp"
          />
        ))}
      </div>
    </Section>
  )
}
