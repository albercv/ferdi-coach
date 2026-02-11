"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { getProviders, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [googleAvailable, setGoogleAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const oauthError = useMemo(() => {
    const raw = searchParams.get("error")
    if (!raw) return null
    if (raw === "AccessDenied") return "Tu cuenta de Google no tiene acceso a este panel."
    if (raw === "OAuthSignin") return "No se pudo iniciar el login con Google."
    if (raw === "OAuthCallback") return "Falló el callback de Google."
    if (raw === "Configuration") return "Falta configuración de autenticación en el servidor."
    return `Error de autenticación: ${raw}`
  }, [searchParams])

  useEffect(() => {
    if (oauthError) setError(oauthError)
  }, [oauthError])

  useEffect(() => {
    let mounted = true
    getProviders()
      .then((p) => {
        if (!mounted) return
        setGoogleAvailable(!!p?.google)
      })
      .catch(() => {
        if (!mounted) return
        setGoogleAvailable(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.ok) {
      router.push("/dashboard")
    } else {
      setError("Credenciales inválidas")
    }
  }

  const handleGoogle = async () => {
    setError(null)
    if (googleAvailable === false) {
      setError("Google no está configurado en el servidor.")
      return
    }

    setOauthLoading(true)
    try {
      const res = await signIn("google", { redirect: false, callbackUrl: "/dashboard" })
      if (res?.url) {
        window.location.assign(res.url)
        return
      }
      setError(res?.error ? `No se pudo iniciar con Google: ${res.error}` : "No se pudo iniciar con Google")
    } catch {
      setError("No se pudo iniciar con Google")
    } finally {
      setOauthLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-sm border rounded-lg p-6 shadow-sm">
        <Button type="button" variant="ghost" onClick={() => router.push("/")} className="mb-3">
          ← Volver a Home
        </Button>
        <h1 className="text-2xl font-bold mb-4">Acceso</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Introduce tu email y contraseña para acceder al panel.
        </p>

        <Button
          type="button"
          onClick={handleGoogle}
          disabled={oauthLoading}
          className="w-full mb-3"
          variant="outline"
        >
          {oauthLoading ? "Conectando con Google..." : "Continuar con Google"}
        </Button>

        {googleAvailable === false && (
          <p className="text-xs text-muted-foreground mb-4">
            Google OAuth no está disponible. Revisa GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Contraseña</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Accediendo..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  )
}
