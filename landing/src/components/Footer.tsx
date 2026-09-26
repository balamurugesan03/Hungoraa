import { IconArrowRight } from './Icons'
import { pageHref } from '../lib/links'
import './Footer.css'

const logo = '/logolanding.jpeg'

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '#about' },
      { label: 'Contact', href: '#contact' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Features', href: '/features' },
    ],
  },
  {
    title: 'Partners',
    links: [
      { label: 'Partner with us', href: '/partner' },
      { label: 'Owner dashboard', href: '#' },
      { label: 'Help & support', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of service', href: '#' },
      { label: 'Privacy policy', href: '#' },
      { label: 'Cookie policy', href: '#' },
    ],
  },
]

export default function Footer({ onHome = true }: { onHome?: boolean }) {
  return (
    <footer id="contact" className="footer">
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
            <a href={pageHref('#top', onHome)} className="footer__logo">
              <img src={logo} alt="Hungora" />
            </a>
            <p className="footer__tagline">The smartest way to dine</p>
          </div>

          <div className="footer__columns">
            {columns.map((c) => (
              <div key={c.title}>
                <h4 className="mono">{c.title}</h4>
                <ul>
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a href={pageHref(l.href, onHome)}>{l.label}</a>
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
          <p className="footer__legal">
            By accessing or continuing to use this platform, you agree to abide by our Terms of Service, Cookie
            Policy, Privacy Policy, and Content Guidelines. All third-party trademarks, logos, and brand assets
            displayed are the property of their respective owners.
          </p>
          <span className="mono">
            © 2025–{new Date().getFullYear()} Hungora™ (Hungora Technologies Private Ltd.). All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}
