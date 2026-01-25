"use client"

import { Section } from "@/components/ui/section"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import type { Testimonial } from "@/lib/content-md"

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  // const { testimonials } = siteContent
  const [api, setApi] = useState<CarouselApi | null>(null)

  // Autoplay simple: avanza cada 3.2s; loop ya está activo en opts
  useEffect(() => {
    if (!api) return
    const id = setInterval(() => {
      api.scrollNext()
    }, 3200)
    return () => clearInterval(id)
  }, [api])

  return (
    <Section id="testimonios" aria-labelledby="testimonios-title" className="bg-secondary">
      <div className="text-center mb-12">
        <h2 id="testimonios-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          Lo que dicen mis clientes
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Historias reales de transformación y recuperación emocional
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <Carousel opts={{ align: "start", loop: true }} setApi={setApi} className="w-full">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  name={testimonial.name}
                  age={testimonial.age}
                  text={testimonial.text}
                  rating={testimonial.rating}
                  videoUrl={testimonial.videoUrl}
                  imageUrl={testimonial.imageUrl}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex top-1/2 md:-left-10" aria-label="Testimonio anterior" />
          <CarouselNext className="hidden md:flex top-1/2 md:-right-10" aria-label="Siguiente testimonio" />
        </Carousel>
      </div>
    </Section>
  )
}
