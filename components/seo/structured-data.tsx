import {
  generateStructuredData,
  generateFAQStructuredData,
  generateBreadcrumbStructuredData,
  generateProductStructuredData,
} from "@/lib/seo"
import { faqData } from "@/data/faq"

export function StructuredData() {
  const { organization, person } = generateStructuredData()

  const faqStructuredData = generateFAQStructuredData(
    faqData.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  )

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Inicio", url: "https://ferdycoach.com" },
    { name: "Coach del desamor", url: "https://ferdycoach.com" },
  ])

  const sessionProduct = generateProductStructuredData({
    name: "Sesiones 1 a 1 - Coach del desamor",
    description: "Sesiones personalizadas para superar rupturas amorosas",
    price: "75",
    currency: "EUR",
  })

  const programProduct = generateProductStructuredData({
    name: "Programa 4 - Transformación completa",
    description: "Programa de 4 semanas para superar el desamor",
    price: "497",
    currency: "EUR",
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sessionProduct) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(programProduct) }} />
    </>
  )
}
