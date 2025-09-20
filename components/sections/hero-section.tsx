import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { Progressive3D } from "@/components/3d/progressive-3d"
import { siteContent } from "@/data/content"
import { Check } from "lucide-react"

export function HeroSection() {
  const { hero } = siteContent

  return (
    <Section id="hero" aria-labelledby="hero-title" className="pt-8 pb-16 md:pt-16 md:pb-24 relative overflow-hidden">
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

        <div className="relative">
          <Progressive3D className="aspect-square" />
        </div>
      </div>
    </Section>
  )
}
