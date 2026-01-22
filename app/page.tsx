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
import { Toggle3D } from "@/components/ui/3d-toggle"
import { LazyLoad } from "@/components/performance/intersection-observer"
import { getTestimonials, getFAQ, getAbout, getHero, getCTA } from "@/lib/content-md"
import { getProducts } from "@/lib/products-md"

export default function HomePage() {
  const testimonials = getTestimonials()
  const about = getAbout()
  const faq = getFAQ()
  const { guides, sessions } = getProducts()
  const hero = getHero()
  const cta = getCTA()
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection hero={hero} />
        <LazyLoad>
          <HowItWorksSectionV2 />
        </LazyLoad>
        <LazyLoad>
          <TestimonialsSection testimonials={testimonials} />
        </LazyLoad>
        <ForWhoSection />
        <SessionsSection sessions={sessions} />
        <LazyLoad>
          <GuidesSection guides={guides} />
        </LazyLoad>
        <LazyLoad>
          <AboutSection about={about} />
        </LazyLoad>
        <LazyLoad>
          <FAQSection faq={faq} />
        </LazyLoad>
        <CTASection
          title={cta.title}
          description={cta.description}
          primaryCTA={{
            text: cta.buttonText,
            href: "#reservar",
          }}
          showTrustSeals={true}
        />
      </main>
      <Footer />
      <Toggle3D />
    </>
  )
}
