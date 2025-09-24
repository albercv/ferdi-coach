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
        <div className="relative group h-[320px] [perspective:1000px]">
          <div className="relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Frente */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-card rounded-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">{description}</CardDescription>
                <div className="mt-6">
                  <span className="text-3xl font-bold text-foreground">{price}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-accent mr-3 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                {features.length > 4 && (
                  <p className="text-xs text-muted-foreground mt-4 italic">Y más características...</p>
                )}
              </CardContent>
            </div>

            {/* Reverso */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg group/back overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-accent">Sinopsis</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 h-full flex flex-col relative">
                <div className="h-1/5 overflow-hidden relative z-20 transition-all duration-300 group/text hover:h-full hover:bg-card/95 hover:backdrop-blur-sm hover:-m-6 hover:p-6 hover:z-30">
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-8 group-hover/text:line-clamp-none transition-all duration-300 cursor-pointer">
                    {backSynopsisFinal}
                  </CardDescription>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 z-10">
                  <img
                    src={backCover}
                    alt={`Portada de ${title}`}
                    className="w-full h-full object-cover rounded-b-lg"
                  />
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
