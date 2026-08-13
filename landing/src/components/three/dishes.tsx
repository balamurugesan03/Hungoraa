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

export type DishId = 'biryani' | 'dosa' | 'butter-chicken' | 'naan' | 'pizza' | 'burger' | 'pasta' | 'dessert'

function Biryani() {
  return (
    <group>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.34, 0.28, 0.14, 32, 1, true]} />
        <meshPhysicalMaterial color="#8a6a3c" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <sphereGeometry args={[0.32, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshPhysicalMaterial color={RICE} roughness={0.6} />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2
        const r = 0.12 + (i % 3) * 0.05
        return (
          <mesh key={i} position={[Math.cos(a) * r, 0.27 + (i % 3) * 0.02, Math.sin(a) * r]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color={i % 3 === 0 ? SAFFRON : '#4a6b2e'} />
          </mesh>
        )
      })}
      <Steam position={[0, 0.42, 0]} count={6} />
    </group>
  )
}

function Dosa() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.11, 0.14, 0.85, 20, 1, true]} />
        <meshPhysicalMaterial color={DOSA_GOLD} roughness={0.4} clearcoat={0.6} clearcoatRoughness={0.3} side={THREE.DoubleSide} />
      </mesh>
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
      <Steam position={[0, 0.38, 0]} count={6} />
    </group>
  )
}

function Naan() {
  return (
    <mesh scale={[1, 0.12, 0.62]}>
      <sphereGeometry args={[0.34, 24, 16]} />
      <meshPhysicalMaterial color={NAAN} roughness={0.55} clearcoat={0.2} />
    </mesh>
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
    tag: 'Signature',
    desc: 'Long-grain basmati layered with saffron, slow-cooked spiced lamb and crisp fried onions.',
    price: '₹420',
  },
  dosa: {
    name: 'Masala Dosa',
    tag: 'South Indian',
    desc: 'Crisp fermented crepe folded over spiced potato, served with sambar and chutney.',
    price: '₹180',
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

export const dishOrder: DishId[] = ['biryani', 'dosa', 'butter-chicken', 'naan', 'pizza', 'burger', 'pasta', 'dessert']

export function DishModel({ id }: { id: DishId }) {
  switch (id) {
    case 'biryani':
      return <Biryani />
    case 'dosa':
      return <Dosa />
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
        <meshPhysicalMaterial color="#1c150e" roughness={0.3} metalness={0.15} clearcoat={0.6} clearcoatRoughness={0.25} />
      </mesh>
      <mesh position={[0, 0.006, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.008, 10, 64]} />
        <meshPhysicalMaterial color={GOLD} metalness={0.9} roughness={0.25} clearcoat={1} />
      </mesh>
    </group>
  )
}
