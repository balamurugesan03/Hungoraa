import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { DishModel } from './three/dishes'
import Steam from './three/Steam'

const GOLD = '#d4af37'
const LEAF = '#1f5c22'
const BRASS = '#c99a3e'

/** A fresh banana leaf — a long, gently curved plane with a raised midrib. */
function BananaLeaf() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0.06]} position={[0, -0.02, 0]}>
      <mesh>
        <planeGeometry args={[3.4, 1.9, 24, 8]} />
        <meshStandardMaterial color={LEAF} roughness={0.55} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[3.2, 0.03]} />
        <meshStandardMaterial color="#3f8a35" roughness={0.5} />
      </mesh>
      {Array.from({ length: 22 }).map((_, i) => (
        <mesh key={i} position={[(i - 11) * 0.14, 0, 0.002]} rotation={[0, 0, 0.42 * (i % 2 ? 1 : -1)]}>
          <planeGeometry args={[0.006, 0.8]} />
          <meshStandardMaterial color="#2b6d28" roughness={0.6} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function BrassBowl({ position, r = 0.16 }: { position: [number, number, number]; r?: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[r, 24, 16, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
      <meshPhysicalMaterial color={BRASS} metalness={0.95} roughness={0.24} clearcoat={0.7} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Chilli({ position, rot }: { position: [number, number, number]; rot: number }) {
  return (
    <mesh position={position} rotation={[0.4, rot, 1.4]}>
      <capsuleGeometry args={[0.018, 0.14, 4, 8]} />
      <meshStandardMaterial color="#9c1f16" roughness={0.4} />
    </mesh>
  )
}

function CurryLeaf({ position, rot }: { position: [number, number, number]; rot: number }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, rot]} scale={[0.5, 1, 1]}>
      <circleGeometry args={[0.055, 12]} />
      <meshStandardMaterial color="#2f6a2a" roughness={0.55} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Platter() {
  const g = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.14) * 0.12
  })
  return (
    <group ref={g}>
      <BananaLeaf />

      <group position={[-0.95, 0.12, 0.15]} scale={0.92}>
        <DishModel id="dosa" />
      </group>
      <group position={[0.55, 0.12, -0.28]} scale={0.9}>
        <DishModel id="idli-vada" />
      </group>
      <group position={[1.25, 0.14, 0.35]} scale={0.86}>
        <DishModel id="biryani" />
      </group>
      <group position={[0.05, 0.12, 0.5]} scale={0.7}>
        <DishModel id="butter-chicken" />
      </group>

      <BrassBowl position={[-0.15, 0.02, -0.55]} r={0.15} />
      <BrassBowl position={[-1.55, 0.02, -0.35]} r={0.13} />
      <Steam position={[-0.15, 0.2, -0.55]} count={5} height={0.7} />

      {[
        [-1.7, 0.06, 0.4, 0.3],
        [1.75, 0.06, -0.5, 1.1],
        [0.9, 0.06, 0.62, 2.2],
        [-0.6, 0.06, -0.7, 0.8],
      ].map(([x, y, z, r], i) => (
        <Chilli key={i} position={[x, y, z] as [number, number, number]} rot={r} />
      ))}
      {[
        [-1.2, 0.05, 0.55, 0.4],
        [1.4, 0.05, 0.5, 1.7],
        [0.3, 0.05, -0.62, 2.6],
        [-0.9, 0.05, -0.5, 0.9],
        [1.9, 0.05, 0.1, 1.2],
      ].map(([x, y, z, r], i) => (
        <CurryLeaf key={i} position={[x, y, z] as [number, number, number]} rot={r} />
      ))}
    </group>
  )
}

/** Gentle mouse-parallax on the camera. */
function ParallaxRig() {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })
  useFrame(() => {
    const t = target.current
    camera.position.x += (t.x * 0.6 - camera.position.x) * 0.05
    camera.position.y += (2.2 + t.y * 0.3 - camera.position.y) * 0.05
    camera.lookAt(0, 0.15, 0)
  })
  return (
    <mesh
      position={[0, 0, 3.8]}
      onPointerMove={(e) => {
        if (!e.uv) return
        target.current.x = (e.uv.x - 0.5) * 2
        target.current.y = -(e.uv.y - 0.5) * 2
      }}
    >
      <planeGeometry args={[40, 24]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

export default function HeroScene() {
  const dpr = useMemo<[number, number]>(() => [1, 1.6], [])
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 2.2, 4.4], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <fog attach="fog" args={['#080808', 4.5, 12]} />
      <ambientLight intensity={0.3} color="#2a1e0e" />
      <directionalLight position={[3, 6, 4]} intensity={1.0} color="#f0d79a" />
      <pointLight position={[-2.4, 2, 2.4]} intensity={0.9} color="#ffb964" distance={9} decay={2} />
      <pointLight position={[2.6, 1.4, -1.4]} intensity={0.34} color="#2e7d32" distance={8} decay={2} />
      <spotLight position={[0, 5.5, 1.5]} angle={0.5} penumbra={0.9} intensity={1.1} color="#ffe6b8" />

      <ParallaxRig />
      <Platter />

      <Sparkles count={90} scale={[9, 5, 7]} size={2} speed={0.14} color={GOLD} opacity={0.5} />
      <Sparkles count={40} scale={[7, 4, 5]} size={1} speed={0.3} color="#e8b04a" opacity={0.4} />
    </Canvas>
  )
}
