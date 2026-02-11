"use client"

import { useEffect, useMemo, useState } from "react"
import { z } from "zod"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { PaymentProductRef } from "@/lib/payments"
import { buildPaymentConceptLine } from "@/lib/payments"

type PaymentDialogProps = {
  product: PaymentProductRef
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type ViewState = "form" | "submitted"

function formatEuro(amount: number): string {
  const fixed = Number.isFinite(amount) ? amount.toFixed(0) : "0"
  return `${fixed}€`
}

export function PaymentDialog({ product, trigger, open, onOpenChange }: PaymentDialogProps) {
  const { toast } = useToast()
  const [internalOpen, setInternalOpen] = useState(false)
  const [iban, setIban] = useState<string>("")
  const [payerName, setPayerName] = useState("")
  const [payerEmail, setPayerEmail] = useState("")
  const [payerPhone, setPayerPhone] = useState("")
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState<ViewState>("form")

  const EmailSchema = useMemo(() => z.string().trim().email().max(120), [])
  const PhoneSchema = useMemo(
    () => z.string().trim().min(7).max(30).regex(/^[0-9+()\s-]+$/),
    [],
  )

  const isOpen = open ?? internalOpen
  const handleOpenChange = (next: boolean) => {
    if (onOpenChange) {
      onOpenChange(next)
    } else {
      setInternalOpen(next)
    }
  }

  const conceptLine = useMemo(() => buildPaymentConceptLine({ product, payerName }), [product, payerName])

  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/payments/config", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && typeof data?.iban === "string") {
          setIban(data.iban)
        }
      } catch {
        return
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setView("form")
      setPayerName("")
      setPayerEmail("")
      setPayerPhone("")
      setSaving(false)
    }
  }, [isOpen])

  async function submitPaid() {
    const name = payerName.trim()
    const email = payerEmail.trim()
    const phone = payerPhone.trim()
    if (name.length < 2) {
      toast({ title: "Falta el nombre", description: "Introduce tu nombre y apellido." })
      return
    }

    const emailParsed = EmailSchema.safeParse(email)
    if (!emailParsed.success) {
      toast({ title: "Email inválido", description: "Introduce un email válido." })
      return
    }

    if (phone.length > 0) {
      const phoneParsed = PhoneSchema.safeParse(phone)
      if (!phoneParsed.success) {
        toast({ title: "Teléfono inválido", description: "Introduce un teléfono válido (solo números y +)." })
        return
      }
    }

    setSaving(true)
    try {
      const res = await fetch("/api/payments/paid", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          payerName: name,
          payerEmail: emailParsed.data,
          payerPhone: phone.length > 0 ? phone : undefined,
        }),
      })
      if (!res.ok) {
        toast({ title: "No se pudo guardar", description: "Inténtalo de nuevo en unos segundos." })
        return
      }
      setView("submitted")
    } catch {
      toast({ title: "Error", description: "No se pudo conectar. Inténtalo de nuevo." })
    } finally {
      setSaving(false)
    }
  }

  const content = (
    <DialogContent className="max-w-[95vw] sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Pago por transferencia</DialogTitle>
        <DialogDescription>
          {product.title} · {formatEuro(product.priceEuro)}
        </DialogDescription>
      </DialogHeader>

      {view === "form" ? (
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <div className="text-sm text-muted-foreground">Haz una transferencia de</div>
            <div className="text-2xl font-bold">{formatEuro(product.priceEuro)}</div>
            <div className="text-sm text-muted-foreground">a este IBAN</div>
            <div className="font-mono text-sm break-all">{iban || "(IBAN pendiente de configurar)"}</div>
            <div className="text-sm text-muted-foreground">con el concepto</div>
            <div className="font-semibold break-words">{conceptLine}</div>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="payer-name">Nombre y apellido</Label>
              <Input id="payer-name" value={payerName} onChange={(e) => setPayerName(e.target.value)} placeholder="Nombre Apellido" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payer-email">Email</Label>
              <Input id="payer-email" value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} placeholder="tu@email.com" inputMode="email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payer-phone">Teléfono (opcional)</Label>
              <Input id="payer-phone" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} placeholder="+34 600 000 000" inputMode="tel" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="font-semibold">Pago en revisión</div>
            <div className="text-sm text-muted-foreground text-pretty">
              {product.kind === "guide"
                ? "En breve recibirás tu guía por email cuando confirmemos la transferencia."
                : "En breve me pondré en contacto contigo para reservar tu sesión cuando confirmemos la transferencia."}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-green-600 mt-1" />
                  <div className="w-px flex-1 bg-border mt-1" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">Marcaste “PAGADO”</div>
                  <div className="text-xs text-muted-foreground">Hemos guardado tus datos de contacto.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mt-1" />
                  <div className="w-px flex-1 bg-border mt-1" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">Transferencia en camino</div>
                  <div className="text-xs text-muted-foreground">Tu banco la envía y debe llegar al nuestro.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/40 mt-1" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {product.kind === "guide" ? "Envío de la guía" : "Contacto para la sesión"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {product.kind === "guide"
                      ? "Cuando lo confirmemos, recibirás un email con tu guía."
                      : "Cuando lo confirmemos, te escribiré para concretar fecha y hora."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DialogFooter>
        {view === "form" ? (
          <Button onClick={submitPaid} disabled={saving} className="w-full sm:w-auto">
            {saving ? "Guardando..." : "PAGADO"}
          </Button>
        ) : (
          <Button onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
            Cerrar
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  )

  if (!trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {content}
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {content}
    </Dialog>
  )
}
