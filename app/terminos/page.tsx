import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Section } from "@/components/ui/section"
import { getProducts } from "@/lib/products-md"
import type { PaymentProductRef } from "@/lib/payments"

// TODO: Completar con datos legales reales antes de publicar
console.warn("[terminos] DATOS PENDIENTES DE COMPLETAR:")
console.warn("  - NOMBRE_RESPONSABLE: Nombre completo o razón social del prestador del servicio")
console.warn("  - NIF_CIF: Número de Identificación Fiscal")
console.warn("  - DIRECCIÓN_FISCAL: Domicilio fiscal registrado")
console.warn("  - CIUDAD_JURISDICCIÓN: Ciudad para fuero judicial (recomendado: ciudad de residencia de Ferdy)")
console.warn("  - IVA: Confirmar si los precios incluyen IVA o están exentos (ej. servicio de coaching puede tributar al 21%)")

export const metadata: Metadata = {
  title: "Términos y Condiciones - Ferdy Coach",
  description: "Condiciones generales de contratación de los servicios de coaching emocional de Ferdy Coach.",
  robots: { index: false, follow: false },
}

export default function TerminosPage() {
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
              Términos y Condiciones
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              Última actualización: abril de 2026
            </p>

            <div className="space-y-8 text-base leading-relaxed text-foreground">

              <div>
                <h2 className="text-xl font-semibold mb-3">1. Identificación del prestador</h2>
                <p className="text-muted-foreground">
                  Los presentes Términos y Condiciones regulan la contratación de los servicios
                  ofrecidos a través del sitio web ferdycoach.com, de conformidad con la Ley 34/2002
                  de Servicios de la Sociedad de la Información (LSSICE) y el Real Decreto Legislativo
                  1/2007 (TRLGDCU).
                </p>
                <ul className="mt-3 space-y-1 text-muted-foreground list-none">
                  <li><strong className="text-foreground">Titular:</strong> [NOMBRE_RESPONSABLE]</li>
                  <li><strong className="text-foreground">NIF:</strong> [NIF_CIF]</li>
                  <li><strong className="text-foreground">Domicilio:</strong> [DIRECCIÓN_FISCAL]</li>
                  <li><strong className="text-foreground">Correo electrónico:</strong> hola@ferdycoach.com</li>
                  <li><strong className="text-foreground">Teléfono:</strong> +34 651 611 463</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">2. Objeto y ámbito de aplicación</h2>
                <p className="text-muted-foreground">
                  Ferdy Coach ofrece servicios de coaching emocional orientados al acompañamiento
                  personal durante procesos de duelo amoroso, dependencia emocional y reconstrucción
                  de la identidad tras una ruptura de pareja. El coaching no es psicoterapia ni
                  intervención clínica y no sustituye al tratamiento psicológico o psiquiátrico.
                </p>
                <p className="mt-2 text-muted-foreground">
                  La aceptación de estos términos implica que el usuario es mayor de 18 años y tiene
                  capacidad legal para contratar.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">3. Servicios disponibles y precios</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-muted-foreground border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Servicio</th>
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Precio</th>
                        <th className="text-left py-2 font-semibold text-foreground">Formato</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-2 pr-4">Sesión individual (70 min)</td>
                        <td className="py-2 pr-4">45 €</td>
                        <td className="py-2">Videollamada online</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">La Brújula — Programa 4 semanas (4 sesiones)</td>
                        <td className="py-2 pr-4">180 €</td>
                        <td className="py-2">Videollamada online + WhatsApp</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Guía digital descargable</td>
                        <td className="py-2 pr-4">Gratuita</td>
                        <td className="py-2">Descarga inmediata</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-muted-foreground text-sm">
                  [IVA: pendiente de confirmar si los precios incluyen o no IVA aplicable.]{" "}
                  Los precios están expresados en euros. Ferdy Coach se reserva el derecho de
                  modificar precios con antelación suficiente y sin efecto sobre contrataciones ya
                  formalizadas.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">4. Proceso de contratación y pago</h2>
                <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                  <li>El usuario selecciona el servicio y completa el formulario de reserva.</li>
                  <li>
                    El sistema genera una referencia de pago única que debe incluirse en el concepto
                    de la transferencia bancaria.
                  </li>
                  <li>
                    El usuario realiza la transferencia al IBAN facilitado en el formulario dentro
                    de las <strong className="text-foreground">48 horas siguientes</strong> a la reserva.
                    El incumplimiento de este plazo anulará la reserva.
                  </li>
                  <li>
                    Una vez verificada la recepción del pago, Ferdy Coach confirma la reserva por
                    correo electrónico y facilita el enlace de videollamada.
                  </li>
                </ol>
                <p className="mt-3 text-muted-foreground text-sm">
                  El contrato se perfecciona únicamente con la confirmación por correo electrónico
                  de Ferdy Coach. La simple reserva sin pago recibido no genera obligación alguna
                  por parte del prestador.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">5. Cancelación y devoluciones</h2>
                <p className="text-muted-foreground mb-2">
                  Se aplica la política de cancelación detallada en la{" "}
                  <a href="/cancelacion" className="underline hover:text-foreground transition-colors">
                    Política de Cancelación
                  </a>
                  . En resumen:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>
                    Cancelación con más de <strong className="text-foreground">24 horas de antelación</strong>:
                    reembolso íntegro del importe pagado o reprogramación sin coste.
                  </li>
                  <li>
                    Cancelación con menos de 24 horas o no asistencia sin aviso:
                    <strong className="text-foreground"> sin derecho a reembolso</strong>. La sesión
                    se considera consumida.
                  </li>
                  <li>
                    Programa de 4 semanas: cancelable únicamente antes del inicio de la primera sesión
                    con más de 24 horas de antelación. Una vez iniciado el programa,
                    <strong className="text-foreground"> no procede reembolso</strong> de las sesiones
                    restantes salvo causa de fuerza mayor acreditada.
                  </li>
                </ul>
                <p className="mt-3 text-muted-foreground text-sm">
                  Los servicios digitales gratuitos (guías descargables) no son reembolsables al
                  carecer de coste económico para el usuario.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">6. Derecho de desistimiento</h2>
                <p className="text-muted-foreground">
                  De conformidad con el artículo 103 del TRLGDCU, el derecho de desistimiento
                  <strong className="text-foreground"> no es aplicable</strong> a:
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                  <li>
                    Servicios ya prestados en su totalidad con el consentimiento previo del consumidor
                    (sesión realizada).
                  </li>
                  <li>
                    Contenido digital no suministrado en soporte material cuando la ejecución haya
                    comenzado con el consentimiento del consumidor y conocimiento de la pérdida del
                    derecho de desistimiento (guía descargada).
                  </li>
                </ul>
                <p className="mt-2 text-muted-foreground">
                  Para servicios no iniciados, el plazo de desistimiento es de{" "}
                  <strong className="text-foreground">14 días naturales</strong> desde la contratación.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">7. Limitación de responsabilidad</h2>
                <p className="text-muted-foreground mb-2">
                  Ferdy Coach se compromete a prestar el servicio con diligencia y profesionalidad.
                  Sin perjuicio de lo anterior:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>
                    El coaching emocional no garantiza resultados concretos. Los resultados dependen
                    del compromiso, participación activa y circunstancias personales de cada usuario.
                  </li>
                  <li>
                    Ferdy Coach no es responsable de decisiones personales que el usuario tome como
                    consecuencia o en el transcurso del proceso de coaching.
                  </li>
                  <li>
                    En ningún caso la responsabilidad de Ferdy Coach superará el importe total abonado
                    por el usuario por el servicio contratado.
                  </li>
                  <li>
                    Ferdy Coach no se responsabiliza de interrupciones del servicio por causas ajenas
                    a su control (fallos técnicos de terceros, fuerza mayor, etc.).
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">8. Confidencialidad</h2>
                <p className="text-muted-foreground">
                  Todo el contenido compartido en las sesiones de coaching es estrictamente
                  confidencial. Ferdy Coach no divulgará información personal del usuario a terceros
                  salvo obligación legal o cuando el usuario lo autorice expresamente. Esta obligación
                  de confidencialidad se mantiene indefinidamente una vez concluida la relación.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">9. Propiedad intelectual</h2>
                <p className="text-muted-foreground">
                  Todos los contenidos del sitio web (textos, imágenes, guías, materiales de sesión,
                  metodología y marca Ferdy Coach) son propiedad exclusiva del titular o están
                  licenciados para su uso. Queda expresamente prohibida su reproducción, distribución,
                  transformación o comunicación pública sin autorización escrita previa. El usuario
                  recibe una licencia personal, intransferible y no exclusiva para uso privado de los
                  materiales adquiridos.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">10. Modificación de los términos</h2>
                <p className="text-muted-foreground">
                  Ferdy Coach se reserva el derecho de modificar estos términos en cualquier momento.
                  Los cambios se publicarán en esta página con actualización de la fecha. Las
                  contrataciones ya formalizadas se regirán por los términos vigentes en el momento
                  de su celebración.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">11. Ley aplicable y jurisdicción</h2>
                <p className="text-muted-foreground">
                  Los presentes términos se rigen por la legislación española. Para cualquier
                  controversia que pudiera surgir, las partes se someten a los Juzgados y Tribunales
                  de <strong className="text-foreground">[CIUDAD_JURISDICCIÓN]</strong>, con renuncia
                  expresa a cualquier otro fuero que pudiera corresponderles, salvo que la normativa
                  de consumidores y usuarios establezca un fuero imperativo distinto en favor del
                  consumidor.
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
