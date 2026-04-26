"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ArrowUpRight, LogOut, Sparkles } from "lucide-react"
import type { ReactNode } from "react"

type DashboardShellProps = {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  const userEmail = session?.user?.email ?? ""
  const userInitial = userEmail.charAt(0).toUpperCase() || "·"

  return (
    <div className="dashboard-scope min-h-screen bg-[var(--dash-bg)] text-foreground">
      <header className="dash-topbar">
        <div className="container mx-auto px-4 lg:px-6 flex h-16 items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <span className="dash-mark">
              <img
                src="/logo2.webp"
                alt="Ferdy Coach"
                className="w-full h-full object-cover"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors">
                Ferdy Coach
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--accent)] font-medium mt-1">
                Admin · Panel
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {userEmail ? (
              <div
                className="hidden md:flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-[var(--dash-line)] bg-[var(--dash-chip)]"
                title={userEmail}
              >
                <span className="size-6 rounded-full bg-foreground text-background flex items-center justify-center text-[11px] font-semibold uppercase">
                  {userInitial}
                </span>
                <span className="text-xs text-foreground/75 max-w-[200px] truncate">
                  {userEmail}
                </span>
                <span className="dash-pulse" aria-hidden />
              </div>
            ) : null}

            <Link href="/" className="dash-btn-ghost group">
              <span>Ver sitio</span>
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="dash-btn-primary group"
            >
              <LogOut className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
        <div className="dash-topbar-line" aria-hidden />
      </header>

      <div className="container mx-auto px-4 lg:px-6 pt-8 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--accent)] font-semibold flex items-center gap-1.5">
              <Sparkles className="size-3" />
              Estudio editorial
            </p>
            <h1 className="dash-title mt-2">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
              Gestiona contenido, media, pagos y documentación del proyecto desde un único lugar.
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-6 pb-16">{children}</main>
    </div>
  )
}
