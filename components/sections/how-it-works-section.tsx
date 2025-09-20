import { Section } from "@/components/ui/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageCircle, Target, Shield } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Calendar,
      title: "1. Reserva tu sesión gratuita",
      description: "Agenda una llamada de 30 minutos sin compromiso para conocer tu situación actual",
    },
    {
      icon: Target,
      title: "2. Diseñamos tu plan personalizado",
      description: "Creamos una estrategia específica para tu proceso de recuperación emocional",
    },
    {
      icon: MessageCircle,
      title: "3. Comenzamos el acompañamiento",
      description: "Sesiones regulares con seguimiento continuo y herramientas prácticas",
    },
    {
      icon: Shield,
      title: "4. Garantía de resultados",
      description: "Si no ves progreso en las primeras 2 semanas, te devolvemos tu inversión",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
