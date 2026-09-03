import * as THREE from 'three'
import Steam from './Steam'

const GOLD = '#d4af6a'
const RICE = '#f3e3b8'
const SAFFRON = '#e8a33d'
const CHICKEN_BROWN = '#7a4a2b'
const TOMATO_SAUCE = '#c1522a'
const DOSA_GOLD = '#d9a441'
const NAAN = '#e3c07f'
const PIZZA_CRUST = '#d8a35a'
const PIZZA_SAUCE = '#a33a24'
const CHEESE = '#f0d385'
const PEPPERONI = '#8a2f1f'
const BUN = '#d9a850'
const PATTY = '#4a3223'
const LETTUCE = '#5f8a3f'
const PASTA_NOODLE = '#e8d18f'
const CHOCOLATE = '#3b2416'
const CREAM = '#f3ead9'
const BERRY = '#8c1f3a'
const GLASS = '#cbd8dd'

// South-Indian palette
const PLATE = '#efe9dd'
const BOWL_CLAY = '#cdbfa4'
const SAMBAR = '#c65a24'
const COCONUT_CHUTNEY = '#f4efe6'
const POTATO_MASALA = '#e0a838'
const DOSA_BROWN = '#8a4a1c'
const BANANA_LEAF = '#2f5d2a'
const IDLI_WHITE = '#f6f3ea'
const VADA_GOLD = '#c6893c'
const EGG_WHITE = '#f5efe0'
const YOLK = '#f0b64a'
const MINT = '#3f7d3a'
const FRIED_ONION = '#7c4a1e'
const CURRY_LEAF = '#2f6a33'

export type DishId =
  | 'biryani'
  | 'dosa'
  | 'idli-vada'
  | 'butter-chicken'
  | 'naan'
  | 'pizza'
  | 'burger'
  | 'pasta'
  | 'dessert'

/** A small stoneware katori (bowl) with a glossy liquid surface — reused for
 * sambar, chutney and raita across the South-Indian plates. */
function Katori({
  position = [0, 0, 0],
  radius = 0.11,
  fill,
  glossy = true,
  steam = 0,
}: {
  position?: [number, number, number]
  radius?: number
  fill: string
  glossy?: boolean
  steam?: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[radius, 24, 16, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
        <meshPhysicalMaterial color={BOWL_CLAY} roughness={0.35} clearcoat={0.5} clearcoatRoughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.028, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.86, 24]} />
        {glossy ? (
          <meshPhysicalMaterial color={fill} roughness={0.18} clearcoat={0.9} clearcoatRoughness={0.15} />
        ) : (
          <meshStandardMaterial color={fill} roughness={0.7} />
        )}
      </mesh>
      {steam > 0 && <Steam position={[0, radius + 0.04, 0]} count={steam} height={0.6} />}
    </group>
  )
}

