import { motion } from 'framer-motion'
import { STATES } from '../lib/data'
import { Arrow } from './Icons'
import { useReveal } from '../hooks/useReveal'

function SouthIndiaMap() {
  return (
    <svg viewBox="0 0 200 260" className="h-full w-full" aria-hidden>
      <path
        d="M96 8c14 6 20 22 18 40 12 6 22 2 30 14 6 10 2 26-6 34 8 12 6 30-4 40 6 14-2 30-12 40-4 14-16 26-30 30-16 4-30-6-38-20-10-6-22-4-28-18-6-14 0-30 10-40-8-14-4-32 8-42-6-14 2-30 14-38-4-16 6-32 22-38 3-1 6-1 8 0Z"
        fill="none"
        stroke="rgba(212,175,55,0.55)"
        strokeWidth="1.4"
      />
      {[
        [70, 60],
        [120, 90],
        [88, 140],
        [110, 190],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" fill="#d4af37">
          <animate attributeName="opacity" values="0.35;1;0.35" dur={`${2.4 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  )
}

export default function ExploreSouthIndia() {
  const head = useReveal<HTMLDivElement>()
  return (
    <section id="explore" className="section">
      <div ref={head} className="reveal section-head max-w-[720px]">
        <span className="eyebrow">Explore South India</span>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] text-cream">
          A Culinary Journey <span className="gold-text">Across Flavors</span>
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {STATES.map((s, i) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative col-span-1 overflow-hidden rounded-2xl border border-gold/12"
          >
            <div
              className="aspect-[3/4] w-full scale-100 transition-transform duration-700 ease-out group-hover:scale-110"
              style={{ background: s.grad }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h3 className="font-display text-base tracking-wide text-cream">{s.name}</h3>
              <p className="mt-1 text-[0.7rem] leading-snug text-gold-soft">
                {s.lines[0]} · {s.lines[1]}
              </p>
              <p className="mt-2 max-h-0 overflow-hidden text-[0.72rem] leading-snug text-cream-dim opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                {s.blurb}
              </p>
              <span className="mt-3 grid h-8 w-8 place-items-center rounded-full border border-gold/40 text-gold transition-colors group-hover:bg-gold group-hover:text-void">
                <Arrow size={14} />
              </span>
            </div>
          </motion.article>
        ))}

        {/* Special map card */}
        <motion.article
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass col-span-2 flex flex-col items-center justify-center gap-4 rounded-2xl p-6 text-center md:col-span-3 lg:col-span-1"
        >
          <div className="h-28 w-24">
            <SouthIndiaMap />
          </div>
          <div>
            <p className="font-display text-lg text-cream">Four States</p>
            <p className="script gold-text text-lg">Infinite Flavors</p>
          </div>
          <button className="btn btn-ghost !px-5 !py-2.5 !text-[0.65rem]">Explore All</button>
        </motion.article>
      </div>
    </section>
  )
}
