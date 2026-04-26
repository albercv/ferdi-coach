export type PaymentStatus = "pending" | "overdue" | "failed_warning" | "confirmed" | "failed"

export type PaymentProductRef =
  | { kind: "session"; id: string; subtype: "individual" | "program4"; title: string; priceEuro: number }
  | { kind: "guide"; id: string; title: string; priceEuro: number }

export type PaymentsConfig = {
  iban: string
  updatedAtIso: string
}

export type PaymentSubmission = {
  id: string
  createdAtIso: string
  status: PaymentStatus
  statusUpdatedAtIso?: string
  statusUpdatedByEmail?: string

  productId: string
  productKind: "session" | "guide"
  productSubtype?: "individual" | "program4"
  productTitle: string
  amountEuro: number
  conceptShort: string
  // Snapshot de la fileUrl del producto en el momento en que el cliente hizo el
  // submit. Se usa para entregar el mismo PDF aunque el producto se haya editado
  // después, y para proteger de borrado ese fichero mientras la compra esté viva.
  productFileUrl?: string

  payerName: string
  payerEmail: string
  payerPhone?: string
  failedWarningAtIso?: string
}

export function buildPaymentConceptShort(product: PaymentProductRef): string {
  if (product.kind === "session") {
    return product.subtype === "program4" ? "programa4" : "individual"
  }
  return "guia"
}

export function buildPaymentConceptLine(input: { product: PaymentProductRef; payerName?: string }): string {
  const conceptShort = buildPaymentConceptShort(input.product)
  const namePart = input.payerName?.trim() ? input.payerName.trim() : "Nombre Apellido"

  if (input.product.kind === "guide") {
    const titlePart = input.product.title.trim() ? input.product.title.trim() : "Guía"
    return `${conceptShort} - ${titlePart} - ${namePart}`
  }

  return `${conceptShort} - ${namePart}`
}
