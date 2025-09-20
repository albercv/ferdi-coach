import { Section } from "@/components/ui/section"
import { siteContent } from "@/data/content"
import { CheckCircle } from "lucide-react"

export function ForWhoSection() {
  const { forWho } = siteContent

  return (
    <Section id="para-quien" aria-labelledby="para-quien-title" className="bg-secondary/30">
      <div className="text-center max-w-4xl mx-auto">
        <h2 id="para-quien-title" className="text-3xl md:text-4xl font-bold mb-12 text-balance">
          {forWho.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forWho.situations.map((situation, index) => (
            <div key={index} className="flex items-start text-left p-4 rounded-lg bg-card">
              <CheckCircle className="h-6 w-6 text-accent mr-4 mt-1 flex-shrink-0" />
              <p className="text-muted-foreground text-pretty">{situation}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
