import * as Sentry from "@sentry/nextjs"

export type SessionLike = {
  user?: { email?: string | null; role?: string | null } | null
} | null

export class AuthzError extends Error {
  status: 401 | 403

  constructor(message: string, status: 401 | 403) {
    super(message)
    this.status = status
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function dedupeNonEmpty(values: string[]): string[] {
  return Array.from(
    new Set(values.map(normalizeEmail).filter((email) => email.length > 0)),
  )
}

export function getAdminEmails(): string[] {
  const env = process.env as Record<string, string | undefined>
  const emails: string[] = []

  if (env.AUTH_ADMIN_EMAIL) {
    emails.push(env.AUTH_ADMIN_EMAIL)
  }

  for (let i = 2; i <= 5; i++) {
    const key = `AUTH_ADMIN_EMAIL_${i}`
    const email = env[key]
    if (email) emails.push(email)
  }

  if (env.AUTH_ADMINS) {
    const pairs = env.AUTH_ADMINS.split(/[;\n,]/).map((s) => s.trim()).filter(Boolean)
    for (const pair of pairs) {
      const [email] = pair.split(":")
      if (email) emails.push(email)
    }
  }

  return dedupeNonEmpty(emails)
}

export function isAdmin(session: SessionLike): boolean {
  if (session?.user?.role === "admin") return true

  const email = session?.user?.email
  if (!email) return false

  const allowlist = getAdminEmails()
  if (allowlist.length === 0) return false

  return allowlist.includes(normalizeEmail(email))
}

export function assertAdmin(session: SessionLike): void {
  if (!session?.user) {
    Sentry.captureMessage("assertAdmin: unauthenticated", {
      level: "warning",
      tags: { flow: "authz", outcome: "unauthenticated" },
    })
    throw new AuthzError("UNAUTHENTICATED", 401)
  }

  if (!isAdmin(session)) {
    const email = session.user.email ?? null
    const allowlist = getAdminEmails()
    Sentry.captureMessage("assertAdmin: forbidden", {
      level: "warning",
      tags: { flow: "authz", outcome: "forbidden" },
      extra: {
        email,
        role: session.user.role ?? null,
        allowlistSize: allowlist.length,
        emailInAllowlist: email ? allowlist.includes(normalizeEmail(email)) : false,
      },
    })
    throw new AuthzError("FORBIDDEN", 403)
  }
}
