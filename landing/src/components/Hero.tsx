import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IconArrowRight, IconBolt, IconShield, IconStar } from './Icons'
import HeroScene from './HeroScene'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero__eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(
          '.hero__title-line',
          { opacity: 0, y: 46, rotateX: 20 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.12 },
          '-=0.3',
        )
        .fromTo('.hero__subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('.hero__actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('.hero__stats > *', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
        .fromTo(
          '.hero__floating',
          { opacity: 0, y: 24, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15 },
          '-=0.5',
        )

      gsap.to('.hero__blob--a', {
        x: 40,
        y: -30,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.hero__blob--b', {
        x: -50,
        y: 40,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to(['.hero__copy', '.hero__floating'], {
        opacity: 0,
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '65% top', scrub: 0.6 },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="top" className="hero" ref={rootRef}>
      <div className="hero__blob hero__blob--a" />
      <div className="hero__blob hero__blob--b" />
      <div className="noise-grid" />
      <div className="hero__vignette" />
      <HeroScene />

      <div className="hero__floating hero__floating--a glass-card">
        <span className="hero__floating-icon">
          <IconShield size={16} />
        </span>
        <div>
          <strong>Verified</strong>
          <span>12k+ partner restaurants</span>
        </div>
      </div>

      <div className="hero__floating hero__floating--b glass-card">
        <span className="hero__floating-icon">
          <IconBolt size={16} />
        </span>
        <div>
          <strong>5-min hold</strong>
          <span>Your table, never lost</span>
        </div>
      </div>

      <div className="hero__inner">
        <div className="hero__copy">
          <span className="eyebrow hero__eyebrow">Booking + bill pay, unified</span>
          <h1 className="hero__title">
            <span className="hero__title-line">Book the table.</span>
            <span className="hero__title-line">
              Split the bill. <span className="gradient-text">Instantly.</span>
            </span>
          </h1>
          <p className="hero__subtitle">
            Hungora lets you reserve tables in seconds, unlock live restaurant offers, and pay your
            bill straight from your phone — no waiting for the check, no app-switching.
          </p>

          <div className="hero__actions">
            <a href="#download" className="btn btn-primary">
              Get the app <IconArrowRight size={18} />
            </a>
            <a href="#how-it-works" className="btn btn-ghost">
              See how it works
            </a>
          </div>

          <div className="hero__stats">
            <div>
              <strong>12k+</strong>
              <span>Partner restaurants</span>
            </div>
            <span className="hero__stats-divider" />
            <div>
              <strong>2.4M</strong>
              <span>Bills paid instantly</span>
            </div>
            <span className="hero__stats-divider" />
            <div>
              <strong>4.9<IconStar size={14} /></strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
