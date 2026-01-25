# Media Library v1 (Uploads + asociación a contenido)

## Resumen
Implementar un sistema de subida y gestión de ficheros (imágenes, vídeos y PDFs) restringido a usuarios admin. El sistema debe devolver una URL final (ruta pública) que se persistirá en Markdown para asociarla a una sección/elemento (hero, about, testimonials, productos, etc.). Debe permitir reemplazo/actualización de media, eliminando el fichero antiguo cuando ya no esté referenciado.

## Objetivos (Goals)
1. Subida de media (multipart/form-data) para:
   - Imágenes (png/jpg/jpeg/webp/avif)
   - Vídeos (mp4)
   - Documentos (pdf)
2. Guardar ficheros subidos en una ruta determinística dentro de `public/uploads/**` (v1).
3. Devolver URL pública `/uploads/...` para persistirla en Markdown.
4. Evitar colisiones de nombre dentro de la misma ruta (no overwrite accidental).
5. Reemplazo: al actualizar la URL en un MD, intentar borrar el fichero anterior si ya no se usa en ningún otro MD.
6. Seguridad: solo admins pueden subir/listar/borrar.

## No objetivos (Non-goals)
- Transformación/optimización (resize, compresión, transcodificación de vídeo).
- CDN/Storage externo en v1 (se diseña con adapter para v2).
- Gestión avanzada de permisos por rol granular (solo admin vs no-admin en v1).
- Versionado histórico de media (más allá de reemplazo).

## Asunciones / Restricciones
- El hosting permite persistencia en disco (VPS/Docker/Node server). Se escribe en FS en runtime.
- Si el despliegue es serverless sin disco persistente, esta feature requerirá Storage remoto (v2) usando `StorageAdapter`.

## Almacenamiento y rutas
- Directorio base: `public/uploads/`
- URL pública: `/uploads/**`
- Estructuras de carpetas (v1):
  - `/uploads/hero/`
  - `/uploads/about/`
  - `/uploads/testimonials/<slug>/`
  - `/uploads/products/guides/<slug>/`
  - `/uploads/products/sessions/<slug>/`
  - `/uploads/global/` (assets globales como logo)

## Naming y colisiones
- No se permite sobrescribir un archivo existente por nombre.
- Nombre final:
  - `sanitizedBaseName--<uniqueSuffix>.<ext>`
  - `uniqueSuffix` generado (nanoid/uuid corto).
- Si el nombre final ya existe (muy improbable), regenerar el sufijo.

## Tipos soportados (v1)
- Imágenes: png, jpg, jpeg, webp, avif
- Vídeos: mp4
- Docs: pdf

Validación:
- Tamaño máximo por tipo (config):
  - images: 10MB
  - pdf: 30MB
  - video: 200MB
- Validar extension + mime y (recomendado) sniffing del contenido (lib `file-type`).

## Seguridad / Autenticación
- Requiere sesión con NextAuth.
- Requiere admin:
  - Implementar `assertAdmin(session)` basado en tu lógica actual (admins por env).
- Endpoints protegidos: upload, list, delete.

## API (contratos)
### POST /api/media/upload
- Auth: admin-only
- Content-Type: multipart/form-data
- Fields:
  - `file` (required)
  - `scope` (required): hero|about|testimonials|products|global
  - `entitySlug` (optional): slug de testimonio/guía/sesión para construir ruta
  - `kind` (optional): image|video|document (se puede inferir)
- Response 200:
  - `{ url, mimeType, size }`

### GET /api/media/list?prefix=/uploads/about/
- Auth: admin-only
- Response 200:
  - `[{ url, size, mimeType, lastModified }]`

### DELETE /api/media/delete
- Auth: admin-only
- Body: `{ url }`
- Borrado seguro (solo si no referenciado en content)

## Asociación a contenido (Markdown)
Regla: se guarda SIEMPRE la URL completa (ruta o URL remota). Fin del “slug sin extensión”.

Cambios de schema:
- `content/hero.md`: `backgroundImageUrl?: string`
- `content/about.md`: `videoUrl?: string`, `posterImageUrl?: string`
- `content/testimonials/*.md`:
  - nuevo: `imageUrl?: string`, `videoUrl?: string`
  - legacy: `image?: string`, `video?: string` se mantiene en lectura (compat).
- `content/products/guides/*.md`:
  - `fileUrl` ya existe (permitir `/uploads/...pdf`)
  - nuevo: `coverImageUrl?: string`
- `content/products/sessions/*.md`:
  - nuevo: `imageUrl?: string` (si aplica)

## Reemplazo y borrado de antiguos
Cuando un campo media cambia en un MD:
1. Guardar la nueva URL en MD
2. Si la URL anterior es local (`/uploads/**`):
   - buscar referencias exactas de esa URL en `/content/**`
   - si no hay más referencias → borrar fichero físico
   - si hay referencias → NO borrar

