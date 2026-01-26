# Test Plan — dashboard-ui-polish-v1

## Smoke manual (dashboard)
1) Hero:
- Ver labels “Botón principal/secundario”.
- Subir/seleccionar background image.
- Ver preview con esa imagen.

2) Breaker:
- Ver nombre en español.
- Editar “Un alto aquí” (kicker) y guardar.
- Comprobar preview centrado y con background correcto.
- Abrir home pública y comprobar que el texto cambia.

3) How it Works:
- Ver nombre en español.
- Media/files dentro de recuadro centrado.
- Toggle “Avanzado”: editar URL manualmente; invalid URL muestra error; valid URL guarda.

4) Testimonials:
- Ver nombre en español.
- Media dentro de recuadro centrado.

5) Sobre mí:
- Media dentro de recuadro centrado.
- Preview de vídeo en editor reducido.
- Preview derecha muestra vídeo/poster o imagen.

## Regression
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- Navegación tabs dashboard sin layout roto.
