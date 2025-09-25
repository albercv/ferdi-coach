import type React from "react"
import type { Metadata } from "next"
// Importa fuentes Geist desde el paquete oficial en lugar de next/font/google
import { GeistSans, GeistMono } from "geist/font"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { StructuredData } from "@/components/seo/structured-data"
import { SkipLink } from "@/components/ui/skip-link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import "./globals.css"

const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
  title: "Ferdy | Coach del desamor - Supera tu ruptura amorosa",
  description:
    "Coach especializado en superar rupturas amorosas. Sesiones 1 a 1 y programas para salir del desamor. Reserva tu consulta gratuita.",
  keywords:
    "coach del desamor, superar ruptura, sesiones 1 a 1 desamor, contacto cero, duelo de pareja, dependencia emocional",
  authors: [{ name: "Ferdy Coach" }],
  creator: "Ferdy Coach",
  publisher: "Ferdy Coach",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://ferdycoach.com",
    title: "Ferdy | Coach del desamor - Supera tu ruptura amorosa",
    description: "Coach especializado en superar rupturas amorosas. Sesiones 1 a 1 y programas para salir del desamor.",
    siteName: "Ferdy Coach",
    images: [
      {
        url: "https://ferdycoach.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ferdy Coach - Especialista en superar rupturas amorosas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferdy | Coach del desamor - Supera tu ruptura amorosa",
    description: "Coach especializado en superar rupturas amorosas. Sesiones 1 a 1 y programas para salir del desamor.",
    creator: "@ferdycoach",
    images: ["https://ferdycoach.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://ferdycoach.com",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
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
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
