import { useStaggerReveal, useRevealSelf } from '../hooks/useReveal'
import { useTilt } from '../hooks/useTilt'
import {
  IconFork,
  IconHandshake,
  IconScale,
  IconUsers,
  IconSparkle,
  IconHeart,
  IconAward,
  IconEye,
  IconCompass,
  IconArrowRight,
} from './Icons'
import './About.css'

const values = [
  { icon: IconScale, title: 'Transparency', body: 'Honest pricing and genuine value — the menu price you see is the price you pay.' },
  { icon: IconUsers, title: 'Customer First', body: 'Every decision we make begins with what’s best for the diner.' },
  { icon: IconHandshake, title: 'Restaurant Partnership', body: 'Growing together through fair, low-commission collaboration.' },
  { icon: IconSparkle, title: 'Innovation', body: 'Simplifying the entire dining journey through thoughtful technology.' },
  { icon: IconHeart, title: 'Trust', body: 'Building lasting relationships with customers and partners alike.' },
  { icon: IconAward, title: 'Excellence', body: 'Delivering an exceptional experience, every reservation, every time.' },
]

function ValueCard({ icon: Icon, title, body }: (typeof values)[number]) {
  const tiltRef = useTilt<HTMLDivElement>(6)
  return (
    <div className="value-card glass-card" ref={tiltRef}>
      <span className="value-card__icon">
        <Icon size={20} />
      </span>
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  )
}

export default function About() {
  const promiseRef = useRevealSelf<HTMLDivElement>()
  const splitRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.15, y: 32 })
  const valuesRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.06, y: 24 })
  const vmRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.15, y: 32 })

  return (
    <section id="about" className="section about">
      <div className="section-head">
        <span className="eyebrow">About Hungora</span>
        <h2>
          Trust in every reservation. <span className="gradient-text">Value in every meal.</span>
        </h2>
        <p>
          Hungora is India&rsquo;s next-generation restaurant discovery, table reservation, dine-in, takeaway, and
          digital payment platform — built to make dining more transparent, affordable, and rewarding for everyone.
          Every reservation begins with trust: the menu price, genuine restaurant-backed discounts, no hidden fees.
        </p>
      </div>

      <div className="about__promise glass-card" ref={promiseRef}>
        <div className="noise-grid" />
        <span className="about__promise-eyebrow">Our brand promise</span>
        <h3>
          Bringing hospitality and technology <span className="gradient-text">together.</span>
        </h3>
        <p>Trust in every reservation. Value in every meal.</p>
      </div>

      <div className="about__split" ref={splitRef}>
        <div className="about__split-card glass-card">
          <span className="about__split-icon">
            <IconFork size={22} />
          </span>
          <h3>For diners</h3>
          <p>A customer-first experience with elite dining value baked into every booking.</p>
          <ul>
            <li>
              <IconArrowRight size={14} /> Pay the real menu price — no inflated numbers, no hidden fees
            </li>
            <li>
              <IconArrowRight size={14} /> Authentic, restaurant-backed offers on every reservation
            </li>
            <li>
              <IconArrowRight size={14} /> One of the lowest overall dining costs in India
            </li>
          </ul>
        </div>

        <div className="about__split-card glass-card">
          <span className="about__split-icon">
            <IconHandshake size={22} />
          </span>
          <h3>For restaurant partners</h3>
          <p>More than a technology platform — a long-term growth partner.</p>
          <ul>
            <li>
              <IconArrowRight size={14} /> A fair, low-commission ecosystem that protects your margins
            </li>
            <li>
              <IconArrowRight size={14} /> More visibility, more reservations, more footfall
            </li>
            <li>
              <IconArrowRight size={14} /> Full control over your pricing, brand, and guest experience
            </li>
          </ul>
        </div>
      </div>

      <div className="about__values" ref={valuesRef}>
        {values.map((v) => (
          <ValueCard key={v.title} {...v} />
        ))}
      </div>

      <div className="about__vm" ref={vmRef}>
        <div className="about__vm-card glass-card">
          <span className="about__vm-icon">
            <IconEye size={22} />
          </span>
          <h4>Vision</h4>
          <p>
            To become India&rsquo;s most trusted and leading digital dining ecosystem that enriches every dining
            experience and empowers every restaurant.
          </p>
        </div>
        <div className="about__vm-card glass-card">
          <span className="about__vm-icon">
            <IconCompass size={22} />
          </span>
          <h4>Mission</h4>
          <p>
            To connect people with exceptional restaurants through seamless technology, trusted partnerships, and
            authentic experiences that make every meal more enjoyable and every business more successful.
          </p>
        </div>
      </div>
    </section>
  )
}
