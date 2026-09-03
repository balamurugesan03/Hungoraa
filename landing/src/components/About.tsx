import { useStaggerReveal, useRevealSelf } from '../hooks/useReveal'
import { IconArrowRight, IconEye, IconCompass, IconFork, IconHandshake } from './Icons'
import './About.css'

const values = [
  ['Transparency', 'The menu price you see is the price you pay.'],
  ['Customer first', 'Every decision starts with what’s best for the diner.'],
  ['Fair partnership', 'Low, honest commission — we grow when you grow.'],
  ['Innovation', 'The whole dining journey, quietly simplified.'],
  ['Trust', 'Relationships that outlast a single reservation.'],
  ['Excellence', 'An exceptional experience, every booking.'],
]

export default function About() {
  const promiseRef = useRevealSelf<HTMLDivElement>()
  const splitRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.12 })
  const valuesRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.05 })
  const vmRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.12 })

  return (
    <section id="about" className="section band about">
      <div className="section-head">
        <span className="eyebrow">About Hungora</span>
        <h2>
          Trust in every reservation. <span className="accent">Value in every meal.</span>
        </h2>
        <p>
          India&rsquo;s next-generation platform for restaurant discovery, reservations, dine-in and digital
          payment — built to make eating out more transparent, affordable and rewarding for everyone at the table.
        </p>
      </div>

      <div className="about__promise panel ticks" ref={promiseRef}>
        <span className="eyebrow">Brand promise</span>
        <h3>
          Hospitality and technology, <span className="accent">on the same side.</span>
        </h3>
      </div>

      <div className="about__split" ref={splitRef}>
        <div className="about__col panel">
          <span className="about__col-icon">
            <IconFork size={20} />
          </span>
          <h3>For diners</h3>
          <ul>
            <li><IconArrowRight size={13} /> Pay the real menu price — no inflation, no hidden fees</li>
            <li><IconArrowRight size={13} /> Authentic, restaurant-backed offers on every booking</li>
            <li><IconArrowRight size={13} /> One of the lowest overall dining costs in India</li>
          </ul>
        </div>
        <div className="about__col panel">
          <span className="about__col-icon">
            <IconHandshake size={20} />
          </span>
          <h3>For restaurant partners</h3>
          <ul>
            <li><IconArrowRight size={13} /> A fair, low-commission model that protects your margins</li>
            <li><IconArrowRight size={13} /> More visibility, more reservations, more footfall</li>
            <li><IconArrowRight size={13} /> Full control of your pricing, brand and guest experience</li>
          </ul>
        </div>
      </div>

      <div className="about__values" ref={valuesRef}>
        {values.map(([title, body], i) => (
          <div className="about__value" key={title}>
            <span className="about__value-num mono">{String(i + 1).padStart(2, '0')}</span>
            <h4>{title}</h4>
            <p>{body}</p>
          </div>
        ))}
      </div>

      <div className="about__vm" ref={vmRef}>
        <div className="about__vm-card panel">
          <span className="about__vm-icon"><IconEye size={20} /></span>
          <h4>Vision</h4>
          <p>To become India&rsquo;s most trusted digital dining ecosystem — one that enriches every dining experience and empowers every restaurant.</p>
        </div>
        <div className="about__vm-card panel">
          <span className="about__vm-icon"><IconCompass size={20} /></span>
          <h4>Mission</h4>
          <p>To connect people with exceptional restaurants through seamless technology, trusted partnerships and authentic experiences.</p>
        </div>
      </div>
    </section>
  )
}
