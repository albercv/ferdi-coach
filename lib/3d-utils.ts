export function detectWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    return !!gl
  } catch (e) {
    return false
  }
}

export function detectLowPerformanceDevice(): boolean {
  // Check for low-performance indicators
  const isLowEnd =
    navigator.hardwareConcurrency <= 2 || // Low CPU cores
    (navigator as any).deviceMemory <= 2 || // Low RAM (Chrome only)
    /Android.*Chrome\/[0-5]/.test(navigator.userAgent) || // Old Android Chrome
    /iPhone.*OS [0-9]_/.test(navigator.userAgent) // Old iOS

  return isLowEnd
}

export function shouldUse3D(): boolean {
  if (typeof window === "undefined") return false

  const hasWebGL = detectWebGLSupport()
  const isLowPerformance = detectLowPerformanceDevice()
  const userDisabled = localStorage.getItem("disable-3d") === "true"

  return hasWebGL && !isLowPerformance && !userDisabled
}

export function toggle3D(): void {
  const current = localStorage.getItem("disable-3d") === "true"
  localStorage.setItem("disable-3d", (!current).toString())
  window.location.reload()
}
