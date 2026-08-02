import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import './HeroScene.css'

gsap.registerPlugin(ScrollTrigger)

const GOLD = '#f9a91b'
const RED = '#cd302b'
const CREAM = '#f6f1e6'
const STEEL = '#e4eaf0'

const steelMat = { color: STEEL, metalness: 0.95, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08 } as const
const goldMat = { color: GOLD, metalness: 0.85, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15 } as const

/** Modern minimalist fork — a rounded rod handle + four tapered tine rods. */
function Fork() {
  return (
    <group>
      <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.02, 0.4, 16]} />
        <meshPhysicalMaterial {...steelMat} />
      </mesh>
      {[-0.055, -0.018, 0.018, 0.055].map((x) => (
        <mesh key={x} position={[x, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.0035, 0.007, 0.22, 12]} />
          <meshPhysicalMaterial {...steelMat} />
        </mesh>
      ))}
      {/* Neck plate joining tines to handle */}
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[0.14, 0.012, 0.03]} />
        <meshPhysicalMaterial {...steelMat} />
      </mesh>
    </group>
  )
}

/** Modern knife — rounded gold handle + a tapered blade (flattened cone, tip forward). */
function Knife() {
  return (
    <group>
      <mesh position={[0, 0, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.017, 0.021, 0.34, 16]} />
        <meshPhysicalMaterial {...goldMat} />
      </mesh>
      <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.22, 1]}>
        <cylinderGeometry args={[0.003, 0.07, 0.44, 24]} />
        <meshPhysicalMaterial {...steelMat} />
      </mesh>
    </group>
  )
}

/**
 * "The Table" — a place setting, not an abstract orbit: a plate, fork, knife,
 * two glasses, and a tealight, with a restaurant pendant lamp (the gold ring)
 * hanging above it on a cord. Rotates gently, tilts toward the pointer, and
 * drifts away as the hero scrolls out of view.
 */
function TableSetting() {
  const groupRef = useRef<THREE.Group>(null!)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // Visible world-space width at z=0 for the current canvas size — used so the
  // scene stays on-screen across aspect ratios instead of a fixed x offset
  // that only worked for wide desktop viewports. Below the hero's mobile
  // breakpoint (980px, see Hero.css) the copy stacks full-width instead of
  // sharing a row with the scene, so it should sit near-center, not off to
  // the side.
  const isNarrow = typeof window !== 'undefined' && window.innerWidth < 720
  const viewportWidth = useThree((state) => state.viewport.width)
  const baseX = isNarrow
    ? THREE.MathUtils.clamp(viewportWidth * 0.06, 0.1, 0.7)
    : THREE.MathUtils.clamp(viewportWidth * 0.24, 0.55, 1.9)
  const baseScale = THREE.MathUtils.clamp(viewportWidth / 5.5, 0.4, 0.85)

  useFrame((_, delta) => {
    const g = groupRef.current
    if (!g) return
    g.rotation.y += delta * 0.05
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.55 + pointer.current.y * 0.12, 0.04)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, pointer.current.x * 0.1, 0.04)
  })

  useEffect(() => {
    const g = groupRef.current
    if (!g) return
    const ctx = gsap.context(() => {
      const trigger = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
      gsap.to(g.position, { z: -2.2, y: -1.5, x: baseX + 0.65, ease: 'none', scrollTrigger: trigger })
      gsap.to(g.scale, { x: baseScale * 0.73, y: baseScale * 0.73, z: baseScale * 0.73, ease: 'none', scrollTrigger: trigger })
    })
    return () => ctx.revert()
  }, [baseX, baseScale])

  return (
    <group ref={groupRef} position={[baseX, -0.35, 0]} rotation={[0.55, -0.35, 0]} scale={baseScale}>
      {/* Pendant lamp — the ring, now hanging above the table on a cord */}
      <group position={[0, 0.78, 0]}>
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.48, 8]} />
          <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.48, 0.028, 24, 96]} />
          <meshPhysicalMaterial color={GOLD} metalness={0.9} roughness={0.22} clearcoat={1} clearcoatRoughness={0.15} />
        </mesh>
        <pointLight position={[0, -0.1, 0]} intensity={0.9} color="#ffd28a" distance={3.2} />
      </group>

      {/* Plate, with a thin gold rim */}
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.62, 0.66, 0.045, 72]} />
        <meshPhysicalMaterial color={CREAM} transparent opacity={0.5} roughness={0.08} metalness={0} clearcoat={1} />
      </mesh>
      <mesh position={[0, -0.298, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.01, 72]} />
        <meshPhysicalMaterial color={CREAM} transparent opacity={0.28} roughness={0.1} metalness={0} />
      </mesh>
      <mesh position={[0, -0.296, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.615, 0.006, 12, 96]} />
        <meshPhysicalMaterial {...goldMat} />
      </mesh>

      {/* Fork, laid to the left of the plate */}
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.4}>
        <group position={[-0.95, -0.3, 0.1]} rotation={[0, 0.15, 0]}>
          <Fork />
        </group>
      </Float>

      {/* Knife, laid to the right of the plate */}
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.4}>
        <group position={[0.95, -0.3, 0.05]} rotation={[0, -0.15, 0]}>
          <Knife />
        </group>
      </Float>

      {/* Two glasses */}
      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0.55, -0.06, 0.55]}>
          <cylinderGeometry args={[0.09, 0.06, 0.32, 32]} />
          <meshPhysicalMaterial color={CREAM} transparent opacity={0.32} roughness={0.05} metalness={0} clearcoat={1} />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[-0.5, -0.1, -0.5]}>
          <cylinderGeometry args={[0.07, 0.05, 0.26, 32]} />
          <meshPhysicalMaterial color={RED} transparent opacity={0.55} roughness={0.05} metalness={0} clearcoat={1} />
        </mesh>
      </Float>

      {/* Tealight */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={1.4} />
        </mesh>
      </Float>
    </group>
  )
}

export default function HeroScene() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.2], fov: 42 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.4} color="#123f66" />
        <directionalLight position={[3, 4, 5]} intensity={1.5} color="#ffe4b0" />
        <pointLight position={[-3, -2, 2]} intensity={0.9} color={RED} />
        <pointLight position={[2, -3, -2]} intensity={0.5} color={GOLD} />
        <TableSetting />
        <Sparkles count={22} scale={[6, 4, 3]} size={2} speed={0.3} color={GOLD} opacity={0.4} />
      </Canvas>
    </div>
  )
}
