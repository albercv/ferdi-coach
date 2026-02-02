import { withAuth } from "next-auth/middleware"

import { getAdminEmails } from "@/lib/auth/assertAdmin"

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token }) => {
      if (!token) return false
      if ((token as any).role === "admin") return true
      const email = typeof (token as any).email === "string" ? (token as any).email : ""
      if (!email) return false
      const allowlist = getAdminEmails()
      if (allowlist.length === 0) return false
      return allowlist.includes(normalizeEmail(email))
    },
  },
})

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
}
