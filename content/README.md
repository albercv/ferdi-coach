# Contenidos en Markdown

Este proyecto sirve los textos desde archivos `.md` dentro de `content/`. De momento migramos las secciones de Testimonios y Preguntas Frecuentes (FAQ), y hemos preparado `about.md` para usarlo próximamente.

## Estructura

```
content/
├── about.md
├── testimonials/
│   ├── 001-m.md
│   ├── 002-mj.md
│   ├── 003-ana-g.md
│   └── 004-carlos-r.md
└── faq/
    ├── 001-sesion-vs-programa.md
    ├── 002-recaida-o-contacto.md
    ├── 003-listo-para-empezar.md
    ├── 004-psicologo.md
    ├── 005-genero.md
    └── 006-cancelacion.md
```

## Convenciones

- Orden: los archivos dentro de `testimonials/` y `faq/` se ordenan por prefijo numérico (`001-`, `002-`, ...). Para reordenar, cambia el número del nombre del archivo.
- Frontmatter: usamos YAML al inicio del `.md` para datos estructurados y el cuerpo del archivo para el texto principal.

### Testimonio

Archivo `content/testimonials/001-m.md`:

```md
---
name: "M."
age: 32
rating: 5
video: "ferdy-presentation" # opcional; alternativamente `image: "hero-img-v2"`
---
Después de 6 meses sin poder superar mi ruptura, en solo 4 semanas con Ferdy conseguí recuperar mi paz mental. Sus herramientas son realmente efectivas.
```

Campos soportados:
- `name` (string)
- `age` (number)
- `rating` (number)
- `video` (string, opcional) — nombre del recurso de video en `/public`
- `image` (string, opcional) — nombre del recurso de imagen en `/public`
- Cuerpo del `.md`: texto del testimonio

### FAQ

Archivo `content/faq/001-sesion-vs-programa.md`:

```md
---
question: "¿Qué diferencia hay entre una sesión suelta y el Programa 4?"
---
La sesión individual de coaching emocional te proporciona alivio y claridad inmediata para superar tu ruptura de pareja. El Programa 4 consolida hábitos duraderos de bienestar emocional y acompaña tu progreso con seguimiento personalizado durante 4 semanas completas.
```

Campos soportados:
- `question` (string)
- Cuerpo del `.md`: respuesta

### About

Archivo `content/about.md`:

```md
---
title: "Sobre mí (Ferdy)"
credentials:
  - "Formación en coaching transpersonal para superar rupturas de pareja"
  - "Enfoque integral: combinación de introspección, fuerza interior y acompañamiento emocional"
  - "Guiar sin juicios, con comprensión y cercanía en procesos de duelo amoroso"
  - "Hablo desde la experiencia: estuve en tu lugar y salí adelante tras mi ruptura"
---
Soy Ferdy, coach emocional especializado en procesos de ruptura de pareja...
```

## Cómo editar y añadir contenido

1. Duplica un archivo existente y ajusta el frontmatter y el texto.
2. Usa prefijos numéricos (`001-`, `002-`) para controlar el orden.
3. Guarda los cambios: el servidor en modo `pnpm dev` recargará y verás el contenido actualizado.

## Conexión con la UI

- Home (`app/page.tsx`) lee los `.md` mediante utilidades en `lib/content-md.ts` y pasa los datos a:
  - `TestimonialsSection` (client component) vía props `testimonials`
  - `FAQSection` (server component) vía props `faq`
- El resto de secciones (`hero`, `forWho`, `sessions`, `guides`, etc.) siguen temporalmente en `data/content.ts`. Podemos migrarlas a `.md` en una segunda fase.

## Próximos pasos (sugerencia)

- Migrar `hero` y `about` a `.md` (ya existe `about.md`).
- Migrar `guides` y `sessions` con frontmatter más rico (arrays y objetos) o usar `mdx` si necesitamos componentes dentro del contenido.