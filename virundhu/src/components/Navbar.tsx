import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_LINKS } from '../lib/data'
import { Menu, Close } from './Icons'

function Mark() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 32 32" className="text-gold" aria-hidden>
        <path
          d="M16 3c3 4 3 7 1 10 4-1 6-4 7-7 2 6-1 12-6 15 3 1 6 0 8-2-1 6-7 10-13 9V3Z"
          fill="currentColor"
          opacity="0.9"
        />
        <circle cx="16" cy="16" r="13.2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
      <span className="font-display text-lg font-bold tracking-[0.28em] text-cream">VIRUNDHU</span>
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex max-w-[1320px] items-center justify-between px-5 transition-all duration-500 md:px-8 ${
          scrolled
            ? 'my-2.5 rounded-full border border-gold/15 bg-void/70 py-2.5 backdrop-blur-xl'
            : 'py-5'
        }`}
      >
        <a href="#home" aria-label="VIRUNDHU home">
          <Mark />
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[0.72rem] font-medium tracking-[0.2em] text-cream-dim transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#book" className="btn btn-gold hidden sm:inline-flex">
            Book a Table
          </a>
          <button
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-gold/25 text-cream lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-void/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Mark />
              <button
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-gold/25 text-cream"
                onClick={() => setOpen(false)}
              >
                <Close />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1 px-6">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                  className="border-b border-gold/10 py-5 font-display text-2xl text-cream"
                >
                  {l.label}
                </motion.a>
              ))}
              <a href="#book" onClick={() => setOpen(false)} className="btn btn-gold mt-8 self-start">
                Book a Table
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
