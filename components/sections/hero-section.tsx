import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { siteContent } from "@/data/content"
import { Wrench, Handshake, SlidersHorizontal, Shield, Calendar, CreditCard } from "lucide-react"
import { TrustSeals } from "@/components/ui/trust-seals"

export function HeroSection() {
  const { hero } = siteContent
  const bulletIcons = [Wrench, Handshake, SlidersHorizontal]

  return (
    <Section id="hero" aria-labelledby="hero-title" className="pt-8 pb-16 md:pt-16 md:pb-24 relative overflow-hidden">
      {/* Fondo móvil: degradado vertical de rosa a blanco */}
      <div
        aria-hidden
        className="lg:hidden absolute inset-0 -z-10 bg-gradient-to-b from-accent/30 via-accent/10 to-white"
      />
      {/* Fondo que simula la pantalla del vídeo expandiéndose por detrás del texto */}
      <div
        aria-hidden
        className="hidden lg:block absolute inset-y-0 right-0 w-[70%] -z-10 bg-gradient-to-l from-accent/30 via-accent/10 to-white"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        {/* Columna izquierda: texto */}
        <div className="relative z-10 space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              {hero.title}
            </h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              {hero.subtitle}
            </p>
          </div>

          <div>
            <p className="font-medium mb-3">Te ayudo con</p>
            <ul className="space-y-3">
              {hero.bullets.map((bullet: string, index: number) => {
                const Icon = bulletIcons[index % bulletIcons.length]
                return (
                  <li key={index} className="flex items-start">
                    <Icon aria-hidden className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{bullet}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 bg-accent text-white border border-amber-300/60 hover:shadow-sm hover:bg-accent/90"
            >
              <a href="#reservar">{hero.ctaPrimary}</a>
            </Button>
            <Button
              asChild
              size="lg"
              className="text-lg px-8 bg-white text-black border-2 border-black hover:shadow-sm hover:bg-white"
            >
              <a href="#programa-4">{hero.ctaSecondary}</a>
            </Button>
          </div>

          {/* 2 pasos para reservar */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-lg text-gray-800 text-center">2 pasos para reservar</h3>
            
            {/* Paso 1: Pago 100% seguro */}
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-600 flex-shrink-0" />
                <CreditCard className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Pago 100% seguro</span>
              </div>
            </div>

            {/* Paso 2: Eliges día y hora en Calendly */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-blue-800">Eliges día y hora en Calendly</span>
              </div>
            </div>

            {/* Sellos de confianza reales */}
            <div className="pt-4">
              <p className="text-sm text-gray-600 text-center mb-3">Protegido por:</p>
              <TrustSeals className="justify-center" />
            </div>
          </div>
        </div>

        {/* Columna derecha: vídeo */}
        <div className="relative w-full rounded-xl overflow-hidden ring-1 ring-black/10 shadow-2xl bg-transparent">
          <video
            className="w-full h-auto rounded-xl shadow-md ring-1 ring-foreground/10"
            autoPlay
            muted
            loop
            playsInline
            poster="/logo2.webp"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
          {/* Borde simulado de pantalla */}
          <div aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
        </div>
      </div>
    </Section>
  )
}
