import { Section } from "@/components/ui/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { siteContent } from "@/data/content"

export function SessionsSection() {
  const { sessions } = siteContent

  return (
    <Section id="sesiones" aria-labelledby="sesiones-title">
      <div className="text-center mb-12">
        <h2 id="sesiones-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          {sessions.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Sesiones 1 a 1 Card */}
        <Card className="relative">
          <CardHeader>
            <CardTitle className="text-2xl">{sessions.cards[0].title}</CardTitle>
            <CardDescription className="text-base">
              {sessions.cards[0].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* What you get section */}
            <div>
              <h4 className="font-semibold mb-3">{sessions.cards[0].whatYouGet.title}</h4>
              <ul className="space-y-2">
                {sessions.cards[0].whatYouGet.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ideal for */}
            <div>
              <p className="text-sm"><strong>Ideal para:</strong> {sessions.cards[0].idealFor}</p>
            </div>

            {/* Format */}
            <div>
              <p className="text-sm"><strong>Formato:</strong> {sessions.cards[0].format}</p>
            </div>

            {/* Pricing */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold">{sessions.cards[0].pricing.single}</span>
                <Badge variant="secondary">{sessions.cards[0].pricing.singleLabel}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {sessions.cards[0].pricing.packLabel}: <strong>{sessions.cards[0].pricing.pack}</strong>
              </p>
              <Button className="w-full mb-3 bg-primary hover:bg-primary/90" size="lg">
                {sessions.cards[0].cta}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                {sessions.cards[0].paymentInfo}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Programa 4 Card */}
        <Card className="relative border-primary">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground relative flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Más Popular
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">{sessions.cards[1].title}</CardTitle>
            <CardDescription className="text-base">
              {sessions.cards[1].promise}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Points */}
            <div>
              <h4 className="font-semibold mb-3">Puntos clave:</h4>
              <ul className="space-y-3">
                {sessions.cards[1].keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-sm">{point.title}:</strong>
                      <span className="text-sm ml-1">{point.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Includes */}
            <div>
              <p className="text-sm"><strong>Incluye:</strong> {sessions.cards[1].includes}</p>
            </div>

            {/* Bonus */}
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-sm"><strong>Bonus lanzamiento:</strong> {sessions.cards[1].bonus}</p>
            </div>

            {/* Pricing */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-center mb-3">
                <div className="text-3xl font-bold">{sessions.cards[1].pricing.full}</div>
                <p className="text-sm text-muted-foreground">o {sessions.cards[1].pricing.installments}</p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                {sessions.cards[1].cta}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}
