import { useStaggerReveal } from '../hooks/useReveal'
import { IconStar } from './Icons'
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
      </div>

      <div className="testimonials__grid" ref={ref}>
        {testimonials.map((t) => (
          <figure className="testimonial-card glass-card" key={t.name}>
            <div className="testimonial-card__stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStar key={i} size={14} />
              ))}
            </div>
            <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption>
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
