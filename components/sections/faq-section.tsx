import { Section } from "@/components/ui/section"
import { FAQItem } from "@/components/ui/faq-item"
import type { FAQItem as FAQItemType } from "@/lib/content-md"

export function FAQSection({ faq }: { faq: { title: string; subtitle?: string; items: FAQItemType[] } }) {
  // const { faq } = siteContent

  return (
    <Section id="preguntas" aria-labelledby="faq-title" className="bg-primary/5">
      <div className="text-center mb-12">
        <h2 id="faq-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          {faq.title}
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          {faq.subtitle}
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faq.items.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </Section>
  )
}
