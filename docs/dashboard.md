---
title: "Guía del Dashboard"
description: "Cómo usar cada tab del panel admin para gestionar la web."
category: "user"
tags: ["dashboard", "admin", "guía", "uso"]
audience: ["user", "dev"]
order: 20
---

# Guía del Dashboard

El dashboard es la herramienta de Ferdy y Alberto para mantener la web sin tocar código. Está dividido en cuatro tabs:

| Tab | Para qué sirve |
|---|---|
| **Secciones** | Editar el contenido visible de la landing (Hero, FAQs, productos…) |
| **Media** | Subir y gestionar imágenes/vídeos que después se eligen en otras secciones |
| **Pagos** | Ver solicitudes de pago, marcarlas como confirmadas y disparar la entrega |
| **Documentación** | Esta misma documentación (búsqueda incluida) |

## Acceso

1. Entrar en `/login` con cuenta de Google autorizada (Ferdy o Alberto).
2. El middleware redirige al dashboard automáticamente tras autenticar.
3. Si ves "FORBIDDEN" al subir algo, **cierra sesión y vuelve a entrar** — el rol se asigna en el momento del login.

## Tab Secciones

Cada subtab edita un fichero `.md` distinto en `/content`:

| Subtab | Fichero |
|---|---|
| Hero | `content/hero.md` |
| Frase destacada | `content/breaker.md` |
| Para quién | `content/for-who.md` |
| Sesiones | `content/products/sessions/*.md` |
| Guías | `content/products/guides/*.md` |
| Testimonios | `content/testimonials/*.md` |
| Sobre mí | `content/about.md` |
| FAQs | `content/faq.md` |
| CTA | `content/cta.md` |

**Cambios:** se guardan al pulsar "Guardar". Aparece toast de confirmación. Si falla, revisa la consola del navegador.

## Tab Media

- **Subir** — arrastra archivo o pulsa botón. Validación por tipo (image/png, jpeg, webp, pdf, mp4).
- **Reemplazar** — sube con el mismo nombre, se sobreescribe.
- **Eliminar** — solo si el archivo no está referenciado en ningún `.md`.
- Las URLs generadas son relativas a `/uploads/` y se guardan en frontmatter.

## Tab Pagos

Estados posibles de una solicitud:

| Estado | Significado | Siguiente paso |
|---|---|---|
| `pending` | El cliente ha pulsado "Pagar" pero no ha confirmado transferencia | Esperar |
| `awaiting_proof` | El cliente reporta haber pagado | Verificar en banco |
| `confirmed` | Coach confirma que el dinero llegó | Email de entrega automático |
| `cancelled` | Cancelada manualmente o expirada | — |

Para confirmar un pago: localizar la fila → cambiar estado → "Confirmar". Esto dispara el email transaccional de entrega.

## Tab Documentación

- Lateral izquierdo: lista de docs ordenados por categoría.
- Buscador superior: full-text en título, descripción, tags y cuerpo.
- Filtro por categoría y audiencia.
- El contenido se renderiza con Markdown estándar (incluye GFM: tablas, checkboxes, código).
