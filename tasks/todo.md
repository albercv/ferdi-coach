# FERDY COACH — TODO
_Generado: 2026-04-07 | Basado en: tasks/pending_tasks.md_

---

## Estado general

| Tarea | Título | Estado |
|-------|--------|--------|
| T0 | Fix: edición de sección faltante | ✅ Hecho |
| T1 | CSS y estilos — STYLES.md | ✅ Hecho |
| T2 | Proceso de deploy — DEPLOY.md | 🔴 Pendiente |
| T3 | Emails transaccionales con Resend | ✅ Hecho |
| T4 | Reestructurar orden de secciones de la web | ✅ Hecho |
| T5 | Monitorización de errores | ✅ Hecho |
| T6 | Bug: permisos de Ferdy en el dashboard | 🔴 Pendiente |
| T7 | Migración de .md a base de datos | 🔴 Pendiente |
| T8 | Auditoría de seguridad — correcciones | 🔴 Pendiente |
| T9 | Auditoría SEO — correcciones | 🔴 Pendiente |
| T10 | Tab Documentación dinámica en dashboard | ✅ Hecho |

---

## ORDEN DE EJECUCIÓN

```
T0 ✅ → T1 ──┐
              ├──→ [PAUSA: recoger credenciales Resend] ──→ T3
         T2 ──┘
```

- **T1 y T2** no tienen dependencias entre sí: pueden hacerse en paralelo o en cualquier orden.
- **T3** requiere que T2 esté hecho antes de subir a producción, y necesita datos externos (ver T3).

---

## TAREA 0 — Fix: edición de sección faltante ✅ HECHO

- [x] Cambios subidos al repositorio en la rama `feature/editRelationship`
- [x] Mergeado a `develop`

---

## TAREA 1 — CSS y estilos: crear STYLES.md

**Objetivo:** Documentar el contrato de diseño del proyecto para que cualquier cambio de UI mantenga coherencia.

**Archivos a auditar:**
- `styles/` — estilos globales
- `app/globals.css` — tokens CSS raíz (variables CSS, colores, etc.)
- `tailwind.config.*` — configuración de Tailwind (si existe extend personalizado)
- `components.json` — configuración shadcn/ui (base color, CSS vars, prefixes)
- `components/ui/` — componentes base shadcn para extraer convenciones de uso

**Checklist:**
- [ ] Auditar `app/globals.css`: extraer variables CSS (colores, radios, fuentes)
- [ ] Auditar `tailwind.config.*`: extraer tokens custom (si los hay)
- [ ] Auditar `components.json`: anotar base color, style, prefijo de clases
- [ ] Revisar `components/ui/` para identificar qué componentes base están en uso
- [ ] Revisar 2-3 secciones principales (`components/sections/`) para identificar patrones de clase frecuentes (spacing, tipografía, layout)
- [ ] Crear `STYLES.md` en la raíz del repo con:
  - Paleta de colores (tokens CSS vars + equivalentes Tailwind)
  - Escala tipográfica (font families, sizes, weights usados)
  - Espaciados frecuentes y breakpoints
  - Componentes base disponibles (shadcn/ui) y cómo usarlos
  - Convenciones de clase (prefijos, dark mode, responsive)
  - Patrones de layout recurrentes
- [ ] Verificar: pedir a Claude que genere un componente nuevo y confirmar que usa los tokens documentados sin romper estilos

**Criterio de done:** `STYLES.md` existe, es legible, y sirve como referencia para generar UI coherente.

---

## TAREA 2 — Deploy: crear DEPLOY.md

**Objetivo:** SOP documentado para desplegar sin riesgo de perder los archivos `.md` que actúan como base de datos.

**Contexto del sistema de ficheros `.md` como BD:**
- `content/payments/config.md` — IBAN configurado (dato crítico)
- `content/payments/submissions/*.md` — historial de pagos (dato crítico, no debe perderse nunca)
- `content/about.md`, `content/hero.md`, `content/faq/faq.md`, etc. — contenido editable de la web
- `content/products/` — catálogo de productos

