'use client'

import { Section } from "@/components/ui/section"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ForWhoContent } from "@/lib/content-md"
import { HeartCrack, Clock, Users, Target } from "lucide-react"

import { useEffect, useRef, useState } from "react"

const iconMap = {
  "heart-crack": HeartCrack,
  clock: Clock,
  users: Users,
  target: Target,
} as const

export function ForWhoSection({ forWho }: { forWho: ForWhoContent }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const heartRef = useRef<HTMLDivElement>(null)
  const [, setProgress] = useState(0)
  const [, setDistance] = useState(0)

  // Movimiento suave del corazón en mobile según el scroll dentro de la sección
  useEffect(() => {
    const update = () => {
      const elSection = sectionRef.current
      const elHeart = heartRef.current
      if (!elSection) return

      const rect = elSection.getBoundingClientRect()
      const sectionTop = rect.top + window.scrollY
      const sectionHeight = elSection.offsetHeight || 1
      const heartHeight = elHeart?.offsetHeight || 0

      const padding = 20
      // Desplazamiento vertical deseado: scroll dentro de la sección con padding
      const inside = window.scrollY - sectionTop + padding
      const maxTravel = Math.max(sectionHeight - heartHeight - padding * 2, 0)
      const clamped = Math.min(Math.max(inside, 0), maxTravel)

      setProgress(0) // ya no usamos progress, mantenemos para no romper
      setDistance(clamped) // reutilizamos distance como offsetY directo
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <Section id="para-quien" aria-labelledby="para-quien-title" className="bg-background relative overflow-hidden">
      <div ref={sectionRef} className="relative sm:py-0 py-5">
        <div className="text-center max-w-6xl mx-auto">
          <h2 id="para-quien-title" className="text-3xl md:text-4xl font-bold text-balance">
            {forWho.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            {forWho.subtitle}
          </p>
          
          {/* Layout principal: en desktop 2 columnas (tarjetas a la izquierda) */}
          <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            {/* Tarjetas (izquierda) - 2x2 en pantallas grandes */}
            <div className="lg:col-span-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                {forWho.cards?.map((card, idx) => {
                  const Icon = iconMap[(card.icon as keyof typeof iconMap) ?? "heart-crack"]
                  return (
                    <Card
                      key={idx}
                      className="group relative overflow-hidden will-change-transform transition-transform duration-500 ease-out border-0 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.25)] bg-white/90 backdrop-blur hover:scale-[1.02]"
                      aria-label={`${card.title}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="shrink-0 rounded-2xl bg-accent/10 text-accent p-3 ring-1 ring-accent/15 group-hover:translate-y-[-2px] group-hover:scale-105 transition-transform duration-500">
                            <Icon className="h-6 w-6 drop-shadow-[0_1px_2px_rgba(238,64,66,0.4)]" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg leading-tight">{card.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground text-pretty">{card.description}</p>
                          </div>
                        </div>
                      </CardContent>
                      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true">
                        <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-2xl" />
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Botón CTA debajo de las tarjetas */}
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <a href={forWho.ctaHref || "#reservar"}>{forWho.ctaText}</a>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
