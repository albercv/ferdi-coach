"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial } from "@react-three/drei"
import type { Mesh } from "three"

function AnimatedHeart() {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <Sphere
      ref={meshRef}
      args={[1, 64, 64]}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshDistortMaterial color="#ff4d6d" attach="material" distort={0.3} speed={2} roughness={0.2} metalness={0.1} />
    </Sphere>
  )
}

function Heart3DCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff4d6d" />
      <Suspense fallback={null}>
        <AnimatedHeart />
      </Suspense>
    </Canvas>
  )
}

export function Heart3D() {
  return (
    <div className="w-full h-full">
      <Heart3DCanvas />
    </div>
  )
}
