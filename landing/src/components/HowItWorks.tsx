import { useStaggerReveal } from '../hooks/useReveal'
import { IconBolt, IconCalendar, IconReceipt } from './Icons'
import './HowItWorks.css'

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

export default function HowItWorks() {
  const ref = useStaggerReveal<HTMLDivElement>({ stagger: 0.16 })

  return (
    <section id="how-it-works" className="section how">
      <div className="section-head">
        <span className="eyebrow">How it works</span>
        <h2>From hungry to seated to paid — three taps.</h2>
        <p>No paperwork at the table, no waiting for a card machine, no splitting arguments.</p>
      </div>

      <div className="how__steps" ref={ref}>
        {steps.map(({ icon: Icon, step, title, body }) => (
          <div className="how__step glass-card" key={step}>
            <div className="how__step-top">
              <span className="how__step-icon">
                <Icon size={22} />
              </span>
              <span className="how__step-num">{step}</span>
            </div>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
        <div className="how__connector" aria-hidden="true" />
      </div>
    </section>
  )
}
