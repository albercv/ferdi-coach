import React from "react"
import { getProducts, GuideProduct, SessionProduct } from "@/lib/products-md"
import { Button } from "@/components/ui/button"
import { User, CheckCircle, BookOpen } from "lucide-react"
import { PaymentDialog } from "@/components/payments/PaymentDialog"

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

export default function HowItWorksSectionV2() {
  const picks = resolveFeatured()

  const cards = picks.filter(Boolean) as Array<GuideProduct | SessionProduct>

  return (
    <section id="como-funciona" className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Cómo funciona</h2>
          <p className="mt-4 text-muted-foreground">Elige tu servicio y comienza tu transformación</p>
        </div>

        {/* Cards compactas: solo resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {cards.map((item, idx) => {
            const isCenter = idx === 1
            const title = item.title
            const price = item.price
            const summary = (item as any).kind === "guide" ? (item as GuideProduct).miniDescription : (item as SessionProduct).description
            const Icon = ((item as any).kind === "guide") ? BookOpen : ((item as SessionProduct).subtype === "program4" ? CheckCircle : User)
            return (
              <div
                key={item.id}
                className={`bg-card rounded-lg p-4 text-center hover:shadow-md transition-shadow ${isCenter ? "relative border-2" : "border border-border"}`}
                style={isCenter ? { borderColor: '#517e61' } : undefined}
              >
                {isCenter && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#b5ac69', color: 'white' }}>
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: '#517e61' }}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#517e61' }}>{title}</h3>
                <p className="text-xs text-muted-foreground mb-2 truncate">{summary}</p>
                <p className="text-lg font-bold mb-3" style={{ color: '#517e61' }}>€{price}</p>
                {(item as any).kind === "guide" ? (
                  Number((item as GuideProduct).price || 0) > 0 ? (
                    <PaymentDialog
                      product={{
                        kind: "guide",
                        id: item.id,
                        title: item.title,
                        priceEuro: Number((item as GuideProduct).price || 0),
                      }}
                      trigger={
                        <Button size="sm" className="w-full text-xs font-medium bg-[#517e61] hover:bg-[#406e55] text-white">
                          Pagar
                        </Button>
                      }
                    />
                  ) : (
                    <Button asChild size="sm" className="w-full text-xs font-medium bg-[#517e61] hover:bg-[#406e55] text-white">
                      <a href={(item as GuideProduct).fileUrl || "/fake.pdf"}>Descargar ahora</a>
                    </Button>
                  )
                ) : (
                  <PaymentDialog
                    product={{
                      kind: "session",
                      id: item.id,
                      subtype: (item as SessionProduct).subtype,
                      title: item.title,
                      priceEuro: Number((item as SessionProduct).price || 0),
                    }}
                    trigger={
                      <Button size="sm" className="w-full text-xs font-medium bg-[#517e61] hover:bg-[#406e55] text-white">
                        Pagar
                      </Button>
                    }
                  />
                )}
              </div>
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
