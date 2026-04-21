"use client"

import { Section } from "@/components/ui/section"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award } from "lucide-react"
import { useEffect, useRef } from "react"
import type { AboutContent } from "@/lib/content-md"

export function AboutSection({ about }: { about: AboutContent }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reproducir video cuando entra en vista
            video.play().catch((error) => {
              console.log("Error al reproducir video automáticamente:", error)
            })
          } else {
            // Pausar video cuando sale de vista
            video.pause()
          }
        })
      },
      {
        threshold: 0.5, // Se activa cuando el 50% del video es visible
      }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <Section id="sobre-mi" aria-labelledby="sobre-mi-title" className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 id="sobre-mi-title" className="text-3xl md:text-4xl font-bold text-balance">
            {about.title}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">{about.description}</p>

          <Card className="relative">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Credenciales y experiencia</h3>
              </div>
              <ul className="space-y-2">
                {about.credentials.map((credential, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span className="text-muted-foreground">{credential}</span>
                  </li>
                ))}
              </ul>
              {/* Logo stamp en esquina superior derecha */}
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-accent/20 flex items-center justify-center">
                <img 
                  src="/logo2.webp" 
                  alt="Logo Ferdy Coach" 
                  className="w-8 h-8 object-contain"
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            asChild 
            className="w-full sm:w-auto bg-accent text-white border border-amber-300/60 hover:shadow-sm hover:bg-accent/90"
          >
            <Link href="#reservar">Reservar sesión</Link>
          </Button>
        </div>

        <div className="relative">
          {/* Video de Ferdy */}
          <div className="aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-black/10 bg-secondary/20">
            <video
              ref={videoRef}
              src={about.videoUrl || "/ferdy-presentation.mp4"}
              className="w-full h-full object-cover"
              controls
              muted
              preload="metadata"
              poster={about.posterImageUrl || "/logo2.webp"}
              aria-label="Video de presentación de Ferdy - Coach emocional certificado especializado en superar rupturas de pareja y dependencia emocional"
            >
              Tu navegador no soporta el elemento de video.
              <img
                src={about.posterImageUrl || "/logo2.webp"}
                alt="Ferdy - Coach emocional certificado especializado en superar rupturas de pareja y dependencia emocional"
                className="w-full h-full object-cover"
              />
            </video>
          </div>
        </div>
      </div>
    </Section>
  )
}
