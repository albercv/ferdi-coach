import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site-config"

// Fecha de última revisión de contenido. Estática a propósito: evita que
// cada render reporte `new Date()` y degrade la señal de frescura.
const LAST_REVIEWED = "2026-06-07"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/contacto", "/privacidad", "/terminos", "/cancelacion"]

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: LAST_REVIEWED,
  }))
}
