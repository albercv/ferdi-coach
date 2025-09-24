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
  flipOnHover?: boolean
  backSynopsis?: string
  backCoverSrc?: string
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
  flipOnHover = false,
  backSynopsis,
  backCoverSrc,
}: PricingCardProps) {
  // Datos para la cara trasera (sinopsis e imagen de portada)
  const backSynopsisFinal = backSynopsis ?? description
  const backCover = backCoverSrc ?? "/logo2.webp"

  return (
    <Card className={cn("relative overflow-hidden", flipOnHover && "group", popular && "border-accent shadow-lg", className)}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-destructive" aria-hidden />
            Más popular
          </span>
        </div>
      )}

      {/* Contenido principal: condicional según flipOnHover */}
      {flipOnHover ? (
        <div className="relative" style={{ perspective: "1000px", WebkitPerspective: "1000px" }}>
          <div
            className="relative h-[320px] overflow-hidden transition-transform duration-500 group-hover:[transform:rotateY(180deg)] [will-change:transform]"
            style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" }}
          >
            {/* Frente */}
            <div
              className="absolute inset-0 p-6"
              style={{ transform: "rotateY(0deg) translateZ(1px)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-foreground">{price}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 max-h-32 overflow-hidden">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>

            {/* Reverso */}
            <div
              className="absolute inset-0 p-6"
              style={{ transform: "rotateY(180deg) translateZ(1px)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <CardHeader>
                <CardTitle className="text-xl">Sinopsis</CardTitle>
                <CardDescription className="line-clamp-4">{backSynopsisFinal}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-32 md:h-40 lg:h-44 rounded-md overflow-hidden ring-1 ring-black/10 bg-muted">
                  <img src={backCover} alt={`Portada de ${title}`} className="absolute inset-0 w-full h-full object-contain" />
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}

      {/* El botón no se da la vuelta */}
      <CardFooter>
        <Button asChild className="w-full" variant={popular ? "default" : "outline"}>
          <a href={ctaHref}>{ctaText}</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
