import { Section } from "@/components/ui/section"
import { PricingCard } from "@/components/ui/pricing-card"
import { siteContent } from "@/data/content"

export function GuidesSection() {
  const { guides } = siteContent

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
          />
        ))}
      </div>
    </Section>
  )
}
