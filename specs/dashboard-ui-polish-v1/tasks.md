# Tasks — dashboard-ui-polish-v1

## T1 — Crear wrapper de estilo para media (reuso)
- Implementar `MediaSectionCard` (o nombre equivalente) para unificar:
  - recuadro (Card) dentro de edición
  - centrado y spacing
  - opcional: `compactPreview` / `maxPreviewHeight`
- Reutiliza `MediaPicker` internamente (no duplicar lógica).

Done when:
- Existe un componente reusable usado por al menos 2 secciones.
- No se crean 3+ variantes de uploader.

## T2 — Hero: labels + subsección media + preview
- Cambiar labels CTA -> Botón principal/secundario.
- Background image dentro de `MediaSectionCard` centrado.
- Preview del dashboard muestra la imagen del hero.

Done when:
- AC1 cumple.

## T3 — Breaker: renombre + kicker editable + preview correcto
- Renombrar sección a español.
- Añadir campo persistido “kicker” (texto “Un alto aquí”) en breaker.md (frontmatter).
- Actualizar loader + sección pública + preview dashboard para usarlo.
- Preview: background correcto y texto centrado.

Done when:
- AC2 cumple.

## T4 — How it Works: renombre + media estilos + URL avanzado
- Renombrar sección a español.
- Reencuadrar la parte de media/files con `MediaSectionCard` centrado.
- URL editable solo con toggle “Avanzado”.
- Validación URL (startsWith('/') o startsWith('https://')).

Done when:
- AC3 cumple.

## T5 — Testimonials: renombre + media estilos
- Renombrar sección a español.
- Reencuadrar media con `MediaSectionCard` centrado y consistente.

Done when:
- AC4 + AC6 parcial cumplen.

## T6 — Sobre mí: media estilos + ajustar previews
- Reencuadrar media con `MediaSectionCard` centrado.
- Reducir tamaño del preview del vídeo en el editor (lado izquierdo).
- Preview derecha: renderizar vídeo/poster o imagen según datos guardados/draft.

Done when:
- AC5 cumple.

## T7 — Verificación final
- Ejecutar `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
- Ajustes menores para cumplir AC6 (consistencia de estilos).

Done when:
- AC6 + AC7 cumplen.
