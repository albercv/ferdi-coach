import { Section } from "@/components/ui/section"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { siteContent } from "@/data/content"

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            name={testimonial.name}
            age={testimonial.age}
            text={testimonial.text}
            rating={testimonial.rating}
          />
        ))}
      </div>
    </Section>
  )
}
