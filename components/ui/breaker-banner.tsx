import { Section } from "@/components/ui/section"

export function BreakerBanner({ text, kicker }: { text: string; kicker?: string }) {
  return (
    <Section className="pt-0 md:pt-0 pb-6 md:pb-8 -mt-12 md:-mt-16 -mb-10 md:-mb-14 relative z-10">
      <div className="mx-auto max-w-4xl">
        <div className="relative rounded-2xl bg-background border border-border shadow-lg px-5 py-6 md:px-10 md:py-8 text-center">
          <div aria-hidden className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-background border border-border border-b-0 border-r-0" />

          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1">
            <span className="text-xs md:text-sm font-medium tracking-wide uppercase text-accent">{kicker?.trim() || "Un alto aquí"}</span>
          </div>

          <p className="mt-4 text-xl md:text-3xl font-semibold tracking-tight text-balance text-foreground">
            <span className="text-muted-foreground">&ldquo;</span>
            <span className="px-1">{text}</span>
            <span className="text-muted-foreground">&rdquo;</span>
          </p>

          <div className="mt-5 flex justify-center">
            <div className="h-px w-20 bg-border" />
          </div>
        </div>
      </div>
    </Section>
  )
}