**Checklist:**
- [ ] Identificar todos los `.md` de la carpeta `content/` (listar cuáles son datos vs cuáles son contenido versionable)
- [ ] Revisar `.gitignore` actual: comprobar si `content/payments/submissions/` está excluido o no
- [ ] Decidir estrategia por tipo de archivo:
  - Contenido versionable (hero, faq, about, products) → versionar en git ✅
  - Datos operativos (submissions/*.md) → excluir de git + backup manual antes de deploy
  - Configuración (config.md con IBAN) → versionar con cuidado o excluir según criterio del negocio
- [ ] Crear `DEPLOY.md` en la raíz del repo con:
  - Descripción del sistema `.md` como BD y por qué es crítico
  - Lista de archivos por categoría (versionados vs excluidos)
  - Flujo de deploy: local → git push → Vercel/producción (u otro proveedor)
  - Checklist pre-deploy (backup de submissions, verificar variables de entorno, etc.)
  - Procedimiento de backup de `content/payments/submissions/`
  - Qué hacer si se pierde un archivo de datos
- [ ] Actualizar `.gitignore` si es necesario según la estrategia definida
- [ ] Verificar: otra persona puede seguir el doc desde cero sin preguntas

**Criterio de done:** `DEPLOY.md` existe y el checklist pre-deploy cubre todos los riesgos identificados.

---

## TAREA 3 — Emails transaccionales con Resend ⏸ BLOQUEADO

> **Requiere antes de empezar:**
> 1. Cuenta Resend creada y API key generada → `RESEND_API_KEY=re_...`
> 2. Dominio de envío verificado en Resend (SPF + DKIM configurados) → ej. `noreply@ferdycoachdesamor.com`
> 3. Email del coach para notificaciones internas → ej. `ferdycoachdesamor@gmail.com`
> 4. T2 completada (para saber qué variables añadir al proceso de deploy)

**Contexto importante:** El sistema de pago es por transferencia bancaria (IBAN), NO Stripe ni PayPal. Los triggers de email son:
- **Al registrar pago** (`POST /api/payments/paid`): email de confirmación al cliente + notificación al coach
- **Al confirmar pago** (`PATCH /api/payments/submissions` con status → `confirmed`): email de entrega al cliente

**Archivos a crear:**
- [ ] `lib/email/resendClient.ts` — wrapper del SDK de Resend con la API key
- [ ] `lib/email/templates/ConfirmacionCompra.tsx` — email al cliente tras registrar el pago
- [ ] `lib/email/templates/NotificacionCoach.tsx` — email interno al coach de nueva solicitud
- [ ] `lib/email/templates/EntregaProducto.tsx` — email al cliente cuando el coach confirma el pago
- [ ] `lib/email/emailService.ts` — funciones: `sendSubmissionEmails()` y `sendDeliveryEmail()`

**Archivos a modificar:**
- [ ] `app/api/payments/paid/route.ts` — llamar a `sendSubmissionEmails()` tras crear la submission
- [ ] `app/api/payments/submissions/route.ts` — llamar a `sendDeliveryEmail()` cuando `status === "confirmed"`
- [ ] `.env.example` — añadir `RESEND_API_KEY` y `COACH_NOTIFICATION_EMAIL`

**Checklist de implementación:**
- [ ] Instalar SDK: `npm install resend`
- [ ] Añadir `RESEND_API_KEY` y `COACH_NOTIFICATION_EMAIL` al `.env` local y a producción
- [ ] Crear `resendClient.ts` con el cliente inicializado
- [ ] Crear plantilla `ConfirmacionCompra.tsx` (React Email):
  - Asunto: "Hemos recibido tu solicitud de pago — [producto]"
  - Cuerpo: datos del producto, importe, concepto de transferencia, IBAN, próximos pasos
- [ ] Crear plantilla `NotificacionCoach.tsx`:
  - Asunto: "Nueva solicitud de pago — [nombre cliente]"
  - Cuerpo: nombre, email, teléfono, producto, importe, fecha
- [ ] Crear plantilla `EntregaProducto.tsx` (diferente para guía vs sesión):
  - Guía: asunto "Tu guía está lista", cuerpo con enlace/adjunto de la guía
  - Sesión: asunto "¡Tu pago está confirmado!", cuerpo con instrucciones para reservar sesión
- [ ] Implementar `emailService.ts` con las dos funciones exportadas
- [ ] Integrar en `paid/route.ts` (envío no bloqueante — `void sendSubmissionEmails(...)`)
- [ ] Integrar en `submissions/route.ts` (solo en el PATCH cuando `status === "confirmed"`)
- [ ] Testear con email real en modo sandbox de Resend
- [ ] Verificar logs sin errores tras una compra de prueba completa

**Criterio de done:** Cliente recibe confirmación al registrar pago. Coach recibe notificación. Cliente recibe entrega cuando el coach confirma. Logs limpios.

---

---

## TAREA 4 — Reestructurar orden de secciones de la web

**Objetivo:** Reordenar las secciones de la página principal según el nuevo orden definido, respetando la alternancia de fondos blanco/gris.

**Orden final:**

| # | Sección | Fondo |
|---|---------|-------|
| 1 | Hero | Imagen (no aplica alternancia) |
| 2 | Frase — *"Detente un segundo… Sí, estás roto…pero algo en ti empieza a despertar"* | Gris |
| 3 | Te acompaño a reconstruirte con sentido | Blanco |
| 4 | Sesiones y programas | Gris |
| 5 | Descarga de guías | Blanco |
| 6 | Testimonios | Gris |
| 7 | Quién soy | Blanco |
| 8 | Preguntas frecuentes | Gris |

**Checklist:**
- [ ] Identificar el archivo de la página principal (`app/page.tsx` o similar) que monta las secciones
- [ ] Identificar qué componente corresponde a cada sección del orden deseado
- [ ] La frase "Detente un segundo" ya existe: `components/ui/breaker-banner.tsx` + `content/breaker.md`
- [ ] Reordenar los componentes en la página según el orden definido
- [ ] Aplicar/verificar los fondos alternos: `bg-muted/30` o `bg-primary/5` para gris, `bg-background` para blanco
- [ ] Verificar en local que el resultado visual es correcto (orden + alternancia de fondos)

**Criterio de done:** La página muestra las secciones en el orden definido con la alternancia blanco/gris correcta.

---

---

## TAREA 5 — Monitorización de errores

> **Estado: 📋 Por planificar** — No implementar sin sesión de planificación previa.

**Objetivo:** Tener visibilidad de errores en producción sin tener que revisar logs manualmente. Saber cuándo algo falla, dónde y con qué frecuencia.

**Áreas a cubrir:**
- Errores de servidor (API routes, excepciones no capturadas)
- Errores de cliente (JS runtime errors, errores de UI)
- Alertas de pagos fallidos o flujo de compra roto
- Métricas básicas de rendimiento (Core Web Vitals — ya hay `@vercel/analytics`)

**Opciones a evaluar en la sesión de planificación:**

| Opción | Pros | Contras |
|---|---|---|
| **Sentry** (free tier) | Estándar industria, SDK Next.js oficial, alertas email, trazas completas | Requiere cuenta externa, datos salen del servidor |
| **Logs estructurados a fichero** (solución propia) | Sin dependencias externas, datos en el servidor, simple | Sin alertas automáticas, hay que revisar manualmente |
| **Better Stack / Logtail** | Dashboard bonito, free tier generoso, fácil integración | Dato externo, curva de configuración |
| **PM2 + pm2-logrotate** | Ya está en el servidor, cero coste | Solo logs de proceso, sin contexto de errores de app |

**Preguntas a responder antes de implementar:**
- ¿Queremos alertas automáticas por email/Slack cuando algo falla?
- ¿Datos sensibles pueden salir del servidor (Sentry, Logtail)?
- ¿Presupuesto para herramientas externas?
- ¿Qué nivel de detalle necesitamos (solo errores o también métricas)?

**Criterio de done:** Un error en producción genera una alerta o es visible en un dashboard sin necesidad de hacer SSH al servidor.

---

## TAREA 6 — Bug: permisos de Ferdy en el dashboard

**Objetivo:** Ferdy (`ferdycoachdesamor@gmail.com`) puede entrar al dashboard pero recibe FORBIDDEN al intentar subir documentos o imágenes. Alberto (`alberto.carrasco@evolve2digital.com`) sí puede.

**Alcance del bug:** afecta a TODAS las operaciones protegidas del dashboard (subir docs, subir imágenes, editar contenido de secciones, borrar archivos). El acceso visual al dashboard funciona porque el middleware usa una comprobación distinta a la de las API routes.

**Causas identificadas (por orden de probabilidad):**

**Causa 1 — JWT cacheado con `role: "user"` (más probable)**
El callback `jwt` solo asigna el rol en el momento del login. Si Ferdy inició sesión antes de que se añadiera `AUTH_ADMIN_EMAIL_2` al `.env`, su token quedó con `role: "user"`. La función `isAdmin()` comprueba el rol primero: si existe y no es `"admin"`, devuelve `false` sin llegar a comprobar el email. El token persiste hasta que expire o Ferdy cierre sesión.

→ **Solución:** Ferdy cierra sesión y vuelve a entrar con Google.

**Causa 2 — Servidor no reiniciado tras añadir `AUTH_ADMIN_EMAIL_2`**
Next.js en producción carga las variables de entorno al arrancar el proceso PM2. Si el `.env` se modificó después del último restart, el proceso no tiene la variable en memoria y `getAdminEmails()` no devuelve el email de Ferdy.

→ **Solución:** `pm2 restart ferdy-web` y que Ferdy lo intente de nuevo.

**Causa 3 — Email de Google no coincide**
El `.env` tiene `AUTH_ADMIN_EMAIL_2=ferdycoachdesamor@gmail.com`. Si Ferdy entra con una cuenta de Google distinta, el email del token no coincide con el allowlist.

→ **Solución:** Revisar los logs del servidor para ver qué email llega en el token de Ferdy.

**Vulnerabilidad de fondo (a corregir aunque se resuelva con la solución rápida):**
En `lib/auth.ts`, el callback `jwt` no re-evalúa el rol si ya existe en el token. Si un email se añade al allowlist de admins después de que el usuario haya iniciado sesión, no surtirá efecto hasta que el JWT expire. Corrección: en el callback `jwt`, forzar re-evaluación del rol cuando el email está en el allowlist de admins, ignorando el rol previo del token.

**Checklist:**
- [ ] Que Ferdy cierre sesión y vuelva a entrar (Causa 1)
- [ ] Si sigue fallando: `pm2 restart ferdy-web` (Causa 2)
- [ ] Si sigue fallando: revisar logs para ver el email del token (Causa 3)
- [ ] Corregir la vulnerabilidad de fondo en `lib/auth.ts` (callback `jwt`)
- [ ] Verificar que Ferdy puede subir un documento desde el dashboard

**Criterio de done:** Ferdy puede subir docs e imágenes desde el dashboard sin errores FORBIDDEN.

---

---

## TAREA 8 — Auditoría de Seguridad — Correcciones

> Resultados de auditoría automática del 2026-04-21. Ordenadas por prioridad.

### CRÍTICO

- [ ] **SEC-1** Verificar si `.env` está en git history (`git log --all --full-history -- .env`). Si aparece: rotar TODOS los secretos en producción y limpiar history con BFG/filter-branch.
- [ ] **SEC-2** Comparación de secretos con tiempo constante (`crypto.timingSafeEqual`) en:
  - `app/api/cron/payments-transitions/route.ts` línea 12
  - `app/api/monitoring/webhook/route.ts` línea 33
- [ ] **SEC-3** Contraseñas en variables de entorno comparadas en texto plano. Si el Credentials Provider se activa, usar bcrypt (`lib/auth.ts` líneas 145-147).

### ALTO

- [ ] **SEC-4** Añadir headers de seguridad en `next.config.mjs`: `Content-Security-Policy`, `Strict-Transport-Security`, `Referrer-Policy`.
- [ ] **SEC-5** Implementar rate limiting en endpoints sensibles: `POST /api/payments/paid`, endpoint cron, endpoint webhook de monitoring.
- [ ] **SEC-6** Validación de ID en schema Zod: cambiar `z.string().min(1)` a `z.string().uuid()` en `app/api/payments/submissions/route.ts` para prevenir path traversal.

### MEDIO

- [ ] **SEC-7** Añadir validación estricta con Zod en `app/api/content/testimonials/route.ts` (actualmente usa coerción suelta).
- [ ] **SEC-8** Añadir `Cache-Control` headers a los endpoints de contenido público (hero, faq, about, etc.).

**Criterio de done:** SEC-1 al SEC-6 completados y verificados en producción.

---

## TAREA 9 — Auditoría SEO — Correcciones
_Re-planificado 2026-06-06 tras `/seo audit` completo. Organizado por ramas._

### Estrategia de ramas
Ejecutar en orden. Cada rama = un PR independiente.

1. `fix/canonical-domain` — bloquea todo
2. `fix/schema-critical` — datos fabricados / placeholders
3. `fix/sitemap-robots` — depende de 1
4. `feat/schema-improvements` — refactor schema completo
5. `feat/og-image-meta` — OG image + metadata + GSC verification
6. `feat/sobre-mi-eeat` — input necesario de Ferdy
7. `feat/blog-foundation` + dos artículos largos
8. `feat/cta-awareness` — guía gratuita above-the-fold
9. `chore/img-to-next-image` — MEDIO, perf
10. `chore/performance-baseline` — verificación final

---

### Rama 1 — `fix/canonical-domain` ✅ COMPLETADA (2026-06-06)
Rama local: `fix/canonical-domain`. **No pusheada todavía.** Sin PR.
Commits:
- `bc7b109` docs(seo): re-plan T9 with branch-grouped tasks after audit
- `1f1c30d` fix(seo): unify canonical domain to ferdycoachdesamor.com

- [x] `NEXT_PUBLIC_SITE_URL=https://ferdycoachdesamor.com` en `.env.example` (`.env` real → pendiente Ferdy/Alberto)
- [x] `lib/site-config.ts` con `SITE_URL`, `CONTACT_EMAIL`, `CONTACT_PHONE`, `SOCIAL_INSTAGRAM`, `SOCIAL_TIKTOK`
- [x] `lib/seo.ts`: todas las apariciones via `SITE_URL`
- [x] typo `ferdycoach_desamor_desamor` → `ferdycoach_desamor`
- [x] `hola@ferdy-coach.com` → `ferdycoachdesamor@gmail.com` (`CONTACT_EMAIL`)
- [x] `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `components/seo/structured-data.tsx`: usan `SITE_URL`
- [x] `public/llms.txt`: `ferdycoach.com` → `ferdycoachdesamor.com`
- [x] `app/terminos/page.tsx`: dominio corregido (precios viejos 45€/180€ siguen → Rama 2)
- [x] `README.md`: env doc corregida
- [x] `rg "ferdy-coach\.com|ferdycoach\.com"` → 0 hits
- [x] `npm run build` verde
- [x] `npm run typecheck` verde

**Pendiente al retomar:**
- Decidir: push + PR a `develop`, o seguir con Rama 2 sobre la misma rama y luego push consolidado
- Añadir `NEXT_PUBLIC_SITE_URL` al `.env` de producción (servidor PM2) antes de deploy
- Tras deploy: `pm2 restart ferdy-web`

### Rama 2 — `fix/schema-critical` ✅ COMPLETADA (2026-06-07) — commit `f93fe17`
Inputs confirmados (2026-06-06): precios reales = **50€ sesión**, **200€ programa**, **17.99€ guía**. Email = `ferdycoachdesamor@gmail.com`. Tel = `+34 651 611 463`.

- [x] `lib/seo.ts`: eliminado bloque `aggregateRating` fabricado (50 reviews, 5.0)
- [x] `lib/seo.ts`: `"+34-XXX-XXX-XXX"` → `CONTACT_PHONE_E164` (2 sitios)
- [x] `lib/seo.ts` `hasOfferCatalog`: precios 97/297 → 50/200
- [x] `components/seo/structured-data.tsx`: precios 97 → 50, 297 → 200
- [x] `app/terminos/page.tsx` tabla: 45€ → 50€, 180€ → 200€, Gratuita → 17,99€
- [x] `app/cancelacion/page.tsx`: 45€ → 50€, 180€ → 200€ (extra, mismo scope)
- [x] `public/llms.txt`: precios + guía ya no gratuita
- [x] `data/content.ts`: borrados 3 testimonios lorem "Test Usuario" (datos muertos, no renderizados) + precios display €97/€297 → €50/€200
- [x] Commit `f93fe17`

**Pendiente legal (no en mi alcance — decisión Ferdy):** `app/cancelacion/page.tsx` sección 3 "Guía digital gratuita / producto gratuito" — la guía ahora cuesta 17,99€; la política de reembolso de producto digital de pago necesita copy legal.

### Rama 3 — `fix/sitemap-robots` 🔴 CRÍTICO
Depende de Rama 1.

- [ ] `app/sitemap.ts`: eliminar las 6 entradas `#fragment` (`#sesiones`, `#programa-4`, etc.)
- [x] Sustituir por URLs reales indexables: `/`, `/contacto`, `/privacidad`, `/terminos`, `/cancelacion`
- [x] Eliminar `changeFrequency` y `priority`
- [x] `lastModified` estático (constante `LAST_REVIEWED`), no `new Date()`
- [x] `app/robots.ts`: rules explícitas para `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`; disallow `/dashboard` y `/login`
- [x] `app/login` + `app/dashboard`: `noindex` vía `layout.tsx` server (las pages son `"use client"`, no pueden exportar metadata)
- [x] Commit `22f8ed3`

### Rama 4 — `feat/schema-improvements` ✅ COMPLETADA (2026-06-07) — commit `8e5a644`
Reescrito `lib/seo.ts` casi entero.

- [x] `WebSite` con `@id="#website"`. **`SearchAction` OMITIDO**: el sitio no tiene buscador → sería dato fabricado
- [x] `@id` en Organization, Person, WebSite, LocalBusiness, Services
- [x] Cross-link por @id: Person `worksFor`/`mainEntityOfPage` → Org; Service `provider` → Person; Offer `seller` → Org
- [x] `generateProductStructuredData` → `generateServiceStructuredData` (Product → Service)
- [x] `validFrom` ISO estático (`OFFER_VALID_FROM`)
- [x] Quitados `serviceType` y `priceRange` de `Organization`
- [x] BreadcrumbList: retorna `null` si ≤1 item
- [x] Person `sameAs`: Instagram + TikTok
- [x] Person `alumniOf`: `EducationalOrganization`
- [x] LocalBusiness `aggregateRating` + `review[]` desde los 4 testimonios reales del md DB (Francisco, Ángel, Angie, Flavio)
- [ ] **PENDIENTE: validar con Rich Results Test** (requiere deploy o URL pública)

### Rama 5 — `feat/og-image-meta` 🟠 HIGH ⏸ BLOQUEADA (assets + GSC + decisión)
Inputs requeridos: imagen OG diseñada (o brief para diseñador).

**Bloqueos detectados (2026-06-07):**
- `public/logo.png` y `public/og-image.jpg` NO existen. El schema Organization ya referencia `${SITE_URL}/logo.png` → **apunta a 404 ahora mismo**. Necesita assets.
- GSC verification: necesita propiedad creada + code real de Alberto/Ferdy.
- `export const dynamic = "force-dynamic"` en `app/page.tsx`: quitarlo congela el contenido editado por dashboard (md DB en vivo) hasta rebuild. **Decisión**: ¿migrar a ISR con `revalidate`? No es cambio seguro silencioso.
- Las 4 páginas legales (`contacto`, `privacidad`, `terminos`, `cancelacion`) YA tienen `export const metadata` — revisar si las descriptions son específicas.

### Rama 5 ✅ COMPLETADA (2026-06-07)
- [x] `public/og-image.jpg` (1200×630) — subida por Alberto, sirve 200 image/jpeg ~99KB, validada en prod (commit `febb50d`)
- [x] `metadataBase` añadido (commit `3d29530`): og:image/twitter:image resuelven a dominio prod, no localhost
- [x] Logo schema → `/logo2.webp` (commit `e5cb9fb`) — sustituye el `logo.png` inexistente
- [x] Verification: GSC verificado por DNS → placeholder `google-site-verification` ELIMINADO (commit `3226a1c`)
- [x] `force-dynamic` en `page.tsx`: SE QUEDA — Ferdy edita textos a menudo, necesita render fresco
- [x] Descriptions legales: ya específicas en las 4 páginas
- [x] privacidad + terminos: `noindex` → `index` (commit `4841698`) para casar con sitemap y evitar error GSC
- [ ] (opcional, próximo rebuild) `og:image:type: "image/jpeg"` en layout

**Pendiente de deploy (commits posteriores al build de las 14:02):** `3226a1c` (verification) y `4841698` (legal index) NO están aún en prod → rebuild+restart antes de enviar el sitemap a GSC.

### Rama 6 — `feat/sobre-mi-eeat` 🟠 HIGH
Inputs requeridos: bio completa de Ferdy, foto profesional, nombre exacto de la escuela de coaching, año de certificación, redes sociales adicionales.

- [ ] Página `/sobre-mi` (o sección expandida si ya existe) con:
  - Foto profesional
  - Bio con credencial: escuela + año + organismo profesional
  - Diferenciación "coaching ≠ terapia" (ya en llms.txt)
  - Método (4 hitos mencionados en hasCredential)
- [ ] Person schema: `alumniOf` con `@type: EducationalOrganization` + `name` + `url`
- [ ] Person schema: `hasCredential` estructurado como `EducationalOccupationalCredential`
- [ ] Person schema: `sameAs` Instagram + TikTok
- [ ] Commit: `feat(content): expand sobre-mi page with full E-E-A-T signals`

### Rama 7a — `feat/blog-foundation` 🟡 MEDIUM
Sin inputs externos.

- [ ] Ruta `/blog` con listado MDX
- [ ] Layout artículo individual con `Article` schema (author → Person `@id`)
- [ ] Estructura `content/blog/*.md` (mantiene patrón doc-DB del proyecto)
- [ ] Sitemap.ts: añadir generación dinámica desde `content/blog/`
- [ ] Commit: `feat(blog): foundation routes and Article schema`

### Rama 7b — `feat/blog-articulo-superar-ruptura` 🟡 MEDIUM
Depende de 7a.

- [ ] `content/blog/como-superar-una-ruptura.md` ≥1800 palabras
- [ ] FAQ section con preguntas reales de PAA
- [ ] CTA interno a sesión gratuita 15min
- [ ] Imagen hero con alt descriptivo
- [ ] Commit: `feat(blog): add article "cómo superar una ruptura"`

### Rama 7c — `feat/blog-articulo-olvidar-alguien` 🟡 MEDIUM
Depende de 7a.

- [ ] `content/blog/como-olvidar-a-alguien.md` ≥1800 palabras
- [ ] Misma estructura que 7b
- [ ] Commit: `feat(blog): add article "cómo olvidar a alguien"`

### Rama 8 — `feat/cta-awareness` 🟡 MEDIUM
- [ ] CTA above-the-fold de fricción cero: descarga guía gratis (la que ya existe) con email gate o WhatsApp directo
- [ ] Mantener "Reservar sesión gratuita" como secundario
- [ ] Tracking separado por tipo de CTA
- [ ] Commit: `feat(ui): add zero-friction awareness CTA above the fold`

### Rama 9 — `chore/img-to-next-image` 🟡 MEDIUM (perf)
- [ ] `components/sections/hero-section.tsx` (~línea 30): `<img>` → `<Image>`
- [ ] `components/sections/about-section.tsx` (~69-70, ~100-104): idem
- [ ] Definir `width`, `height`, `alt`, `priority` (hero), `loading="lazy"` (resto)
- [ ] Añadir `VideoObject` JSON-LD para `<video>` en about-section
- [ ] Commit: `chore(perf): migrate img tags to next/image and add VideoObject schema`

### Rama 10 — `chore/performance-baseline` 🟢 LOW
Verificación, no implementación.
- [ ] PageSpeed Insights mobile + desktop tras deploy de todas las anteriores
- [ ] Registrar LCP / INP / CLS / FCP / TTFB
- [ ] Crear issues separados por hallazgo si CWV en rojo

---

**Criterio de done T9:** Ramas 1-5 + 7 mergeadas. Rich Results Test sin warnings. Sitemap submission en GSC sin "location mismatch". `rg "ferdy-coach\.com|ferdycoach\.com"` → 0 hits en todo el repo.

---

_Actualizar este archivo marcando `[x]` cada ítem al completarlo._

---

## TAREA 10 — Tab Documentación dinámica en el dashboard

**Objetivo:** Centralizar toda la documentación del proyecto (devs + usuarios) en un tab del dashboard, con buscador avanzado y carga dinámica desde ficheros `.md`.

**Decisiones clave:**
- Documentación en `docs/*.md` siguiendo el patrón existente de `content/` (frontmatter + body)
- Renderizado con `react-markdown` + `remark-gfm` (estándar, ~30kb, evita reinventar parser)
- Búsqueda con `cmdk` (ya instalado vía shadcn/ui `command.tsx`) — full-text + filtro por categoría
- API server-side bajo `assertAdmin` (consistente con el resto del dashboard)
- El tab "Documentación" se coloca arriba a la derecha en el `TabsList` mediante `ml-auto`

**Archivos a crear:**
- [x] `docs/README.md` — índice de la documentación
- [x] `docs/architecture.md` — visión técnica del proyecto
- [x] `docs/dashboard.md` — guía del dashboard (usuario admin)
- [x] `docs/payments-flow.md` — flujo de pagos (transferencia + estados)
- [x] `docs/emails.md` — sistema transaccional con Resend
- [x] `docs/api-reference.md` — endpoints internos
- [x] `docs/content-system.md` — `.md` como BD documental
- [x] `docs/deployment.md` — referencia a `DEPLOY.md`
- [x] `docs/styles.md` — referencia a `STYLES.md`
- [x] `docs/troubleshooting.md` — problemas frecuentes
- [x] `lib/docs.ts` — lectura dinámica de `docs/*.md` con frontmatter
- [x] `app/api/docs/route.ts` — `GET` lista de documentos (admin)
- [x] `app/api/docs/[slug]/route.ts` — `GET` documento concreto (admin)
- [x] `components/dashboard/DocsTab.tsx` — UI con buscador

**Archivos a modificar:**
- [x] `app/dashboard/page.tsx` — añadir TabsTrigger "Documentación" + TabsContent
- [x] `package.json` — `react-markdown` y `remark-gfm`

**Checklist:**
- [x] Crear `docs/` con los `.md` listados arriba
- [x] Implementar `lib/docs.ts` con `getDocsList()` y `getDoc(slug)`
- [x] Crear endpoints API protegidos con `assertAdmin`
- [x] Instalar `react-markdown` y `remark-gfm`
- [x] Implementar `DocsTab.tsx` con: lista lateral, panel de lectura, buscador full-text con resaltado, filtro por categoría y tags
- [x] Integrar tab "Documentación" en el dashboard, alineado arriba-derecha
- [x] Verificar `npm run typecheck` y `npm run build` en verde
- [x] Desplegar la rama (`feature/deploy-docs`) en local para probar visualmente
- [x] Commit con prefijo `feat:` (sin Co-Authored-By)

**Criterio de done:** Un admin entra al dashboard, ve el tab "Documentación" arriba a la derecha, puede buscar/filtrar por categoría/tag y leer cualquier doc renderizado.

---

## T11 — Footer y contacto: limpieza + WhatsApp + reserva 15min
_Anotada: 2026-05-18 · Lanzamiento previsto: 2026-05-19_

**Estado:** planificada, **sin tocar código hasta luz verde**. Plan pre-implementación abajo.

### T11.0 — Pendientes de input del usuario (BLOQUEANTES)

- [ ] **SWIFT/BIC del banco de Ferdy**: pedir valor literal antes de tocar código.
- [ ] **Destino del CTA "Sesión 15 min gratis"**: confirmar uno de:
  - URL externa Calendly/Cal.com (pedir link).
  - Ruta interna nueva (p. ej. `/reservar-15min`) con formulario propio.
  - Sección anchor existente con copy adaptado.
- [ ] **Confirmar copy del nuevo CTA** ("Reservar sesión de 15 min" / "Sesión gratuita 15 min" / otro).

### T11.1 — Quitar sellos de pago seguro

Ubicación detectada:
- `components/sections/how-it-works-section.tsx`
- `components/sections/how-it-works-section-v2.tsx`

Pasos:
- [ ] Localizar bloque "pago seguro" en cada archivo y eliminarlo (no comentar — borrar).
- [ ] Revisar si hay imports/iconos huérfanos tras borrar y limpiarlos.
- [ ] Verificar que ningún test/snapshot rompa: `npm run typecheck`, lint y build.
- [ ] Inspección visual de la sección en `/`.

### T11.2 — Incluir SWIFT en el footer

- [ ] Tras recibir valor (T11.0), añadir línea SWIFT en el footer, junto al resto de datos fiscales/legales.
- [ ] Si el footer no tiene aún sección de datos bancarios, crear bloque mínimo (label + valor) sin reestructurar el resto.
- [ ] No alterar diseño del bloque e2d-attribution ni del email/Instagram.

### T11.3 — Tel Ferdy → CTA WhatsApp

Ubicación detectada: `app/contacto/page.tsx:73-76` (`tel:+34651611463`).

- [ ] Sustituir `tel:` por `https://wa.me/34651611463` con `target="_blank"` y `rel="noopener noreferrer"`.
- [ ] Cambiar icono y label: que el botón comunique WhatsApp claramente (icono `MessageCircle` o similar de `lucide-react`).
- [ ] Mantener accesibilidad: `aria-label` descriptivo.
- [ ] Revisar si el mismo número aparece en otro sitio (`grep "651 ?611 ?463"`) y unificar.

### T11.4 — CTA "Sesión gratuita" → reserva 15 min

Ubicación detectada del copy:
- `data/content.ts:20` → `ctaPrimary: "Reservar sesión gratuita"`
- `lib/content-md.ts:400` → mismo string
- Uso en `components/sections/hero-section.tsx:72` → `href="#reservar"`

Pasos (a definir tras T11.0):
- [ ] Actualizar `href` del CTA primario del hero para apuntar al destino confirmado.
- [ ] Verificar que ningún otro botón/CTA del mismo flujo apunta al checkout por error (`#reservar`, `/sesiones`, links de "Reservar sesión" en header `components/layout/header.tsx:86,98,154` y `components/sections/about-section.tsx:82`).
- [ ] Si el destino es ruta nueva, crearla con el mínimo (formulario o embed) — alcance acotado, sin tocar checkout.
- [ ] Confirmar que el flujo "ir al checkout de sesión" sigue accesible desde otros puntos (p. ej. la propia sección Sesiones), para no romper conversión existente.

### Criterio de done (T11)

- Sellos "pago seguro" eliminados de las dos secciones detectadas.
- SWIFT visible en footer.
- Botón WhatsApp en `/contacto` funcional (abre `wa.me/34651611463`).
- CTA "Sesión gratuita" del hero (y resto del flujo equivalente) lleva a reserva de 15 min, **nunca al checkout de pago de sesión**.
- `npm run typecheck` + build verdes.
- Verificación visual en local antes de merge.
- Commit con prefijo correcto (`feat:` / `fix:` / `refactor:`), **sin Co-Authored-By**.

### Recordatorios cruzados

- **Pendiente de deploy:** rama `feat/footer-e2d-attribution` está en develop; al hacer el merge a main mañana, incluir también T11.
- Tras deploy: `pm2 restart ferdy-web` (puerto 3000).
