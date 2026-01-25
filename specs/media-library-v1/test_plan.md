# Test Plan — Media Library v1

## Unit tests
1. `sanitizeFilename()`: elimina caracteres raros, normaliza espacios, mantiene base.
2. `generateUniqueName()`: produce nombres distintos ante mismo input.
3. `resolveUploadDir(scope, entitySlug)`: no permite traversal y aplica rutas esperadas.
4. `validateFile(meta, bytes)`: rechaza:
   - mime/ext no permitido
   - size > límite

## Integration tests (API)
1. Upload sin sesión → 401/403.
2. Upload con sesión no-admin → 403.
3. Upload admin image/pdf/mp4 → 200 y url empieza por `/uploads/`.
4. List sin admin → 403.
5. Delete:
   - si url referenciada en 2 MD → NO borra
   - si url solo en 1 MD y se reemplaza → borra el fichero

## E2E smoke (manual o playwright si existe)
1. Dashboard → Hero:
   - subir imagen → guardar → home refleja imagen
2. Testimonials:
   - subir imageUrl/videoUrl → render ok
3. Guides:
   - subir pdf (fileUrl) → enlace descarga funciona

## Checks
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Dashboard Media Library tab smoke
1. Ir a Dashboard → tab Media
2. Cambiar prefix y verificar que lista actualiza
3. Borrar un asset no referenciado → desaparece
4. Borrar asset referenciado → mensaje de bloqueo, item permanece
