import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DISHES, type MenuCategory } from '../lib/data'
import { Heart } from './Icons'
import { useReveal } from '../hooks/useReveal'

const CATS: MenuCategory[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'DESSERTS', 'BEVERAGES']

const DISC: Record<string, string> = {
  dosa: 'radial-gradient(circle at 35% 30%, #e6b45c, #7a3f12 75%)',
  'idli-vada': 'radial-gradient(circle at 35% 30%, #f2ead6, #8a6a3c 78%)',
  biryani: 'radial-gradient(circle at 35% 30%, #f0d38a, #6a3d18 78%)',
  'butter-chicken': 'radial-gradient(circle at 35% 30%, #d9702f, #4a1c10 78%)',
  naan: 'radial-gradient(circle at 35% 30%, #e7c98a, #7c5a2c 78%)',
  dessert: 'radial-gradient(circle at 35% 30%, #e7cf9e, #4a2f16 78%)',
}

function DishCard({ dish, i }: { dish: (typeof DISHES)[number]; i: number }) {
  const [fav, setFav] = useState(false)
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
      style={{ perspective: '900px' }}
    >
      <div className="glass rounded-3xl p-5 transition-transform duration-500 ease-out group-hover:[transform:rotateX(6deg)_rotateY(-8deg)]">
        <div className="relative mx-auto h-28 w-28">
          <div
            className="h-full w-full rounded-full shadow-[0_18px_40px_-14px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105 group-hover:[transform:translateZ(40px)]"
            style={{ background: DISC[dish.model] ?? DISC.biryani }}
          />
          <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-gold/40" />
          <span
            className="pointer-events-none absolute -inset-2 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.4), transparent 70%)' }}
          />
        </div>

        <div className="mt-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg leading-tight text-cream">{dish.name}</h3>
            <p className="mt-1 text-[0.72rem] leading-snug text-cream-dim">{dish.desc}</p>
          </div>
          <button
            onClick={() => setFav((v) => !v)}
            aria-label="Add to favorites"
            className={`shrink-0 transition-colors ${fav ? 'text-gold' : 'text-cream-dim hover:text-gold'}`}
          >
            <Heart size={18} className={fav ? 'fill-current' : ''} />
          </button>
        </div>
        <p className="mt-4 font-display text-xl gold-text">{dish.price}</p>
      </div>
    </motion.article>
  )
}

export default function MenuExperience() {
  const head = useReveal<HTMLDivElement>()
  const [cat, setCat] = useState<MenuCategory>('BREAKFAST')
  const list = useMemo(() => DISHES.filter((d) => d.cat === cat), [cat])

  return (
    <section id="menu" className="section">
      <div ref={head} className="reveal section-head">
        <span className="eyebrow">The Menu</span>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] text-cream">
          Flavours That <span className="gold-text">Float</span>
        </h2>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-all ${
              cat === c ? 'border-gold/70 bg-gold/10 text-cream' : 'border-gold/15 text-cream-dim hover:border-gold/40'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((d, i) => (
            <DishCard key={d.name} dish={d} i={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
