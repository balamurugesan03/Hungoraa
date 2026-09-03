import logo from '../assets/logo.svg'
import { IconArrowRight } from './Icons'
import './Footer.css'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Features', href: '#features' },
      { label: 'Restaurants', href: '#restaurants' },
      { label: 'Pricing', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '#about' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Partners',
    links: [
      { label: 'Partner with us', href: '#restaurants' },
      { label: 'Owner dashboard', href: '#' },
      { label: 'Settlements', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of service', href: '#' },
      { label: 'Privacy policy', href: '#' },
      { label: 'Refund policy', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__cta section">
        <h2>
          Ready to skip the wait? <span className="accent">Download Hungora.</span>
        </h2>
        <a href="#download" className="btn btn-primary">
          Get the app <IconArrowRight size={16} />
        </a>
      </div>

      <div className="footer__main">
        <div className="footer__inner">
          <div className="footer__brand">
            <a href="#top" className="footer__logo">
              <img src={logo} alt="Hungora" />
              <span>Hungora</span>
            </a>
            <p>Reserve. Dine. Settle. All from one app.</p>
          </div>

          <div className="footer__columns">
            {columns.map((c) => (
              <div key={c.title}>
                <h4 className="mono">{c.title}</h4>
                <ul>
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__inner">
          <span className="mono">© {new Date().getFullYear()} Hungora — a DineSmart platform</span>
          <span className="mono">Made for the table</span>
        </div>
      </div>
    </footer>
  )
}
