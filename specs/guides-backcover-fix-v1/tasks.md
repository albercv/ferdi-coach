## T1-fix — Wire coverImageUrl to back cover
- Cambiar GuidesSection para pasar `backCoverSrc={guide.coverImageUrl}` (con fallback si se quiere redundante).
- Mantener fallback de PricingCard.

Done when:
- Con coverImageUrl definido, el reverso usa esa src.
- Sin coverImageUrl, el reverso usa /logo2.webp.

## T2-fix — Tests + verification
- Añadir test SSR (renderToStaticMarkup) que valide:
  - AC1: src === coverImageUrl cuando existe
  - AC2: src === /logo2.webp cuando no existe
- Ejecutar pnpm lint && pnpm typecheck && pnpm test && pnpm build