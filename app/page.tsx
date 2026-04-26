export const dynamic = "force-dynamic"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { ForWhoSection } from "@/components/sections/for-who-section"
import { SessionsSection } from "@/components/sections/sessions-section"
import { GuidesSection } from "@/components/sections/guides-section"
import HowItWorksSectionV2 from "@/components/sections/how-it-works-section-v2"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { AboutSection } from "@/components/sections/about-section"
import { FAQSection } from "@/components/sections/faq-section"
import { CTASection } from "@/components/ui/cta-section"
import { BreakerBanner } from "@/components/ui/breaker-banner"
import { Toggle3D } from "@/components/ui/3d-toggle"
import { LazyLoad } from "@/components/performance/intersection-observer"
import { getTestimonials, getFAQ, getAbout, getHero, getCTA, getBreaker, getForWho } from "@/lib/content-md"
import { getProducts } from "@/lib/products-md"
import { getSectionStyles } from "@/lib/section-styles"
import { SectionBg } from "@/components/sections/SectionBg"
import type { PaymentProductRef } from "@/lib/payments"

export default function HomePage() {
  const testimonials = getTestimonials()
  const about = getAbout()
  const faq = getFAQ()
  const { guides, sessions } = getProducts()
  const individual = sessions.find((s) => s.subtype === "individual") || sessions[0]
  const reserveProduct: PaymentProductRef = {
    kind: "session",
    id: individual.id,
    subtype: "individual",
    title: individual.title,
    priceEuro: Number(individual.price || 0),
  }
  const hero = getHero()
  const cta = getCTA()
  const breaker = getBreaker()
  const forWho = getForWho()
  const sectionStyles = getSectionStyles()
  return (
    <>
      <Header reserveProduct={reserveProduct} />
      <main id="main-content">
        <HeroSection hero={hero} />
        <SectionBg id="breaker" styles={sectionStyles}>
          <BreakerBanner text={breaker.text} kicker={breaker.kicker} />
        </SectionBg>
        <SectionBg id="forWho" styles={sectionStyles}>
          <ForWhoSection forWho={forWho} />
        </SectionBg>
        <SectionBg id="sessions" styles={sectionStyles}>
          <LazyLoad>
            <SessionsSection sessions={sessions} />
          </LazyLoad>
        </SectionBg>
        <SectionBg id="guides" styles={sectionStyles}>
          <LazyLoad>
            <GuidesSection guides={guides} />
          </LazyLoad>
        </SectionBg>
        <SectionBg id="testimonials" styles={sectionStyles}>
          <LazyLoad>
            <TestimonialsSection testimonials={testimonials} />
          </LazyLoad>
        </SectionBg>
        <SectionBg id="about" styles={sectionStyles}>
          <LazyLoad>
            <AboutSection about={about} />
          </LazyLoad>
        </SectionBg>
        <LazyLoad>
          <HowItWorksSectionV2 />
        </LazyLoad>
        <SectionBg id="faqs" styles={sectionStyles}>
          <LazyLoad>
            <FAQSection faq={faq} />
          </LazyLoad>
        </SectionBg>
        <SectionBg id="cta" styles={sectionStyles}>
          <CTASection
            title={cta.title}
            description={cta.description}
            primaryCTA={{
              text: cta.buttonText,
              href: "#reservar",
            }}
            reserveProduct={reserveProduct}
            showTrustSeals={true}
          />
        </SectionBg>
      </main>
      <Footer />
      <Toggle3D />
    </>
  )
}
