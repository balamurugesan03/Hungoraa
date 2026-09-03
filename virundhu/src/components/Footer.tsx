import { NAV_LINKS, SOCIALS } from '../lib/data'
import { Phone, Mail, Pin } from './Icons'

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-gold/12">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-5 py-20 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:px-8">
        <div>
          <p className="font-display text-xl font-bold tracking-[0.28em] text-cream">VIRUNDHU</p>
          <p className="script mt-3 text-lg gold-text">Beyond Food. Into Experience.</p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-full border border-gold/25 text-[0.6rem] font-semibold uppercase tracking-wider text-cream-dim transition-colors hover:border-gold hover:text-gold"
              >
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-soft">Quick Links</p>
          <ul className="space-y-2.5 text-sm text-cream-dim">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="capitalize transition-colors hover:text-gold">
                  {l.label.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-soft">Contact</p>
          <ul className="space-y-3 text-sm text-cream-dim">
            <li className="flex items-center gap-2.5">
              <Phone className="text-gold" /> +91 98840 00000
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="text-gold" /> hello@virundhu.com
            </li>
            <li className="flex items-center gap-2.5">
              <Pin className="text-gold" /> Chennai · Bengaluru
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-soft">Download App</p>
          <div className="flex flex-col gap-3">
            {['App Store', 'Google Play'].map((s) => (
              <a
                key={s}
                href="#"
                className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-cream transition-transform hover:-translate-y-0.5"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-gold/30 text-gold">▲</span>
                <span>
                  <span className="block text-[0.58rem] uppercase tracking-wider text-cream-dim">Get it on</span>
                  {s}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gold/10 px-5 py-6 text-center text-[0.68rem] tracking-[0.14em] text-cream-dim md:px-8">
        © 2026 VIRUNDHU. All Rights Reserved.
      </div>
    </footer>
  )
}
