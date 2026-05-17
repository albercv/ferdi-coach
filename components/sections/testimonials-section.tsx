"use client"

import { Section } from "@/components/ui/section"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import type { Testimonial } from "@/lib/content-md"

const AUTOPLAY_INTERVAL_MS = 3200

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [autoplayActive, setAutoplayActive] = useState(true)

  // Autoplay: advances every AUTOPLAY_INTERVAL_MS when active.
  // Programmatic scrollNext calls from this interval do not affect the flag.
  useEffect(() => {
    if (!api || !autoplayActive) return
    const id = setInterval(() => { api.scrollNext() }, AUTOPLAY_INTERVAL_MS)
    return () => clearInterval(id)
  }, [api, autoplayActive])

  function handlePreviousClick() {
    // Left arrow always pauses; if already paused, stays paused.
    setAutoplayActive(false)
  }

  function handleNextClick() {
    // Right arrow toggles: pauses if active, resumes if paused.
    setAutoplayActive((previous) => !previous)
  }

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
              <CarouselItem
                key={index}
                className="basis-full md:basis-1/2 lg:basis-1/3"
                onClick={() => setAutoplayActive(false)}
              >
                <TestimonialCard
                  name={testimonial.name}
                  age={testimonial.age}
                  text={testimonial.text}
                  rating={testimonial.rating}
                  mediaUrl={testimonial.mediaUrl}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* onClickCapture fires before the button's own onClick, so scrollPrev/scrollNext still run */}
          <div onClickCapture={handlePreviousClick}>
            <CarouselPrevious className="hidden md:flex top-1/2 md:-left-10" aria-label="Testimonio anterior" />
          </div>
          <div onClickCapture={handleNextClick}>
            <CarouselNext className="hidden md:flex top-1/2 md:-right-10" aria-label="Siguiente testimonio" />
          </div>
        </Carousel>
      </div>
    </Section>
  )
}
