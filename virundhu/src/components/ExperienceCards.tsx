import { motion } from 'framer-motion'
import { EXPERIENCES } from '../lib/data'
import { Arrow, Spark, Flame, Frames, Star } from './Icons'
import { useReveal } from '../hooks/useReveal'

const GLYPH = { spark: Spark, flame: Flame, frames: Frames, star: Star }

export default function ExperienceCards() {
  const head = useReveal<HTMLDivElement>()
  return (
    <section id="experience" className="section">
      <div ref={head} className="reveal section-head">
        <span className="eyebrow">The Experience</span>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] text-cream">
          More Than <span className="gold-text">a Meal</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {EXPERIENCES.map((e, i) => {
          const G = GLYPH[e.glyph as keyof typeof GLYPH]
          return (
            <motion.article
              key={e.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group glass relative overflow-hidden rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1.5"
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.35), transparent 70%)' }}
              />
              <div className="relative flex items-start justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-gold/25 text-gold transition-all group-hover:border-gold/60 group-hover:shadow-gold-glow">
                  <G size={22} />
                </span>
                <span className="font-display text-4xl text-gold/15 transition-colors group-hover:text-gold/30">
                  0{i + 1}
                </span>
              </div>

              <h3 className="mt-6 font-display text-xl tracking-wide text-cream">{e.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream-dim">{e.body}</p>

              <button className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold">
                {e.cta}
                <span className="transition-transform group-hover:translate-x-1">
                  <Arrow size={14} />
                </span>
              </button>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
