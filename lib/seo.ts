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
    description: "Coach especializado en superar rupturas amorosas y desamor",
    url: "https://ferdycoach.com",
    logo: "https://ferdycoach.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+34-XXX-XXX-XXX",
      contactType: "customer service",
      availableLanguage: "Spanish",
    },
    sameAs: ["https://instagram.com/ferdycoach"],
    areaServed: {
      "@type": "Country",
      name: "Spain",
    },
    serviceType: "Coaching emocional",
    priceRange: "€€",
  }

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ferdy",
    jobTitle: "Coach del desamor",
    description: "Coach especializado en ayudar a superar rupturas amorosas y procesos de duelo emocional",
    url: "https://ferdycoach.com/sobre-mi",
    worksFor: {
      "@type": "Organization",
      name: "Ferdy Coach",
    },
    knowsAbout: [
      "Coaching emocional",
      "Superación de rupturas",
      "Duelo amoroso",
      "Dependencia emocional",
      "Contacto cero",
    ],
    alumniOf: "Certificación en Coaching Emocional",
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
    "@id": "https://ferdycoach.com",
    name: "Ferdy Coach",
    description: "Coach especializado en superar rupturas amorosas",
    url: "https://ferdycoach.com",
    telephone: "+34-XXX-XXX-XXX",
    email: "hola@ferdycoach.com",
    areaServed: {
      "@type": "Country",
      name: "Spain",
    },
    serviceType: "Coaching emocional online",
    priceRange: "€€",
    openingHours: "Mo-Fr 09:00-18:00",
    sameAs: ["https://instagram.com/ferdycoach"],
  }
}
