import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { IconArrowRight, IconClock, IconStar } from './Icons'
import './Hero.css'

const U = (id: string) => `https://images.unsplash.com/${id}?w=760&q=74&auto=format&fit=crop`

const stats = [
  { v: '12,400+', l: 'Partner restaurants' },
  { v: '2.4M', l: 'Bills settled' },
  { v: '4.9', l: 'Avg. diner rating' },
]

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })
      tl.from('.hero__eyebrow', { opacity: 0, y: 14 })
        .from('.hero__title .line > span', { yPercent: 116, stagger: 0.08, duration: 0.9 }, '-=0.4')
        .from('.hero__subtitle', { opacity: 0, y: 16 }, '-=0.55')
        .from('.hero__actions > *', { opacity: 0, y: 16, stagger: 0.08 }, '-=0.5')
        .from('.hero__stats > *', { opacity: 0, y: 14, stagger: 0.08 }, '-=0.45')
        .from('.hero__frame', { opacity: 0, y: 30, scale: 0.96, stagger: 0.12, duration: 1 }, '-=0.9')
        .from('.hero__chip', { opacity: 0, y: 12, stagger: 0.12 }, '-=0.5')
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="top" className="hero" ref={rootRef}>
      <div className="hero__inner">
        <div className="hero__copy">
          <span className="eyebrow hero__eyebrow">Reservations &amp; bill pay, unified</span>

          <h1 className="hero__title">
            <span className="line"><span>Walk in.</span></span>
            <span className="line"><span>Sit down.</span></span>
            <span className="line">
              <span>Settle up <span className="accent">instantly.</span></span>
            </span>
          </h1>

          <p className="hero__subtitle">
            Hungora reserves your table in seconds, applies every live restaurant offer automatically,
            and lets the whole table split and pay the bill without waiting on the check.
          </p>

          <div className="hero__actions">
            <a href="#download" className="btn btn-primary">
              Get the app <IconArrowRight size={16} />
            </a>
            <a href="#how-it-works" className="btn btn-ghost">
              How it works
            </a>
          </div>

          <div className="hero__stats">
            {stats.map((s) => (
              <div key={s.l}>
                <strong className="mono">{s.v}</strong>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__art">
          <figure className="hero__frame hero__frame--main">
            <img src={U('photo-1589302168068-964664d93dc0')} alt="Hyderabadi biryani" loading="eager" />
          </figure>
          <figure className="hero__frame hero__frame--sub">
            <img src={U('photo-1565299624946-b28f40a0ae38')} alt="Wood-fired pizza" loading="eager" />
          </figure>

          <div className="hero__chip hero__chip--hold">
            <IconClock size={14} />
            <div>
              <strong className="mono">Table held · 4:52</strong>
              <span>Ember &amp; Oak, tonight 8:30</span>
            </div>
          </div>

          <div className="hero__chip hero__chip--rating">
            <span className="hero__stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStar key={i} size={11} />
              ))}
            </span>
            <span className="mono">4.9 · 2.4M bills settled</span>
          </div>
        </div>
      </div>
    </section>
  )
}
