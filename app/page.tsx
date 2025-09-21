import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { ForWhoSection } from "@/components/sections/for-who-section"
import { SessionsSection } from "@/components/sections/sessions-section"
import { ProgramSection } from "@/components/sections/program-section"
import { ComparisonSection } from "@/components/sections/comparison-section"
import { GuidesSection } from "@/components/sections/guides-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { AboutSection } from "@/components/sections/about-section"
import { FAQSection } from "@/components/sections/faq-section"
import { CTASection } from "@/components/ui/cta-section"
import { Toggle3D } from "@/components/ui/3d-toggle"
import { PageBreadcrumbs } from "@/components/seo/breadcrumbs"
import { LazyLoad } from "@/components/performance/intersection-observer"

export default function HomePage() {
  return (
    <>
      <Header />
      <PageBreadcrumbs items={[{ name: "Coach del desamor" }]} />
      <main id="main-content">
        <HeroSection />
        <LazyLoad>
          <TestimonialsSection />
        </LazyLoad>
        <ForWhoSection />
        <SessionsSection />
        <ProgramSection />
        <ComparisonSection />
        <LazyLoad>
          <GuidesSection />
        </LazyLoad>
        <LazyLoad>
          <HowItWorksSection />
        </LazyLoad>
        <LazyLoad>
          <TestimonialsSection />
        </LazyLoad>
        <LazyLoad>
          <AboutSection />
        </LazyLoad>
        <LazyLoad>
          <FAQSection />
        </LazyLoad>
        <CTASection
          title="No tienes que pasar por esto solo"
          description="Reserva tu sesión gratuita y comienza tu proceso de transformación hoy mismo"
          primaryCTA={{
            text: "Reservar sesión gratuita",
            href: "#reservar",
          }}
          secondaryCTA={{
            text: "Ver Programa 4",
            href: "#programa-4",
          }}
        />
      </main>
      <Footer />
      <Toggle3D />
    </>
  )
}
