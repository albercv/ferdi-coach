# STYLES.md — Contrato de diseño de Ferdy Coach

> Referencia para generar UI coherente. Cualquier cambio de estilos debe respetar los tokens aquí documentados.

---

## 1. Paleta de colores

### Colores base (3 colores de marca)

| Variable CSS | Valor hex | Rol |
|---|---|---|
| `--color-1` | `#517e61` | **Primary** — verde principal de marca |
| `--color-2` | `#ffffff` | **Contrast** — blanco, fondo base |
| `--color-3` | `#b5ac69` | **Accent** — dorado terroso |

> **Nota:** `globals.css` contiene tres bloques `:root` superpuestos. La cascada CSS hace que el **último** bloque prevalezca. Los valores activos son los de arriba. No añadir nuevos bloques `:root`; modificar siempre el último.

### Tokens semánticos (modo claro)

| Token | Resuelve a | Uso |
|---|---|---|
| `--background` | `#ffffff` | Fondo de página |
| `--foreground` | `#517e61` | Texto principal |
| `--primary` | `#517e61` | Botones primarios, iconos |
| `--primary-foreground` | `#ffffff` | Texto sobre primary |
| `--accent` | `#b5ac69` | Highlights, badges, CTAs secundarios |
| `--accent-foreground` | `#ffffff` | Texto sobre accent |
| `--secondary` | `#d1d5db` | Elementos secundarios |
| `--muted` | `#6b7280` | Texto muted, iconos discretos |
| `--muted-foreground` | `#4b5563` | Texto de soporte (subtítulos, descripciones) |
| `--border` | `#e5e7eb` | Bordes de card, separadores |
| `--input` | `#f1f5f9` | Fondo de inputs |
| `--destructive` | `#dc2626` | Errores, acciones destructivas |
| `--ring` | `rgba(81,126,97,0.5)` | Focus ring |
| `--card` | `#ffffff` | Fondo de cards |
| `--card-foreground` | `#517e61` | Texto en cards |

### Clases Tailwind equivalentes

```
bg-primary        → --color-1 (#517e61)
text-primary      → --color-1
bg-accent         → --color-3 (#b5ac69)
text-accent       → --color-3
bg-background     → --color-2 (#ffffff)
text-foreground   → --color-1
text-muted-foreground → #4b5563
bg-card           → --color-2
```

### Modo oscuro

El modo oscuro invierte primary y background: `--background → #517e61`, `--foreground → #ffffff`. Se activa con la clase `.dark` en un elemento ancestro. La variante CSS custom está definida como `@custom-variant dark (&:is(.dark *))`.

---

## 2. Tipografía

### Fuentes

| Rol | Fuente | Variable CSS | Clase Tailwind |
|---|---|---|---|
| Sans (por defecto) | **Geist Sans** | `--font-sans` | `font-sans` |
| Mono | **Geist Mono** | `--font-mono` | `font-mono` |

Importadas desde el paquete `geist/font`. Aplicadas en `<body>` como `className={geistSans.className}`.

### Escala tipográfica usada en secciones

| Elemento | Clases |
|---|---|
| Hero `<h1>` | `text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance` |
| Sección `<h2>` | `text-3xl md:text-4xl font-bold text-balance` |
| Sección `<h3>` | `text-lg font-semibold` o `font-semibold text-sm` |
| Subtítulo de sección | `text-xl text-muted-foreground text-pretty` |
| Cuerpo / descripción | `text-sm text-muted-foreground` o `text-xs text-muted-foreground` |
| Lista / bullet | `text-white/90` (sobre fondos oscuros) |

### Convenciones de texto

- `text-balance` para títulos (ajuste de líneas equilibrado)
- `text-pretty` para párrafos largos (evita orphans)
- `leading-tight` en h1 · `leading-relaxed` en cuerpo

---

## 3. Espaciado y layout

### Sección base — componente `<Section>`

```tsx
// components/ui/section.tsx
<section className="py-16 md:py-24">
  <div className="container mx-auto px-4">
    {children}
  </div>
</section>
```

