import { Section } from "@/components/ui/section"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { siteContent } from "@/data/content"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export function TestimonialsSection() {
  const { testimonials } = siteContent

  return (
    <Section id="testimonios" aria-labelledby="testimonios-title">
      <div className="text-center mb-12">
        <h2 id="testimonios-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          Lo que dicen mis clientes
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Historias reales de transformación y recuperación emocional
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  name={testimonial.name}
                  age={testimonial.age}
                  text={testimonial.text}
                  rating={testimonial.rating}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="top-1/2 -left-6 md:-left-10" aria-label="Testimonio anterior" />
          <CarouselNext className="top-1/2 -right-6 md:-right-10" aria-label="Siguiente testimonio" />
        </Carousel>
      </div>
    </Section>
  )
}
