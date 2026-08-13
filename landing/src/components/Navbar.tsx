import { useEffect, useState } from 'react'
import logo from '../assets/logo.svg'
import './Navbar.css'

const links = [
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Restaurants', href: '#restaurants' },
  { label: 'Get the app', href: '#download' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#top" className="navbar__brand">
          <img src={logo} alt="Hungora" className="navbar__brand-icon" />
          Hungora
        </a>

        <nav className="navbar__links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="navbar__cta">
          <a href="#download" className="btn btn-primary navbar__cta-btn">
            Get the app
          </a>
        </div>

        <button className="navbar__burger" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="navbar__mobile">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#download" className="btn btn-primary" onClick={() => setOpen(false)}>
            Get the app
          </a>
        </div>
      )}
    </header>
  )
}
