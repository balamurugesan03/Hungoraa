import { motion } from 'framer-motion'
import { GALLERY } from '../lib/data'
import { useReveal } from '../hooks/useReveal'

export default function Gallery() {
  const head = useReveal<HTMLDivElement>()
  return (
    <section id="gallery" className="section">
      <div ref={head} className="reveal section-head">
        <span className="eyebrow">Gallery</span>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] text-cream">
          A Glimpse <span className="gold-text">Inside</span>
        </h2>
      </div>

      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {GALLERY.map((g, i) => (
          <motion.figure
            key={g.label}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative block break-inside-avoid overflow-hidden rounded-2xl border border-gold/12"
          >
            <div
              className={`w-full transition-transform duration-[1.2s] ease-out group-hover:scale-110 ${
                g.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'
              }`}
              style={{ background: g.grad }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-[0.72rem] uppercase tracking-[0.16em] text-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {g.label}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