Usar `<Section>` para todas las secciones de página. Pasar `className` para overrides puntuales (ej. `className="bg-primary/5"`).

### Secciones sin `<Section>` (patrón alternativo)

```
py-16 lg:py-24 + container mx-auto px-6
```

### Grids

| Patrón | Clases |
|---|---|
| 3 columnas (productos, pasos) | `grid grid-cols-1 md:grid-cols-3 gap-4` |
| 2 columnas (hero) | `grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12` |
| 4 columnas (steps móvil 2×2) | `grid grid-cols-2 md:grid-cols-4 gap-3` |

### Contenedor de texto centrado

```
max-w-3xl mx-auto   — cuerpo de texto
max-w-xl            — columna de formulario o bloque estrecho
space-y-4 / space-y-8 — separación vertical entre bloques
```

### Cabecera de sección (patrón estándar)

```tsx
<div className="text-center mb-12">
  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Título</h2>
  <p className="mt-4 text-muted-foreground">Subtítulo</p>
</div>
```

---

## 4. Border radius

| Token | Valor | Clase Tailwind |
|---|---|---|
| `--radius-sm` | ~6px | `rounded-sm` |
| `--radius-md` | ~8px | `rounded-md` |
| `--radius-lg` (`--radius`) | 10px | `rounded-lg` |
| `--radius-xl` | ~14px | `rounded-xl` |
| Circular | — | `rounded-full` |

Uso habitual: `rounded-lg` para cards · `rounded-md` para botones e inputs · `rounded-full` para badges y avatares.

---

## 5. Componentes base disponibles (shadcn/ui)

Estilo **new-york**, baseColor **neutral**, cssVariables **true**, sin prefijo de clase, iconos **lucide-react**.

### Componentes instalados en `components/ui/`

| Componente | Archivo | Uso habitual |
|---|---|---|
| `Button` | `button.tsx` | CTAs, acciones |
| `Card` | `card.tsx` | Contenedor con borde y sombra |
| `Dialog` | `dialog.tsx` | Modales |
| `Sheet` | `sheet.tsx` | Panel lateral (móvil) |
| `Accordion` | `accordion.tsx` | FAQ, contenido expandible |
| `Select` | `select.tsx` | Desplegables |
| `Input` | `input.tsx` | Campos de texto |
| `Form` | `form.tsx` | Wrapper de react-hook-form |
| `Badge` | `badge.tsx` | Etiquetas, estados |
| `Skeleton` | `skeleton.tsx` | Loading state |
| `Separator` | `separator.tsx` | Divisores |
| `Carousel` | `carousel.tsx` | Carrusel (embla) |
| `Sonner` | `sonner.tsx` | Toasts |
| `Sidebar` | `sidebar.tsx` | Menú lateral admin |

### Componentes UI propios del proyecto

| Componente | Archivo | Propósito |
|---|---|---|
| `Section` | `section.tsx` | Contenedor de sección (py + container) |
| `FAQItem` | `faq-item.tsx` | Ítem de acordeón FAQ |
| `PricingCard` | `pricing-card.tsx` | Card de producto/precio |
| `CTASection` | `cta-section.tsx` | Banda de llamada a la acción |
| `BreakerBanner` | `breaker-banner.tsx` | Banner divisorio |
| `LoadingSpinner` | `loading-spinner.tsx` | Indicador de carga |
| `LazyImage` | `lazy-image.tsx` | Imagen con lazy loading |
| `SkipLink` | `skip-link.tsx` | Accesibilidad: saltar al contenido |
| `GoogleSignInButton` | `google-sign-in-button.tsx` | Botón OAuth Google |
| `3dToggle` | `3d-toggle.tsx` | Toggle con efecto 3D |

---

## 6. Button — variantes y tamaños

```tsx
// Variantes
<Button variant="default">   // bg-primary, texto blanco
<Button variant="outline">   // borde, fondo background
<Button variant="secondary"> // bg-secondary
<Button variant="ghost">     // transparente, hover accent
<Button variant="link">      // solo texto con underline
<Button variant="destructive"> // bg-destructive

// Tamaños
<Button size="sm">      // h-8, px-3
<Button size="default"> // h-9, px-4
<Button size="lg">      // h-10, px-6
<Button size="icon">    // 36×36px

// CTA primario de marca (patrón frecuente)
<Button size="lg" className="bg-accent text-white hover:bg-accent/90">
```

