# dashboard-ui-polish-v1

## Objetivo
Arreglos visuales y de estilo en el Dashboard (backoffice) para mejorar claridad, consistencia y previews.
Incluye 1 ajuste funcional mínimo: hacer editable el texto “Un alto aquí” del breaker y reflejarlo en la web.

## Principios
- Reutilizar un único componente de subida/selección de media (MediaPicker) en todas las secciones del CRUD.
- Estilo consistente: todas las “zonas de media” se presentan como subsección dentro de un recuadro (Card) con alineación centrada.
- Preview del dashboard debe reflejar lo que se verá en la web (sin hacks/duplicación innecesaria).

## Cambios por sección (Dashboard)

### 1) Hero
- Renombrar labels:
  - “CTA principal” -> “Botón principal”
  - “CTA secundario” -> “Botón secundario”
- Media (imagen de fondo):
  - Mostrar como subsección separada (Card dentro de edición Hero).
  - Corregir estilos/alineado: centrado, spacing consistente.
- Preview:
  - Mostrar la imagen del hero (backgroundImageUrl) en el preview del dashboard.

### 2) Breaker Quote
- Renombrar el nombre de sección en dashboard a un nombre representativo en español (ej: “Frase destacada”).
- Hacer editable el texto “Un alto aquí”.
- Preview:
  - El background del preview debe coincidir con el de la sección real (no blanco si en la web no es blanco).
  - Texto del preview centrado.

### 3) How it Works
- Cambiar el nombre a español (ej: “Cómo funciona”).
- Subida de imágenes/archivos:
  - Estilos: centrado, dentro de subsección (Card) marcada como “Media / Archivos”.
- Sobre “¿la URL del archivo debe ser editable?”:
  - Sí, pero como opción “Avanzado”: permitir editar manualmente la URL (para pegar una externa o una ya existente).
  - Default: subida con MediaPicker + campo URL readonly (o editable solo al activar “Avanzado”).
  - Validación: la URL debe ser absoluta (https://...) o relativa (/uploads/... o /...).

### 4) Testimonials
- Cambiar el nombre a español (ej: “Testimonios”).
- Subida de media:
  - Estilos: centrado, dentro de subsección (Card) “Media”.
  - Reusar el mismo componente de subida (MediaPicker) con el estilo unificado.

### 5) Sobre mí (About)
- Subida de media:
  - Estilos: centrado, dentro de subsección (Card) “Media”.
  - El vídeo previsualizado en el lado izquierdo (editor) debe ser más pequeño (no ocupar media pantalla).
- Preview (lado derecho):
  - Debe verse el vídeo o imagen/poster configurado en la sección (si existe).
  - Si no hay media, fallback actual.

## Reuso del componente de media
- No crear múltiples componentes distintos para subir media.
- Se permite crear un wrapper de estilo (p.ej. MediaSectionCard / MediaFieldGroup) que use internamente MediaPicker, para aplicar el mismo layout en todo el CRUD.
- El wrapper debe aceptar parámetros para limitar tipos:
  - `allowImages`, `allowVideo`, `allowPdf` (o `accept` directo).
  - Algunas secciones no admiten vídeo: se controla por parámetro.

## Datos / Persistencia (solo lo necesario)
- Breaker: añadir un campo persistido para “Un alto aquí” (p.ej. `breakerLabel` o `kicker`) en `content/breaker.md`.
- El resto es solo UI/labels/estilos/previews; no requiere cambios de schema.

## Acceptance Criteria (verificables)
AC1 Hero: labels actualizados; media de fondo aparece en subsección Card centrada; preview muestra la imagen configurada.
AC2 Breaker: nombre en español; “Un alto aquí” editable y persistido; preview centrado y con background correcto.
AC3 How it Works: nombre en español; subsección Media centrada; URL editable solo en modo Avanzado y validada.
AC4 Testimonials: nombre en español; subsección Media centrada usando componente común.
AC5 Sobre mí: subsección Media centrada; preview derecha muestra video/poster o imagen; preview izquierda del vídeo reducido.
AC6 Unificación: el estilo de subida/selección de media es consistente entre secciones y usa MediaPicker (con wrapper común si aplica).
AC7 `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pasan.
