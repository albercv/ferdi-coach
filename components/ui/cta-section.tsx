"use client"

import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { TrustSeals } from "@/components/ui/trust-seals"
import type { PaymentProductRef } from "@/lib/payments"
import { PaymentDialog } from "@/components/payments/PaymentDialog"

interface CTASectionProps {
  id?: string
  title: string
  description: string
  primaryCTA: {
    text: string
    href: string
  }
  reserveProduct?: PaymentProductRef
  secondaryCTA?: {
    text: string
    href: string
  }
  showTrustSeals?: boolean
}

export function CTASection({
  id = "reservar",
  title,
  description,
  primaryCTA,
  reserveProduct,
  secondaryCTA,
  showTrustSeals,
}: CTASectionProps) {
  return (
    <Section id={id} className="bg-accent text-accent-foreground">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">{title}</h2>
        <p className="text-xl mb-8 text-accent-foreground/90 text-pretty">{description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {reserveProduct ? (
            <PaymentDialog
              product={reserveProduct}
              trigger={
                <Button size="lg" variant="secondary">
                  {primaryCTA.text}
                </Button>
              }
            />
          ) : (
            <Button asChild size="lg" variant="secondary">
              <a href={primaryCTA.href}>{primaryCTA.text}</a>
            </Button>
          )}
          {secondaryCTA && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/10 bg-transparent"
            >
              <a href={secondaryCTA.href}>{secondaryCTA.text}</a>
            </Button>
          )}
        </div>
        {showTrustSeals && (
          <div className="mt-8 pt-6 border-t border-accent-foreground/20">
            <p className="text-sm text-accent-foreground/70 text-center mb-4">Protegido por:</p>
            <TrustSeals className="justify-center" />
          </div>
        )}
      </div>
    </Section>
  )
}
