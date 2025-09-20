# Ferdy Coach - Landing Page

Landing page profesional para coach especializado en superar rupturas amorosas.

## 🚀 Características

- **Arquitectura escalable** con componentes reutilizables
- **SEO técnico impecable** con JSON-LD structured data
- **Sistema 3D progresivo** con fallbacks automáticos
- **Accesibilidad WCAG 2.1 AA** completa
- **Performance optimizada** para Core Web Vitals
- **Mobile-first responsive** design
- **Sistema de 3 colores** parametrizados

## 🛠 Tecnologías

- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS v4
- React Three Fiber (3D)
- Framer Motion (animaciones)

## 📦 Instalación

\`\`\`bash
# Clonar repositorio
git clone [repository-url]
cd ferdy-coach

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
npm start
\`\`\`

## 🎨 Personalización de colores

Los colores están parametrizados en `app/globals.css`:

\`\`\`css
:root {
  --color-1: #0d0d0d; /* primary - dark */
  --color-2: #ffffff; /* contrast - white */
  --color-3: #ff4d6d; /* accent - coral/pink */
}
\`\`\`

Para cambiar la paleta, modifica estas 3 variables CSS.

## 🎯 Control de elementos 3D

### Desactivar 3D globalmente
\`\`\`javascript
localStorage.setItem('disable-3d', 'true')
\`\`\`

### Activar 3D
\`\`\`javascript
localStorage.setItem('disable-3d', 'false')
\`\`\`

También disponible el botón toggle en la esquina inferior derecha.

## 📊 SEO y Analytics

### Structured Data incluido:
- Organization
- Person (Ferdy)
- FAQPage
- Product (servicios)
- BreadcrumbList

### Metadatos optimizados:
- Open Graph
- Twitter Cards
- Canonical URLs
- Keywords naturales

## ♿ Accesibilidad

- **WCAG 2.1 AA** compliant
- Skip links
- Focus management
- Screen reader support
- Keyboard navigation
- Semantic HTML
- ARIA labels

## ⚡ Performance

### Optimizaciones incluidas:
- Image optimization (WebP/AVIF)
- Lazy loading
- Code splitting
- Font preloading
- 3D progressive enhancement
- Critical CSS inlining

### Core Web Vitals targets:
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

## 📁 Estructura del proyecto

\`\`\`
/src
  /components
    /ui (componentes base)
    /layout (header, footer)
    /sections (secciones de contenido)
    /3d (elementos 3D)
    /seo (SEO components)
    /accessibility (a11y helpers)
    /performance (optimización)
  /lib (utilidades)
  /data (contenido estructurado)
  /app (páginas Next.js)
\`\`\`

## 🔧 Configuración

### Variables de entorno requeridas:
\`\`\`env
NEXT_PUBLIC_SITE_URL=https://ferdycoach.com
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
\`\`\`

### Next.js config:
- Image optimization habilitada
- Compression headers
- Security headers
- CSS optimization

## ✅ Checklist de calidad (DoD)

### SEO ✅
- [x] H1 único por página
- [x] Jerarquía H2/H3 correcta
- [x] Meta description 150-160 chars
- [x] JSON-LD structured data
- [x] Sitemap.xml automático
- [x] Robots.txt
- [x] Canonical URLs
- [x] Open Graph + Twitter Cards

### Accesibilidad ✅
- [x] WCAG 2.1 AA compliance
- [x] Skip links
- [x] Focus management
- [x] Keyboard navigation
- [x] Screen reader support
- [x] Semantic HTML
- [x] ARIA labels
- [x] Color contrast AA

### Performance ✅
- [x] Core Web Vitals optimized
- [x] Image optimization
- [x] Lazy loading
- [x] Code splitting
- [x] Font preloading
- [x] 3D progressive enhancement

### Responsive ✅
- [x] Mobile-first design
- [x] Breakpoints: 640, 768, 1024, 1280, 1536px
- [x] Touch-friendly interactions
- [x] Viewport optimization

## 🚀 Deployment

### Vercel (recomendado):
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Otros providers:
\`\`\`bash
npm run build
npm start
\`\`\`

## 📞 Soporte

Para soporte técnico o personalizaciones, contactar al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** Diciembre 2024
