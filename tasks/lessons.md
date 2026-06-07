# Lecciones — Ferdy Coach

Patrones aprendidos de correcciones del usuario. Revisar al inicio de cada sesión.

## Builds y deploys los hace el usuario, no Claude

**Fecha:** 2026-06-07

**Qué pasó:** Claude corrió `npm run build` varias veces en las Ramas 2-4 dentro del directorio de producción. El proceso `ferdy-web` (next start vía pm2) sirve ese mismo `.next`. Recompilar bajo el server vivo (sin `pm2 restart`) generó mismatch server↔disco → "Failed to find Server Action" + chunks rotos → hidratación rota en todo el sitio (secciones lazy en placeholder, login/dashboard muertos).

**Regla:**
- Claude NO ejecuta `npm run build` ni `pm2 restart`/deploys. Los hace el usuario.
- Para verificar tipos: `npm run typecheck` (tsc --noEmit) sí — no toca `.next`.
- Para probar comportamiento: Claude da instrucciones concretas (comandos/URLs) y espera feedback del usuario.
