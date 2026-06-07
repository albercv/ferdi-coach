# Lecciones — Ferdy Coach

Patrones aprendidos de correcciones del usuario. Revisar al inicio de cada sesión.

## Builds y deploys los hace el usuario, no Claude

**Fecha:** 2026-06-07

**Qué pasó:** Claude corrió `npm run build` varias veces en las Ramas 2-4 dentro del directorio de producción. El proceso `ferdy-web` (next start vía pm2) sirve ese mismo `.next`. Recompilar bajo el server vivo (sin `pm2 restart`) generó mismatch server↔disco → "Failed to find Server Action" + chunks rotos → hidratación rota en todo el sitio (secciones lazy en placeholder, login/dashboard muertos).

**Regla:**
- Claude NO ejecuta `npm run build` ni `pm2 restart`/deploys. Los hace el usuario.
- Para verificar tipos: `npm run typecheck` (tsc --noEmit) sí — no toca `.next`.
- Para probar comportamiento: Claude da instrucciones concretas (comandos/URLs) y espera feedback del usuario.

## Una rama por tarea — nunca commits directos en develop

**Fecha:** 2026-06-07

**Qué pasó:** Claude commiteó fixes de cierre de Rama 5 directamente en `develop` local. Corrección del usuario: cada tarea va en su propia rama.

**Regla:**
- Antes del primer commit de cualquier tarea: `git branch --show-current`. Si es `develop`/`main` → `git switch -c <prefijo>/<tarea>` ANTES de commitear.
- Todos los commits de la tarea van en esa rama. El merge a develop lo hace el usuario vía PR.
