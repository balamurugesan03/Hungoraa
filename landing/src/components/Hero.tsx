import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { IconArrowRight } from './Icons'
import banner from '../assets/banner.png'
import './Hero.css'

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
        .from('.hero__banner', { opacity: 0, y: 30, scale: 0.96, duration: 1 }, '-=0.9')
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
          <img className="hero__banner" src={banner} alt="Hungora — table reserved, bill split and paid instantly" loading="eager" />
        </div>
      </div>
    </section>
  )
}