function Biryani() {
  return (
    <group>
      {/* Copper handi — two stacked bulged rings + a brass lip */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.12, 44]} />
        <meshPhysicalMaterial color="#9c6a3a" metalness={0.85} roughness={0.3} clearcoat={0.55} clearcoatRoughness={0.25} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.34, 0.3, 0.1, 44]} />
        <meshPhysicalMaterial color="#b47f47" metalness={0.9} roughness={0.24} clearcoat={0.7} clearcoatRoughness={0.2} />
      </mesh>
      <mesh position={[0, 0.185, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.33, 0.02, 12, 44]} />
        <meshPhysicalMaterial color={GOLD} metalness={0.95} roughness={0.18} clearcoat={1} />
      </mesh>

      {/* Rice mound */}
      <mesh position={[0, 0.19, 0]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[0.315, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={RICE} roughness={0.9} flatShading />
      </mesh>
      {/* Saffron-stained patches on the mound */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 + 0.7
        const r = 0.12 + (i % 2) * 0.08
        return (
          <mesh key={`sf${i}`} position={[Math.cos(a) * r, 0.21 + (i % 2) * 0.02, Math.sin(a) * r]} rotation={[-Math.PI / 2, 0, a]} scale={[1, 0.7, 1]}>
            <circleGeometry args={[0.07, 16]} />
            <meshStandardMaterial color={SAFFRON} roughness={0.8} transparent opacity={0.6} />
          </mesh>
        )
      })}

      {/* Individual grains — elongated specks in rice / saffron / browned tones */}
      {Array.from({ length: 40 }).map((_, i) => {
        const a = i * 2.399963
        const r = 0.04 + (i % 8) * 0.032
        const y = 0.205 + Math.cos(r * 7) * 0.05 + (i % 3) * 0.014
        const c = i % 5 === 0 ? SAFFRON : i % 7 === 0 ? '#6a4a2a' : i % 3 === 0 ? '#fff6e0' : RICE
        return (
          <mesh key={`g${i}`} position={[Math.cos(a) * r, y, Math.sin(a) * r]} rotation={[a, a * 0.7, a * 0.3]} scale={[0.008, 0.008, 0.032]}>
            <sphereGeometry args={[1, 6, 5]} />
            <meshStandardMaterial color={c} roughness={0.65} />
          </mesh>
        )
      })}

      {/* Boiled-egg half */}
      <mesh position={[0.13, 0.25, 0.07]} scale={[0.75, 0.95, 0.75]}>
        <sphereGeometry args={[0.062, 18, 14]} />
        <meshPhysicalMaterial color={EGG_WHITE} roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0.13, 0.3, 0.07]} scale={[0.62, 0.32, 0.62]}>
        <sphereGeometry args={[0.045, 14, 12]} />
        <meshStandardMaterial color={YOLK} roughness={0.55} />
      </mesh>

      {/* Fried-onion curls */}
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2 + 0.3
        return (
          <mesh key={`o${i}`} position={[Math.cos(a) * 0.16, 0.24 + (i % 2) * 0.025, Math.sin(a) * 0.16]} rotation={[0.4, a, 0.6]}>
            <torusGeometry args={[0.028, 0.006, 6, 12, Math.PI * 1.4]} />
            <meshStandardMaterial color={FRIED_ONION} roughness={0.6} />
          </mesh>
        )
      })}

      {/* Mint leaves */}
      {Array.from({ length: 4 }).map((_, i) => {
        const a = i * 1.9 + 0.4
        return (
          <mesh key={`m${i}`} position={[Math.cos(a) * 0.1, 0.285, Math.sin(a) * 0.1]} rotation={[0.5, a, 0.2]} scale={[0.03, 0.008, 0.055]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color={MINT} roughness={0.55} />
          </mesh>
        )
      })}

      {/* Whole spices — cinnamon quill + bay leaf */}
      <mesh position={[-0.09, 0.235, 0.11]} rotation={[0, 0.6, Math.PI / 2]}>
        <cylinderGeometry args={[0.011, 0.011, 0.15, 8]} />
        <meshStandardMaterial color="#6b3a1c" roughness={0.85} />
      </mesh>
      <mesh position={[-0.13, 0.235, -0.06]} rotation={[-Math.PI / 2, 0, 0.7]} scale={[0.5, 1, 1]}>
        <circleGeometry args={[0.06, 3]} />
        <meshStandardMaterial color="#4e6b32" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      <Steam position={[0, 0.44, 0]} count={7} />
    </group>
  )
}

