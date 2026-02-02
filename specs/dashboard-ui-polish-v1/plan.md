# Plan — dashboard-ui-polish-v1

## Enfoque
1) Crear/ajustar un wrapper visual reutilizable para “bloques de media” en el dashboard:
- `MediaSectionCard` (Card con título “Media”, descripción opcional, contenido centrado).
- Dentro usa el `MediaPicker` existente (o el que ya esté en el repo).
- Props para aceptar tipos (accept / allowVideo / allowPdf) y para controlar preview size (compact).

2) Aplicar el wrapper en:
- Hero (background image)
- How it Works (media/files)
- Testimonials (media)
- About (video/poster)
Esto corrige estilos/alineado de una vez.

3) Previews:
- Hero preview: asegurar que el preview usa `backgroundImageUrl` (del draft o del MD guardado).
- About preview: asegurar que el preview muestra `videoUrl`/`posterImageUrl` o imagen, y reducir preview en editor.

4) Breaker:
- Añadir un nuevo campo persistido (frontmatter) en `content/breaker.md` para el “kicker” (texto “Un alto aquí”).
- Actualizar loader y componente público (breaker section) para leerlo.
- Dashboard: input para editarlo.
- Preview del dashboard: usar el mismo componente público (o las mismas clases) para background y centrado.

5) URL editable (How it Works):
- Mostrar URL como readonly por defecto.
- Toggle “Avanzado” -> habilita input editable.
- Validación simple en UI (y si existe endpoint de guardado, validar también server-side):
  - url empieza por `/` o `https://`.

## Riesgos
- Dashboard es una página client grande: mantener cambios acotados y evitar refactors grandes.
- Previews: preferir reutilizar componentes públicos antes que duplicar estilos.

## Verificación
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- Smoke manual guiado (ver test_plan.md)
