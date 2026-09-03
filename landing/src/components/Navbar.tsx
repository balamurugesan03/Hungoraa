import { useEffect, useState } from 'react'
import logo from '../assets/logo.svg'
import Wordmark from './Wordmark'
import './Navbar.css'

const links = [
  { label: 'Menu', href: '#menu' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Restaurants', href: '#restaurants' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      setScrolled(h.scrollTop > 20)
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? h.scrollTop / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#top" className="navbar__brand">
          <img src={logo} alt="Hungora" className="navbar__brand-icon" />
          <Wordmark />
        </a>

        <nav className="navbar__links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              <span className="navbar__link-dot" />
              {l.label}
            </a>
          ))}
        </nav>

        <div className="navbar__cta">
          <a href="#download" className="btn btn-primary navbar__cta-btn">
            Get the app
          </a>
        </div>

        <button
          className={`navbar__burger ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
      </div>

      <div className="navbar__progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />

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
