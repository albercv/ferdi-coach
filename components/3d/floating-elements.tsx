"use client"

import { Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type { Mesh } from "three"

function FloatingElement({
  position,
  color,
  scale = 1,
}: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </mesh>
  )
}

function FloatingScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <FloatingElement position={[-2, 1, 0]} color="#ff4d6d" scale={0.8} />
      <FloatingElement position={[2, -1, -1]} color="#0d0d0d" scale={0.6} />
      <FloatingElement position={[0, 2, -2]} color="#ff4d6d" scale={0.4} />
      <FloatingElement position={[-1, -2, 1]} color="#0d0d0d" scale={0.5} />
    </>
  )
}

export function FloatingElements3D() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <FloatingScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
