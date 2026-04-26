# DEPLOY.md — Proceso de despliegue de Ferdy Coach

> SOP para desplegar a producción sin perder datos críticos (`content/` y `public/uploads`) ni romper el symlink de uploads. Léelo entero la primera vez. Después usa el checklist de la sección 6.

---

## 1. Resumen del entorno

| Entorno | URL | Proceso PM2 | Puerto | Rama desplegable |
|---|---|---|---|---|
| Producción | ferdycoachdesamor.com | `ferdy-web` | 3000 | `main` |
| Test | test.ferdycoachdesamor.com | `ferdy-test` | 3001 | `develop` |

Servidor: Ubuntu VPS · Nginx (TLS + proxy a 3000/3001) · PM2 (gestor de procesos Node) · Resend (emails) · Sentry (monitorización).

Ruta del repo en el servidor: `/root/projects/ferdi-coach/`.

---

## 2. Modelo de ramas (git flow)

- `main` — rama de producción. **Sólo merges desde `develop` vía PR.** Cada merge a `main` implica deploy.
- `develop` — rama de integración. Aquí caen todas las features y fixes vía PR. Es lo que se despliega en `test`.
- `feature/<nombre>` — trabajo en curso. Se abre desde `develop`, se mergea a `develop` por PR.
- `fix/<nombre>` — corrección puntual. Mismo flujo que feature.
- `hotfix/<nombre>` — corrección urgente sobre `main`. Se mergea a `main` y se backportea a `develop`.

> **Nota:** Si producción está temporalmente desplegada desde una rama distinta a `main` (caso real visto el 2026-04-22 con `fix/uploadDocuments`), normalízalo cuanto antes: merge a `develop` → PR a `main` → deploy desde `main`. La verdad operacional se comprueba en el servidor con `git rev-parse HEAD`, no asumiendo el modelo.

---

## 3. Datos críticos que viven SÓLO en el servidor

Hay dos volúmenes de datos que **no están en git** y que un deploy mal hecho puede destruir.

### 3.1 `/content/` — base de datos en `.md`

Todo el directorio `content/` está en `.gitignore` (`/content/*`). El repo no lleva su contenido. En el servidor está poblado y es la BD del sitio.

| Ruta | Qué contiene | Recuperabilidad si se pierde |
|---|---|---|
| `content/payments/config.md` | IBAN del coach | Manual (re-introducir IBAN) |
| `content/payments/submissions/*.md` | Historial de pagos por cliente | **NULA** — datos de negocio únicos |
| `content/products/guides/*.md` | Catálogo de guías | Manual desde el dashboard |
| `content/products/sessions/*.md` | Catálogo de sesiones | Manual desde el dashboard |
| `content/hero.md`, `content/about.md` | Texto de la home | Manual desde el dashboard |
| `content/faq/*.md` | FAQ | Manual desde el dashboard |
| `content/testimonials/*.md` | Testimonios | Manual desde el dashboard |

**Implicación:** un `git pull` es seguro (no toca lo gitignorado). Un `rsync --delete` desde local **borraría todo el content/ del servidor**. Nunca usar `--delete` sobre el repo.

### 3.2 `/public/uploads/` — symlink a uploads de usuario

`public/uploads` es un **symlink**, no un directorio:

```
/root/projects/ferdi-coach/public/uploads -> /var/www/ferdy-uploads
```

Está en `.gitignore`. Los ficheros reales (imágenes, vídeos, PDFs subidos por el coach desde el dashboard) viven en `/var/www/ferdy-uploads/` y los sirve **nginx directamente**, no Next.js (ver sección 7).

**Implicación:** nunca borrar ni sobreescribir `public/uploads`. Si el symlink se rompe (p.ej. tras un clone fresco), recrearlo:

```bash
cd /root/projects/ferdi-coach/public
rm -rf uploads          # sólo si existe como dir vacío
ln -s /var/www/ferdy-uploads uploads
```

---

## 4. Variables de entorno

El fichero `.env` del servidor **no está en git**. Cualquier variable nueva añadida en código debe propagarse manualmente al `.env` de producción antes de desplegar.

Variables requeridas (ver `.env.example` para la plantilla):

