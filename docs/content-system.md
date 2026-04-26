---
title: "Sistema de contenido (.md como BD)"
description: "Cómo se modela, lee y escribe el contenido editable basado en ficheros Markdown."
category: "dev"
tags: ["contenido", "markdown", "frontmatter", "gray-matter"]
audience: ["dev"]
order: 60
---

# Sistema de contenido

## Por qué `.md` y no una base de datos

- **Cero dependencias operativas**: nada que mantener (no DB, no migraciones).
- **Versionable**: cada cambio queda en git con autor y diff legible.
- **Transparente**: el coach (con ayuda) puede leer el contenido directamente.
- **Coste marginal cero**: hosteado en el mismo servidor que la app.

A cambio: no es transaccional, no escala a millones de items, no soporta búsquedas complejas en SQL. Para Ferdy Coach (decenas de items) sobra.

## Anatomía de un fichero

```markdown
---
title: "Texto visible"
position: 3
extra: "valor"
---
Cuerpo en Markdown estándar.
```

- **Frontmatter** (entre `---`): metadatos en YAML. Parseados con `gray-matter`.
- **Cuerpo**: contenido Markdown libre. Algunos modelos lo usan como descripción larga; otros lo dejan vacío.

## Tipos modelados (`lib/content-md.ts`)

- `Testimonial` — un fichero por testimonio en `content/testimonials/`
- `FAQItem` — items dentro de un solo `content/faq.md` (array en frontmatter)
- `AboutContent`, `HeroContent`, `CTAContent`, `BreakerContent`, `ForWhoContent` — un fichero único por sección
- `GuideProduct`, `SessionProduct` — `content/products/<kind>/<slug>.md`

## Lectura

Cada tipo tiene su `getX()` que:

1. Resuelve el directorio (`CONTENT_DIR`, configurable vía `CONTENT_DIR=...`).
2. Lee el fichero(s) con `fs.readFileSync`.
3. Parsea con `matter()`.
4. Mapea a un objeto tipado.
5. Ordena por `position` cuando aplica.

## Escritura

Cada tipo tiene `setX()` y, si aplica, `addXItem()` y `deleteXItem()`. Patrón:

1. Leer el estado actual.
2. Aplicar el cambio en memoria (insertar, actualizar, borrar).
3. **Renormalizar `position`** (1, 2, 3, …) — nunca dejar huecos.
4. Re-renderizar el frontmatter manualmente (no se usa `matter.stringify` para evitar reordenar claves).
5. `fs.writeFileSync` atómico.

## Reglas de oro

- **Nunca borrar `.md` sin verificar referencias**. Por ejemplo, una guía con submissions activas (ver `lib/products-md.ts` → `protege guías contra borrado mientras haya compras activas`).
- **Backup antes de cualquier cambio masivo**. `tar -czf backup.tgz content/`.
- **No editar manualmente desde el servidor en producción** mientras hay tráfico — usar siempre el dashboard.
- **`content/payments/submissions/`** se trata como datos, no contenido. NO va a git. Backup manual antes de deploy.

## Migración futura a DB

Si alguna vez se migra a una BD real, la capa `lib/content-md.ts` actúa como interfaz: solo hay que reescribir las funciones internas manteniendo las firmas públicas. El resto de la app no se entera.
