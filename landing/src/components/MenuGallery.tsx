import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { useRevealSelf } from '../hooks/useReveal'
import { DishModel, Plinth, dishMeta, dishOrder, type DishId } from './three/dishes'
import './MenuGallery.css'

const RADIUS = 3.3
const DEFAULT_CAM = new THREE.Vector3(0, 1.25, 7.6)
const FOCUS_CAM = new THREE.Vector3(0, 1.02, 3.1)

/** Tweens the R3F camera toward a wide view or a close "reveal" dolly, driven by `focusedId`. */
function CameraRig({ focused }: { focused: boolean }) {
  const { camera } = useThree()

  useEffect(() => {
    const target = focused ? FOCUS_CAM : DEFAULT_CAM
    gsap.to(camera.position, { x: target.x, y: target.y, z: target.z, duration: 1.1, ease: 'power3.inOut' })
  }, [focused, camera])

  useFrame(() => camera.lookAt(0, 0.18, 0))
  return null
}

function DishStation({
  id,
  index,
  total,
  hovered,
  onHover,
  onSelect,
}: {
  id: DishId
  index: number
  total: number
  hovered: boolean
  onHover: (i: number | null) => void
  onSelect: (i: number) => void
}) {
  const wrapRef = useRef<THREE.Group>(null!)
  const spinRef = useRef<THREE.Group>(null!)
  const angle = (index / total) * Math.PI * 2
  const x = Math.sin(angle) * RADIUS
  const z = Math.cos(angle) * RADIUS

  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * (hovered ? 0.9 : 0.35)
    if (wrapRef.current) {
      wrapRef.current.position.y = THREE.MathUtils.lerp(wrapRef.current.position.y, hovered ? 0.1 : 0, 0.1)
      const s = THREE.MathUtils.lerp(wrapRef.current.scale.x, hovered ? 1.16 : 1, 0.12)
      wrapRef.current.scale.setScalar(s)
    }
  })

  return (
    <group position={[x, 0, z]} rotation={[0, -angle, 0]}>
      <group
        ref={wrapRef}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          onHover(index)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          onHover(null)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onSelect(index)
        }}
      >
        <Plinth />
        <group ref={spinRef} position={[0, 0.24, 0]}>
          <DishModel id={id} />
        </group>
        {hovered && <pointLight position={[0, 0.6, 0.3]} intensity={1.1} color="#f3d9a0" distance={2.4} decay={2} />}
      </group>
    </group>
  )
}

function Carousel({
  focusedIndex,
  hoveredIndex,
  onHover,
  onSelect,
}: {
  focusedIndex: number | null
  hoveredIndex: number | null
  onHover: (i: number | null) => void
  onSelect: (i: number) => void
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const targetRot = useRef(0)
  const drag = useRef({ active: false, startX: 0, startRot: 0 })
  const total = dishOrder.length

  useEffect(() => {
    if (focusedIndex !== null) {
      const angle = (focusedIndex / total) * Math.PI * 2
      targetRot.current = -angle
    }
  }, [focusedIndex, total])

  useFrame((_, delta) => {
    const g = groupRef.current
    if (!g) return
    if (focusedIndex === null && !drag.current.active) {
      targetRot.current += delta * 0.025
    }
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRot.current, drag.current.active ? 1 : 0.07)
  })

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (focusedIndex !== null) return
    drag.current = { active: true, startX: e.clientX, startRot: groupRef.current.rotation.y }
  }
  const onPointerMoveCapture = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active) return
    targetRot.current = drag.current.startRot + (e.clientX - drag.current.startX) * 0.006
  }
  const endDrag = () => {
    drag.current.active = false
  }

  return (
    <group>
      <mesh position={[0, 0, -1]} onPointerDown={onPointerDown} onPointerMove={onPointerMoveCapture} onPointerUp={endDrag} onPointerOut={endDrag}>
        <planeGeometry args={[44, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={groupRef}>
        {dishOrder.map((id, i) => (
          <DishStation
            key={id}
            id={id}
            index={i}
            total={total}
            hovered={hoveredIndex === i}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </group>
    </group>
  )
}

export default function MenuGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const headRef = useRevealSelf<HTMLDivElement>()

  const focusedId = focusedIndex !== null ? dishOrder[focusedIndex] : null
  const focused = focusedId ? dishMeta[focusedId] : null

  return (
    <section id="menu" className="section menu">
      <div className="section-head" ref={headRef}>
        <span className="eyebrow">The Menu</span>
        <h2>
          Dishes you can <span className="gradient-text">walk around.</span>
        </h2>
        <p>Drag to spin the table, hover to bring a dish forward, click to step in close.</p>
      </div>

      <div className="menu__stage">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [DEFAULT_CAM.x, DEFAULT_CAM.y, DEFAULT_CAM.z], fov: 38 }}
          gl={{ alpha: true, antialias: true }}
          onPointerMissed={() => setFocusedIndex(null)}
        >
          <fog attach="fog" args={['#071522', 6, 15]} />
          <ambientLight intensity={0.5} color="#173250" />
          <directionalLight position={[3, 5, 4]} intensity={1.05} color="#a9d2f0" />
          <pointLight position={[-3, 2, -2]} intensity={0.5} color="#3f93d8" decay={2} />
          <pointLight position={[2.5, 1.5, 3]} intensity={0.35} color="#e8c27a" decay={2} />

          <CameraRig focused={focusedIndex !== null} />
          <Carousel focusedIndex={focusedIndex} hoveredIndex={hoveredIndex} onHover={setHoveredIndex} onSelect={setFocusedIndex} />
          <Sparkles count={30} scale={[8, 4, 8]} size={1.5} speed={0.25} color="#d4af6a" opacity={0.35} />
        </Canvas>

        <div className={`menu__hint ${focusedIndex !== null ? 'is-hidden' : ''}`}>Drag to rotate · Click a dish to explore</div>

        <div className={`menu__detail glass-card ${focused ? 'is-open' : ''}`}>
          {focused && (
            <>
              <button className="menu__detail-close" onClick={() => setFocusedIndex(null)} aria-label="Close dish details">
                ✕
              </button>
              <span className="menu__detail-tag">{focused.tag}</span>
              <h3>{focused.name}</h3>
              <p>{focused.desc}</p>
              <strong className="menu__detail-price">{focused.price}</strong>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
