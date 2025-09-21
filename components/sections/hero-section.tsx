import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { Progressive3D } from "@/components/3d/progressive-3d"
import { siteContent } from "@/data/content"
import { Check } from "lucide-react"

export function HeroSection() {
  const { hero } = siteContent

  return (
    <Section id="hero" aria-labelledby="hero-title" className="pt-8 pb-16 md:pt-16 md:pb-24 relative overflow-hidden">
      {/* Círculo pulsante posicionado como fondo en móviles y a la derecha en pantallas grandes */}
      <Progressive3D
        className="absolute pointer-events-none -z-10 top-6 right-[-18px] w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-[420px] lg:h-[420px] lg:top-8 lg:right-10 xl:w-[480px] xl:h-[480px]"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              {hero.title}
            </h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              Coach especializado en procesos de desamor. {hero.subtitle}
            </p>
          </div>

          <ul className="space-y-3">
            {hero.bullets.map((bullet, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-lg px-8">
              <a href="#reservar">{hero.ctaPrimary}</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <a href="#programa-4">{hero.ctaSecondary}</a>
            </Button>
          </div>
        </div>

        {/* Reservamos espacio de la segunda columna en desktop sin contenido explícito */}
        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </Section>
  )
}
