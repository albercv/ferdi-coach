import { cn } from "@/lib/utils"
import type React from "react"

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  "aria-labelledby"?: string
}

export function Section({ children, className, id, "aria-labelledby": ariaLabelledby }: SectionProps) {
  return (
    <section id={id} aria-labelledby={ariaLabelledby} className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  )
}
