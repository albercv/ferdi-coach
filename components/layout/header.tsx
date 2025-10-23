"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { GoogleSignInButton } from "@/components/ui/google-sign-in-button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDashboardEnabled, setIsDashboardEnabled] = useState(false)

  useEffect(() => {
    // Inicializa desde localStorage
    try {
      const enabled = localStorage.getItem("dashboardEnabled") === "true"
      setIsDashboardEnabled(enabled)
    } catch {}

    // Escucha el evento global para cambios
    const onEnabled = () => setIsDashboardEnabled(true)
    window.addEventListener("dashboard-enabled", onEnabled)
    return () => window.removeEventListener("dashboard-enabled", onEnabled)
  }, [])

  const navigation = [
    { name: "Sesiones", href: "#sesiones", title: "Sesiones individuales de coaching emocional para superar rupturas" },
    { name: "Programa 4", href: "#programa-4", title: "Programa intensivo de 4 semanas para superar ruptura de pareja" },
    { name: "Guías", href: "#guias", title: "Guías gratuitas para comenzar tu proceso de sanación emocional" },
    { name: "Cómo funciona", href: "#como-funciona", title: "Metodología de coaching emocional para superar dependencia emocional" },
    { name: "Sobre mí", href: "#sobre-mi", title: "Conoce a Ferdy, coach especializado en rupturas de pareja" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 header-hero-bg">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4" aria-label="principal">
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center overflow-hidden">
              <img src="/logo2.webp" alt="Ferdy Coach - Logo del especialista en superar rupturas de pareja y coaching emocional" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg text-foreground">Ferdy | Coach del desamor</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              title={item.title}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </a>
          ))}
          {isDashboardEnabled && (
            <a
              href="/dashboard"
              title="Panel de gestión"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </a>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Sign in button in navbar (desktop) when not enabled */}
          {!isDashboardEnabled && (
            <GoogleSignInButton />
          )}

          {/* Existing CTA */}
          <button className="hidden lg:inline-flex bg-accent text-white border border-amber-300/60 hover:shadow-sm hover:bg-accent/90 rounded-md px-4 py-2">
            <a href="#reservar">Reservar sesión</a>
          </button>

          {/* Mobile CTA visible under 1024px */}
          <button className="inline-flex lg:hidden bg-accent text-white border border-amber-300/60 hover:shadow-sm hover:bg-accent/90 rounded-md px-3 py-1.5 text-sm">
            <a href="#reservar">Reservar sesión</a>
          </button>

          {/* Mobile menu button */}
          <button
            className="lg:hidden rounded-md px-3 py-1.5 text-sm hover:bg-muted"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "Cerrar" : "Menú"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border lg:hidden">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  title={item.title}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {isDashboardEnabled && (
                <a
                  href="/dashboard"
                  title="Panel de gestión"
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </a>
              )}
              {/* Sign in button in navbar (mobile) when not enabled */}
              {!isDashboardEnabled && (
                <div className="w-full">
                  <GoogleSignInButton />
                </div>
              )}
              <button className="w-full bg-accent text-white border border-amber-300/60 hover:shadow-sm hover:bg-accent/90 rounded-md px-4 py-2">
                <a href="#reservar" onClick={() => setIsMenuOpen(false)}>Reservar sesión</a>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