## Compatibilidad (testimonials legacy)
En lectura:
- si `videoUrl` existe usarla
- else si `video` legacy existe → resolver `/${video}.mp4`
- si `imageUrl` existe usarla
- else si `image` legacy existe → resolver `/${image}.png`

## Criterios de aceptación (Acceptance Criteria)
1. Un usuario no-admin recibe 401/403 en upload/list/delete.
2. Un admin puede subir:
   - una imagen → obtiene URL pública usable
   - un mp4 → obtiene URL pública usable
   - un pdf → obtiene URL pública usable
3. No hay overwrites: dos subidas con mismo nombre original producen URLs distintas.
4. Al guardar un MD con reemplazo:
   - se actualiza el MD con la nueva URL
   - el fichero antiguo se borra SOLO si no está referenciado en otro MD.
5. La UI pública renderiza correctamente las nuevas URLs sin romper el contenido existente.

## Observabilidad
- Log mínimo server-side: { adminId/email, scope, url, size, mimeType } en upload/delete.

## Dashboard: Media Library tab (admin-only) — v1.1

### Objetivo
Añadir en el backoffice una pestaña "Media" para listar y borrar assets subidos en `/uploads/**` usando los endpoints existentes:
- GET `/api/media/list?prefix=...`
- DELETE `/api/media/delete` (borrado seguro)

### Comportamiento
- Permite seleccionar un `prefix` para listar:
  - `/uploads`
  - `/uploads/hero`
  - `/uploads/about`
  - `/uploads/testimonials`
  - `/uploads/products`
  - `/uploads/global`
- Muestra una lista de items con:
  - `url`
  - `size` (bytes o formateado)
  - `lastModified` (derivado de `lastModifiedMs`)
- Preview básico:
  - Imagen: miniatura
  - Vídeo: icono o mini `<video>` (opcional)
  - PDF: icono + enlace
- Borrar:
  - botón "Delete" por item → llama `DELETE /api/media/delete` con `{ url }`
  - Si backend responde `{ deleted:false, reason:'still-referenced' }`, mostrar error "No se puede borrar: está referenciado" y no eliminar de la lista.
  - Si `deleted:true`, refrescar lista o remover item localmente.

### Seguridad
- La pestaña solo es accesible desde dashboard (admin).
- Las llamadas dependen de la protección server-side ya implementada en endpoints.

### Acceptance Criteria
1. Un admin puede listar assets por cada `prefix` desde el dashboard.
2. La lista muestra al menos `url`, `size`, `lastModified`.
3. Borrar un asset no referenciado: desaparece de la lista tras éxito.
4. Intentar borrar un asset referenciado: no desaparece y se muestra mensaje de bloqueo.
5. `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pasan.

### Entrega
- v1.1 incluye listado (T11.1) y borrado (T11.2) en dos pasos incrementales.

## Testimonials: Media Slot unificado (mediaUrl) — v1.2

### Objetivo
Evitar caché por URL constante (legacy slug) y simplificar edición: un único campo `mediaUrl` que puede ser imagen o vídeo.

### Modelo de datos
En `content/testimonials/*.md`:
- Nuevo campo: `mediaUrl?: string`
- Compatibilidad lectura (legacy):
  - Si `mediaUrl` existe → usarlo.
  - Si no, usar `videoUrl`/`imageUrl` (si existen).
  - Si no, usar legacy `video`/`image` (slugs) resolviendo `/${slug}.mp4` o `/${slug}.png`.

### Render
- Si `mediaUrl` termina en `.mp4` → renderizar vídeo.
- Si no → renderizar imagen.
- Fallback: `/logo2.webp`.

### Dashboard
- Un único MediaPicker para el slot de testimonio que acepta `image/*` y `video/mp4`.
- Al guardar, escribir SOLO `mediaUrl` y limpiar `imageUrl`, `videoUrl`, `image`, `video` (para evitar ambigüedad).

### Cache busting
- Se considera resuelto porque cada reemplazo debe generar una URL nueva (upload con nombre único) y el MD debe persistir esa URL.

### Acceptance Criteria
1. Subir imagen o vídeo para un testimonio desde dashboard rellena `mediaUrl` con la URL devuelta por upload.
2. La home renderiza correctamente imagen/vídeo según extensión.
3. Reemplazar media cambia la URL (no se reutiliza la misma).
4. El cleanup (T8) intenta borrar la anterior si ya no está referenciada.
5. Compatibilidad: testimonios existentes con legacy slug siguen renderizando.
6. `pnpm lint && pnpm typecheck && pnpm test && pnpm build` OK.
