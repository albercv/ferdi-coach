---
title: "Troubleshooting"
description: "Errores frecuentes y cómo resolverlos. Tanto operativos como de desarrollo."
category: "ops"
tags: ["bugs", "errores", "debugging", "fix"]
audience: ["dev", "user"]
order: 90
---

# Troubleshooting

## Acceso

### "FORBIDDEN" al subir ficheros desde el dashboard

**Síntoma**: Ferdy entra al dashboard pero al pulsar "Subir" recibe `403 FORBIDDEN`.

**Causa**: el JWT cacheado tiene `role: "user"` porque inició sesión antes de que su email se añadiera a la allowlist.

**Solución**:
1. Cerrar sesión completamente.
2. Volver a entrar con Google.
3. Si persiste: verificar que `AUTH_ADMIN_EMAIL_2` está en el `.env` de producción y reiniciar PM2.

Ver T6 en `tasks/todo.md` para el fix definitivo en `lib/auth.ts`.

### "UNAUTHORIZED" al llamar a una API admin

Sesión expirada. Hacer logout y login de nuevo.

## Pagos

### El cliente paga y no recibe email de confirmación

1. Buscar la submission en `content/payments/submissions/<id>.md`. Si no existe → la API falló (revisar logs).
2. Si existe pero no hay email: dashboard de Resend → Activity → buscar destinatario.
3. Si Resend no muestra el envío: el `RESEND_API_KEY` es inválido o `EMAIL_FROM` no está verificado.

### Submission no aparece en el dashboard

El directorio `content/payments/submissions/` no existe en el filesystem del servidor. Crear:

```bash
ssh ferdy "mkdir -p /var/www/ferdy/content/payments/submissions && pm2 restart ferdy-web"
```

### Email de entrega no llega cuando confirmo

Comprobar en logs:

```bash
ssh ferdy "pm2 logs ferdy-web --lines 100 | grep -i 'sendDeliveryEmail'"
```

Causa típica: el path del PDF de la guía no existe (la guía fue borrada o renombrada). Restaurar el PDF en `public/uploads/` o reasignarlo desde el tab Guías.

## Build / dev

### `npm run build` falla por tipos

```bash
npm run typecheck
```

Mira el error exacto. Lo más habitual: cambio en `lib/content-md.ts` que rompe el contrato con un componente.

### Tailwind no aplica nuevas clases

Tailwind 4 usa scan automático. Si una clase nueva no aplica:
- Borrar `.next/` y rebuildear.
- Revisar que la clase no esté concatenada dinámicamente sin lista completa (`bg-${color}` no funciona — usar mapping).

### "Cannot find module '@/...'"

Reiniciar el servidor de TypeScript en VSCode (Cmd+Shift+P → "Restart TS Server"). Si persiste: `tsconfig.json` tiene los paths bien, pero IDE cacheó.

## Producción

### Sentry no recibe errores

1. `SENTRY_DSN` debe estar en `.env` de producción.
2. `instrumentation.ts` y `instrumentation-client.ts` deben estar en la raíz.
3. Verificar en `next.config.mjs` que `withSentryConfig` envuelve el config.

### PM2 no arranca tras deploy

```bash
ssh ferdy "pm2 logs ferdy-web --err --lines 100"
```

Causas frecuentes: variable de entorno faltante, puerto ocupado, error de build no detectado en local.

### Despliegue rompe assets/uploads

Recordatorio: `public/uploads/` y `content/payments/submissions/` **no van en git**. Si la máquina es nueva, restaurar backup antes de arrancar el proceso.
