import { Section } from "@/components/ui/section"
import { Check, X } from "lucide-react"

export function ComparisonSection() {
  const comparisonData = [
    { feature: "Sesión de diagnóstico", session: true, program: true },
    { feature: "Plan personalizado", session: true, program: true },
    { feature: "Seguimiento entre sesiones", session: false, program: true },
    { feature: "Programa estructurado 4 semanas", session: false, program: true },
    { feature: "Grupo privado de apoyo", session: false, program: true },
    { feature: "Bonus y recursos extra", session: false, program: true },
    { feature: "Garantía de satisfacción", session: true, program: true },
  ]

  return (
    <Section id="comparativa" aria-labelledby="comparativa-title" className="bg-secondary/30">
      <div className="text-center mb-12">
        <h2 id="comparativa-title" className="text-3xl md:text-4xl font-bold mb-6 text-balance">
          Comparativa rápida
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Elige la opción que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <table className="w-full bg-card rounded-lg overflow-hidden shadow-sm">
          <caption className="sr-only">Comparación entre sesiones individuales y Programa 4</caption>
          <thead>
            <tr className="bg-muted">
              <th scope="col" className="text-left p-4 font-semibold">
                Características
              </th>
              <th scope="col" className="text-center p-4 font-semibold">
                Sesiones 1 a 1
              </th>
              <th scope="col" className="text-center p-4 font-semibold bg-accent text-accent-foreground">
                Programa 4
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index} className="border-t border-border">
                <td className="p-4 font-medium">{row.feature}</td>
                <td className="p-4 text-center">
                  {row.session ? (
                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  )}
                </td>
                <td className="p-4 text-center bg-accent/5">
                  {row.program ? (
                    <Check className="h-5 w-5 text-accent mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
