import {
  SITE_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
  SOCIAL_INSTAGRAM,
  SOCIAL_TIKTOK,
} from "@/lib/site-config"

export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
}

export interface ReviewInput {
  author: string
  rating: number
  text: string
}

// @id estables para cross-linking entre entidades del grafo de schema.
const ORG_ID = `${SITE_URL}/#organization`
const PERSON_ID = `${SITE_URL}/#ferdy`
const WEBSITE_ID = `${SITE_URL}/#website`
const LOCALBUSINESS_ID = `${SITE_URL}/#localbusiness`
const SERVICE_INDIVIDUAL_ID = `${SITE_URL}/#service-individual`
const SERVICE_PROGRAMA_ID = `${SITE_URL}/#service-programa`

// Estática a propósito: evita reescribir validFrom en cada render.
const OFFER_VALID_FROM = "2026-01-01T00:00:00.000Z"

const SOCIAL_LINKS = [SOCIAL_INSTAGRAM, SOCIAL_TIKTOK]

export function generateStructuredData() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Ferdy Coach",
    url: SITE_URL,
    inLanguage: "es-ES",
    publisher: { "@id": ORG_ID },
  }

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Ferdy Coach",
    description: "Coach emocional especializado en superar rupturas de pareja y duelo amoroso",
    url: SITE_URL,
    logo: `${SITE_URL}/logo2.webp`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT_PHONE_E164,
      email: CONTACT_EMAIL,
      contactType: "customer service",
      availableLanguage: "Spanish",
    },
    sameAs: SOCIAL_LINKS,
    areaServed: {
      "@type": "Country",
      name: "Spain",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de coaching emocional",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sesiones individuales de coaching emocional",
            description: "Acompañamiento personalizado para superar ruptura de pareja",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Programa intensivo 4 semanas",
            description: "Programa completo para superar ruptura y recuperar bienestar emocional",
          },
        },
      ],
    },
  }

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Ferdy",
    jobTitle: "Coach emocional especializado en rupturas de pareja",
    description: "Coach especializado en ayudar a superar rupturas amorosas, duelo emocional y dependencia emocional",
    url: `${SITE_URL}/sobre-mi`,
    worksFor: { "@id": ORG_ID },
    mainEntityOfPage: { "@id": ORG_ID },
    sameAs: SOCIAL_LINKS,
    knowsAbout: [
      "Coaching emocional",
      "Superación de rupturas de pareja",
      "Duelo amoroso",
      "Dependencia emocional",
      "Contacto cero",
      "Autoestima tras ruptura",
      "Límites emocionales sanos",
      "Bienestar emocional",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Certificación en Coaching Transpersonal",
    },
    hasCredential: [
      "Coaching Transpersonal",
      "Especialización en duelo amoroso",
      "Metodología propia de 4 hitos para superar rupturas",
    ],
  }

  return { website, organization, person }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  // Un breadcrumb de un solo nivel no aporta señal: no se renderiza.
  if (items.length <= 1) return null

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function generateServiceStructuredData(service: {
  id: string
  name: string
  description: string
  price: string
  currency: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": service.id,
    name: service.name,
    description: service.description,
    serviceType: "Coaching emocional para rupturas de pareja",
    provider: { "@id": PERSON_ID },
    areaServed: {
      "@type": "Country",
      name: "Spain",
    },
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: service.currency,
      availability: "https://schema.org/InStock",
      validFrom: OFFER_VALID_FROM,
      seller: { "@id": ORG_ID },
    },
  }
}

export const SERVICE_IDS = {
  individual: SERVICE_INDIVIDUAL_ID,
  programa: SERVICE_PROGRAMA_ID,
}

export function generatePageMetadata(config: SEOConfig) {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.canonical,
      images: config.ogImage ? [{ url: config.ogImage }] : undefined,
    },
    twitter: {
      title: config.title,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : undefined,
    },
    alternates: {
      canonical: config.canonical,
    },
  }
}

export function generateLocalBusinessStructuredData(reviews: ReviewInput[] = []) {
  const review = reviews.map((item) => ({
    "@type": "Review",
    author: { "@type": "Person", name: item.author },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(item.rating),
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: item.text,
  }))

  const aggregateRating =
    reviews.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: (
            reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
          ).toFixed(1),
          reviewCount: String(reviews.length),
          bestRating: "5",
          worstRating: "1",
        }
      : undefined

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": LOCALBUSINESS_ID,
    name: "Ferdy Coach",
    description: "Coach emocional especializado en superar rupturas de pareja y duelo amoroso",
    url: SITE_URL,
    telephone: CONTACT_PHONE_E164,
    email: CONTACT_EMAIL,
    areaServed: {
      "@type": "Country",
      name: "Spain",
    },
    priceRange: "€€",
    openingHours: "Mo-Fr 09:00-18:00",
    sameAs: SOCIAL_LINKS,
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(review.length > 0 ? { review } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de coaching para superar rupturas",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sesión individual coaching emocional",
            description: "Sesión personalizada para superar ruptura de pareja",
            provider: { "@id": PERSON_ID },
          },
          price: "50",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Programa intensivo 4 semanas",
            description: "Programa completo para superar ruptura y recuperar bienestar",
            provider: { "@id": PERSON_ID },
          },
          price: "200",
          priceCurrency: "EUR",
        },
      ],
    },
  }
}
