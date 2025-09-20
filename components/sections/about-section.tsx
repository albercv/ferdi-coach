import { Section } from "@/components/ui/section"
import { Card, CardContent } from "@/components/ui/card"
import { siteContent } from "@/data/content"
import { Award } from "lucide-react"

export function AboutSection() {
  const { about } = siteContent

  return (
    <Section id="sobre-mi" aria-labelledby="sobre-mi-title" className="bg-secondary/30">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 id="sobre-mi-title" className="text-3xl md:text-4xl font-bold text-balance">
            {about.title}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">{about.description}</p>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Credenciales y experiencia</h3>
              </div>
              <ul className="space-y-2">
                {about.credentials.map((credential, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span className="text-muted-foreground">{credential}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          {/* Placeholder for Ferdy's photo */}
          <div className="aspect-[4/5] bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="w-24 h-24 bg-accent/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">F</span>
              </div>
              <p className="text-sm">Foto de Ferdy</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
