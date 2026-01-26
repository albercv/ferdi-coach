# Plan técnico — Media Library v1

## Enfoque
Implementación v1 con disco local en `public/uploads/**` y URLs públicas `/uploads/**`.
Diseño extensible mediante `StorageAdapter` para permitir v2 con S3/R2/Vercel Blob.

## Estructura de módulos (propuesta)
- `lib/media/`
  - `paths.ts` (resolver dir destino según scope/entitySlug)
  - `filename.ts` (sanitize + unique filename)
  - `validation.ts` (allowed mimes/ext + size + sniff opcional)
  - `reference-scan.ts` (buscar referencias de url en /content/**)
  - `mediaService.ts` (orquestación)
- `lib/media/storage/`
  - `StorageAdapter.ts`
  - `LocalPublicStorage.ts`
- `lib/auth/assertAdmin.ts` (o equivalente)
- `app/api/media/`
  - `upload/route.ts`
  - `list/route.ts`
  - `delete/route.ts`

## Cambios en lectura/escritura de Markdown
- `content-md.ts`: añadir campos en schemas y lógica de compatibilidad testimonials.
- `products-md.ts`: añadir `coverImageUrl` (guides) y `imageUrl` (sessions).

## Integración con APIs de content existentes
En los handlers de `app/api/content/*`:
- Detectar cambios de campo(s) media (oldUrl -> newUrl).
- Tras persistir MD: llamar `MediaService.tryDeleteIfUnreferenced(oldUrl)`.

## UI pública
- `testimonial-card.tsx`: usar urls completas con fallback legacy.
- `hero-section.tsx`, `about-section.tsx`, `header.tsx`:
  - leer nuevos campos desde MD si existen, si no fallback hardcoded actual.

## Dashboard
- Crear `MediaPicker` reusable:
  - upload a `/api/media/upload`
  - preview
  - setUrl en estado del editor
- Añadir a:
  - Hero: backgroundImageUrl
  - About: videoUrl/posterImageUrl
  - Testimonials: imageUrl/videoUrl
  - Guides: coverImageUrl + fileUrl (pdf)
  - Sessions: imageUrl (si aplica)

  ## Dashboard — Media Library tab (v1.1)
- Añadir tab "Media" en `dashboard/page.tsx` (o sistema de tabs existente).
- Implementar primero listado (T11.1) y después delete (T11.2) para iteración rápida y verificable.
- Estado:
  - `prefix` seleccionado (default `/uploads`)
  - `items` (ListObject[])
  - `loading`, `error`
- Calls:
  - `GET /api/media/list?prefix=${encodeURIComponent(prefix)}`
  - `DELETE /api/media/delete` con body `{ url }`
- UX:
  - Loading spinner/estado textual durante fetch.
  - En delete:
    - deshabilitar botón mientras borra
    - si `still-referenced`: mostrar error inline/toast y mantener item
    - si `deleted`: refrescar lista (re-fetch) o filtrar item del estado
- Preview:
  - decidir por extensión (`.png/.jpg/.webp/.avif` imagen, `.mp4` vídeo, `.pdf` doc)
  - Preview mínimo aceptable: iconos + link, imagen con `<img>` pequeña.


## Consideraciones de implementación Next.js
- Upload handler:
  - Para v1: `await request.formData()` y escribir a FS.
  - Nota: si vídeos > ~20-50MB y el runtime da problemas, pasar a streaming con Busboy/Formidable.
- Sanitizar inputs (`scope`, `entitySlug`) para evitar path traversal.

## Riesgos
- Serverless: FS no persistente → requiere v2 con Storage remoto.
- Vídeos grandes: `formData()` puede ser insuficiente → streaming.

## Definition of Done
- pnpm lint/typecheck/test/build OK
- Tests: auth + upload + replace delete seguro
- Dashboard permite subir y guardar URLs en MD
- UI pública no rompe contenido legacy

## Plan v1.2 — Testimonial mediaUrl
- Parser: exponer en el modelo de testimonial un campo `mediaUrl` ya resuelto aplicando precedencia:
  mediaUrl > videoUrl > imageUrl > legacy video/image(slug->ruta).
- UI testimonial-card: usar únicamente `mediaUrl` para decidir render (mp4 vs imagen).
- Dashboard: reemplazar inputs separados por un MediaPicker único (accept image/*,video/mp4) y guardar `mediaUrl`.
- En el writer del testimonial, al persistir: set `mediaUrl` y eliminar claves legacy (`videoUrl`,`imageUrl`,`video`,`image`) para normalizar.

## Plan
1. Modificar `guides-section.tsx` para pasar `backCoverSrc={guide.coverImageUrl ?? "/logo2.webp"}` al componente que renderiza la tarjeta (PricingCard).
2. Mantener el fallback existente en `pricing-card.tsx` (no romper).
3. Añadir test SSR (renderToStaticMarkup) para verificar `src` del reverso con y sin `coverImageUrl`.
4. Ejecutar verificación completa.
