---
title: "Índice de Documentación"
description: "Punto de entrada a toda la documentación del proyecto Ferdy Coach."
category: "general"
tags: ["intro", "índice", "overview"]
audience: ["dev", "user"]
order: 1
---

# Documentación de Ferdy Coach

Bienvenido. Esta es la documentación viva del proyecto, accesible desde el dashboard y editable como cualquier otro contenido (ficheros `.md` en `/docs`).

## ¿Para quién es esta documentación?

- **Usuario admin (Ferdy / Alberto):** explica cómo usar el dashboard, qué significan los estados de pago, cómo funcionan los emails, etc.
- **Desarrolladores:** explica la arquitectura, las APIs internas, el sistema de contenido en `.md`, despliegue y troubleshooting.

## Cómo está organizada

| Documento | Audiencia | Resumen |
|---|---|---|
| [Arquitectura](#/architecture) | dev | Stack, estructura de carpetas, patrones |
| [Dashboard](#/dashboard) | user | Guía de uso de cada tab |
| [Flujo de pagos](#/payments-flow) | dev + user | Pago por transferencia, estados, emails |
| [Sistema de emails](#/emails) | dev + user | Triggers, plantillas, Resend |
| [API reference](#/api-reference) | dev | Endpoints internos y protección |
| [Sistema de contenido](#/content-system) | dev | `.md` como base de datos documental |
| [Despliegue](#/deployment) | dev | SOP completo de deploy |
| [Estilos](#/styles) | dev | Tokens, paleta y convenciones de UI |
| [Troubleshooting](#/troubleshooting) | dev + user | Errores frecuentes y resolución |

## Cómo añadir o editar un documento

1. Crea o edita un fichero en `/docs/<slug>.md`.
2. Añade el frontmatter siguiente:

```yaml
---
title: "Título visible"
description: "Resumen corto para el buscador"
category: "general | dev | user | ops"
tags: ["tag1", "tag2"]
audience: ["dev", "user"]
order: 10
---
```

3. Escribe el cuerpo en Markdown estándar. Soporta GFM (tablas, checkboxes, código, etc.).
4. Recarga el dashboard. La documentación se carga dinámicamente.

## Búsqueda

El buscador del tab Documentación indexa **título, descripción, tags y cuerpo** de cada documento. Soporta filtrado por categoría y por audiencia.
