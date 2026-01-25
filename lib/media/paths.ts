export type MediaScope = "hero" | "about" | "testimonials" | "products" | "global"

export type ProductMediaSubscope = "guides" | "sessions"

export function sanitizeSlug(input: string): string {
  const slug = input.trim().toLowerCase()

  if (!slug) {
    throw new Error("Slug must not be empty")
  }

  if (slug.length > 80) {
    throw new Error("Slug must be at most 80 characters")
  }

  if (slug.includes("/") || slug.includes("\\")) {
    throw new Error("Slug must not contain '/' or '\\'")
  }

  if (slug.includes("..")) {
    throw new Error("Slug must not contain '..'")
  }

  if (/\s/.test(slug)) {
    throw new Error("Slug must not contain spaces")
  }

  if (!/^[a-z0-9-_]+$/.test(slug)) {
    throw new Error("Slug contains invalid characters")
  }

  return slug
}

export function resolveUploadDir(args: {
  scope: MediaScope
  entitySlug?: string
  productSubscope?: ProductMediaSubscope
}): string {
  const { scope, entitySlug, productSubscope } = args

  if (scope === "hero") return "uploads/hero"
  if (scope === "about") return "uploads/about"
  if (scope === "global") return "uploads/global"

  if (scope === "testimonials") {
    if (!entitySlug) {
      throw new Error("entitySlug is required when scope is 'testimonials'")
    }
    return `uploads/testimonials/${sanitizeSlug(entitySlug)}`
  }

  if (scope === "products") {
    if (!entitySlug) {
      throw new Error("entitySlug is required when scope is 'products'")
    }
    if (!productSubscope) {
      throw new Error("productSubscope is required when scope is 'products'")
    }
    return `uploads/products/${productSubscope}/${sanitizeSlug(entitySlug)}`
  }

  const _exhaustive: never = scope
  return _exhaustive
}
