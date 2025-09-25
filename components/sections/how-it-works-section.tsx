import { Section } from "@/components/ui/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, CreditCard, Calendar, Mail, Shield } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: ShoppingCart,
      title: "1. Elige tu servicio y pulsa Reservar",
      description: "Selecciona la opción que mejor se adapte a tus necesidades y haz clic en el botón de reserva",
    },
    {
      icon: CreditCard,
      title: "2. Realiza el pago seguro (tarjeta/PayPal)",
      description: "Completa tu pago de forma segura usando tu tarjeta de crédito o PayPal",
    },
    {
      icon: Calendar,
      title: "3. Se abre Calendly para elegir día y hora",
      description: "Accede al calendario y selecciona el día y horario que mejor te convenga",
    },
    {
      icon: Mail,
      title: "4. Recibirás un email con la confirmación",
      description: "Te enviaremos la confirmación y el enlace de videollamada a tu correo electrónico",
    },
    {
      icon: Shield,
      title: "5. Política flexible de cambios",
      description: "Cambios o cancelaciones hasta 24h antes.",
    },
  ]

  return (
    <Section id="como-funciona" aria-labelledby="como-funciona-title" className="bg-secondary/30">
      <div className="text-center mb-12">
        <h2 id="como-funciona-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          Cómo funciona la reserva
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Un proceso simple y transparente para comenzar tu transformación
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <Card key={index} className="text-center h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pretty">{step.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
