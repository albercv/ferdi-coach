'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

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
  // Estado para controlar flip y expansión en dispositivos táctiles
  const [isFlipped, setIsFlipped] = useState(false)
  const [isTextExpanded, setIsTextExpanded] = useState(false)
  
  // Datos para la cara trasera (sinopsis e imagen de portada)
  const backSynopsisFinal = backSynopsis ?? description
  const backCover = backCoverSrc ?? "/logo2.webp"
  
  // Funciones para manejar taps en móvil
  const handleCardTap = () => {
    if (flipOnHover) {
      setIsFlipped(!isFlipped)
      setIsTextExpanded(false) // Reset text expansion when flipping
    }
  }
  
  const handleTextTap = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card flip when tapping text
    setIsTextExpanded(!isTextExpanded)
  }

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
        <div className="relative group h-[320px] [perspective:1000px]" onClick={handleCardTap}>
          <div className={cn(
            "relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] cursor-pointer",
            "group-hover:[transform:rotateY(180deg)]",
            isFlipped && "[transform:rotateY(180deg)]"
          )}>
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
              <CardContent className="relative h-full overflow-hidden p-6 flex flex-col gap-1.5">
                <div className={cn(
                  "relative transition-all duration-500 ease-in-out cursor-pointer group/text",
                  "hover:h-full hover:bg-card/95 hover:backdrop-blur-sm hover:-m-6 hover:p-6 hover:z-30",
                  isTextExpanded ? "h-full bg-card/95 backdrop-blur-sm -m-6 p-6 z-30" : "h-auto max-h-[20%] min-h-[60px]"
                )}
                onClick={handleTextTap}
              >
                <CardDescription className={cn(
                   "text-sm text-muted-foreground leading-snug transition-all duration-300 cursor-pointer",
                   "group-hover/text:line-clamp-none overflow-hidden",
                   "bg-secondary/70 p-2 rounded-md backdrop-blur-sm",
                   isTextExpanded ? "line-clamp-none" : "line-clamp-3"
                 )}>
                  {backSynopsisFinal}
                </CardDescription>
              </div>
              <div className="flex-1 z-10">
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
