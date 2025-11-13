import React from "react"
import { getProducts, GuideProduct, SessionProduct } from "@/lib/products-md"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function resolveFeatured() {
  const { guides, sessions } = getProducts()
  const picks: Array<(GuideProduct | SessionProduct) | null> = [null, null, null]
  const all: Array<GuideProduct | SessionProduct> = [...guides, ...sessions]

  // place featured by spot
  for (const item of all) {
    const spot = item.featuredSpot
    if (spot && spot >= 1 && spot <= 3) {
      picks[spot - 1] = item
    }
  }

  // If center lacks mostPopular, mark it from any item with mostPopular=true
  const center = picks[1]
  if (!center) {
    const popular = all.find((it) => it.mostPopular)
    if (popular) picks[1] = popular
  }

  // Fallbacks: if any spot missing, use reasonable defaults from existing collections
  const individual = sessions.find((s) => s.subtype === "individual") || sessions[0]
  const program4 = sessions.find((s) => s.subtype === "program4") || sessions[1]
  const guide = guides[0]

  if (!picks[0]) picks[0] = individual || guide || null
  if (!picks[1]) picks[1] = program4 || individual || guide || null
  if (!picks[2]) picks[2] = guide || individual || program4 || null

  return picks
}

function buttonFor(item: GuideProduct | SessionProduct) {
  if ((item as any).kind === "guide") {
    return { label: "Descargar ahora", href: (item as GuideProduct).fileUrl || "/fake.pdf" }
  } else {
    const s = item as SessionProduct
    return s.subtype === "program4" ? { label: "Empezar programa", href: "/#programa-4" } : { label: "Reservar ahora", href: "/#sesion-individual" }
  }
}

export default function HowItWorksSectionV2() {
  const picks = resolveFeatured()

  const cards = picks.filter(Boolean) as Array<GuideProduct | SessionProduct>

  return (
    <section id="como-funciona" className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Cómo funciona</h2>
          <p className="mt-4 text-muted-foreground">Elige la opción que mejor se adapta a tu proceso</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((item, idx) => {
            const btn = buttonFor(item)
            const isCenter = idx === 1
            const title = item.title
            const price = item.price
            const features = item.features
            const description = (item as any).kind === "guide" ? (item as GuideProduct).miniDescription : (item as SessionProduct).description
            const isPopular = Boolean(item.mostPopular) || isCenter
            return (
              <Card key={item.id} className={`relative ${isCenter ? "border-primary shadow-lg" : ""}`}>
                <CardHeader>
                  {isCenter && (
                    <Badge className="absolute right-4 top-4" variant="default">Más Popular</Badge>
                  )}
                  <CardTitle className="text-xl">{title}</CardTitle>
                  <div className="mt-2 text-muted-foreground">{description}</div>
                  <div className="mt-4 text-2xl font-bold">€{price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button asChild className={isCenter ? "w-full" : "w-full"}>
                      <a href={btn.href}>{btn.label}</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-4">Proceso de Compra</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: 1, title: "Elige tu producto", text: "Selecciona la guía o el programa que mejor se adapte a tu situación." },
              { step: 2, title: "Completa el pedido", text: "Realiza el pago y obtén acceso inmediato a tu guía o agenda tu sesión." },
              { step: 3, title: "Sigue el plan", text: "Aplica las estrategias, o trabaja conmigo 1 a 1 si eliges sesiones." },
              { step: 4, title: "Evoluciona", text: "Te acompaño durante el proceso para que avances con confianza." },
            ].map((p) => (
              <div key={p.step} className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Paso {p.step}</div>
                <div className="mt-1 font-medium">{p.title}</div>
                <p className="mt-2 text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}