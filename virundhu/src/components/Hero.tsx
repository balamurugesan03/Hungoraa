import { Suspense } from 'react'
import { motion } from 'framer-motion'
import HeroScene from './HeroScene'
import { Arrow, Play, Scroll } from './Icons'
import { SOCIALS } from '../lib/data'

const rise = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* 3D composition */}
      <div className="pointer-events-none absolute inset-0 md:pointer-events-auto">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* atmospheric vignette + smoke */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 30% 45%, transparent 30%, rgba(8,8,8,0.55) 78%), radial-gradient(ellipse 80% 60% at 50% 110%, rgba(8,8,8,0.9), transparent 60%)',
        }}
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1320px] grid-cols-1 items-center px-5 md:px-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="pt-28 pb-40 lg:py-0">
          <motion.span variants={rise} custom={0} initial="hidden" animate="show" className="eyebrow">
            Experience
          </motion.span>

          <motion.h1
            variants={rise}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-6 font-display text-[clamp(2.9rem,8vw,5.6rem)] font-bold leading-[0.95] text-cream"
          >
            SOUTH INDIA
            <span className="mt-1 block script text-[clamp(2rem,5vw,3.4rem)] gold-text">
              Like Never Before!
            </span>
          </motion.h1>

          <motion.p
            variants={rise}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-7 max-w-md text-[1.05rem] leading-relaxed text-cream-dim"
          >
            A journey of authentic flavors,
            <br />
            served with tradition and love.
          </motion.p>

          <motion.div
            variants={rise}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a href="#menu" className="btn btn-gold">
              Explore Menu <Arrow size={16} />
            </a>
            <a href="#book" className="btn btn-ghost">
              Book Your Table
            </a>
          </motion.div>

          <motion.button
            variants={rise}
            custom={4}
            initial="hidden"
            animate="show"
            className="group mt-10 flex items-center gap-4"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold transition-all group-hover:border-gold group-hover:shadow-gold-glow">
              <Play size={16} />
            </span>
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cream-dim group-hover:text-cream">
              Watch our story
            </span>
          </motion.button>
        </div>
      </div>

      {/* vertical socials */}
      <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex">
        <span className="h-14 w-px bg-gradient-to-b from-transparent to-gold/40" />
        {SOCIALS.map((s) => (
          <a
            key={s}
            href="#contact"
            className="[writing-mode:vertical-rl] text-[0.6rem] font-medium uppercase tracking-[0.24em] text-cream-dim transition-colors hover:text-gold"
          >
            {s}
          </a>
        ))}
        <span className="h-14 w-px bg-gradient-to-t from-transparent to-gold/40" />
      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-cream-dim">
        <Scroll size={20} className="animate-float-slow text-gold/80" />
        <span className="text-[0.6rem] font-medium uppercase tracking-[0.24em]">Scroll</span>
      </div>
    </section>
  )
}
