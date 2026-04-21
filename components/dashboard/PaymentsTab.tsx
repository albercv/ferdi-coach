"use client"

import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { PaymentSubmission } from "@/lib/payments"

type StatusFilter = "active" | "confirmed" | "failed" | "all"

const ACTIVE_STATUSES = new Set(["pending", "overdue", "failed_warning"])

function formatEuro(amount: number): string {
  return `${Number.isFinite(amount) ? amount.toFixed(0) : "0"}€`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function statusBadge(status: PaymentSubmission["status"]) {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-600 hover:bg-green-600 text-white">Comprobado</Badge>
    case "failed":
      return <Badge className="bg-red-900 hover:bg-red-900 text-white">Fallido</Badge>
    case "failed_warning":
      return <Badge className="bg-red-500 hover:bg-red-500 text-white">Aviso enviado</Badge>
    case "overdue":
      return <Badge className="bg-orange-500 hover:bg-orange-500 text-white">Recordatorio enviado</Badge>
    default:
      return <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white">Pendiente</Badge>
  }
}

export function PaymentsTab() {
  const { toast } = useToast()
  const [iban, setIban] = useState("")
  const [savingIban, setSavingIban] = useState(false)
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [filter, setFilter] = useState<StatusFilter>("active")

  const filtered = useMemo(() => {
    switch (filter) {
      case "active": return submissions.filter((s) => ACTIVE_STATUSES.has(s.status))
      case "confirmed": return submissions.filter((s) => s.status === "confirmed")
      case "failed": return submissions.filter((s) => s.status === "failed")
      default: return submissions
    }
  }, [filter, submissions])

  async function loadAll() {
    setLoadingSubmissions(true)
    try {
      const [configRes, subsRes] = await Promise.all([
        fetch("/api/payments/config", { cache: "no-store" }),
        fetch("/api/payments/submissions", { cache: "no-store" }),
      ])
      if (configRes.ok) {
        const config = await configRes.json()
        if (typeof config?.iban === "string") setIban(config.iban)
      }
      if (subsRes.ok) {
        const data = await subsRes.json()
        if (Array.isArray(data?.submissions)) setSubmissions(data.submissions)
      }
    } finally {
      setLoadingSubmissions(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  async function saveIban() {
    const value = iban.trim()
    if (value.length < 8) {
      toast({ title: "IBAN inválido", description: "Introduce un IBAN válido." })
      return
    }
    setSavingIban(true)
    try {
      const res = await fetch("/api/payments/config", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ iban: value }),
      })
      if (!res.ok) {
        toast({ title: "No se pudo guardar", description: "Revisa que sigues logado como admin." })
        return
      }
      toast({ title: "Guardado", description: "IBAN actualizado." })
      await loadAll()
    } finally {
      setSavingIban(false)
    }
  }

  async function updateStatus(id: string, status: "pending" | "confirmed") {
    const prev = submissions
    setSubmissions((current) => current.map((s) => (s.id === id ? { ...s, status } : s)))
    try {
      const res = await fetch("/api/payments/submissions", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) {
        setSubmissions(prev)
        toast({ title: "No se pudo actualizar", description: "Inténtalo de nuevo." })
        return
      }
      const data = await res.json()
      if (data?.submission?.id) {
        setSubmissions((current) => current.map((s) => (s.id === id ? data.submission : s)))
      }
    } catch {
      setSubmissions(prev)
      toast({ title: "Error", description: "No se pudo conectar." })
    }
  }

  function renderButtons(s: PaymentSubmission) {
    if (s.status === "confirmed" || s.status === "failed") {
      return (
        <Button size="sm" variant="outline" onClick={() => updateStatus(s.id, "pending")}>
          Reabrir
        </Button>
      )
    }
    return (
      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(s.id, "confirmed")}>
        Comprobado
      </Button>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>IBAN para transferencias</CardTitle>
          <CardDescription>Este IBAN se muestra en los modales de pago.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="payments-iban">IBAN</Label>
            <Input id="payments-iban" value={iban} onChange={(e) => setIban(e.target.value)} placeholder="ES00...." />
          </div>
          <Button onClick={saveIban} disabled={savingIban} className="w-full sm:w-auto">
            {savingIban ? "Guardando..." : "Guardar"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagos</CardTitle>
          <CardDescription>Gestión de solicitudes de pago.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>Activos</Button>
            <Button variant={filter === "confirmed" ? "default" : "outline"} size="sm" onClick={() => setFilter("confirmed")}>Comprobados</Button>
            <Button variant={filter === "failed" ? "default" : "outline"} size="sm" onClick={() => setFilter("failed")}>Fallidos</Button>
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>Todos</Button>
            <Button variant="ghost" size="sm" onClick={loadAll} disabled={loadingSubmissions}>Recargar</Button>
          </div>

          {filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {loadingSubmissions ? "Cargando..." : "No hay pagos en este estado."}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((s) => (
                <div key={s.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{s.productTitle}</div>
                      <div className="text-xs text-muted-foreground">{formatEuro(s.amountEuro)} · {s.conceptShort}</div>
                    </div>
                    <div className="flex-shrink-0">{statusBadge(s.status)}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{s.payerName}</div>
                    <div className="text-muted-foreground break-all">{s.payerEmail}</div>
                    {s.payerPhone && <div className="text-muted-foreground">{s.payerPhone}</div>}
                    <div className="text-xs text-muted-foreground mt-1">Inicio: {formatDate(s.createdAtIso)}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {renderButtons(s)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
