import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Section } from "@/components/ui/section"
import { getProducts } from "@/lib/products-md"
import type { PaymentProductRef } from "@/lib/payments"

export const metadata: Metadata = {
  title: "Contacto - Ferdy Coach",
  description: "Ponte en contacto con Ferdy Coach. Te acompaño en tu proceso de superación tras una ruptura de pareja.",
  robots: { index: true, follow: true },
}

export default function ContactoPage() {
  const { sessions } = getProducts()
  const individual = sessions.find((s) => s.subtype === "individual") ?? sessions[0]
  const reserveProduct: PaymentProductRef = {
    kind: "session",
    id: individual.id,
    subtype: "individual",
    title: individual.title,
    priceEuro: Number(individual.price ?? 0),
  }

  return (
    <>
      <Header reserveProduct={reserveProduct} />
      <main id="main-content">
        <Section>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-balance mb-3">
              Contacto
            </h1>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed mb-10">
              ¿Tienes alguna pregunta antes de dar el primer paso? Escríbeme sin compromiso.
              Respondo en un plazo de 24–48 horas.
            </p>

            <div className="space-y-6">

              <div className="rounded-xl border border-border p-6 space-y-5">

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">Correo electrónico</p>
                    <a
                      href="mailto:ferdycoachdesamor@gmail.com"
                      className="text-accent underline hover:opacity-80 transition-opacity text-base"
                    >
                      ferdycoachdesamor@gmail.com
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">Para consultas, reservas y gestión de pagos</p>
                  </div>
                </div>

                <div className="border-t border-border" />

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.58 5.1 2 2 0 0 1 3.55 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.9-1.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">WhatsApp / Teléfono</p>
                    <a
                      href="tel:+34651611463"
                      className="text-accent underline hover:opacity-80 transition-opacity text-base"
                    >
                      +34 651 611 463
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">Para dudas rápidas y cancelaciones o cambios de sesión</p>
                  </div>
                </div>

                <div className="border-t border-border" />

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">Instagram</p>
                    <a
                      href="https://instagram.com/ferdycoach_desamor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline hover:opacity-80 transition-opacity text-base"
                    >
                      @ferdycoach_desamor
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">Contenido sobre duelo amoroso, herramientas y reflexiones</p>
                  </div>
                </div>

              </div>

              <div className="rounded-xl bg-secondary/50 border border-border p-6">
                <h2 className="font-semibold text-foreground mb-2">¿Primera vez aquí?</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Si no sabes por dónde empezar, escríbeme y agendamos una videollamada gratuita de
                  15 minutos para ver si el programa encaja contigo. Sin compromiso.
                </p>
                <p className="mt-3 text-sm">
                  <a
                    href="mailto:ferdycoachdesamor@gmail.com?subject=Primera%20consulta%20gratuita"
                    className="font-semibold text-accent underline hover:opacity-80 transition-opacity"
                  >
                    Solicitar consulta gratuita →
                  </a>
                </p>
              </div>

            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
