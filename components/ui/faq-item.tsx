"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItemProps {
  question: string
  answer: string
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <details className="group" open={isOpen}>
      <summary
        className="flex cursor-pointer items-center justify-between rounded-lg bg-card p-4 text-left font-medium text-card-foreground hover:bg-accent/5 transition-colors"
        onClick={(e) => {
          e.preventDefault()
          setIsOpen(!isOpen)
        }}
      >
        <span className="text-balance">{question}</span>
        <ChevronDown
          className={cn("h-5 w-5 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
        />
      </summary>
      {isOpen && (
        <div className="px-4 pb-4 pt-2">
          <p className="text-muted-foreground text-pretty leading-relaxed">{answer}</p>
        </div>
      )}
    </details>
  )
}
