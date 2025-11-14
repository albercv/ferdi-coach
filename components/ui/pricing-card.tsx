'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

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
  // NEW: permite que la tarjeta se monte ya girada (útil para vista previa tras crear)
  initialFlipped?: boolean
  // NEW: desactiva el 3D y usa un flip simple por opacidad (útil en el editor si el 3D se rompe)
  forceSimpleFlip?: boolean
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
  initialFlipped = false,
  forceSimpleFlip = false,
}: PricingCardProps) {
  // Estado para controlar flip y expansión en dispositivos táctiles
  const [isFlipped, setIsFlipped] = useState(initialFlipped)
  const [isTextExpanded, setIsTextExpanded] = useState(false)

  // Si el prop initialFlipped cambia (poco frecuente), sincronizamos el estado
  useEffect(() => {
    setIsFlipped(initialFlipped)
  }, [initialFlipped])
  
  // Datos para la cara trasera (sinopsis e imagen de portada)
  const backSynopsisFinal = (backSynopsis ?? description)?.trim() || "Sinopsis no disponible"
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
    <Card className={cn("relative", flipOnHover && "group", popular && "border-accent shadow-lg", className)}>
      {popular && (
        <div className="absolute top-[4px] right-4 z-10">
          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-destructive" aria-hidden />
            Más popular
          </span>
        </div>
      )}

      {/* Contenido principal: condicional según flipOnHover */}
      {flipOnHover ? (
        <div className={cn(
          "relative group min-h-[420px]",
          !forceSimpleFlip && "[perspective:1000px]"
        )} onClick={handleCardTap} onMouseEnter={() => flipOnHover && setIsFlipped(true)} onMouseLeave={() => flipOnHover && setIsFlipped(false)}>
          <div className={cn(
            "relative w-full h-full cursor-pointer",
            !forceSimpleFlip && "transition-transform duration-700 ease-in-out [transform-style:preserve-3d] will-change-[transform]",
            !forceSimpleFlip && "group-hover:[transform:rotateY(180deg)]",
            (!forceSimpleFlip && isFlipped) && "[transform:rotateY(180deg)]"
          )}>
            {/* Frente */}
            <div className={cn(
              // Posicionamiento: absoluto solo en modo 3D; relativo en modo simple
              !forceSimpleFlip ? "absolute inset-0 w-full h-full" : "relative w-full h-full",
              "bg-card rounded-lg flex flex-col p-6 transition-opacity duration-300",
              !forceSimpleFlip && "[backface-visibility:hidden] [transform:rotateY(0deg)] will-change-[transform]",
              // Fallback de visibilidad: en modo simple, oculta por completo el frente cuando está girado
              forceSimpleFlip
                ? ((isFlipped || initialFlipped) ? "hidden" : "")
                : ((isFlipped || initialFlipped) ? "opacity-0 pointer-events-none" : "opacity-100")
            )}>
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-foreground">{price}</span>
                  </div>
                </div>
                
                <div className="flex-1 mb-6">
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
                </div>
                
                {/* Botón incluido en el frente */}
                <div className="mt-auto">
                  <Button asChild className="w-full" variant={popular ? "default" : "outline"}>
                    <a href={ctaHref}>{ctaText}</a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Reverso */}
            <div className={cn(
              // Posicionamiento: absoluto solo en modo 3D; relativo en modo simple
              !forceSimpleFlip ? "absolute inset-0 w-full h-full" : "relative w-full h-full",
              "rounded-lg group/back overflow-hidden bg-card transition-opacity duration-300 z-10",
              !forceSimpleFlip && "[backface-visibility:hidden] [transform:rotateY(180deg)] will-change-[transform]",
              // Fallback de visibilidad: en modo simple, muestra solo el reverso cuando está girado
              forceSimpleFlip
                ? ((isFlipped || initialFlipped) ? "" : "hidden")
                : ((isFlipped || initialFlipped) ? "opacity-100" : "opacity-0 pointer-events-none")
            )}>
              <div className="p-6 h-full flex flex-col relative">
                <h3 className="text-xl font-semibold text-accent mb-4 flex-shrink-0">Sinopsis</h3>
                
                {/* Imagen fija en el fondo */}
                <div className="absolute inset-x-6 top-20 bottom-20 z-0">
                  <img
                    src={backCover}
                    alt={`Portada de ${title}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                {/* Texto expandible por encima - contraído inicialmente */}
                <div className="flex-1 relative z-10 mb-4 min-h-0">
                  <div className={cn(
                    "w-full transition-all duration-700 ease-out cursor-pointer group",
                    // Altura inicial pequeña, expandida hasta ocupar todo el espacio disponible
                    isTextExpanded ? "h-full" : "h-24"
                  )}
                  onClick={handleTextTap}
                  onMouseEnter={() => {
                    // Solo activar hover en desktop (pantallas >= 1024px)
                    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                      setIsTextExpanded(true)
                    }
                  }}
                  onMouseLeave={() => {
                    // Solo desactivar hover en desktop
                    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                      setIsTextExpanded(false)
                    }
                  }}
                  >
                    <div className={cn(
                      "w-full bg-card/95 backdrop-blur-sm rounded-lg p-4 border shadow-sm h-full transition-all duration-700 ease-out",
                      isTextExpanded ? "overflow-y-auto" : "overflow-hidden",
                      // Hover effect solo en desktop con transición suave
                      "lg:group-hover:overflow-y-auto"
                    )}>
                      <p className={cn(
                         "text-sm text-foreground leading-snug cursor-pointer w-full transition-all duration-700 ease-out",
                         isTextExpanded ? "line-clamp-none" : "line-clamp-3",
                         // Hover effect solo en desktop
                         "lg:group-hover:line-clamp-none"
                       )}>
                        {backSynopsisFinal}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Botón incluido en el reverso - siempre visible */}
                <div className="flex-shrink-0 relative z-10">
                  <Button asChild className="w-full" variant={popular ? "default" : "outline"}>
                    <a href={ctaHref}>{ctaText}</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 flex flex-col h-full min-h-[320px]">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-foreground">{price}</span>
            </div>
          </div>
          <div className="flex-1 mb-6">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto">
            <Button asChild className="w-full" variant={popular ? "default" : "outline"}>
              <a href={ctaHref}>{ctaText}</a>
            </Button>
          </div>
        </div>
      )}

      {/* El botón no se da la vuelta - Solo para tarjetas sin flip */}
      {!flipOnHover && (
        <CardFooter className="mt-auto pt-4 pb-4">
          <Button asChild className="w-full" variant={popular ? "default" : "outline"}>
            <a href={ctaHref}>{ctaText}</a>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
