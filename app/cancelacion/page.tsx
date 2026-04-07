import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Section } from "@/components/ui/section"
import { getProducts } from "@/lib/products-md"
import type { PaymentProductRef } from "@/lib/payments"

export const metadata: Metadata = {
  title: "Política de Cancelación - Ferdy Coach",
  description: "Condiciones de cancelación, reprogramación y reembolso de los servicios de coaching emocional de Ferdy Coach.",
  robots: { index: true, follow: true },
}

export default function CancelacionPage() {
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
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-balance mb-2">
              Política de Cancelación
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              Última actualización: abril de 2026
            </p>

            <div className="space-y-8 text-base leading-relaxed text-foreground">

              <div>
                <p className="text-muted-foreground">
                  Entendemos que pueden surgir imprevistos. A continuación encontrarás las
                  condiciones de cancelación y reprogramación de cada servicio. Te pedimos que
                  las leas con atención antes de formalizar tu reserva.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">1. Sesión individual (45 €)</h2>
                <div className="space-y-3">
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold text-foreground">Con más de 24 horas de antelación</p>
                    <p className="text-muted-foreground">
                      Puedes cancelar o reprogramar tu sesión sin coste alguno. Se reembolsará el
                      importe íntegro mediante transferencia al mismo número de cuenta desde el que
                      realizaste el pago, en un plazo máximo de 5 días hábiles.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="font-semibold text-foreground">Con menos de 24 horas de antelación o no asistencia</p>
                    <p className="text-muted-foreground">
                      La sesión se considerará consumida y no procederá reembolso alguno. La ausencia
                      sin aviso previo implica la pérdida de la sesión y del importe abonado.
                    </p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-semibold text-foreground">Reprogramación</p>
                    <p className="text-muted-foreground">
                      Se permite una única reprogramación gratuita siempre que se solicite con más de
                      24 horas de antelación. Las reprogramaciones adicionales se gestionarán caso a
                      caso.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">2. La Brújula — Programa 4 semanas (180 €)</h2>
                <div className="space-y-3">
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold text-foreground">Antes del inicio del programa</p>
                    <p className="text-muted-foreground">
                      Cancelación con más de 24 horas antes de la primera sesión: reembolso íntegro
                      de los 180 € en un plazo máximo de 5 días hábiles.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="font-semibold text-foreground">Una vez iniciado el programa</p>
                    <p className="text-muted-foreground">
                      No se realizarán reembolsos por las sesiones restantes una vez que el programa
                      haya comenzado, salvo causa de fuerza mayor debidamente acreditada (enfermedad
                      grave documentada u otras circunstancias excepcionales a valorar por Ferdy Coach).
                    </p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-semibold text-foreground">Pausa del programa</p>
                    <p className="text-muted-foreground">
                      Si necesitas pausar el programa por causas justificadas, contacta con
                      hola@ferdycoach.com. Se valorará la posibilidad de aplazar las sesiones restantes
                      hasta un máximo de 60 días naturales desde la fecha de la última sesión realizada.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="font-semibold text-foreground">No asistencia a una sesión del programa</p>
                    <p className="text-muted-foreground">
                      Las sesiones no realizadas sin aviso con más de 24 horas de antelación se
                      consideran consumidas y no se compensarán con sesiones adicionales.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">3. Guía digital gratuita</h2>
                <p className="text-muted-foreground">
                  Al ser un producto gratuito, no aplica ninguna política de devolución.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">4. Cancelación por parte de Ferdy Coach</h2>
                <p className="text-muted-foreground">
                  En el caso excepcional de que Ferdy Coach deba cancelar una sesión ya confirmada,
                  se notificará al usuario con la mayor antelación posible y se ofrecerá, a elección
                  del usuario:
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Reprogramación en la fecha más próxima disponible.</li>
                  <li>Reembolso íntegro del importe abonado correspondiente a esa sesión.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">5. Cómo cancelar o reprogramar</h2>
                <p className="text-muted-foreground mb-3">
                  Para cancelar o reprogramar una sesión, contacta con nosotros por cualquiera de
                  estas vías antes de que venza el plazo aplicable:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>
                    <strong className="text-foreground">Correo electrónico:</strong>{" "}
                    <a
                      href="mailto:hola@ferdycoach.com"
                      className="underline hover:text-foreground transition-colors"
                    >
                      hola@ferdycoach.com
                    </a>
                  </li>
                  <li>
                    <strong className="text-foreground">WhatsApp / Teléfono:</strong>{" "}
                    <a
                      href="tel:+34651611463"
                      className="underline hover:text-foreground transition-colors"
                    >
                      +34 651 611 463
                    </a>
                  </li>
                </ul>
                <p className="mt-3 text-muted-foreground text-sm">
                  Indica en tu mensaje tu nombre, el servicio contratado, la fecha y hora de la
                  sesión y el motivo de la cancelación o reprogramación. La recepción de tu solicitud
                  se confirmará por el mismo canal en un plazo máximo de 24 horas.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">6. Reembolsos</h2>
                <p className="text-muted-foreground">
                  Los reembolsos se realizan siempre mediante transferencia bancaria al número de
                  cuenta de origen. No se realizan devoluciones en efectivo ni a través de otros
                  medios de pago. El plazo de abono es de máximo{" "}
                  <strong className="text-foreground">5 días hábiles</strong> desde la confirmación
                  de la cancelación.
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
