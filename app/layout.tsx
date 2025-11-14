import type React from "react"
import type { Metadata } from "next"
// Importa fuentes Geist desde el paquete oficial en lugar de next/font/google
import { GeistSans, GeistMono } from "geist/font"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { StructuredData } from "@/components/seo/structured-data"
import { SkipLink } from "@/components/ui/skip-link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AuthProvider } from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
  title: "Transformación personal tras una ruptura: empieza a sanar desde dentro",
  description:
    "¿Acabas de terminar una relación? Te ayudo a superar tu ruptura de pareja en 4 semanas. Coach emocional especializado en duelo amoroso, dependencia emocional y recuperación tras separación. Programa personalizado con resultados comprobados.",
  keywords: [
    "superar ruptura de pareja",
    "coaching emocional ruptura",
    "como superar una separación",
    "duelo amoroso",
    "dependencia emocional",
    "coach especialista rupturas",
    "terapia ruptura pareja",
    "sanación emocional",
    "recuperarse de una ruptura",
    "bienestar tras separación",
    "coaching transpersonal",
    "proceso de duelo",
    "límites emocionales",
    "autoestima después ruptura"
  ],
  authors: [{ name: "Ferdy Coach" }],
  creator: "Ferdy Coach",
  publisher: "Ferdy Coach",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://ferdy-coach.com",
    title: "Transformación personal tras una ruptura: empieza a sanar desde dentro",
    description:
      "¿Acabas de terminar una relación? Te ayudo a superar tu ruptura de pareja en 4 semanas. Coach emocional especializado en duelo amoroso y dependencia emocional con resultados comprobados.",
    siteName: "Ferdy Coach",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ferdy Coach - Especialista en superar rupturas de pareja"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Transformación personal tras una ruptura: empieza a sanar desde dentro",
    description:
      "¿Acabas de terminar una relación? Te ayudo a superar tu ruptura de pareja en 4 semanas. Coach emocional especializado con resultados comprobados.",
    images: ["/og-image.jpg"]
  },
  alternates: {
    canonical: "https://ferdy-coach.com",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  generator: "Next.js",
  verification: {
    google: "your-google-verification-code",
  },
  other: {
    "theme-color": "#ff4d6d",
    "color-scheme": "light",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <head>
        <StructuredData />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${geistSans.className} antialiased bg-background text-foreground`}>
        <SkipLink />
        <AuthProvider>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            {children}
          </Suspense>
        </AuthProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
