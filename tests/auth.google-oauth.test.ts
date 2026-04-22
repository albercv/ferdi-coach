import { describe, expect, it, vi } from "vitest"

function loadAuthOptions() {
  return import("../lib/auth").then((m) => m.authOptions)
}

describe("authOptions Google", () => {
  it("adds Google provider when env vars are set", async () => {
    vi.resetModules()
    ;(process.env as any).NODE_ENV = "development"
    process.env.GOOGLE_CLIENT_ID = "x"
    process.env.GOOGLE_CLIENT_SECRET = "y"

    const authOptions = await loadAuthOptions()
    const ids = (authOptions.providers ?? []).map((p: any) => p.id)
    expect(ids).toContain("google")
  })

  it("disables credentials authorize in production by default", async () => {
    vi.resetModules()
    ;(process.env as any).NODE_ENV = "production"
    process.env.GOOGLE_CLIENT_ID = "x"
    process.env.GOOGLE_CLIENT_SECRET = "y"

    const authOptions = await loadAuthOptions()
    const credentialsProvider = (authOptions.providers ?? []).find((p: any) => p.id === "credentials")
    expect(credentialsProvider).toBeTruthy()

    const res = await (credentialsProvider as any).authorize({
      email: "admin@example.com",
      password: "pw",
    })

    expect(res).toBeNull()
  })

  it("denies Google sign-in when email is not in allowlist", async () => {
    vi.resetModules()
    ;(process.env as any).NODE_ENV = "development"
    process.env.GOOGLE_CLIENT_ID = "x"
    process.env.GOOGLE_CLIENT_SECRET = "y"
    process.env.AUTH_ADMIN_EMAIL = "admin@example.com"
    process.env.AUTH_ADMINS = ""

    const authOptions = await loadAuthOptions()
    const res = await (authOptions.callbacks as any).signIn({
      user: { email: "not-allowed@example.com" },
      account: { provider: "google" },
    })

    expect(res).toBe(false)
  })

  it("allows Google sign-in when email is in allowlist", async () => {
    vi.resetModules()
    ;(process.env as any).NODE_ENV = "development"
    process.env.GOOGLE_CLIENT_ID = "x"
    process.env.GOOGLE_CLIENT_SECRET = "y"
    process.env.AUTH_ADMIN_EMAIL = "admin@example.com"
    process.env.AUTH_ADMINS = ""

    const authOptions = await loadAuthOptions()
    const res = await (authOptions.callbacks as any).signIn({
      user: { email: "Admin@Example.com" },
      account: { provider: "google" },
    })

    expect(res).toBe(true)
  })

  it("sets token.role based on allowlist", async () => {
    vi.resetModules()
    ;(process.env as any).NODE_ENV = "development"
    process.env.GOOGLE_CLIENT_ID = "x"
    process.env.GOOGLE_CLIENT_SECRET = "y"
    process.env.AUTH_ADMIN_EMAIL = "admin@example.com"
    process.env.AUTH_ADMINS = ""

    const authOptions = await loadAuthOptions()
    const out1 = await (authOptions.callbacks as any).jwt({
      token: { email: "admin@example.com" },
      user: undefined,
    })
    expect(out1.role).toBe("admin")

    const out2 = await (authOptions.callbacks as any).jwt({
      token: { email: "user@example.com" },
      user: undefined,
    })
    expect(out2.role).toBe("user")
  })

  it("JWT callback recalcula role a admin si el email entra al allowlist después del primer login", async () => {
    vi.resetModules()
    ;(process.env as any).NODE_ENV = "development"
    process.env.GOOGLE_CLIENT_ID = "x"
    process.env.GOOGLE_CLIENT_SECRET = "y"
    process.env.AUTH_ADMIN_EMAIL = "admin@example.com"
    process.env.AUTH_ADMIN_EMAIL_2 = "ferdy-test@example.com"
    process.env.AUTH_ADMINS = ""

    const authOptions = await loadAuthOptions()
    const out = await (authOptions.callbacks as any).jwt({
      token: { email: "ferdy-test@example.com", role: "user" },
      user: undefined,
    })

    expect(out.role).toBe("admin")

    delete process.env.AUTH_ADMIN_EMAIL_2
  })

  it("JWT callback baja role a user si el email se quita del allowlist", async () => {
    vi.resetModules()
    ;(process.env as any).NODE_ENV = "development"
    process.env.GOOGLE_CLIENT_ID = "x"
    process.env.GOOGLE_CLIENT_SECRET = "y"
    process.env.AUTH_ADMIN_EMAIL = "admin@example.com"
    delete process.env.AUTH_ADMIN_EMAIL_2
    process.env.AUTH_ADMINS = ""

    const authOptions = await loadAuthOptions()
    const out = await (authOptions.callbacks as any).jwt({
      token: { email: "formerly-admin@example.com", role: "admin" },
      user: undefined,
    })

    expect(out.role).toBe("user")
  })
})
