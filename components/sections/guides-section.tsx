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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        <PricingCard
          title="Guía de Nutrición Básica"
          description="Fundamentos esenciales para una alimentación saludable"
          price="Gratis"
          features={[
            "Fundamentos de nutrición",
            "Planificación de comidas",
            "Recetas saludables",
            "Tips de hidratación"
          ]}
          ctaText="Descargar Guía"
          ctaHref="#descargar"
          flipOnHover={true}
          backSynopsis="Descubre los fundamentos esenciales de la nutrición con esta guía completa que transformará tu relación con la comida. Aprende a planificar comidas balanceadas que nutran tu cuerpo y mente, conoce en profundidad los macronutrientes y micronutrientes necesarios para optimizar tu rendimiento físico y mental, domina el arte de crear hábitos alimenticios sostenibles que te acompañarán toda la vida, y desarrolla una comprensión integral de cómo los alimentos afectan tu energía, estado de ánimo y bienestar general. Esta guía incluye estrategias prácticas para superar los antojos, técnicas de preparación de alimentos que maximizan los nutrientes, y un enfoque holístico hacia la alimentación consciente que te permitirá disfrutar de la comida mientras alcanzas tus objetivos de salud y fitness."
          backCoverSrc="/logo2.webp"
        />
        <PricingCard
          title="Plan de Entrenamiento"
          description="Rutinas personalizadas para alcanzar tus objetivos"
          price="€29"
          features={[
            "Rutinas personalizadas",
            "Seguimiento de progreso",
            "Videos explicativos",
            "Soporte 24/7"
          ]}
          ctaText="Comprar Plan"
          ctaHref="#comprar"
          flipOnHover={true}
          backSynopsis="Un programa de entrenamiento diseñado específicamente para tus objetivos y nivel de condición física. Incluye rutinas progresivas, técnicas avanzadas y el apoyo constante que necesitas para alcanzar tus metas de forma segura y efectiva con resultados garantizados."
          backCoverSrc="/logo2.webp"
        />
        <PricingCard
          title="Coaching Personalizado"
          description="Atención individual para tu transformación completa"
          price="€99"
          features={[
            "Sesiones 1 a 1",
            "Plan nutricional completo",
            "Seguimiento diario",
            "Acceso prioritario"
          ]}
          ctaText="Contratar Coaching"
          ctaHref="#coaching"
          flipOnHover={true}
          backSynopsis="Transformación total."
          backCoverSrc="/logo2.webp"
        />
      </div>
    </Section>
  )
}
