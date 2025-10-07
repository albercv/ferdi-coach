import {
  generateStructuredData,
  generateFAQStructuredData,
  generateBreadcrumbStructuredData,
  generateProductStructuredData,
  generateLocalBusinessStructuredData,
} from "@/lib/seo"
import { siteContent } from "@/data/content"

export function StructuredData() {
  const { organization, person } = generateStructuredData()

  const faqStructuredData = generateFAQStructuredData(
    siteContent.faq.items.map((item: { question: string; answer: string }) => ({
      question: item.question,
      answer: item.answer,
    })),
  )

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Inicio", url: "https://ferdy-coach.com" },
    { name: "Coach para superar rupturas", url: "https://ferdy-coach.com" },
  ])

  const sessionProduct = generateProductStructuredData({
    name: "Sesiones individuales de coaching emocional",
    description: "Acompañamiento personalizado para superar tu ruptura de pareja",
    price: "97",
    currency: "EUR",
  })

  const programProduct = generateProductStructuredData({
    name: "Programa intensivo: Supera tu ruptura en 4 semanas",
    description: "Transforma tu dolor en crecimiento personal y recupera tu bienestar emocional",
    price: "297",
    currency: "EUR",
  })

  const localBusiness = generateLocalBusinessStructuredData()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sessionProduct) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(programProduct) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
    </>
  )
}
