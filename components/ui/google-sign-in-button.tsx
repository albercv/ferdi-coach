"use client"

import { Button } from "@/components/ui/button"

export function GoogleSignInButton() {
  const handleClick = () => {
    // Mock: activar dashboard
    try {
      localStorage.setItem("dashboardEnabled", "true")
      // Notificar al header que debe mostrar el tab Dashboard
      window.dispatchEvent(new CustomEvent("dashboard-enabled"))
      // Redirigir al dashboard
      window.location.assign("/dashboard")
    } catch (e) {
      console.warn("No se pudo activar el dashboard mock", e)
      alert("Mock: Google Sign-In aún no está implementado.")
    }
  }

  return (
    <Button onClick={handleClick} className="text-sm px-2 py-1 border border-border rounded-md bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted">
      Google
    </Button>
  )
}