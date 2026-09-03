import { useStaggerReveal } from '../hooks/useReveal'
import { IconStar } from './Icons'
import './Testimonials.css'

const stats = [
  { v: '4.9', l: 'Average diner rating' },
  { v: '38s', l: 'Median time to settle a bill' },
  { v: '12,400+', l: 'Partner restaurants live' },
  { v: '2.4M', l: 'Bills settled to date' },
]

const testimonials = [
  {
    quote: 'We used to wait 15 minutes just to get the check split right. Now the whole table pays in under a minute.',
    name: 'Priya Nair',
    role: 'Regular diner · Bengaluru',
  },
  {
    quote: 'Booked on my commute, table was ready the second we walked in. The hold feature is the whole game.',
    name: 'Rohan Mehta',
    role: 'Product Manager · Pune',
  },
  {
    quote: 'Offers stack automatically so I never miss a discount. It feels like the app is doing the math for me.',
    name: 'Ananya Iyer',
    role: 'Food blogger · Chennai',
  },
]

const initials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

export default function Testimonials() {
  const statsRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.08 })
  const grid = useStaggerReveal<HTMLDivElement>({ stagger: 0.1 })

  return (
    <section className="section band testimonials">
      <div className="tstats" ref={statsRef}>
        {stats.map((s) => (
          <div className="tstats__item" key={s.l}>
            <strong className="mono">{s.v}</strong>
            <span>{s.l}</span>
          </div>
        ))}
      </div>

      <div className="section-head" style={{ maxWidth: 620, margin: '96px 0 56px' }}>
        <span className="eyebrow">Loved by diners</span>
        <h2>
          Real tables. <span className="accent">Real speed.</span>
        </h2>
      </div>

      <div className="testimonials__grid" ref={grid}>
        {testimonials.map((t) => (
          <figure className="tcard panel ticks" key={t.name}>
            <div className="tcard__stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStar key={i} size={13} />
              ))}
            </div>
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <span className="tcard__avatar mono">{initials(t.name)}</span>
              <span className="tcard__who">
                <strong>{t.name}</strong>
                <span className="mono">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
