import { Section } from "@/components/ui/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { siteContent } from "@/data/content"

export function SessionsSection() {
  const { sessions } = siteContent

  return (
    <Section id="sesiones" aria-labelledby="sesiones-title" className="bg-secondary">
      <div className="text-center mb-12">
        <h2 id="sesiones-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          {sessions.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
        {/* Sesiones 1 a 1 Card */}
        <Card className="relative group-trigger flex flex-col h-full">
          <CardHeader>
            <CardTitle className="text-2xl">{sessions.cards[0].title}</CardTitle>
            <CardDescription className="text-base">
              {sessions.cards[0].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* What you get section - condensed */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Qué incluye:</h4>
              <ul className="space-y-1">
                {sessions.cards[0].whatYouGet.items.slice(0, 3).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{item}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">+ 2 beneficios adicionales</span>
                </li>
              </ul>
            </div>

            {/* Ideal for - condensed */}
            <div className="bg-blue-50 p-2 rounded text-center">
              <p className="text-xs text-blue-700"><strong>Ideal para apoyo inmediato tras ruptura</strong></p>
            </div>

            {/* Pricing - simplified */}
            <div className="bg-secondary/30 p-3 rounded-lg mt-auto">
              <div className="text-center mb-2">
                <span className="text-xl font-bold">{sessions.cards[0].pricing.full}</span>
                <p className="text-xs text-muted-foreground">{sessions.cards[0].pricing.note}</p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                {sessions.cards[0].cta}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Programa 4 Card */}
        <Card className="relative border-primary group flex flex-col h-full">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground relative flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full red-dot-pulse relative"></div>
              Más Popular
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">{sessions.cards[1].title}</CardTitle>
            <CardDescription className="text-base">
              {sessions.cards[1].promise}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Key Points - condensed */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Programa semanal:</h4>
              <ul className="space-y-2">
                {sessions.cards[1].keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-medium">{point.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Includes - simplified */}
            <div className="bg-green-50 p-2 rounded text-center">
              <p className="text-xs text-green-700"><strong>4 sesiones + material + seguimiento diario</strong></p>
            </div>

            {/* Bonus - compact */}
            <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
              <p className="text-xs"><strong>Bonus:</strong> {sessions.cards[1].bonus}</p>
            </div>

            {/* Pricing - simplified */}
            <div className="bg-secondary/30 p-3 rounded-lg mt-auto">
              <div className="text-center mb-2">
                <div className="text-xl font-bold">{sessions.cards[1].pricing.full}</div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                {sessions.cards[1].cta}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Security Seals */}
      <div className="mt-8 flex justify-center items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Pago 100% seguro</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
          <span>Tarjetas aceptadas</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>SSL certificado</span>
        </div>
      </div>
    </Section>
  )
}
