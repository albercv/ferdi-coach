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

        {/* Cards con CTA alineado abajo */}
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {cards.map((item, idx) => {
            const btn = buttonFor(item)
            const isCenter = idx === 1
            const title = item.title
            const price = item.price
            const features = item.features
            const description = (item as any).kind === "guide" ? (item as GuideProduct).miniDescription : (item as SessionProduct).description
            const isPopular = Boolean(item.mostPopular) || isCenter
            return (
              <Card key={item.id} className={`relative ${isCenter ? "border-primary shadow-lg" : ""} flex flex-col h-full`}>
                <CardHeader>
                  {isCenter && (
                    <Badge className="absolute right-4 top-4" variant="default">Más Popular</Badge>
                  )}
                  <CardTitle className="text-xl">{title}</CardTitle>
                  <div className="mt-2 text-muted-foreground">{description}</div>
                  <div className="mt-4 text-2xl font-bold">€{price}</div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Botón abajo siempre */}
                  <div className="mt-auto pt-6">
                    <Button asChild className={isPopular ? "w-full" : "w-full"}>
                      <a href={btn.href}>{btn.label}</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Proceso de Compra - estilos restaurados */}
        <div className="mt-16 bg-muted/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-center mb-4" style={{color: '#517e61'}}>Proceso de Compra</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {/* Paso 1 */}
            <div className="bg-card rounded-lg p-3 text-center" style={{border: '1px solid #b5ac69'}}>
              <div className="w-6 h-6 mx-auto mb-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#b5ac69'}}>
                <span className="text-xs font-bold text-white">1</span>
              </div>
              <h4 className="font-medium text-xs mb-1" style={{color: '#b5ac69'}}>Elige tu servicio</h4>
              <p className="text-xs text-muted-foreground">Selecciona el plan ideal</p>
            </div>
            {/* Paso 2 */}
            <div className="bg-card rounded-lg p-3 text-center" style={{border: '1px solid #a09e5f'}}>
              <div className="w-6 h-6 mx-auto mb-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#a09e5f'}}>
                <span className="text-xs font-bold text-white">2</span>
              </div>
              <h4 className="font-medium text-xs mb-1" style={{color: '#a09e5f'}}>Pago seguro</h4>
              <p className="text-xs text-muted-foreground">Proceso 100% seguro</p>
            </div>
            {/* Paso 3 */}
            <div className="bg-card rounded-lg p-3 text-center" style={{border: '1px solid #6b8f5a'}}>
              <div className="w-6 h-6 mx-auto mb-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#6b8f5a'}}>
                <span className="text-xs font-bold text-white">3</span>
              </div>
              <h4 className="font-medium text-xs mb-1" style={{color: '#6b8f5a'}}>Reserva tu cita</h4>
              <p className="text-xs text-muted-foreground">Elige fecha y hora</p>
            </div>
            {/* Paso 4 */}
            <div className="bg-card rounded-lg p-3 text-center" style={{border: '1px solid #517e61'}}>
              <div className="w-6 h-6 mx-auto mb-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#517e61'}}>
                <span className="text-xs font-bold text-white">4</span>
              </div>
              <h4 className="font-medium text-xs mb-1" style={{color: '#517e61'}}>Confirmación</h4>
              <p className="text-xs text-muted-foreground">Recibe tu confirmación</p>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p className="mb-1">🔒 Pago 100% seguro con encriptación SSL</p>
            <p>📅 Política de cambios flexible hasta 24h antes</p>
          </div>
        </div>
      </div>
    </section>
  )
}