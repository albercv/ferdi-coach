import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  title: string
  description: string
  price: string
  features: string[]
  ctaText: string
  ctaHref: string
  popular?: boolean
  className?: string
}

export function PricingCard({
  title,
  description,
  price,
  features,
  ctaText,
  ctaHref,
  popular = false,
  className,
}: PricingCardProps) {
  return (
    <Card className={cn("relative", popular && "border-accent shadow-lg", className)}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-destructive" aria-hidden />
            Más popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold text-foreground">{price}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant={popular ? "default" : "outline"}>
          <a href={ctaHref}>{ctaText}</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
