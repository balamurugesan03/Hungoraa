import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStaggerReveal } from '../hooks/useReveal'
import { useTilt } from '../hooks/useTilt'
import { IconBolt, IconCalendar, IconReceipt } from './Icons'
import './HowItWorks.css'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    icon: IconCalendar,
    step: '01',
    title: 'Find & hold your table',
    body: 'Search nearby restaurants, pick a slot, and we hold your table for 5 minutes while you confirm — no more turning up to a walk-in queue.',
  },
  {
    icon: IconBolt,
    step: '02',
    title: 'Unlock live offers',
    body: 'Apply restaurant, platform, or bank-funded offers automatically — the best available discount is applied before you even ask.',
  },
  {
    icon: IconReceipt,
    step: '03',
    title: 'Split & pay the bill',
    body: 'Scan the table QR, review the itemized bill, split it your way, and pay — the restaurant gets settled automatically in the background.',
  },
]

function Step({ icon: Icon, step, title, body }: (typeof steps)[number]) {
  const tiltRef = useTilt<HTMLDivElement>(6)
  return (
    <div className="how__step glass-card" ref={tiltRef}>
      <span className="how__step-ghost" aria-hidden="true">
        {step}
      </span>
      <div className="how__step-top">
        <span className="how__step-icon">
          <Icon size={22} />
        </span>
        <span className="how__step-num">{step}</span>
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  )
}

export default function HowItWorks() {
  const rootRef = useRef<HTMLDivElement>(null)
  const connectorRef = useRef<HTMLDivElement>(null)
  const ref = useStaggerReveal<HTMLDivElement>({ stagger: 0.16 })

  useEffect(() => {
    const el = connectorRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 55%', scrub: 0.6 },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" className="section how" ref={rootRef}>
      <div className="section-head">
        <span className="eyebrow">How it works</span>
        <h2>From hungry to seated to paid — three taps.</h2>
        <p>No paperwork at the table, no waiting for a card machine, no splitting arguments.</p>
      </div>

      <div className="how__steps-wrap">
        <div className="how__connector-track" aria-hidden="true">
          <div className="how__connector" ref={connectorRef} />
        </div>
        <div className="how__steps" ref={ref}>
          {steps.map((s) => (
            <Step key={s.step} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
