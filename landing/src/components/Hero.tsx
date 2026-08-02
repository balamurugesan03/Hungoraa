import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTilt } from '../hooks/useTilt'
import { IconArrowRight, IconBolt, IconCalendar, IconReceipt, IconStar } from './Icons'
import './Hero.css'

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)
  const tiltRef = useTilt<HTMLDivElement>(10)

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
          '.hero__mockup-wrap',
          { opacity: 0, y: 60, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 1.1 },
          '-=0.9',
        )
        .fromTo('.hero__chip', { opacity: 0, scale: 0.7, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15 }, '-=0.5')

      gsap.to('.hero__chip--calendar', {
        y: -14,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.hero__chip--receipt', {
        y: 12,
        duration: 3.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.3,
      })
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
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="top" className="hero" ref={rootRef}>
      <div className="hero__blob hero__blob--a" />
      <div className="hero__blob hero__blob--b" />
      <div className="noise-grid" />

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
            <div>
              <strong>2.4M</strong>
              <span>Bills paid instantly</span>
            </div>
            <div>
              <strong>4.9<IconStar size={14} /></strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>

        <div className="hero__mockup-wrap">
          <div className="hero__mockup-stage" ref={tiltRef}>
            <div className="hero__mockup">
              <div className="hero__mockup-notch" />
              <div className="hero__mockup-header">
                <span>Good evening, Aarav</span>
                <div className="hero__mockup-avatar" />
              </div>

              <div className="hero__mockup-card hero__mockup-card--booking">
                <div className="hero__mockup-card-row">
                  <span className="eyebrow" style={{ fontSize: '0.6rem' }}>Table confirmed</span>
                  <IconCalendar size={16} />
                </div>
                <strong>Ember & Oak, Table 6</strong>
                <span className="hero__mockup-muted">Today, 8:30 PM · 4 guests</span>
              </div>

              <div className="hero__mockup-card hero__mockup-card--bill">
                <div className="hero__mockup-card-row">
                  <span className="eyebrow" style={{ fontSize: '0.6rem' }}>Bill ready</span>
                  <IconReceipt size={16} />
                </div>
                <strong>₹2,840.00</strong>
                <div className="hero__mockup-progress">
                  <div className="hero__mockup-progress-fill" />
                </div>
                <span className="hero__mockup-muted">18% off applied · Split 4 ways</span>
              </div>

              <button className="hero__mockup-pay">
                Pay ₹710.00 <IconArrowRight size={16} />
              </button>
            </div>

            <div className="hero__mockup-glow" />
          </div>

          <div className="hero__chip hero__chip--calendar glass-card">
            <IconBolt size={16} />
            Table held for 5 min
          </div>
          <div className="hero__chip hero__chip--receipt glass-card">
            <IconReceipt size={16} />
            Split & pay in 10s
          </div>
        </div>
      </div>
    </section>
  )
}
