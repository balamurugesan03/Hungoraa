import logo from '../assets/logo.svg'
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
    title: 'Restaurants',
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
          Ready to skip the wait? <span className="gradient-text">Download Hungora.</span>
        </h2>
        <a href="#download" className="btn btn-primary">
          Get the app
        </a>
      </div>

      <div className="footer__main">
        <div className="footer__brand">
          <a href="#top" className="navbar__brand">
            <img src={logo} alt="Hungora" className="navbar__brand-icon" />
            Hungora
          </a>
          <p>Book. Dine. Pay. All from one app.</p>
        </div>

        <div className="footer__columns">
          {columns.map((c) => (
            <div key={c.title}>
              <h4>{c.title}</h4>
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

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Hungora. All rights reserved.</span>
      </div>
    </footer>
  )
}
