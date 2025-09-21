import { Section } from "@/components/ui/section"
import { siteContent } from "@/data/content"
import { Card, CardContent } from "@/components/ui/card"
import { HeartCrack, Clock, Users, Target } from "lucide-react"

const iconMap = {
  "heart-crack": HeartCrack,
  clock: Clock,
  users: Users,
  target: Target,
} as const

type IconKey = keyof typeof iconMap

export function ForWhoSection() {
  const { forWho } = siteContent

  return (
    <Section id="para-quien" aria-labelledby="para-quien-title" className="bg-secondary/30">
      <div className="text-center max-w-5xl mx-auto">
        <h2 id="para-quien-title" className="text-3xl md:text-4xl font-bold text-balance">
          {forWho.title}
        </h2>
        {forWho.subtitle && (
          <p className="mt-3 text-muted-foreground text-balance">
            {forWho.subtitle}
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 perspective-1000">
          {forWho.cards?.map((card, idx) => {
            const Icon = iconMap[(card.icon as IconKey) ?? "heart-crack"]
            return (
              <Card
                key={idx}
                className="group relative overflow-hidden will-change-transform transition-transform duration-500 ease-out border-0 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.25)] bg-white/90 backdrop-blur card-3d hover:scale-[1.02]"
                aria-label={`${card.title}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-2xl bg-accent/10 text-accent p-3 ring-1 ring-accent/15 group-hover:translate-y-[-2px] group-hover:scale-105 transition-transform duration-500 icon-lift">
                      <Icon className="h-6 w-6" aria-hidden="true" />
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
    </Section>
  )
}