function Dosa() {
  return (
    <group position={[0, 0.01, 0]}>
      {/* Ceramic plate */}
      <mesh position={[0, -0.006, 0]}>
        <cylinderGeometry args={[0.45, 0.41, 0.028, 48]} />
        <meshPhysicalMaterial color={PLATE} roughness={0.3} clearcoat={0.7} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0, 0.006, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.006, 8, 48]} />
        <meshStandardMaterial color="#d8cdb8" roughness={0.5} />
      </mesh>

      {/* Rolled masala dosa — a long tapered crepe lying across the plate */}
      <group rotation={[0, 0.5, 0]} position={[-0.02, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.02, 0.1, 0]}>
          <cylinderGeometry args={[0.07, 0.115, 0.82, 30, 5, true]} />
          <meshPhysicalMaterial
            color={DOSA_GOLD}
            roughness={0.42}
            clearcoat={0.3}
            clearcoatRoughness={0.45}
            side={THREE.DoubleSide}
            flatShading
          />
        </mesh>

        {/* Crisp folded flap running along the top */}
        <mesh position={[0.06, 0.17, 0]} rotation={[0, 0, -0.22]} scale={[0.52, 0.035, 0.26]}>
          <sphereGeometry args={[0.42, 22, 12]} />
          <meshPhysicalMaterial color="#e4b25a" roughness={0.45} clearcoat={0.25} flatShading />
        </mesh>

        {/* Open wide end — dark crisp rim + potato masala peeking out */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.36, 0.1, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.018, 24]} />
          <meshStandardMaterial color={DOSA_BROWN} roughness={0.75} />
        </mesh>
        <mesh position={[-0.37, 0.08, 0]} scale={[0.95, 0.7, 0.95]}>
          <icosahedronGeometry args={[0.08, 1]} />
          <meshStandardMaterial color={POTATO_MASALA} roughness={0.8} flatShading />
        </mesh>
        {/* mustard seeds / curry-leaf fleck in the masala */}
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh key={`ms${i}`} position={[-0.37 + (i - 1) * 0.02, 0.11, (i - 1) * 0.02]} scale={0.01}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshStandardMaterial color={i === 1 ? CURRY_LEAF : '#3a2a18'} roughness={0.7} />
          </mesh>
        ))}

        {/* Griddle browning — mottled scorch spots across the crepe */}
        {Array.from({ length: 14 }).map((_, i) => {
          const t = (i / 14) * 0.72 - 0.36
          const a = i * 2.35
          return (
            <mesh
              key={`b${i}`}
              position={[t, 0.1 + Math.sin(a) * 0.065, Math.cos(a) * 0.1]}
              scale={[0.028, 0.01, 0.028]}
            >
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial color={i % 2 ? '#7c3f16' : '#a85f24'} roughness={0.85} />
            </mesh>
          )
        })}
      </group>

      {/* Sambar katori (steaming) + coconut chutney katori */}
      <Katori position={[0.32, 0, 0.26]} radius={0.12} fill={SAMBAR} steam={4} />
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`sv${i}`} position={[0.32 + Math.cos(i * 1.6) * 0.05, 0.05, 0.26 + Math.sin(i * 2.1) * 0.05]} scale={0.016}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={i % 2 ? '#e0902c' : '#5f8a3f'} roughness={0.7} />
        </mesh>
      ))}
      <Katori position={[0.3, 0, -0.27]} radius={0.1} fill={COCONUT_CHUTNEY} glossy={false} />
      {/* tempering on the chutney */}
      <mesh position={[0.3, 0.052, -0.27]} rotation={[-Math.PI / 2, 0, 0.6]} scale={[0.5, 1, 1]}>
        <circleGeometry args={[0.03, 3]} />
        <meshStandardMaterial color={CURRY_LEAF} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function IdliVada() {
  return (
    <group position={[0, 0.008, 0]}>
      {/* Banana-leaf plate over a thin steel thali */}
      <mesh position={[0, -0.01, 0]}>
        <cylinderGeometry args={[0.44, 0.42, 0.02, 40]} />
        <meshPhysicalMaterial color="#c9ccd0" metalness={0.6} roughness={0.35} clearcoat={0.4} />
      </mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0.25]}>
        <planeGeometry args={[0.86, 0.58]} />
        <meshStandardMaterial color={BANANA_LEAF} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0.25]}>
        <planeGeometry args={[0.8, 0.012]} />
        <meshStandardMaterial color="#7fae5a" roughness={0.5} />
      </mesh>

      {/* Two steamed idlis */}
      {([[-0.24, 0.11], [-0.03, -0.06]] as const).map(([x, z], i) => (
        <group key={i} position={[x, 0.055, z]}>
          <mesh scale={[1, 0.52, 1]}>
            <sphereGeometry args={[0.125, 28, 18]} />
            <meshStandardMaterial color={IDLI_WHITE} roughness={0.9} flatShading />
          </mesh>
          <Steam position={[0, 0.11, 0]} count={3} height={0.55} />
        </group>
      ))}

      {/* One crisp medu vada (doughnut) */}
      <group position={[0.24, 0.06, 0.15]} rotation={[Math.PI / 2, 0, 0.3]}>
        <mesh>
          <torusGeometry args={[0.1, 0.052, 14, 28]} />
          <meshPhysicalMaterial color={VADA_GOLD} roughness={0.5} clearcoat={0.22} clearcoatRoughness={0.5} flatShading />
        </mesh>
        {/* browned ridges */}
        {Array.from({ length: 7 }).map((_, i) => {
          const a = (i / 7) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.1, Math.sin(a) * 0.1, 0]} scale={[0.02, 0.02, 0.02]}>
              <sphereGeometry args={[1, 6, 6]} />
              <meshStandardMaterial color="#9a5f24" roughness={0.85} />
            </mesh>
          )
        })}
      </group>

      {/* Sambar + coconut chutney */}
      <Katori position={[0.3, 0, -0.18]} radius={0.1} fill={SAMBAR} steam={3} />
      <Katori position={[-0.34, 0, -0.16]} radius={0.09} fill={COCONUT_CHUTNEY} glossy={false} />
    </group>
  )
}

