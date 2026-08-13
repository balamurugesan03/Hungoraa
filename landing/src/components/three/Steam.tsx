import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type SteamProps = {
  position?: [number, number, number]
  count?: number
  color?: string
  height?: number
}

/**
 * Cheap rising/fading steam wisps — small spheres that loop upward and fade
 * out, no textures or particle-shader assets required. Used above hot dishes
 * and the distant kitchen glow.
 */
export default function Steam({ position = [0, 0, 0], count = 7, color = '#f3ead9', height = 0.9 }: SteamProps) {
  const group = useRef<THREE.Group>(null!)
  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        seed: Math.random() * 10,
        x: (Math.random() - 0.5) * 0.14,
        z: (Math.random() - 0.5) * 0.14,
        speed: 0.14 + Math.random() * 0.1,
        scale: 0.05 + Math.random() * 0.05,
      })),
    [count],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const g = group.current
    if (!g) return
    g.children.forEach((mesh, i) => {
      const p = particles[i]
      const life = (t * p.speed + p.seed) % 1
      mesh.position.set(p.x + Math.sin(t * 0.6 + p.seed) * 0.05, life * height, p.z)
      const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial
      mat.opacity = Math.sin(life * Math.PI) * 0.3
      const s = p.scale * (0.6 + life)
      mesh.scale.setScalar(s)
    })
  })

  return (
    <group ref={group} position={position}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}
