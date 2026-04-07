# FERDY COACH — TAREAS PENDIENTES
_Última actualización: 2026-03-31_

---

## TAREA 0 — Fix: edición de sección faltante
**Estado:** ⏳ Pendiente de subir  
**Tipo:** Bugfix / Frontend  

- Hay cambios locales de edición de una sección que no se podía editar.
- **Acción:** Subir esos cambios al repositorio antes de arrancar las tareas siguientes para no generar conflictos.

---

## TAREA 1 — Proyecto Claude Code: CSS y estilos
**Estado:** 🔴 No iniciado  
**Tipo:** Configuración / Documentación  

**Objetivo:** Crear un proyecto en Claude Code que sirva como referencia estable del sistema de estilos actual de la web, dado que el desarrollo previo lo hizo otro codificador y no existe un contrato de estilos documentado.

**Acciones concretas:**
- [ ] Auditar el CSS/Tailwind/estilos actuales del proyecto Next.js
- [ ] Identificar tokens: colores, tipografías, espaciados, breakpoints, componentes base
- [ ] Crear un archivo `STYLES.md` (o `design-system.md`) en el repo con ese contrato documentado
- [ ] Configurar el proyecto en Claude Code apuntando a ese archivo como contexto base
- [ ] Verificar que cualquier cambio de UI pase por ese contexto para mantener coherencia

**Criterio de done:** Claude Code puede generar componentes nuevos coherentes con el diseño existente sin romper estilos actuales.

---

## TAREA 2 — Documentar proceso de subida (respetando .md como base de datos)
**Estado:** 🔴 No iniciado  
**Tipo:** Documentación / Proceso  

**Objetivo:** Tener un SOP (procedimiento estándar) documentado para el despliegue de cambios, que garantice que los archivos `.md` usados como base de datos no se sobreescriben ni se pierden en el proceso de subida.

**Acciones concretas:**
- [ ] Identificar qué archivos `.md` actúan como base de datos (contenido, configuración, datos de negocio)
- [ ] Documentar en `DEPLOY.md` el flujo completo: local → staging (si existe) → producción
- [ ] Establecer qué archivos deben estar en `.gitignore` vs cuáles deben versionarse
- [ ] Definir la estrategia para los `.md` de datos: ¿versionados en git? ¿excluidos y gestionados manualmente? ¿backup previo al deploy?
- [ ] Añadir un checklist pre-deploy que incluya verificación de integridad de esos archivos

**Criterio de done:** Cualquier persona puede hacer un deploy siguiendo `DEPLOY.md` sin riesgo de perder datos en los `.md`.

---

## TAREA 3 — Finalizar proceso de compra: emails con Resend
**Estado:** 🔴 No iniciado  
**Tipo:** Feature / Integración  

**Objetivo:** Completar el flujo de compra end-to-end añadiendo el envío de emails transaccionales via Resend tras el pago confirmado.

**Acciones concretas:**
- [ ] Configurar cuenta Resend y obtener API key
- [ ] Añadir `RESEND_API_KEY` a las variables de entorno (`.env.local` + producción)
- [ ] Instalar SDK: `npm install resend`
- [ ] Crear plantillas de email:
  - `email-confirmacion-compra.tsx` — confirmación inmediata al cliente
  - `email-bienvenida-onboarding.tsx` — instrucciones de acceso / próximos pasos
  - `email-notificacion-coach.tsx` — aviso interno al coach de nueva venta
- [ ] Implementar el envío en el webhook de Stripe (`/api/webhooks/stripe`):
  - Evento `checkout.session.completed` → dispara confirmación + bienvenida
  - Evento `payment_intent.payment_failed` → email de fallo (opcional pero recomendado)
- [ ] Implementar el envío en el webhook de PayPal si aplica
- [ ] Testear en modo sandbox/test con emails reales
- [ ] Verificar dominio en Resend para evitar spam (SPF, DKIM)

**Criterio de done:** Al completar una compra de prueba, el cliente recibe email de confirmación y el coach recibe notificación. Logs sin errores.

---

## ORDEN DE EJECUCIÓN RECOMENDADO

```
0 (subir fix) → 1 (estilos Claude Code) → 2 (documentar deploy) → 3 (emails Resend)
```

La tarea 0 es un prerequisito de cualquier otra para no generar conflictos en el repo.  
La tarea 2 debe estar completada antes de cualquier subida a producción de la tarea 3.
