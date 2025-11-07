import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { ForWhoSection } from "@/components/sections/for-who-section"
import { SessionsSection } from "@/components/sections/sessions-section"
import { GuidesSection } from "@/components/sections/guides-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { AboutSection } from "@/components/sections/about-section"
import { FAQSection } from "@/components/sections/faq-section"
import { CTASection } from "@/components/ui/cta-section"
import { Toggle3D } from "@/components/ui/3d-toggle"
import { LazyLoad } from "@/components/performance/intersection-observer"
import { getTestimonials, getFAQ, getAbout } from "@/lib/content-md"

export default function HomePage() {
  const testimonials = getTestimonials()
  const about = getAbout()
  const faq = getFAQ()
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <LazyLoad>
          <HowItWorksSection />
        </LazyLoad>
        <LazyLoad>
          <TestimonialsSection testimonials={testimonials} />
        </LazyLoad>
        <ForWhoSection />
        <SessionsSection />
        <LazyLoad>
          <GuidesSection />
        </LazyLoad>
        <LazyLoad>
          <AboutSection about={about} />
        </LazyLoad>
        <LazyLoad>
          <FAQSection faq={faq} />
        </LazyLoad>
        <CTASection
          title="No tienes que pasar por esto solo"
          description="En 60 minutos puedes tener un plan para esta semana y volver a respirar con calma."
          primaryCTA={{
            text: "Reservar sesión",
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
