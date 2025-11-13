import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// En desarrollo, los usuarios se leen de variables de entorno
// Nunca usar contraseñas en claro en producción.
const envUsers = [
  {
    email: process.env.AUTH_ADMIN_EMAIL,
    password: process.env.AUTH_ADMIN_PASSWORD,
    role: "admin" as const,
    name: process.env.AUTH_ADMIN_NAME || "Admin",
  },
  {
    email: process.env.AUTH_USER_EMAIL,
    password: process.env.AUTH_USER_PASSWORD,
    role: "user" as const,
    name: process.env.AUTH_USER_NAME || "User",
  },
].filter((u) => !!u.email && !!u.password)

export const authOptions: NextAuthOptions = {
  trustHost: true,
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
        // Debug temporal para verificar los valores recibidos y variables de entorno
        console.log("[NextAuth] authorize() called", {
          credentials,
          envUsers,
        })
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