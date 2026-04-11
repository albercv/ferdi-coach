import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Section } from "@/components/ui/section"
import { getProducts } from "@/lib/products-md"
import type { PaymentProductRef } from "@/lib/payments"

// TODO: Completar con datos legales reales antes de publicar
console.warn("[privacidad] DATOS PENDIENTES DE COMPLETAR:")
console.warn("  - NOMBRE_RESPONSABLE: Nombre completo o razón social del responsable del tratamiento")
console.warn("  - NIF_CIF: Número de Identificación Fiscal (NIF de autónomo o CIF de empresa)")
console.warn("  - DIRECCIÓN_FISCAL: Dirección postal registrada fiscalmente")
console.warn("  - CIUDAD_JURISDICCIÓN: Ciudad para determinar fuero judicial competente")

export const metadata: Metadata = {
  title: "Política de Privacidad - Ferdy Coach",
  description: "Información sobre el tratamiento de tus datos personales conforme al RGPD y la LOPD.",
  robots: { index: false, follow: false },
}

export default function PrivacidadPage() {
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
              Política de Privacidad
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              Última actualización: abril de 2026
            </p>

            <div className="space-y-8 text-base leading-relaxed text-foreground">

              <div>
                <h2 className="text-xl font-semibold mb-3">1. Responsable del tratamiento</h2>
                <p className="text-muted-foreground">
                  En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de
                  Protección de Datos Personales (LOPDGDD), te informamos de que el responsable del
                  tratamiento de tus datos personales es:
                </p>
                <ul className="mt-3 space-y-1 text-muted-foreground list-none">
                  <li><strong className="text-foreground">Nombre:</strong> [NOMBRE_RESPONSABLE]</li>
                  <li><strong className="text-foreground">NIF:</strong> [NIF_CIF]</li>
                  <li><strong className="text-foreground">Domicilio:</strong> [DIRECCIÓN_FISCAL]</li>
                  <li><strong className="text-foreground">Correo electrónico:</strong> ferdycoachdesamor@gmail.com</li>
                  <li><strong className="text-foreground">Teléfono:</strong> +34 651 611 463</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">2. Datos que recopilamos</h2>
                <p className="text-muted-foreground mb-3">
                  Recopilamos únicamente los datos estrictamente necesarios para la prestación del
                  servicio contratado:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Nombre completo</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de teléfono (opcional, solo si lo facilitas)</li>
                  <li>Referencia del pago bancario</li>
                  <li>Datos de navegación (dirección IP, tipo de navegador) a través de Vercel Analytics</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">3. Finalidad y base jurídica del tratamiento</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-muted-foreground border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Finalidad</th>
                        <th className="text-left py-2 font-semibold text-foreground">Base jurídica</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-2 pr-4">Gestión de la reserva y prestación del servicio de coaching</td>
                        <td className="py-2">Ejecución de un contrato (Art. 6.1.b RGPD)</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Gestión de pagos y facturación</td>
                        <td className="py-2">Obligación legal (Art. 6.1.c RGPD)</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Envío de comunicaciones relacionadas con el servicio contratado</td>
                        <td className="py-2">Ejecución de un contrato (Art. 6.1.b RGPD)</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Análisis de uso del sitio web (estadístico, agregado y anónimo)</td>
                        <td className="py-2">Interés legítimo (Art. 6.1.f RGPD)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-muted-foreground text-sm">
                  No utilizamos tus datos para elaborar perfiles ni para tomar decisiones automatizadas
                  que te afecten significativamente.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">4. Destinatarios de los datos</h2>
                <p className="text-muted-foreground mb-3">
                  Tus datos no se ceden a terceros salvo obligación legal. Los encargados del
                  tratamiento que acceden a tus datos para prestar servicios técnicos son:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>
                    <strong className="text-foreground">Vercel Inc.</strong> — Alojamiento web.
                    Certificado con el marco EU-US Data Privacy Framework.
                  </li>
                  <li>
                    <strong className="text-foreground">Resend Inc.</strong> — Envío de correos
                    transaccionales. Opera bajo Cláusulas Contractuales Tipo de la UE.
                  </li>
                </ul>
                <p className="mt-3 text-muted-foreground text-sm">
                  Ambos proveedores actúan exclusivamente como encargados del tratamiento y no
                  pueden utilizar tus datos para finalidades propias.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">5. Transferencias internacionales</h2>
                <p className="text-muted-foreground">
                  Los proveedores indicados anteriormente pueden procesar datos fuera del Espacio
                  Económico Europeo (EEE). Dichas transferencias se realizan con las garantías
                  adecuadas exigidas por el RGPD (Cláusulas Contractuales Tipo o marcos de
                  adecuación reconocidos por la Comisión Europea).
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">6. Plazos de conservación</h2>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>
                    <strong className="text-foreground">Datos contractuales:</strong> durante la
                    vigencia de la relación y hasta 5 años después para atender posibles
                    reclamaciones civiles.
                  </li>
                  <li>
                    <strong className="text-foreground">Datos de facturación:</strong> 6 años según
                    el artículo 30 del Código de Comercio.
                  </li>
                  <li>
                    <strong className="text-foreground">Datos de navegación:</strong> máximo 13 meses.
                  </li>
                </ul>
                <p className="mt-3 text-muted-foreground text-sm">
                  Transcurridos los plazos, los datos se eliminarán de forma segura.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">7. Tus derechos</h2>
                <p className="text-muted-foreground mb-3">
                  Puedes ejercer en cualquier momento los siguientes derechos enviando un correo a{" "}
                  <a href="mailto:ferdycoachdesamor@gmail.com" className="underline hover:text-foreground transition-colors">
                    ferdycoachdesamor@gmail.com
                  </a>{" "}
                  con una copia de tu documento de identidad:
                </p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li><strong className="text-foreground">Acceso:</strong> conocer qué datos tenemos sobre ti.</li>
                  <li><strong className="text-foreground">Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                  <li><strong className="text-foreground">Supresión:</strong> solicitar el borrado de tus datos cuando ya no sean necesarios.</li>
                  <li><strong className="text-foreground">Limitación:</strong> restringir el tratamiento en determinadas circunstancias.</li>
                  <li><strong className="text-foreground">Portabilidad:</strong> recibir tus datos en formato estructurado y de uso común.</li>
                  <li><strong className="text-foreground">Oposición:</strong> oponerte al tratamiento basado en interés legítimo.</li>
                </ul>
                <p className="mt-3 text-muted-foreground text-sm">
                  Responderemos a tu solicitud en el plazo máximo de un mes. Si no quedas satisfecho
                  con nuestra respuesta, tienes derecho a presentar una reclamación ante la{" "}
                  <strong className="text-foreground">
                    Agencia Española de Protección de Datos (AEPD)
                  </strong>{" "}
                  en{" "}
                  <span className="font-mono text-xs">www.aepd.es</span>.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">8. Seguridad</h2>
                <p className="text-muted-foreground">
                  Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos contra
                  accesos no autorizados, pérdida o destrucción accidental. La comunicación con el
                  servidor está cifrada mediante TLS/HTTPS. El acceso a los registros de pago está
                  restringido y requiere autenticación.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">9. Modificaciones de esta política</h2>
                <p className="text-muted-foreground">
                  Podemos actualizar esta política de privacidad para adaptarla a cambios legislativos
                  o en nuestros servicios. La fecha de última actualización siempre aparecerá al inicio
                  de este documento. Te recomendamos revisarla periódicamente.
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
