import type { MouseEvent } from 'react'
import { useStaggerReveal } from '../hooks/useReveal'
import { useTilt } from '../hooks/useTilt'
import { IconQuote, IconStar } from './Icons'
import './Testimonials.css'

const testimonials = [
  {
    quote:
      'We used to wait 15 minutes just to get the check split right. Now the whole table pays in under a minute.',
    name: 'Priya Nair',
    role: 'Regular diner, Bengaluru',
  },
  {
    quote:
      'The table hold feature is a lifesaver — booked on my commute, table was ready the second we walked in.',
    name: 'Rohan Mehta',
    role: 'Product Manager',
  },
  {
    quote: 'Offers stack automatically so I never miss a discount. Feels like the app is doing the math for me.',
    name: 'Ananya Iyer',
    role: 'Food blogger',
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function handleSpotlight(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
  e.currentTarget.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`)
}

function TestimonialCard({ quote, name, role }: (typeof testimonials)[number]) {
  const tiltRef = useTilt<HTMLElement>(6)
  return (
    <figure className="testimonial-card glass-card" ref={tiltRef} onMouseMove={handleSpotlight}>
      <IconQuote size={40} className="testimonial-card__quote" />
      <div className="testimonial-card__stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStar key={i} size={14} />
        ))}
      </div>
      <blockquote>&ldquo;{quote}&rdquo;</blockquote>
      <figcaption>
        <span className="testimonial-card__avatar">{initials(name)}</span>
        <div>
          <strong>{name}</strong>
          <span>{role}</span>
        </div>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  const ref = useStaggerReveal<HTMLDivElement>({ stagger: 0.12 })

  return (
    <section className="section testimonials">
      <div className="section-head" style={{ margin: '0 auto 64px', textAlign: 'center' }}>
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          Loved by diners
        </span>
        <h2 style={{ margin: '16px auto 0' }}>
          Real tables. <span className="gradient-text">Real speed.</span>
        </h2>
        <p style={{ margin: '20px auto 0' }}>4.9 average rating from diners across 12k+ partner restaurants.</p>
      </div>

      <div className="testimonials__grid" ref={ref}>
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </div>
    </section>
  )
}
