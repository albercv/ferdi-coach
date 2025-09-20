import { Section } from "@/components/ui/section"
import { PricingCard } from "@/components/ui/pricing-card"
import { siteContent } from "@/data/content"

export function SessionsSection() {
  const { sessions } = siteContent

  return (
    <Section id="sesiones" aria-labelledby="sesiones-title">
      <div className="text-center mb-12">
        <h2 id="sesiones-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          {sessions.title}
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{sessions.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PricingCard
          title="Sesión individual"
          description="Sesión personalizada de 60 minutos"
          price={sessions.prices.single}
          features={sessions.benefits}
          ctaText="Reservar sesión"
          ctaHref="#reservar"
        />
        <PricingCard
          title="Pack 4 sesiones"
          description="4 sesiones con seguimiento personalizado"
          price={sessions.prices.pack4}
          features={[...sessions.benefits, "Ahorro de 20€", "Seguimiento entre sesiones"]}
          ctaText="Reservar pack"
          ctaHref="#reservar"
          popular={true}
        />
      </div>
    </Section>
  )
}
