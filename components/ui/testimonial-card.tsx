"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useRef, useState } from "react"
import Image from "next/image"

interface TestimonialCardProps {
  name: string
  age: number
  text: string
  rating: number
  video?: string
  image?: string
}

export function TestimonialCard({ name, age, text, rating, video, image }: TestimonialCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const renderMedia = () => {
    if (video) {
      return (
        <div 
          className="w-16 h-16 rounded-full overflow-hidden cursor-pointer border-2 border-white shadow-lg hover:scale-105 transition-transform"
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted={false}
            playsInline
            onEnded={() => setIsPlaying(false)}
          >
            <source src={`/${video}.mp4`} type="video/mp4" />
          </video>
        </div>
      )
    }

    if (image) {
      return (
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
          <Image
            src={`/${image}.png`}
            alt={`Foto de ${name}`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
      )
    }

    // Logo por defecto
    return (
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white flex items-center justify-center">
        <Image
          src="/logo2.webp"
          alt="Logo Ferdy Coach"
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
      </div>
    )
  }

  return (
    <Card className="h-full relative">
      <CardContent className="p-6 pb-16">
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
          ))}
        </div>
        <blockquote className="text-muted-foreground mb-4 italic pl-4 border-l-2 border-destructive/30">
          <span className="text-destructive">&quot;</span>
          {text}
          <span className="text-destructive">&quot;</span>
        </blockquote>
        <cite className="text-sm font-medium text-foreground not-italic">
          {name}, {age} años
        </cite>
      </CardContent>
      
      {/* Media stamp en la parte inferior centrado */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        {renderMedia()}
      </div>
    </Card>
  )
}
