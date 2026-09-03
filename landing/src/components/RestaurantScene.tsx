import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import Steam from './three/Steam'
import './RestaurantScene.css'

gsap.registerPlugin(ScrollTrigger)

const GOLD = '#d4af6a'
const WARM_GLOW = '#ffb35c'
const BLUE_KEY = '#8fc1e8'
const BLUE_FILL = '#3f93d8'
const WOOD = '#0e1a26'
const CLOTH = '#122230'

const woodMat = { color: WOOD, roughness: 0.35, metalness: 0.1 } as const
const brassMat = { color: GOLD, metalness: 0.9, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15 } as const

/** A small round dining table with a cloth top and a single pedestal leg. */
function DiningTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.04, 32]} />
        <meshStandardMaterial color={CLOTH} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.68, 12]} />
        <meshPhysicalMaterial {...woodMat} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.03, 24]} />
        <meshPhysicalMaterial {...woodMat} />
      </mesh>
    </group>
  )
}

/** A minimal chair — seat + backrest, low-poly, just enough to read as furniture at a distance. */
function Chair({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.38, 0.05, 0.38]} />
        <meshPhysicalMaterial {...woodMat} />
      </mesh>
      <mesh position={[0, 0.68, -0.17]}>
        <boxGeometry args={[0.38, 0.5, 0.05]} />
        <meshPhysicalMaterial {...woodMat} />
      </mesh>
      {[-0.15, 0.15].map((x) =>
        [-0.15, 0.15].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.2, z]}>
            <cylinderGeometry args={[0.018, 0.018, 0.4, 8]} />
            <meshPhysicalMaterial {...woodMat} />
          </mesh>
        )),
      )}
    </group>
  )
}

/** A hanging pendant lamp — cord + brass ring + warm glow disc. Most instances
 * are pure emissive (no real light) to keep the light budget small. */
function Pendant({ position, lit = false }: { position: [number, number, number]; lit?: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 1, 6]} />
        <meshStandardMaterial color="#3a2a18" roughness={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.018, 12, 32]} />
        <meshPhysicalMaterial {...brassMat} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={WARM_GLOW} emissive={WARM_GLOW} emissiveIntensity={2.2} />
      </mesh>
      {lit && <pointLight position={[0, -0.1, 0]} intensity={1.1} color={WARM_GLOW} distance={4.5} decay={2} />}
    </group>
  )
}

/** A stylised potted plant — a few flattened, layered "leaf" blobs over a pot. */
function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.16, 0.13, 0.36, 16]} />
        <meshStandardMaterial color="#2a1c12" roughness={0.6} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.1, 0.5 + (i % 3) * 0.08, Math.sin(a) * 0.1]}
            rotation={[0.3, a, 0]}
            scale={[0.16, 0.34, 0.05]}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#2f5c33' : '#3d7a42'} roughness={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}

/** A distant glowing pass-window standing in for the kitchen — a cheap depth
 * cue rather than a full kitchen build (that's a later scene). */
function KitchenGlow() {
  return (
    <group position={[0, 1.1, -11]}>
      <mesh>
        <planeGeometry args={[3.4, 1.3]} />
        <meshStandardMaterial color={WARM_GLOW} emissive={WARM_GLOW} emissiveIntensity={1.4} transparent opacity={0.55} />
      </mesh>
      <Steam position={[-0.8, -0.4, 0.3]} count={5} height={1.1} />
      <Steam position={[0.6, -0.4, 0.3]} count={5} height={1.1} />
    </group>
  )
}

/**
 * Camera rig that dollies through the dining hall as the `.hero` wrapper
 * scrolls (entrance → among the tables) and adds a gentle pointer-parallax
 * offset on top, independent of scroll.
 */
function CameraRig() {
  const { camera } = useThree()
  const scrollT = useRef({ t: 0 })
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(scrollT.current, {
        t: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })
    })
    return () => ctx.revert()
  }, [])

  const entrance = useRef(new THREE.Vector3(0.3, 1.75, 9.2)).current
  const mid = useRef(new THREE.Vector3(-0.9, 1.4, 5.4)).current
  const close = useRef(new THREE.Vector3(0.5, 1.1, 2.5)).current
  const lookEntrance = useRef(new THREE.Vector3(0, 1.1, 0)).current
  const lookClose = useRef(new THREE.Vector3(0.1, 0.5, -1)).current
  const pos = useRef(new THREE.Vector3()).current
  const look = useRef(new THREE.Vector3()).current

  useFrame(() => {
    const t = scrollT.current.t
    if (t < 0.5) {
      pos.lerpVectors(entrance, mid, t / 0.5)
    } else {
      pos.lerpVectors(mid, close, (t - 0.5) / 0.5)
    }
    look.lerpVectors(lookEntrance, lookClose, t)

    camera.position.set(
      pos.x + pointer.current.x * 0.25,
      pos.y - pointer.current.y * 0.12,
      pos.z,
    )
    camera.lookAt(look.x + pointer.current.x * 0.15, look.y, look.z)
  })

  return null
}

function DiningHall() {
  const tablePositions: [number, number, number][] = [
    [-1.6, -1.05, -1.2],
    [1.7, -1.05, -0.6],
    [-2.4, -1.05, -4.2],
    [2.5, -1.05, -4.8],
    [0.2, -1.05, -7.4],
    [-3.2, -1.05, -8.6],
  ]

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -1.32, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#08131f" roughness={0.3} metalness={0.12} />
      </mesh>

      {tablePositions.map((p, i) => (
        <group key={i}>
          <DiningTable position={p} />
          <Chair position={[p[0] - 0.75, p[1], p[2]]} rotationY={Math.PI / 2} />
          <Chair position={[p[0] + 0.75, p[1], p[2]]} rotationY={-Math.PI / 2} />
        </group>
      ))}

      {[
        [-2.2, 2.6, -1] as const,
        [2.4, 2.7, -2.4] as const,
        [-1, 2.5, -5.6] as const,
        [1.8, 2.6, -7.6] as const,
      ].map((p, i) => (
        <Pendant key={i} position={[p[0], p[1], p[2]]} lit={i < 2} />
      ))}

      <Plant position={[-3.6, -1.05, -2.6]} />
      <Plant position={[3.6, -1.05, -6.4]} />

      <KitchenGlow />
    </group>
  )
}

export default function RestaurantScene() {
  return (
    <div className="restaurant-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0.3, 1.75, 9.2], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#071522', 5, 17]} />
        <ambientLight intensity={0.36} color="#16324c" />
        <directionalLight position={[2, 5, 4]} intensity={0.85} color={BLUE_KEY} />
        <pointLight position={[-2, 1.8, 2]} intensity={0.85} color={BLUE_FILL} distance={7} decay={2} />
        <pointLight position={[1.6, 1.4, 1]} intensity={0.5} color={WARM_GLOW} distance={5} decay={2} />

        <CameraRig />
        <DiningHall />
        <Sparkles count={40} scale={[10, 5, 12]} size={1.6} speed={0.2} color={GOLD} opacity={0.3} />
      </Canvas>
    </div>
  )
}
