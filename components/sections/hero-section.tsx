import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { siteContent } from "@/data/content"
import { Wrench, Handshake, SlidersHorizontal } from "lucide-react"

export function HeroSection() {
  const { hero } = siteContent
  const bulletIcons = [Wrench, Handshake, SlidersHorizontal]

  return (
    <Section id="hero" aria-labelledby="hero-title" className="pt-8 pb-16 md:pt-16 md:pb-24 relative overflow-hidden min-h-screen flex items-center">
      {/* Fondo móvil: degradado del color primario a blanco de derecha a izquierda */}
      <div
        aria-hidden
        className="lg:hidden absolute inset-0 -z-10 bg-gradient-to-l from-primary to-white"
      />
      {/* Fondo desktop: degradado del color primario a blanco de derecha a izquierda */}
      <div
        aria-hidden
        className="hidden lg:block absolute inset-0 -z-10 bg-gradient-to-l from-primary to-white"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full max-h-full overflow-hidden">
        {/* Columna izquierda: texto */}
        <div className="relative z-10 space-y-8 animate-fade-in-up pt-4 lg:pt-0 flex flex-col items-center lg:items-start">
          <div className="space-y-4 w-full max-w-xl">
            <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight text-center lg:text-left">
              {hero.title}
            </h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed text-center lg:text-left">
              {hero.subtitle}
            </p>
          </div>

          <div className="w-full max-w-lg">
            <p className="font-medium mb-3 text-center lg:text-left">Te ayudo con</p>
            <ul className="space-y-3">
              {hero.bullets.map((bullet: string, index: number) => {
                const Icon = bulletIcons[index % bulletIcons.length]
                return (
                  <li key={index} className="flex items-start gap-3">
                    <Icon aria-hidden className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{bullet}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center lg:justify-start">
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
              <a href="#sesiones">{hero.ctaSecondary}</a>
            </Button>
          </div>
        </div>

        {/* Columna derecha: composición multimedia hero */}
        <div className="relative w-full max-w-2xl mx-auto lg:mx-0 h-full max-h-[70vh]">
          {/* Contenedor de la composición de 3 elementos */}
          <div className="relative h-full grid grid-cols-12 grid-rows-12 gap-[5px]">
            
            {/* Imagen principal (hero-img-v1) - Elemento dominante */}
            <div className="relative col-span-7 row-span-8 z-10">
              <img
                src="/hero-img-v1.png"
                alt="Ferdy Coach - Especialista en superar rupturas amorosas"
                className="w-full h-full object-cover rounded-l-2xl shadow-lg"
              />
              {/* Overlay sutil para la imagen principal */}
              <div 
                aria-hidden 
                className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent rounded-l-2xl pointer-events-none"
              />
            </div>

            {/* Video muestra - Elemento secundario */}
            <div className="relative col-span-5 row-span-9 col-start-8 row-start-1 z-20">
              <video
                src="/video-muestra-NOPUBLISH.MP4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover rounded-tr-xl rounded-br-xl shadow-md border-2 border-white/50"
              />
              {/* Overlay para el video */}
              <div 
                aria-hidden 
                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-tr-xl rounded-br-xl pointer-events-none"
              />
            </div>

            {/* Imagen secundaria (hero-img-v2) - Elemento de apoyo */}
            <div className="relative col-span-7 row-span-5 col-start-1 row-start-9 z-15">
              <img
                src="/hero-img-v2.png"
                alt="Ferdy Coach - Imagen complementaria"
                className="w-full h-full object-cover rounded-l-xl shadow-md border border-white/30 m-4"
              />
              {/* Overlay para la imagen secundaria */}
              <div 
                aria-hidden 
                className="w-full h-full object-cover rounded-l-xl shadow-md border border-white/30 object-top object-left"
              />
            </div>


          </div>
        </div>
      </div>
    </Section>
  )
}
