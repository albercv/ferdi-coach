import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"

interface CTASectionProps {
  title: string
  description: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
}

export function CTASection({ title, description, primaryCTA, secondaryCTA }: CTASectionProps) {
  return (
    <Section className="bg-accent text-accent-foreground">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">{title}</h2>
        <p className="text-xl mb-8 text-accent-foreground/90 text-pretty">{description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <a href={primaryCTA.href}>{primaryCTA.text}</a>
          </Button>
          {secondaryCTA && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/10 bg-transparent"
            >
              <a href={secondaryCTA.href}>{secondaryCTA.text}</a>
            </Button>
          )}
        </div>
      </div>
    </Section>
  )
}
