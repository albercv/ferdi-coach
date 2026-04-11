export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
}

export function generateStructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ferdy Coach",
    description: "Coach emocional especializado en superar rupturas de pareja y duelo amoroso",
    url: "https://ferdy-coach.com",
    logo: "https://ferdy-coach.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+34-XXX-XXX-XXX",
      contactType: "customer service",
      availableLanguage: "Spanish",
    },
    sameAs: ["https://instagram.com/ferdycoach_desamor_desamor"],
    areaServed: {
      "@type": "Country",
      name: "Spain",
    },
    serviceType: "Coaching emocional para rupturas de pareja",
    priceRange: "€€",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de coaching emocional",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sesiones individuales de coaching emocional",
            description: "Acompañamiento personalizado para superar ruptura de pareja"
          }
        },
        {
          "@type": "Offer", 
          itemOffered: {
            "@type": "Service",
            name: "Programa intensivo 4 semanas",
            description: "Programa completo para superar ruptura y recuperar bienestar emocional"
          }
        }
      ]
    }
  }

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ferdy",
    jobTitle: "Coach emocional especializado en rupturas de pareja",
    description: "Coach especializado en ayudar a superar rupturas amorosas, duelo emocional y dependencia emocional",
    url: "https://ferdy-coach.com/sobre-mi",
    worksFor: {
      "@type": "Organization",
      name: "Ferdy Coach",
    },
    knowsAbout: [
      "Coaching emocional",
      "Superación de rupturas de pareja",
      "Duelo amoroso",
      "Dependencia emocional",
      "Contacto cero",
      "Autoestima tras ruptura",
      "Límites emocionales sanos",
      "Bienestar emocional"
    ],
    alumniOf: "Certificación en Coaching Transpersonal",
    hasCredential: [
      "Coaching Transpersonal",
      "Especialización en duelo amoroso",
      "Metodología propia de 4 hitos para superar rupturas"
    ]
  }

  return { organization, person }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
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

export function generateProductStructuredData(product: {
  name: string
  description: string
  price: string
  currency: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: "Coaching Services",
    brand: {
      "@type": "Brand",
      name: "Ferdy Coach",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
      seller: {
        "@type": "Organization",
        name: "Ferdy Coach",
      },
    },
  }
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

export function generateLocalBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://ferdy-coach.com",
    name: "Ferdy Coach",
    description: "Coach emocional especializado en superar rupturas de pareja y duelo amoroso",
    url: "https://ferdy-coach.com",
    telephone: "+34-XXX-XXX-XXX",
    email: "hola@ferdy-coach.com",
    areaServed: {
      "@type": "Country",
      name: "Spain",
    },
    serviceType: "Coaching emocional online para rupturas de pareja",
    priceRange: "€€",
    openingHours: "Mo-Fr 09:00-18:00",
    sameAs: ["https://instagram.com/ferdycoach_desamor"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "50",
      bestRating: "5",
      worstRating: "1"
    },
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
            provider: {
              "@type": "Person",
              name: "Ferdy"
            }
          },
          price: "97",
          priceCurrency: "EUR"
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service", 
            name: "Programa intensivo 4 semanas",
            description: "Programa completo para superar ruptura y recuperar bienestar",
            provider: {
              "@type": "Person",
              name: "Ferdy"
            }
          },
          price: "297",
          priceCurrency: "EUR"
        }
      ]
    }
  }
}
