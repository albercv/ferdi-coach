import type { ReactNode } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type MediaSectionCardProps = {
  title?: string
  description?: string
  children: ReactNode
  compact?: boolean
}

export function MediaSectionCard({
  title = "Media",
  description,
  children,
  compact = false,
}: MediaSectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-4",
            compact && "[&_img]:max-h-40 [&_video]:max-h-40",
          )}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
