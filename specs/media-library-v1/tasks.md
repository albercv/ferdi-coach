# Tasks — Media Library v1

## T1 — Core media utils (naming/paths/validation)
**Output**
- `lib/media/filename.ts`
- `lib/media/paths.ts`
- `lib/media/validation.ts`

**AC**
- filename único y sanitizado
- paths no permiten `../`
- valida tamaño + mime/ext (+ sniff opcional)

## T2 — StorageAdapter + LocalPublicStorage
**Output**
- `lib/media/storage/StorageAdapter.ts`
- `lib/media/storage/LocalPublicStorage.ts`

**AC**
- guarda en `public/uploads/**`
- delete solo dentro de `public/uploads`

## T3 — Reference scan + MediaService
**Output**
- `lib/media/reference-scan.ts`
- `lib/media/mediaService.ts`

**AC**
- `tryDeleteIfUnreferenced(url)` no borra si hay referencias en otros MD
- borra si no hay referencias

## T4 — Auth admin helper
**Output**
- `lib/auth/assertAdmin.ts` (o donde toque)

**AC**
- consistente con tu NextAuth actual
- endpoints devuelven 401/403 correctamente

## T5 — API endpoints media (admin-only)
**Output**
- `app/api/media/upload/route.ts`
- `app/api/media/list/route.ts`
- `app/api/media/delete/route.ts`

**AC**
- upload devuelve `{ url, mimeType, size }`
- list devuelve assets por prefix
- delete aplica borrado seguro

## T6 — Extender schemas MD (lectura)
**Output**
- cambios en `content-md.ts`
- cambios en `products-md.ts`

**AC**
- compat testimonials legacy ok
- parse no rompe contenidos existentes

## T7 — UI pública usa URLs completas
**Output**
- `testimonial-card.tsx` actualizado
- `hero-section.tsx`, `about-section.tsx`, `header.tsx` (fallback hardcoded)

**AC**
- sin MD nuevo: igual que hoy
- con URLs: renderiza media subida

## T8 — Integrar reemplazo/borrado en APIs content existentes
**Output**
- modificar `app/api/content/*` handlers relevantes

**AC**
- al actualizar media en MD se intenta borrar el antiguo si no referenciado

## T9 — Dashboard: MediaPicker + wiring
**Output**
- `components/dashboard/MediaPicker.tsx`
- `dashboard/page.tsx` (o tabs) integrado

**AC**
- upload usable en móvil
- feedback claro
- guarda URL en MD usando APIs existentes

## T10 — Tests + verificación
**Output**
- unit/integration tests
- pipeline local: pnpm lint/typecheck/test/build

**AC**
- auth y upload cubiertos
- replace + borrado seguro cubierto

## T11.1 — Dashboard Media Library tab (list)
**Output**
- Tab "Media" en dashboard para listar assets bajo `/uploads/**` usando GET `/api/media/list`.

**Done when**
- Dropdown para `prefix` (/uploads, /uploads/hero, /uploads/about, /uploads/testimonials, /uploads/products, /uploads/global).
- Lista muestra `url`, `size`, `lastModified`.
- Preview básico según extensión (imagen thumbnail; mp4/pdf icono + link).
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build` OK

## T11.2 — Dashboard Media Library tab (delete)
**Output**
- Borrado desde la tab "Media" usando DELETE `/api/media/delete` (borrado seguro).

**Done when**
- Botón delete por item con loading/disabled mientras borra.
- Si `deleted:true` refresca lista o elimina item.
- Si `still-referenced` muestra mensaje y no elimina el item.
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build` OK

## T12 — Testimonials: schema mediaUrl + compat
**Done when**
- content-md.ts parsea `mediaUrl` con precedencia definida y mantiene compat legacy.
- tests cubren precedencia.
- build/tests OK.

## T13 — Testimonials: render usa mediaUrl
**Done when**
- testimonial-card.tsx renderiza solo a partir de `mediaUrl` (mp4 vs imagen).
- fallback correcto.
- build/tests OK.

## T14 — Dashboard: un solo MediaPicker para testimonial mediaUrl
**Done when**
- En dashboard, testimonio tiene 1 input/uploader que acepta imagen o mp4.
- Guardado persiste `mediaUrl` y limpia legacy fields.
- build/tests OK.