function ButterChicken() {
  return (
    <group>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.3, 0.24, 0.14, 32, 1, true]} />
        <meshStandardMaterial color="#b8862f" metalness={0.4} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28, 32]} />
        <meshPhysicalMaterial color={TOMATO_SAUCE} roughness={0.25} clearcoat={0.9} clearcoatRoughness={0.15} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.14, 0.13, Math.sin(a) * 0.14]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color={CHICKEN_BROWN} roughness={0.6} />
          </mesh>
        )
      })}
      {/* cream swirl + coriander */}
      <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.12, 24, 1, 0, Math.PI * 1.4]} />
        <meshStandardMaterial color={CREAM} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <Steam position={[0, 0.38, 0]} count={6} />
    </group>
  )
}

function Naan() {
  return (
    <group rotation={[0, 0.4, 0]}>
      <mesh scale={[1, 0.12, 0.62]}>
        <sphereGeometry args={[0.34, 24, 16]} />
        <meshPhysicalMaterial color={NAAN} roughness={0.55} clearcoat={0.2} flatShading />
      </mesh>
      {/* char blisters + garlic-butter flecks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = i * 2.1
        const r = 0.06 + (i % 3) * 0.07
        return (
          <mesh key={i} position={[Math.cos(a) * r, 0.045, Math.sin(a) * r * 0.62]} scale={[0.03, 0.006, 0.03]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color={i % 3 === 0 ? '#5a3a1e' : '#3f7d3a'} roughness={0.8} />
          </mesh>
        )
      })}
    </group>
  )
}

function Pizza() {
  return (
    <group position={[0, 0.03, 0]}>
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 48]} />
        <meshStandardMaterial color={PIZZA_CRUST} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.01, 48]} />
        <meshStandardMaterial color={PIZZA_SAUCE} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.01, 48]} />
        <meshPhysicalMaterial color={CHEESE} roughness={0.3} clearcoat={0.5} transparent opacity={0.92} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.2, 0.045, Math.sin(a) * 0.2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.008, 16]} />
            <meshStandardMaterial color={PEPPERONI} />
          </mesh>
        )
      })}
    </group>
  )
}

function Burger() {
  return (
    <group position={[0, 0.02, 0]}>
      <mesh>
        <sphereGeometry args={[0.26, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={BUN} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.06, 32]} />
        <meshStandardMaterial color={LETTUCE} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.05, 32]} />
        <meshStandardMaterial color={PATTY} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.42, 0.015, 0.42]} />
        <meshPhysicalMaterial color={CHEESE} roughness={0.3} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <sphereGeometry args={[0.24, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={BUN} roughness={0.45} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.14, 0.34, Math.sin(a) * 0.14]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshStandardMaterial color={RICE} />
          </mesh>
        )
      })}
    </group>
  )
}

function Pasta() {
  return (
    <group position={[0, 0.04, 0]}>
      <mesh>
        <cylinderGeometry args={[0.32, 0.26, 0.12, 32, 1, true]} />
        <meshStandardMaterial color="#e8e0cf" side={THREE.DoubleSide} roughness={0.35} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.13, 0.08 + i * 0.01, Math.sin(a) * 0.13]}
            rotation={[i, a, 0]}
          >
            <torusKnotGeometry args={[0.06, 0.018, 32, 4, 1, 2]} />
            <meshPhysicalMaterial color={PASTA_NOODLE} roughness={0.35} clearcoat={0.4} />
          </mesh>
        )
      })}
      <mesh position={[0.1, 0.14, 0.05]}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshStandardMaterial color={CHICKEN_BROWN} />
      </mesh>
      <Steam position={[0, 0.32, 0]} count={5} />
    </group>
  )
}

function Dessert() {
  return (
    <group position={[0, 0.02, 0]}>
      <mesh>
        <cylinderGeometry args={[0.18, 0.15, 0.32, 32, 1, true]} />
        <meshPhysicalMaterial color={GLASS} transparent opacity={0.25} roughness={0.05} clearcoat={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.12, 32]} />
        <meshStandardMaterial color={CHOCOLATE} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} />
        <meshStandardMaterial color={CREAM} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshPhysicalMaterial color={BERRY} roughness={0.3} clearcoat={0.6} />
      </mesh>
    </group>
  )
}

export const dishMeta: Record<DishId, { name: string; tag: string; desc: string; price: string }> = {
  biryani: {
    name: 'Hyderabadi Biryani',
    tag: 'South Indian',
    desc: 'Long-grain basmati layered with saffron, slow-cooked spiced meat, fried onions and a boiled egg — sealed and dum-cooked in a copper handi.',
    price: '₹420',
  },
  dosa: {
    name: 'Masala Dosa',
    tag: 'South Indian',
    desc: 'Crisp golden fermented crepe folded over mustard-tempered potato masala, served with sambar and coconut chutney.',
    price: '₹180',
  },
  'idli-vada': {
    name: 'Idli Vada',
    tag: 'South Indian',
    desc: 'Cloud-soft steamed rice-and-lentil cakes with a crisp medu vada, sambar and coconut chutney on a banana leaf.',
    price: '₹120',
  },
  'butter-chicken': {
    name: 'Butter Chicken',
    tag: 'North Indian',
    desc: 'Tandoor-charred chicken simmered in a velvety tomato-butter gravy.',
    price: '₹360',
  },
  naan: {
    name: 'Garlic Naan',
    tag: 'Tandoor',
    desc: 'Pillow-soft leavened bread, brushed with garlic butter straight off the tandoor.',
    price: '₹90',
  },
  pizza: {
    name: 'Wood-Fired Pizza',
    tag: 'Italian',
    desc: 'Charred thin crust, slow-roasted tomato, buffalo mozzarella and basil.',
    price: '₹390',
  },
  burger: {
    name: 'Smokehouse Burger',
    tag: 'Grill',
    desc: 'Double-stacked patty, aged cheddar and house sauce on a brioche bun.',
    price: '₹340',
  },
  pasta: {
    name: 'Truffle Pasta',
    tag: 'Italian',
    desc: 'Hand-rolled pasta tossed in a black truffle cream sauce.',
    price: '₹410',
  },
  dessert: {
    name: 'Chocolate Fondant',
    tag: 'Dessert',
    desc: 'Warm molten chocolate cake layered with vanilla bean cream.',
    price: '₹220',
  },
}

export const dishOrder: DishId[] = [
  'biryani',
  'dosa',
  'idli-vada',
  'butter-chicken',
  'naan',
  'pizza',
  'burger',
  'pasta',
  'dessert',
]

export function DishModel({ id }: { id: DishId }) {
  switch (id) {
    case 'biryani':
      return <Biryani />
    case 'dosa':
      return <Dosa />
    case 'idli-vada':
      return <IdliVada />
    case 'butter-chicken':
      return <ButterChicken />
    case 'naan':
      return <Naan />
    case 'pizza':
      return <Pizza />
    case 'burger':
      return <Burger />
    case 'pasta':
      return <Pasta />
    case 'dessert':
      return <Dessert />
    default:
      return null
  }
}

/** A small premium pedestal — a dark marble/wood top with a brass rim —
 * that every dish floats above. */
export function Plinth() {
  return (
    <group>
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 0.05, 48]} />
        <meshPhysicalMaterial color="#0c1a26" roughness={0.28} metalness={0.2} clearcoat={0.6} clearcoatRoughness={0.25} />
      </mesh>
      <mesh position={[0, 0.006, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.008, 10, 64]} />
        <meshPhysicalMaterial color={GOLD} metalness={0.9} roughness={0.25} clearcoat={1} />
      </mesh>
    </group>
  )
}
