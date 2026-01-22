import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// En desarrollo, los usuarios se leen de variables de entorno
// Nunca usar contraseñas en claro en producción.

type EnvUser = {
  email?: string | undefined
  password?: string | undefined
  role: "admin" | "user"
  name?: string | undefined
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

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
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
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
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
