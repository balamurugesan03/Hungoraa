import { useStaggerReveal } from '../hooks/useReveal'
import { useTilt } from '../hooks/useTilt'
import { IconBolt, IconCalendar, IconReceipt, IconShield, IconTag, IconWallet } from './Icons'
import './Features.css'

const features = [
  {
    icon: IconCalendar,
    title: 'Instant table holds',
    body: 'Reserve a table and we lock it for 5 minutes while payment confirms — never lose a booking to a slow queue.',
  },
  {
    icon: IconTag,
    title: 'Smart offer stacking',
    body: 'Restaurant, platform, and bank-funded discounts are calculated automatically so you always get the best price.',
  },
  {
    icon: IconReceipt,
    title: 'Split any way',
    body: 'Even split, by item, or custom shares — everyone at the table pays their part in one tap.',
  },
  {
    icon: IconWallet,
    title: 'Hungora Wallet',
    body: 'Top up once, pay everywhere. Refunds on cancelled bookings land back in your wallet instantly.',
  },
  {
    icon: IconBolt,
    title: 'Real-time everything',
    body: 'Live booking status, offer approvals, and payment confirmations pushed to you the second they happen.',
  },
  {
    icon: IconShield,
    title: 'Bank-grade security',
    body: 'Payments run on Razorpay with end-to-end encryption — your card details never touch our servers.',
  },
]

function FeatureCard({ icon: Icon, title, body }: (typeof features)[number]) {
  const tiltRef = useTilt<HTMLDivElement>(8)
  return (
    <div className="feature-card glass-card" ref={tiltRef}>
      <span className="feature-card__icon">
        <Icon size={22} />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  )
}

export default function Features() {
  const ref = useStaggerReveal<HTMLDivElement>({ stagger: 0.08, y: 28 })

  return (
    <section id="features" className="section features">
      <div className="section-head">
        <span className="eyebrow">Features</span>
        <h2>
          Everything a table needs, <span className="gradient-text">built in.</span>
        </h2>
        <p>One platform for the entire dine-in journey — from booking to settlement.</p>
      </div>

      <div className="features__grid" ref={ref}>
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  )
}
