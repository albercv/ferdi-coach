"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { PaymentProductRef } from "@/lib/payments"
import { PaymentDialog } from "@/components/payments/PaymentDialog"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Header({ reserveProduct }: { reserveProduct: PaymentProductRef }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  const navigation = [
    { name: "Sesiones", href: "#sesiones", title: "Sesiones individuales de coaching emocional para superar rupturas" },
    // "Programa 4" se elimina porque es el mismo section que "Sesiones"
    { name: "Guías de apoyo", href: "#guias", title: "Guías de apoyo para comenzar tu proceso de sanación emocional" },
    { name: "Guías", href: "#como-funciona", title: "Metodología de coaching emocional para superar dependencia emocional" },
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
          {isAuthenticated && (
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
          {/* Botón Login cuando NO autenticado (desktop) */}
          {!isAuthenticated && (
            <Link href="/login" className="hidden lg:inline-flex">
              <Button className="text-sm px-2 py-1 border border-border rounded-md bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted">Login</Button>
            </Link>
          )}

          {/* Botón Logout cuando autenticado (desktop) */}
          {isAuthenticated && (
            <Button onClick={handleLogout} className="hidden lg:inline-flex text-sm px-2 py-1 border border-border rounded-md bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted">
              Logout
            </Button>
          )}

          {/* Existing CTA */}
          <div className="hidden lg:inline-flex">
            <PaymentDialog
              product={reserveProduct}
              trigger={
                <button className="bg-accent text-white border border-amber-300/60 hover:shadow-sm hover:bg-accent/90 rounded-md px-4 py-2">
                  Reservar sesión
                </button>
              }
            />
          </div>

          {/* Mobile CTA visible under 1024px */}
          <div className="inline-flex lg:hidden">
            <PaymentDialog
              product={reserveProduct}
              trigger={
                <button className="bg-accent text-white border border-amber-300/60 hover:shadow-sm hover:bg-accent/90 rounded-md px-3 py-1.5 text-sm">
                  Reservar sesión
                </button>
              }
            />
          </div>

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
              {isAuthenticated && (
                <a
                  href="/dashboard"
                  title="Panel de gestión"
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </a>
              )}
              {/* Login/Logout en móvil */}
              {!isAuthenticated ? (
                <Link href="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full text-sm px-2 py-1 border border-border rounded-md bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted">Login</Button>
                </Link>
              ) : (
                <Button onClick={async () => { setIsMenuOpen(false); await signOut({ redirect: false }); router.push("/") }} className="w-full text-sm px-2 py-1 border border-border rounded-md bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted">Logout</Button>
              )}
              <PaymentDialog
                product={reserveProduct}
                trigger={
                  <button
                    className="w-full bg-accent text-white border border-amber-300/60 hover:shadow-sm hover:bg-accent/90 rounded-md px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Reservar sesión
                  </button>
                }
              />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
