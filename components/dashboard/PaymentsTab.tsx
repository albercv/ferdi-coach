"use client"

import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { PaymentSubmission } from "@/lib/payments"

type StatusFilter = "all" | "pending" | "confirmed" | "failed"

function formatEuro(amount: number): string {
  const fixed = Number.isFinite(amount) ? amount.toFixed(0) : "0"
  return `${fixed}€`
}

function statusBadge(status: PaymentSubmission["status"]) {
  if (status === "confirmed") return <Badge className="bg-green-600 hover:bg-green-600 text-white">Comprobado</Badge>
  if (status === "failed") return <Badge className="bg-red-600 hover:bg-red-600 text-white">Fallido</Badge>
  return <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white">Pendiente</Badge>
}

export function PaymentsTab() {
  const { toast } = useToast()
  const [iban, setIban] = useState("")
  const [savingIban, setSavingIban] = useState(false)
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [filter, setFilter] = useState<StatusFilter>("pending")

  const filtered = useMemo(() => {
    if (filter === "all") return submissions
    return submissions.filter((s) => s.status === filter)
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

  useEffect(() => {
    loadAll()
  }, [])

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

  async function updateStatus(id: string, status: PaymentSubmission["status"]) {
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
          <CardTitle>Pagos pendientes</CardTitle>
          <CardDescription>Personas que han marcado “PAGADO”.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>Pendientes</Button>
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
                    {s.payerPhone ? (
                      <div className="text-muted-foreground break-all">{s.payerPhone}</div>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-600" onClick={() => updateStatus(s.id, "confirmed")}>Comprobado</Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-600" onClick={() => updateStatus(s.id, "failed")}>Fallido</Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(s.id, "pending")}>Pendiente</Button>
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
