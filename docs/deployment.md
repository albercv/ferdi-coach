---
title: "Despliegue"
description: "Resumen del SOP de despliegue. La versión completa vive en DEPLOY.md."
category: "ops"
tags: ["deploy", "ops", "pm2", "vps"]
audience: ["dev"]
order: 70
---

# Despliegue

> 📄 La SOP completa, paso a paso, está en `DEPLOY.md` en la raíz del repo. Este documento es un resumen para consulta rápida.

## Pre-deploy (siempre)

1. **Backup** de `content/payments/submissions/` y `public/uploads/`:
   ```bash
   ssh ferdy "cd /var/www/ferdy && tar -czf backups/$(date +%F)-content.tgz content/payments/submissions public/uploads"
   ```
2. **Verificar `.env` en producción** — variables nuevas añadidas localmente deben copiarse al servidor.
3. **Tests verdes** local: `npm run typecheck && npm run test && npm run build`.

## Deploy

```bash
ssh ferdy
cd /var/www/ferdy
git fetch && git checkout develop && git pull
npm ci
npm run build
pm2 restart ferdy-web
pm2 logs ferdy-web --lines 50
```

## Post-deploy

- Comprobar landing pública → no errores en consola.
- Login en `/login` con cuenta admin → entrar al dashboard.
- Subir un asset de prueba al tab Media → verificar que aparece.
- Si tocaste pagos: hacer una compra de prueba en sandbox.

## Rollback

```bash
ssh ferdy
cd /var/www/ferdy
git checkout <SHA-anterior>
npm ci && npm run build && pm2 restart ferdy-web
```

## Variables de entorno mínimas

Ver `.env.example`. Críticas:

- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `AUTH_ADMIN_EMAIL`, `AUTH_ADMIN_EMAIL_2`
- `RESEND_API_KEY`, `EMAIL_FROM`, `COACH_NOTIFICATION_EMAIL`
- `CRON_SECRET`
- `SENTRY_DSN` (opcional pero recomendado)

## Riesgo: ficheros de datos

`content/payments/submissions/*.md` y `public/uploads/*` **no están en git**. Si despliegas en una máquina nueva sin restaurar el backup, perderás histórico de pagos y todos los assets.
