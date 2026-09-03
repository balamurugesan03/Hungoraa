import { useRevealSelf } from '../hooks/useReveal'
import { IconArrowRight } from './Icons'
import './MenuGallery.css'

type Dish = { img: string; name: string; cuisine: string; price: string }

const U = (id: string) => `https://images.unsplash.com/${id}?w=640&q=72&auto=format&fit=crop&crop=entropy`

const rowA: Dish[] = [
  { img: 'photo-1565299624946-b28f40a0ae38', name: 'Wood-fired pizza', cuisine: 'Italian', price: '₹420' },
  { img: 'photo-1589302168068-964664d93dc0', name: 'Hyderabadi biryani', cuisine: 'South Indian', price: '₹380' },
  { img: 'photo-1568901346375-23c9450c58cd', name: 'Smokehouse burger', cuisine: 'Grill', price: '₹340' },
  { img: 'photo-1553621042-f6e147245754', name: 'Sushi platter', cuisine: 'Japanese', price: '₹690' },
  { img: 'photo-1631452180519-c014fe946bc7', name: 'Butter chicken', cuisine: 'North Indian', price: '₹360' },
  { img: 'photo-1569718212165-3a8278d5f624', name: 'Prawn ramen', cuisine: 'Japanese', price: '₹450' },
  { img: 'photo-1473093295043-cdd812d0e601', name: 'Pesto farfalle', cuisine: 'Italian', price: '₹390' },
  { img: 'photo-1606491956689-2ea866880c84', name: 'Mumbai pav bhaji', cuisine: 'Street', price: '₹160' },
  { img: 'photo-1600891964092-4316c288032e', name: 'Steak frites', cuisine: 'French', price: '₹720' },
  { img: 'photo-1546069901-ba9599a7e63c', name: 'Salmon poke bowl', cuisine: 'Hawaiian', price: '₹410' },
]

const rowB: Dish[] = [
  { img: 'photo-1617093727343-374698b1b08d', name: 'Chicken laksa', cuisine: 'Thai', price: '₹360' },
  { img: 'photo-1544025162-d76694265947', name: 'Smoked ribs', cuisine: 'BBQ', price: '₹560' },
  { img: 'photo-1601050690597-df0568f70950', name: 'Punjabi samosa', cuisine: 'Snacks', price: '₹90' },
  { img: 'photo-1585032226651-759b368d7246', name: 'Hakka noodles', cuisine: 'Indo-Chinese', price: '₹220' },
  { img: 'photo-1512621776951-a57141f2eefd', name: 'Garden bowl', cuisine: 'Vegan', price: '₹280' },
  { img: 'photo-1567620905732-2d1ec7ab7445', name: 'Brunch stack', cuisine: 'Brunch', price: '₹240' },
  { img: 'photo-1596797038530-2c107229654b', name: 'Rogan josh', cuisine: 'Kashmiri', price: '₹420' },
  { img: 'photo-1626074353765-517a681e40be', name: 'Tandoori chicken', cuisine: 'Tandoor', price: '₹390' },
  { img: 'photo-1504674900247-0877df9cc836', name: 'Thai beef salad', cuisine: 'Thai', price: '₹330' },
  { img: 'photo-1512058564366-18510be2db19', name: 'Seafood paella', cuisine: 'Spanish', price: '₹640' },
]

function Track({ dishes, reverse }: { dishes: Dish[]; reverse?: boolean }) {
  return (
    <div className={`menu__track ${reverse ? 'menu__track--rev' : ''}`}>
      {[0, 1].map((dup) => (
        <div className="menu__group" key={dup} aria-hidden={dup === 1}>
          {dishes.map((d) => (
            <figure className="dish" key={d.name}>
              <img
                src={U(d.img)}
                alt={`${d.name} — ${d.cuisine}`}
                loading="lazy"
                decoding="async"
                width={320}
                height={224}
              />
              <figcaption className="dish__label">
                <span className="dish__name">{d.name}</span>
                <span className="dish__meta mono">
                  <span className="dish__cuisine">{d.cuisine}</span>
                  <span className="dish__price">{d.price}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function MenuGallery() {
  const headRef = useRevealSelf<HTMLDivElement>()

  return (
    <section id="menu" className="section band menu">
      <div className="section-head menu__head" ref={headRef}>
        <span className="eyebrow">On the pass</span>
        <h2>
          Tonight, across <span className="accent">every kitchen.</span>
        </h2>
        <p>A live crawl of what partner restaurants are plating right now — reserve any of them in the app.</p>
      </div>

      <div className="menu__marquee">
        <Track dishes={rowA} />
        <Track dishes={rowB} reverse />
        <div className="menu__fade menu__fade--l" />
        <div className="menu__fade menu__fade--r" />
      </div>

      <a href="#download" className="menu__cta">
        See every menu in the app <IconArrowRight size={15} />
      </a>
    </section>
  )
}
