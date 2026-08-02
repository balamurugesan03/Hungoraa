import { useRef } from 'react'
import { useRevealSelf } from '../hooks/useReveal'
import { IconArrowRight, IconFork, IconStar, IconTag } from './Icons'
import './RestaurantShowcase.css'

const restaurants = [
  { name: 'Ember & Oak', cuisine: 'Modern Grill', rating: 4.8, offer: '20% off', gradient: 'linear-gradient(140deg,#7a1f1a,#cd302b)' },
  { name: 'Basilico', cuisine: 'Italian', rating: 4.7, offer: 'Flat ₹300 off', gradient: 'linear-gradient(140deg,#0c2f4e,#f9a91b)' },
  { name: 'Umami House', cuisine: 'Japanese', rating: 4.9, offer: '1+1 Starters', gradient: 'linear-gradient(140deg,#123f66,#4d7ea8)' },
  { name: 'Spice Route', cuisine: 'North Indian', rating: 4.6, offer: '15% off', gradient: 'linear-gradient(140deg,#cd302b,#f9a91b)' },
  { name: 'Coastal Table', cuisine: 'Seafood', rating: 4.8, offer: 'Free dessert', gradient: 'linear-gradient(140deg,#0c2f4e,#2f6690)' },
  { name: 'The Green Fork', cuisine: 'Vegan', rating: 4.7, offer: '10% off', gradient: 'linear-gradient(140deg,#f9a91b,#ffe29a)' },
]

export default function RestaurantShowcase() {
  const trackRef = useRef<HTMLDivElement>(null)
  const headRef = useRevealSelf<HTMLDivElement>()

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  return (
    <section id="restaurants" className="section restaurants">
      <div className="restaurants__head" ref={headRef}>
        <div className="section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow">Restaurant showcase</span>
          <h2>
            Thousands of tables, <span className="gradient-text">one app.</span>
          </h2>
          <p>Live offers refresh throughout the day — book while the discount lasts.</p>
        </div>
        <div className="restaurants__arrows">
          <button onClick={() => scrollBy(-1)} aria-label="Scroll left">
            <IconArrowRight size={18} className="restaurants__arrow-icon restaurants__arrow-icon--left" />
          </button>
          <button onClick={() => scrollBy(1)} aria-label="Scroll right">
            <IconArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="restaurants__track" ref={trackRef}>
        {restaurants.map((r) => (
          <article className="restaurant-card glass-card" key={r.name}>
            <div className="restaurant-card__media" style={{ background: r.gradient }}>
              <IconFork size={30} />
              <span className="restaurant-card__offer">
                <IconTag size={13} /> {r.offer}
              </span>
            </div>
            <div className="restaurant-card__body">
              <div className="restaurant-card__row">
                <h3>{r.name}</h3>
                <span className="restaurant-card__rating">
                  <IconStar size={13} /> {r.rating}
                </span>
              </div>
              <span className="restaurant-card__cuisine">{r.cuisine}</span>
              <a href="#download" className="restaurant-card__cta">
                Reserve a table <IconArrowRight size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
