"use client"

import React, { useState, useEffect } from "react"

// 2D Pulse Circle (fallback and primary render)
function PulseCircle() {
  return (
    <div className="aspect-square flex items-center justify-center">
      <div
        className="w-3/4 h-3/4 pulse-circle"
        role="img"
        aria-label="Círculo pulsando como latido"
      />
    </div>
  )
}

// Hook to detect WebGL support (kept for future use if 3D returns)
function useWebGLSupport() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setHasWebGL(!!gl)
    } catch (e) {
      setHasWebGL(false)
    }
  }, [])

  return hasWebGL
}

// Hook to detect device performance (kept for future policy decisions)
function useDevicePerformance() {
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    const isLowEnd =
      (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2) ||
      (typeof (navigator as any).deviceMemory === "number" && (navigator as any).deviceMemory <= 2) ||
      /Android.*Chrome\/[0-5]/.test(navigator.userAgent) ||
      /iPhone.*OS [0-9]_/.test(navigator.userAgent)

    setIsLowPerformance(!!isLowEnd)
  }, [])

  return isLowPerformance
}

interface Progressive3DProps {
  fallback?: React.ReactNode
  className?: string
}

export function Progressive3D({ fallback, className = "aspect-square" }: Progressive3DProps) {
  // Render único: círculo 2D que emite pulsos regulares
  return <div className={className}>{fallback || <PulseCircle />}</div>
}
