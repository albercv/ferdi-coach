import { describe, expect, it } from "vitest"

import { assertAdmin, AuthzError, isAdmin } from "../lib/auth/assertAdmin"

describe("assertAdmin", () => {
  it("isAdmin returns false for missing session", () => {
    expect(isAdmin(null)).toBe(false)
  })

  it("isAdmin returns true for admin role", () => {
    expect(isAdmin({ user: { role: "admin", email: "a@example.com" } })).toBe(true)
  })

  it("isAdmin returns false for non-admin role", () => {
    expect(isAdmin({ user: { role: "user", email: "u@example.com" } })).toBe(false)
  })

  it("isAdmin falls back to env allowlist by email", () => {
    const prevAdminEmail = process.env.AUTH_ADMIN_EMAIL
    const prevAdmins = process.env.AUTH_ADMINS

    process.env.AUTH_ADMIN_EMAIL = "admin@example.com"
    process.env.AUTH_ADMINS = ""

    expect(isAdmin({ user: { email: "ADMIN@EXAMPLE.COM" } })).toBe(true)

    process.env.AUTH_ADMIN_EMAIL = prevAdminEmail
    process.env.AUTH_ADMINS = prevAdmins
  })

  it("assertAdmin throws 401 when unauthenticated", () => {
    try {
      assertAdmin(null)
      throw new Error("expected assertAdmin to throw")
    } catch (err) {
      expect(err).toBeInstanceOf(AuthzError)
      expect((err as AuthzError).status).toBe(401)
      expect((err as Error).message).toBe("UNAUTHENTICATED")
    }
  })

  it("assertAdmin throws 403 when authenticated but not admin", () => {
    try {
      assertAdmin({ user: { role: "user", email: "u@example.com" } })
      throw new Error("expected assertAdmin to throw")
    } catch (err) {
      expect(err).toBeInstanceOf(AuthzError)
      expect((err as AuthzError).status).toBe(403)
      expect((err as Error).message).toBe("FORBIDDEN")
    }
  })
})
