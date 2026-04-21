# FERDY COACH — TODO
_Generado: 2026-04-07 | Basado en: tasks/pending_tasks.md_

---

## Estado general

| Tarea | Título | Estado |
|-------|--------|--------|
| T0 | Fix: edición de sección faltante | ✅ Hecho |
| T1 | CSS y estilos — STYLES.md | ✅ Hecho |
| T2 | Proceso de deploy — DEPLOY.md | 🔴 Pendiente |
| T3 | Emails transaccionales con Resend | ⏸ Bloqueado (requiere credenciales) |
| T4 | Reestructurar orden de secciones de la web | ✅ Hecho |
| T5 | Monitorización de errores | ✅ Hecho |
| T6 | Bug: permisos de Ferdy en el dashboard | 🔴 Pendiente |

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

_Actualizar este archivo marcando `[x]` cada ítem al completarlo._
