---
title: "Estilos y diseño"
description: "Resumen de tokens, paleta y convenciones de UI. Versión completa en STYLES.md."
category: "dev"
tags: ["estilos", "ui", "tailwind", "shadcn"]
audience: ["dev"]
order: 80
---

# Estilos

> 📄 La referencia completa de tokens, paleta y patrones está en `STYLES.md` en la raíz del repo.

## Stack visual

- TailwindCSS 4 con tokens personalizados (vars CSS en `app/globals.css`).
- shadcn/ui como librería base de componentes (`components/ui/`).
- Variables CSS para todo el theming. Nunca hardcodear colores.

## Tokens clave

| Token | Uso |
|---|---|
| `--background` / `--foreground` | Fondo y texto principal |
| `--primary` / `--primary-foreground` | Color de marca (acento principal) |
| `--accent` / `--accent-foreground` | Color secundario (botón "Reservar") |
| `--muted` / `--muted-foreground` | Estados secundarios, placeholders |
| `--border` | Bordes neutros |
| `--ring` | Focus ring accesible |

Todos los tokens tienen variante dark mode automática.

## Convenciones

- **Spacing**: múltiplos de `4px` (Tailwind `p-1`, `p-2`, `p-3`, `p-4`…).
- **Radios**: `rounded-md` por defecto, `rounded-full` para avatars/badges.
- **Tipografía**: variable, sin hard-coded `text-[18px]`. Usar `text-sm`, `text-base`, `text-lg`, etc.
- **Sombra**: `shadow-sm` y `shadow-md`. Nunca sombras custom.

## Componentes base más usados

| Componente | Para qué |
|---|---|
| `Button` | Acciones primarias y secundarias |
| `Card` + `CardHeader/Content/Footer` | Bloques de contenido |
| `Tabs` + `TabsList/Trigger/Content` | Navegación tabular (dashboard) |
| `Dialog` / `AlertDialog` | Modales (PaymentDialog usa Dialog) |
| `Input` / `Textarea` / `Label` | Formularios |
| `Select` | Selección discreta |
| `Toast` (`use-toast`) | Feedback no bloqueante |

## Animación

- **Framer Motion** para entradas/salidas suaves de secciones.
- **GSAP** para animaciones de scroll complejas (parallax del hero).
- Respetar `prefers-reduced-motion` siempre.

## Accesibilidad

- Texto siempre con contraste AA mínimo.
- Focus visible (`focus-visible:ring-ring`).
- Labels asociados a inputs vía `htmlFor`.
- Componentes Radix ya gestionan ARIA correctamente; no romper su comportamiento.
