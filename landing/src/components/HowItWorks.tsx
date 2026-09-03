import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStaggerReveal } from '../hooks/useReveal'
import { IconBolt, IconCalendar, IconReceipt } from './Icons'
import './HowItWorks.css'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    icon: IconCalendar,
    step: '01',
    title: 'Find & hold your table',
    body: 'Search nearby restaurants, pick a slot, and we hold the table for 5 minutes while you confirm — no walk-in queue, no calling ahead.',
    meta: '5:00 hold timer',
  },
  {
    icon: IconBolt,
    step: '02',
    title: 'Offers apply themselves',
    body: 'Restaurant, platform, and bank-funded discounts are calculated automatically — the best available price is locked before you ask.',
    meta: 'Auto-stacked',
  },
  {
    icon: IconReceipt,
    step: '03',
    title: 'Split & settle the bill',
    body: 'Scan the table QR, review the itemised bill, split it any way, and pay. The restaurant is settled automatically in the background.',
    meta: 'Instant settlement',
  },
]

export default function HowItWorks() {
  const rootRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const stepsRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.14 })

  useEffect(() => {
    const el = lineRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top 62%', end: 'bottom 78%', scrub: 0.6 },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" className="section how" ref={rootRef}>
      <div className="section-head">
        <span className="eyebrow">How it works</span>
        <h2>Hungry to seated to settled — three taps.</h2>
        <p>No paperwork at the table. No waiting on a card machine. No splitting argument.</p>
      </div>

      <div className="how__timeline">
        <div className="how__rail" aria-hidden="true">
          <div className="how__rail-fill" ref={lineRef} />
        </div>

        <div className="how__steps" ref={stepsRef}>
          {steps.map(({ icon: Icon, step, title, body, meta }) => (
            <div className="how__step" key={step}>
              <div className="how__node" aria-hidden="true">
                <span className="how__node-num mono">{step}</span>
              </div>
              <div className="how__card panel ticks spotlight" onMouseMove={spotlight}>
                <div className="how__card-top">
                  <span className="how__card-icon">
                    <Icon size={20} />
                  </span>
                  <span className="how__card-meta mono">{meta}</span>
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function spotlight(e: React.MouseEvent<HTMLDivElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
}