```
NEXTAUTH_URL=https://ferdycoachdesamor.com
NEXTAUTH_SECRET=
AUTH_ADMIN_EMAIL=
AUTH_ADMIN_EMAIL_2=ferdycoachdesamor@gmail.com
AUTH_ADMIN_PASSWORD=
AUTH_ADMIN_NAME=
AUTH_GOOGLE_CLIENT_ID=
AUTH_GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=re_...
COACH_NOTIFICATION_EMAIL=ferdy.jsierra@ferdycoachdesamor.com
CRON_SECRET=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
MONITORING_WEBHOOK_SECRET=
```

> **Nota:** `.env.example` está en el repo y debe mantenerse al día como contrato. Si añades una variable en código y no aparece aquí, añádela también a `.env.example` en el mismo PR.

---

## 5. Pre-deploy — checklist obligatorio

Antes de mergear a `main` (o de hacer `git pull` en producción):

- [ ] La rama de origen (normalmente `develop`) está verde: `npm run typecheck && npm run test && npm run build` en local sin errores.
- [ ] Todas las variables de entorno nuevas están **añadidas al `.env` del servidor**.
- [ ] Si el cambio toca `content/payments/*` o el formato de submissions: **backup** del directorio (ver 5.1).
- [ ] Si el cambio toca el sistema de emails: probar con un envío real en `test.ferdycoachdesamor.com` antes.
- [ ] Si el cambio toca cron/transiciones: revisar que `CRON_SECRET` no haya cambiado.
- [ ] Si el cambio toca uploads o nginx: leer la sección 7 entera.

### 5.1 Backup mínimo antes de deploy

```bash
# En el servidor
cd /root
DATE=$(date +%Y%m%d-%H%M)
tar czf "backups/content-${DATE}.tar.gz" projects/ferdi-coach/content/
tar czf "backups/uploads-${DATE}.tar.gz" /var/www/ferdy-uploads/
```

Mantén al menos los 7 backups más recientes en `/root/backups/`.

---

## 6. Proceso de deploy

Asume: cambios ya mergeados a `main` (o a la rama que produzca prod sirva), `.env` actualizado, backups hechos.

```bash
# En el servidor, como root
cd /root/projects/ferdi-coach

# 1. Trae los cambios
git fetch --all
git checkout main
git pull --ff-only origin main

# 2. Verifica que el symlink de uploads sigue intacto
ls -la public/uploads
# Debe mostrar: public/uploads -> /var/www/ferdy-uploads

# 3. Instala dependencias (sólo si package.json cambió)
npm ci

# 4. Build de producción
npm run build

# 5. Reinicia el proceso
pm2 restart ferdy-web

# 6. Comprueba que arrancó bien
pm2 logs ferdy-web --lines 30
```

Si el deploy es a `test`:

```bash
git checkout develop
git pull --ff-only origin develop
npm ci && npm run build
pm2 restart ferdy-test
```

---

## 7. Symlink de uploads — sección crítica

Resumen de la arquitectura (ver `~/claude-memory/Decisions/ferdy-coach/2026-04-22-uploads-architecture.md` para el porqué completo):

- Los uploads viven en `/var/www/ferdy-uploads/`, fuera del repo.
- `public/uploads` es un symlink a esa ruta.
- `public/uploads` está en `.gitignore`.
- Nginx sirve `/uploads/*` directamente con `alias /var/www/ferdy-uploads/`, sin pasar por Next.js.

### Reglas

1. **Nunca usar `rsync --delete`** sobre `/root/projects/ferdi-coach/` desde local. Borraría el symlink y, peor, podría dejar `public/uploads` vacío sin que nginx avise.
2. **Nunca commitear ficheros dentro de `public/uploads/`**. `.gitignore` lo bloquea, pero si alguien lo fuerza con `git add -f`, romperá el modelo.
3. **Tras un clone fresco** del repo en otro host, `public/uploads` no existe. Crear el directorio destino y el symlink antes de arrancar:

```bash
mkdir -p /var/www/ferdy-uploads
chown -R root:root /var/www/ferdy-uploads
chmod 755 /var/www/ferdy-uploads
ln -s /var/www/ferdy-uploads /root/projects/ferdi-coach/public/uploads
```

4. **Si nginx devuelve 404 en `/uploads/...`**: verifica que el bloque `location /uploads/` sigue en `/etc/nginx/sites-enabled/ferdycoachdesamor` y que `/var/www/` es atravesable por `www-data` (debe ser `755`, no `700`).

---

## 8. Health checks post-deploy

Inmediatamente después de cada deploy:

