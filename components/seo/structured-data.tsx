import {
  generateStructuredData,
  generateFAQStructuredData,
  generateBreadcrumbStructuredData,
  generateServiceStructuredData,
  generateLocalBusinessStructuredData,
  SERVICE_IDS,
  type ReviewInput,
} from "@/lib/seo"
import { SITE_URL } from "@/lib/site-config"
import { siteContent } from "@/data/content"
import { getTestimonials } from "@/lib/content-md"

export function StructuredData() {
  const { website, organization, person } = generateStructuredData()

  const faqStructuredData = generateFAQStructuredData(
    siteContent.faq.items.map((item: { question: string; answer: string }) => ({
      question: item.question,
      answer: item.answer,
    })),
  )

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Inicio", url: SITE_URL },
    { name: "Coach para superar rupturas", url: SITE_URL },
  ])

  const sessionService = generateServiceStructuredData({
    id: SERVICE_IDS.individual,
    name: "Sesiones individuales de coaching emocional",
    description: "Acompañamiento personalizado para superar tu ruptura de pareja",
    price: "50",
    currency: "EUR",
  })

  const programService = generateServiceStructuredData({
    id: SERVICE_IDS.programa,
    name: "Programa intensivo: Supera tu ruptura en 4 semanas",
    description: "Transforma tu dolor en crecimiento personal y recupera tu bienestar emocional",
    price: "200",
    currency: "EUR",
  })

  const reviews: ReviewInput[] = getTestimonials().map((testimonial) => ({
    author: testimonial.name,
    rating: testimonial.rating,
    text: testimonial.text,
  }))

  const localBusiness = generateLocalBusinessStructuredData(reviews)

  const blocks = [
    website,
    organization,
    person,
    faqStructuredData,
    breadcrumbData,
    sessionService,
    programService,
    localBusiness,
  ].filter(Boolean)

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}
