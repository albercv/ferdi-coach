"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { toggle3D } from "@/lib/3d-utils"

export function Toggle3D() {
  const [is3DDisabled, setIs3DDisabled] = useState(false)

  useEffect(() => {
    setIs3DDisabled(localStorage.getItem("disable-3d") === "true")
  }, [])

  const handleToggle = () => {
    toggle3D()
    setIs3DDisabled(!is3DDisabled)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm border"
      title={is3DDisabled ? "Activar efectos 3D" : "Desactivar efectos 3D"}
    >
      {is3DDisabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      <span className="sr-only">{is3DDisabled ? "Activar efectos 3D" : "Desactivar efectos 3D"}</span>
    </Button>
  )
}