El botón tiene una animación de subrayado en hover (pseudo-elemento `::after`) cuya velocidad se controla con la prop `underlineSpeedMs` (default: 300ms).

---

## 7. Clases de utilidad personalizadas

Definidas en `globals.css` dentro de `@layer utilities`.

| Clase | Efecto |
|---|---|
| `.animate-float` | Flotación vertical suave (3s, infinita) |
| `.animate-pulse-heart` | Pulso de escala (2s, infinita) |
| `.animate-fade-in-up` | Entrada desde abajo con fade (0.6s, una vez) |
| `.shape-heart` | Clip-path de corazón con lóbulos pronunciados |
| `.heart-glossy` | Relleno degradado glossy para el corazón |
| `.pulse-circle` | Círculo con latido animado (2.4s) |
| `.card-3d` | Hover 3D: rotación + sombra elevada (450ms) |
| `.perspective-1000` | perspective: 1000px en contenedor |
| `.icon-lift` | translateZ(24px) para elevar icono en 3D |
| `.wave-path` | Trazo SVG de onda animado (draw 2.8s) |
| `.wave-shadow` | Sombra del trazo de onda (--destructive, blur) |
| `.red-dot-pulse` | Punto rojo con anillos pulsantes en hover del grupo |

Todas respetan `@media (prefers-reduced-motion: reduce)` — las animaciones se desactivan automáticamente.

---

## 8. Patrones de layout recurrentes

### Card de producto

```tsx
<div className="bg-card rounded-lg p-4 text-center border border-border hover:shadow-md transition-shadow">
  <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center bg-primary">
    <Icon className="w-4 h-4 text-white" />
  </div>
  <h3 className="font-semibold text-sm mb-1 text-primary">{title}</h3>
  <p className="text-xs text-muted-foreground mb-2">{description}</p>
  <p className="text-lg font-bold text-primary">€{price}</p>
  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white">Pagar</Button>
</div>
```

### Card destacada (most popular)

Añade `border-2` en lugar de `border` y `borderColor: '#517e61'` inline. Badge posicionado `absolute -top-2 left-1/2 -translate-x-1/2` con `bg-accent text-white text-xs px-2 py-1 rounded-full`.

### Sección con fondo suave

```tsx
<Section className="bg-primary/5">   // verde muy tenue
```

### Hero con imagen de fondo

```tsx
<Section className="relative overflow-hidden min-h-screen flex items-center">
  <div aria-hidden className="absolute inset-0 -z-10">
    <img className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black/40" /> {/* overlay */}
  </div>
  {/* Texto blanco sobre overlay */}
</Section>
```

---

## 9. Responsive y breakpoints (Tailwind defaults)

| Breakpoint | Prefijo | Ancho mínimo |
|---|---|---|
| Mobile (base) | — | 0px |
| Small | `sm:` | 640px |
| Medium | `md:` | 768px |
| Large | `lg:` | 1024px |
| XL | `xl:` | 1280px |

No hay breakpoints custom definidos en este proyecto.

### Mobile overflow

El CSS incluye reglas globales para evitar overflow-x en móvil: `html, body, main, section` tienen `overflow-x: hidden`. No añadir `width > 100%` ni márgenes negativos sin verificar en móvil.

---

## 10. Animaciones de biblioteca

| Biblioteca | Uso en el proyecto |
|---|---|
| **Framer Motion** | Animaciones de entrada declarativas en componentes React |
| **GSAP** | Animaciones de scroll y timeline (devDep) |
| **Three.js / React Three Fiber** | Elementos 3D |
| **tw-animate-css** | Clases de animación Tailwind adicionales (importada en globals.css) |

---

_Actualizar este archivo si se cambia la paleta, se añaden tokens o se incorporan nuevos patrones de layout._
