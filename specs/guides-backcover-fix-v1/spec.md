# guides-backcover-fix-v1

## Problema
En la sección pública de guías (“Guías gratuitas”), el reverso (flip) de las tarjetas siempre muestra `/logo2.webp` aunque la guía tenga `coverImageUrl` definido en frontmatter.

## Comportamiento esperado
- Si `guide.coverImageUrl` existe, el reverso debe renderizar esa imagen.
- Si no existe, el reverso debe usar `/logo2.webp`.

## Alcance
- Solo afecta a la sección pública de guías (GuidesSection → PricingCard).
- No se cambia parsing (products-md.ts) ni contenido.

## Acceptance Criteria
- AC1: Para una guía con `coverImageUrl="/uploads/x.webp"`, el reverso de la tarjeta renderiza `src="/uploads/x.webp"` (no `/logo2.webp`).
- AC2: Para una guía sin `coverImageUrl`, el reverso renderiza `src="/logo2.webp"`.
- AC3: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pasan.