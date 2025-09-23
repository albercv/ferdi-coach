"use client"

import React, { useState, useEffect, useRef } from "react"

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

// 2D Waveform (fallback and primary render)
function Waveform() {
  const pathRef = useRef<SVGPathElement>(null)
  const [dash, setDash] = useState<number>(800) // fallback para longitud de trazo

  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    const len = el.getTotalLength()
    // Inicializa el trazo para efecto "se va dibujando"
    setDash(len)
  }, [])

  return (
    <div className="aspect-square flex items-center justify-center">
      <svg
        className="wave-svg"
        viewBox="0 0 200 100"
        role="img"
        aria-label="Línea de crecimiento animada"
      >
        <path
          ref={pathRef}
          className="wave-path"
          style={{ strokeDasharray: dash, strokeDashoffset: dash }}
          d="M0 50 L20 50 L30 35 L35 65 L40 40 L45 60 L50 50 L70 50 L80 30 L85 70 L90 35 L95 65 L100 50 L120 50 L130 20 L135 80 L140 30 L145 70 L150 50 L170 50 L180 35 L185 65 L190 50 L200 50"
        />
      </svg>
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
  // Render único: motivo 2D tipo waveform (línea de crecimiento)
  return <div className={className}>{fallback || <Waveform />}</div>
}
