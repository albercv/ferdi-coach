import type { NextAuthOptions } from "next-auth"
import fs from "node:fs"
import path from "node:path"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import { getAdminEmails } from "@/lib/auth/assertAdmin"

// En desarrollo, los usuarios se leen de variables de entorno
// Nunca usar contraseñas en claro en producción.

type EnvUser = {
  email?: string | undefined
  password?: string | undefined
  role: "admin" | "user"
  name?: string | undefined
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const allowlist = getAdminEmails()
  if (allowlist.length === 0) return false
  return allowlist.includes(normalizeEmail(email))
}

function parseAdminsFromEnv(): EnvUser[] {
  const admins: EnvUser[] = []
  // Admin principal
  admins.push({
    email: process.env.AUTH_ADMIN_EMAIL,
    password: process.env.AUTH_ADMIN_PASSWORD,
    role: "admin",
    name: process.env.AUTH_ADMIN_NAME || "Admin",
  })

  // Admins adicionales por sufijo numérico: AUTH_ADMIN_EMAIL_2, AUTH_ADMIN_PASSWORD_2, ...
  for (let i = 2; i <= 5; i++) {
    const email = (process.env as any)[`AUTH_ADMIN_EMAIL_${i}`]
    const password = (process.env as any)[`AUTH_ADMIN_PASSWORD_${i}`]
    const name = (process.env as any)[`AUTH_ADMIN_NAME_${i}`] || `Admin ${i}`
    if (email && password) {
      admins.push({ email, password, role: "admin", name })
    }
  }

  // Admins definidos en lista: AUTH_ADMINS="email:password;email2:password2"
  const rawList = process.env.AUTH_ADMINS
  if (rawList) {
    const pairs = rawList.split(/[;,\n]/).map((s) => s.trim()).filter(Boolean)
    for (const pair of pairs) {
      const [email, password] = pair.split(":")
      if (email && password) admins.push({ email, password, role: "admin", name: "Admin" })
    }
  }

  // Filtrar entradas vacías
  return admins.filter((u) => !!u.email && !!u.password)
}

function buildEnvUsers(): EnvUser[] {
  const admins = parseAdminsFromEnv()
  const maybeUser: EnvUser | null = (process.env.AUTH_USER_EMAIL && process.env.AUTH_USER_PASSWORD)
    ? {
        email: process.env.AUTH_USER_EMAIL,
        password: process.env.AUTH_USER_PASSWORD,
        role: "user",
        name: process.env.AUTH_USER_NAME || "User",
      }
    : null

  return [...admins, ...(maybeUser ? [maybeUser] : [])]
}

const envUsers = buildEnvUsers()

type GoogleCredentials = { clientId: string; clientSecret: string }

function loadGoogleCredentialsFromEnv(): GoogleCredentials | null {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) return null
  return { clientId, clientSecret }
}

function loadGoogleCredentialsFromJsonFile(): GoogleCredentials | null {
  if (process.env.NODE_ENV === "production") return null

  try {
    const files = fs
      .readdirSync(process.cwd())
      .filter((name) => /^client_secret_.*\.json$/i.test(name))
      .sort((a, b) => a.localeCompare(b))

    for (const file of files) {
      const raw = fs.readFileSync(path.join(process.cwd(), file), "utf8")
      const parsed = JSON.parse(raw)
      const web = parsed?.web
      const clientId = typeof web?.client_id === "string" ? web.client_id : null
      const clientSecret = typeof web?.client_secret === "string" ? web.client_secret : null
      if (clientId && clientSecret) return { clientId, clientSecret }
    }
  } catch {
    return null
  }

  return null
}

function resolveGoogleCredentials(): GoogleCredentials | null {
  return loadGoogleCredentialsFromEnv() ?? loadGoogleCredentialsFromJsonFile()
}

const providers = [] as NextAuthOptions["providers"]

const googleCredentials = resolveGoogleCredentials()

if (googleCredentials) {
  providers.push(
    GoogleProvider({
      clientId: googleCredentials.clientId,
      clientSecret: googleCredentials.clientSecret,
    }),
  )
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    ...providers,
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (process.env.NODE_ENV === "production") return null
        if (!credentials?.email || !credentials?.password) return null
        const user = envUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        )
        if (!user) {
          console.warn("[NextAuth] CredentialsSignin: no match for", {
            email: credentials.email,
          })
          return null
        }
        return {
          id: user.email!,
          email: user.email!,
          name: user.name!,
          role: user.role,
        } as any
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true
      return isAdminEmail(user?.email)
    },
    async jwt({ token, user }) {
      if (user) {
        if ((user as any).email) token.email = (user as any).email
      }

      if (typeof token.email === "string") {
        token.role = isAdminEmail(token.email) ? "admin" : "user"
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}
