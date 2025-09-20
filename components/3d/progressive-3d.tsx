"use client"

import React, { Suspense, useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import 3D component with no SSR
const Heart3D = dynamic(() => import("./heart-3d").then((mod) => ({ default: mod.Heart3D })), {
  ssr: false,
  loading: () => <Heart3DFallback />,
})

// 2D Fallback component
function Heart3DFallback() {
  return (
    <div className="aspect-square bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center animate-pulse-heart">
      <div className="w-32 h-32 bg-accent/30 rounded-full flex items-center justify-center">
        <div className="w-16 h-16 bg-accent rounded-full animate-float"></div>
      </div>
    </div>
  )
}

// Error boundary to gracefully fallback if 3D rendering fails at runtime
class ErrorBoundary extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // Side-effect: log error for diagnostics without breaking UX
    // eslint-disable-next-line no-console
    console.error("3D rendering error:", error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Hook to detect WebGL support
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

// Hook to detect device performance
function useDevicePerformance() {
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    // Check for low-performance indicators
    const isLowEnd =
      (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2) || // Low CPU cores
      (typeof (navigator as any).deviceMemory === "number" && (navigator as any).deviceMemory <= 2) || // Low RAM
      /Android.*Chrome\/[0-5]/.test(navigator.userAgent) || // Old Android Chrome
      /iPhone.*OS [0-9]_/.test(navigator.userAgent) // Old iOS

    setIsLowPerformance(!!isLowEnd)
  }, [])

  return isLowPerformance
}

interface Progressive3DProps {
  fallback?: React.ReactNode
  className?: string
}

export function Progressive3D({ fallback, className = "aspect-square" }: Progressive3DProps) {
  const hasWebGL = useWebGLSupport()
  const isLowPerformance = useDevicePerformance()
  const [force2D, setForce2D] = useState(false)

  // Allow users to disable 3D via localStorage
  useEffect(() => {
    try {
      const disable3D = localStorage.getItem("disable-3d") === "true"
      setForce2D(disable3D)
    } catch {
      setForce2D(false)
    }
  }, [])

  const shouldUse3D = hasWebGL && !isLowPerformance && !force2D

  if (hasWebGL === null) {
    // Still checking WebGL support
    return <div className={className}>{fallback || <Heart3DFallback />}</div>
  }

  if (!shouldUse3D) {
    return <div className={className}>{fallback || <Heart3DFallback />}</div>
  }

  return (
    <div className={className}>
      <ErrorBoundary fallback={fallback || <Heart3DFallback />}>
        <Suspense fallback={fallback || <Heart3DFallback />}>
          <Heart3D />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
