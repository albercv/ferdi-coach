import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { siteContent } from "@/data/content"
import { Wrench, Handshake, SlidersHorizontal } from "lucide-react"

export function HeroSection() {
  const { hero } = siteContent
  const bulletIcons = [Wrench, Handshake, SlidersHorizontal]

  return (
    <Section id="hero" aria-labelledby="hero-title" className="pt-8 pb-16 md:pt-16 md:pb-24 relative overflow-hidden min-h-screen flex items-center">
      {/* Imagen de fondo que ocupa todo el ancho */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
      >
        <img
          src="/hero-img-v1.png"
          alt=""
          className="w-full h-full object-cover object-center md:object-[center_15%] lg:object-[center_20%] xl:object-[center_30%]"
        />
        {/* Overlay para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full max-h-full overflow-hidden">
        {/* Columna izquierda: texto */}
        <div className="relative z-10 space-y-8 animate-fade-in-up pt-4 lg:pt-0 flex flex-col items-center lg:items-start lg:pl-4 xl:pl-8">
          <div className="space-y-4 w-full max-w-xl">
            <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight text-center lg:text-left text-white drop-shadow-lg w-full md:max-w-none">
              {hero.title}
            </h1>
            <p className="text-xl text-white/90 text-pretty leading-relaxed text-center lg:text-left drop-shadow-md w-full">
              {hero.subtitle}
            </p>
          </div>

          <div className="w-full max-w-lg">
            <p className="font-medium mb-3 text-center lg:text-left text-white drop-shadow-md">Te ayudo con</p>
            <ul className="space-y-3">
              {hero.bullets.map((bullet: string, index: number) => {
                const Icon = bulletIcons[index % bulletIcons.length]
                return (
                  <li key={index} className="flex items-start gap-3">
                    <Icon aria-hidden className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <span className="text-white/90 drop-shadow-md">{bullet}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center lg:justify-start">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 bg-accent text-white border border-amber-300/60 hover:shadow-lg hover:bg-accent/90"
            >
              <a href="#reservar">{hero.ctaPrimary}</a>
            </Button>
            <Button
              asChild
              size="lg"
              className="text-lg px-8 bg-white text-black border-2 border-white hover:shadow-lg hover:bg-white/90"
            >
              <a href="#sesiones">{hero.ctaSecondary}</a>
            </Button>
          </div>
        </div>

        {/* Columna derecha: espacio para equilibrio visual */}
        <div className="relative w-full max-w-2xl mx-auto lg:mx-0 h-full max-h-[70vh] flex items-center justify-center">
          {/* Espacio en blanco para equilibrio visual */}
        </div>
      </div>
    </Section>
  )
}
