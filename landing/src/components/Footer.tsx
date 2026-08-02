import logo from '../assets/logo.svg'
import './Footer.css'

const columns = [
  {
    title: 'Product',
    links: ['How it works', 'Features', 'Restaurants', 'Pricing'],
  },
  {
    title: 'Company',
    links: ['About us', 'Careers', 'Press', 'Contact'],
  },
  {
    title: 'Restaurants',
    links: ['Partner with us', 'Owner dashboard', 'Settlements', 'Support'],
  },
  {
    title: 'Legal',
    links: ['Terms of service', 'Privacy policy', 'Refund policy'],
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
                  <li key={l}>
                    <a href="#">{l}</a>
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
