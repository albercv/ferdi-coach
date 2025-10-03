import { Section } from "@/components/ui/section"
import { FAQItem } from "@/components/ui/faq-item"
import { siteContent } from "@/data/content"

export function FAQSection() {
  const { faq } = siteContent

  return (
    <Section id="preguntas" aria-labelledby="faq-title" className="bg-primary/5">
      <div className="text-center mb-12">
        <h2 id="faq-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          Preguntas frecuentes
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Resuelve tus dudas antes de dar el primer paso
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faq.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </Section>
  )
}
