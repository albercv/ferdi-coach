// Performance monitoring utilities
export function measureWebVitals() {
  if (typeof window === "undefined") return

  // Measure Core Web Vitals
  import("web-vitals").then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
    onCLS(console.log)
    onFCP(console.log)
    onINP(console.log)
    onLCP(console.log)
    onTTFB(console.log)
  })
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === "undefined") return

  // Preload critical fonts
  const fontPreloads = ["/fonts/geist-sans.woff2", "/fonts/geist-mono.woff2"]

  fontPreloads.forEach((font) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.href = font
    link.as = "font"
    link.type = "font/woff2"
    link.crossOrigin = "anonymous"
    document.head.appendChild(link)
  })
}

// Lazy load non-critical resources
export function lazyLoadResources() {
  if (typeof window === "undefined") return

  // Lazy load analytics and other non-critical scripts
  const scripts = ["https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"]

  scripts.forEach((src) => {
    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  })
}

// Optimize images with blur placeholders
export function generateBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  if (!ctx) return ""

  // Create a simple gradient blur placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, "#f3f4f6")
  gradient.addColorStop(1, "#e5e7eb")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  return canvas.toDataURL()
}
