## Plan
1. Modificar `guides-section.tsx` para pasar `backCoverSrc={guide.coverImageUrl ?? "/logo2.webp"}` al componente que renderiza la tarjeta (PricingCard).
2. Mantener el fallback existente en `pricing-card.tsx` (no romper).
3. Añadir test SSR (renderToStaticMarkup) para verificar `src` del reverso con y sin `coverImageUrl`.
4. Ejecutar verificación completa.