```bash
# 1. La home responde 200
curl -sI https://ferdycoachdesamor.com | head -1
# Esperado: HTTP/2 200

# 2. El dashboard admin responde (debería redirigir a login)
curl -sI https://ferdycoachdesamor.com/dashboard | head -1
# Esperado: HTTP/2 200 o 307

# 3. Un upload existente sigue accesible
curl -sI https://ferdycoachdesamor.com/uploads/<un-fichero-conocido> | head -1
# Esperado: HTTP/2 200

# 4. PM2 muestra el proceso online
pm2 list | grep ferdy-web
# Esperado: status "online", restarts no descontrolado

# 5. Sentry no muestra errores nuevos en los últimos 5 min
# Comprobar dashboard de Sentry manualmente.

# 6. Si tocaste emails: registrar un pago de prueba y verificar que llegan los dos emails (cliente + coach).
```

Si algo falla → ir directamente a la sección 9 (rollback). No improvisar fixes en caliente.

---

## 9. Rollback

Si el deploy rompe algo y no es trivial de fix-forward:

```bash
cd /root/projects/ferdi-coach

# 1. Vuelve al commit anterior conocido como bueno
git log --oneline | head -5         # identifica el SHA previo
git checkout <SHA-anterior>

# 2. Rebuild y reinicia
npm ci          # sólo si dependencias cambiaron entre los dos commits
npm run build
pm2 restart ferdy-web

# 3. Verifica con la sección 8 de nuevo
```

Después, en local:

```bash
git revert <SHA-malo>          # commit de revert limpio
# Push a develop, PR a main, redespliega
```

> **Nota:** No hacer `git reset --hard` en producción si no es estrictamente necesario. `git checkout <SHA>` deja el HEAD en detached pero conserva la historia. Para volver a la rama: `git checkout main`.

---

## 10. Recreación del servidor desde cero (DR)

Pasos mínimos para reconstruir producción en una VPS limpia:

1. Instalar Node 20+, npm, PM2 global, nginx, certbot.
2. Clonar el repo:
   ```bash
   git clone git@github.com:albercv/ferdi-coach.git /root/projects/ferdi-coach
   cd /root/projects/ferdi-coach
   git checkout main
   ```
3. Crear el directorio de uploads y el symlink (ver 7.3).
4. Restaurar `content/` desde el backup más reciente:
   ```bash
   tar xzf /root/backups/content-<fecha>.tar.gz -C /
   ```
5. Restaurar uploads desde el backup más reciente:
   ```bash
   tar xzf /root/backups/uploads-<fecha>.tar.gz -C /
   ```
6. Crear `.env` a partir de `.env.example` y rellenar todos los secretos.
7. `npm ci && npm run build`.
8. Configurar nginx (copiar `/etc/nginx/sites-enabled/ferdycoachdesamor` desde backup) y certificados (`certbot --nginx`).
9. Arrancar PM2:
   ```bash
   pm2 start npm --name ferdy-web -- start
   pm2 save
   pm2 startup     # para que arranque al reboot
   ```
10. Configurar el cron de transiciones de pago:
    ```cron
    0 * * * * curl -s "https://ferdycoachdesamor.com/api/cron/payments-transitions?secret=$CRON_SECRET" >/dev/null
    ```
11. Health checks de la sección 8.

---

## 11. Cron de transiciones de pago

El sistema necesita un cron del sistema (no de Vercel/serverless) que llame cada hora al endpoint de transiciones:

```cron
0 * * * * curl -s "https://ferdycoachdesamor.com/api/cron/payments-transitions?secret=YOUR_CRON_SECRET" >/dev/null 2>&1
```

Verificar que está activo tras cualquier reinstalación de la VPS:

```bash
crontab -l | grep payments-transitions
```

Si `CRON_SECRET` cambia en `.env`, actualizar también la entrada del cron.

---

## 12. Quién toca qué

| Acción | Quién |
|---|---|
| Merge a `develop` | Cualquiera vía PR |
| Merge a `main` (deploy) | Sólo el responsable del deploy |
| Cambios en `.env` del servidor | Sólo el responsable del deploy |
| Edición de `content/` en producción | El coach desde el dashboard (no SSH) |
| Backup de `content/` y `uploads/` | Automatizado vía cron (pendiente) o manual antes de deploy |

---

_Última revisión: 2026-04-26. Actualizar este documento ante cualquier cambio en el flujo de deploy, en la estructura del servidor, o en las dependencias críticas (nginx, PM2, Resend, Sentry)._
