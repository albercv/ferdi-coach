'use client'
import { Section } from "@/components/ui/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { siteContent } from "@/data/content"
import { Gift } from "lucide-react"

export function ProgramSection() {
  const { program4 } = siteContent

  return (
    <Section id="programa-4" aria-labelledby="programa-title" className="bg-primary text-primary-foreground">
      <div className="text-center mb-12">
        <h2 id="programa-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          {program4.title}
        </h2>
        <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto text-pretty">{program4.promise}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold mb-6">Hitos del programa:</h3>
          <div className="grid grid-cols-1 gap-6">
            {program4.milestones.map((milestone, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden will-change-transform transition-transform duration-500 ease-out border-0 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.25)] bg-primary-foreground text-primary backdrop-blur hover:scale-[1.02]"
             >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm ring-1 ring-accent/15 group-hover:translate-y-[-2px] group-hover:scale-105 transition-transform duration-500">
                      {milestone.week}
                    </div>
                    <CardTitle className="text-lg">{milestone.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{milestone.description}</CardDescription>
                </CardContent>
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true">
                  <div className="absolute -top-16 -right-10 md:-right-10 right-0 h-40 w-40 rounded-full bg-accent/20 blur-2xl" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="bg-accent text-accent-foreground">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5" />
                <CardTitle>Bonus incluidos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {program4.bonus.map((bonus, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent-foreground/80">• {bonus}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="text-center p-8 bg-primary-foreground/10 rounded-2xl">
            <div className="mb-4">
              <span className="text-4xl font-bold">{program4.price}</span>
            </div>
            <p className="text-primary-foreground/80 mb-6">Inversión completa del programa</p>
            <Button asChild size="lg" variant="secondary" className="w-full">
              <a href="#reservar">Reservar Programa 4</a>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
