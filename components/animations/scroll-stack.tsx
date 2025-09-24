"use client"
import React, { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"

export function ScrollStack({
  children,
  itemDistance = 120,
  itemScale = 0.04,
  baseScale = 0.92,
  className = "",
  targetRef,
}: {
  children: React.ReactNode
  itemDistance?: number
  itemScale?: number
  baseScale?: number
  className?: string
  targetRef?: React.RefObject<HTMLElement | null>
}) {
  const localRef = useRef<HTMLDivElement | null>(null)
  const scrollTarget = targetRef ?? localRef
  const { scrollYProgress } = useScroll({ target: scrollTarget, offset: ["start end", "end start"] })
  const reduceMotion = useReducedMotion() ?? false

  const items = React.Children.toArray(children)

  // stretch the container height so the scroll is consumed until the last item stacks
  const containerStyle = reduceMotion
    ? undefined
    : ({ height: `calc(100vh + ${itemDistance * Math.max(0, items.length - 1)}px)` } as const)

  return (
    <div ref={localRef} className={`relative isolate ${className}`} style={containerStyle}>
      {/* Pin the stack in place; adjust top to your header height; keep a stable viewport height for the stack */}
      <div className={reduceMotion ? "space-y-6" : "sticky top-24 h-[80vh] relative"}>
        <div className={reduceMotion ? "space-y-6" : "relative h-full"}>
          {items.map((child, index) => (
            <ScrollStackItem
              key={index}
              index={index}
              scrollYProgress={scrollYProgress}
              itemDistance={itemDistance}
              itemScale={itemScale}
              baseScale={baseScale}
              reduceMotion={reduceMotion}
            >
              {child}
            </ScrollStackItem>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ScrollStackItem({
  index,
  scrollYProgress,
  itemDistance,
  itemScale,
  baseScale,
  reduceMotion,
  children,
}: {
  index: number
  scrollYProgress: import("framer-motion").MotionValue<number>
  itemDistance: number
  itemScale: number
  baseScale: number
  reduceMotion: boolean
  children: React.ReactNode
}) {
  const fromY = index * itemDistance
  const toY = Math.max(0, (index - 1) * itemDistance)
  const y = useTransform(scrollYProgress, [0, 1], [fromY, toY])

  const fromScale = baseScale - index * itemScale
  const toScale = baseScale - Math.max(0, index - 1) * itemScale
  const scale = useTransform(scrollYProgress, [0, 1], [fromScale, toScale])

  const style = reduceMotion
    ? undefined
    : ({
        y,
        scale,
        willChange: "transform",
        zIndex: index + 1,
        position: "absolute",
        inset: 0,
      } as const)

  return (
    <motion.div style={style} className={reduceMotion ? "origin-top" : "origin-top"}>
      {children}
    </motion.div>
  )
}