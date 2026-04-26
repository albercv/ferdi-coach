import type { CSSProperties, ReactNode } from "react"
import {
  INNER_ONLY_SECTIONS,
  resolveColor,
  type SectionKey,
} from "@/lib/section-styles-shared"

type SectionBgProps = {
  id: SectionKey
  styles: Partial<Record<SectionKey, string>>
  children: ReactNode
}

export function SectionBg({ id, styles, children }: SectionBgProps) {
  const resolved = resolveColor(styles[id])
  if (!resolved) return <>{children}</>

  const innerOnly = INNER_ONLY_SECTIONS.has(id)
  const style = innerOnly
    ? ({ ["--section-bg" as string]: resolved } as CSSProperties)
    : ({
        backgroundColor: resolved,
        ["--section-bg" as string]: resolved,
      } as CSSProperties)

  const className = innerOnly ? "section-bg section-bg--inner" : "section-bg"

  return (
    <div className={className} data-section-bg={id} style={style}>
      {children}
    </div>
  )
}
