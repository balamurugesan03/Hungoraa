import { useState, type FormEvent } from 'react'
import { useRevealSelf, useStaggerReveal } from '../hooks/useReveal'
import {
  IconArrowRight,
  IconBolt,
  IconCalendar,
  IconCheck,
  IconClock,
  IconEye,
  IconFork,
  IconHandshake,
  IconMinus,
  IconPlus,
  IconQr,
  IconReceipt,
  IconScale,
  IconShield,
  IconStar,
  IconTag,
  IconUsers,
  IconWallet,
} from './Icons'
import './Business.css'

/** Restaurant owners sign in to the owner panel, served by nginx at /owner/. */
const OWNER_LOGIN = '/owner/'
const DEMO_EMAIL = 'admin@hungora.com'

/* ---------------------------------------------------------------- hero */

const liveBookings = [
  { time: '7:30 PM', guest: 'Table for 4', table: 'T-06', status: 'Confirmed', tone: 'ok' },
  { time: '7:45 PM', guest: 'Anniversary · 2', table: 'T-11', status: 'Held · 4:12', tone: 'hold' },
  { time: '8:00 PM', guest: 'Table for 6', table: 'T-02', status: 'Seated', tone: 'seat' },
  { time: '8:15 PM', guest: 'Table for 3', table: 'T-09', status: 'Pending', tone: 'pend' },
]

function Hero() {
  const copyRef = useRevealSelf<HTMLDivElement>()
  const mockRef = useRevealSelf<HTMLDivElement>()

  return (
    <section className="section biz-hero">
      <div className="biz-hero__copy" ref={copyRef}>
        <span className="display-tag">Hungora for Business</span>
        <h1 className="display-title">
          Run every table,
          <span className="display-title-accent">grow every night.</span>
        </h1>
        <span className="display-rule" aria-hidden="true" />
        <p className="display-lead">
          One dashboard for live bookings, tables, menus, offers, QR bill payments and settlements, so your floor runs
          smoothly and every rupee is accounted for.
        </p>
        <div className="biz-hero__actions">
          <a href="#demo" className="btn btn-primary">
            Request a free demo <IconArrowRight size={16} />
          </a>
          <a href={OWNER_LOGIN} className="btn btn-ghost">
            Owner login
          </a>
        </div>
        <ul className="biz-hero__proof mono">
          <li>
            <IconCheck size={14} /> No double bookings
          </li>
          <li>
            <IconCheck size={14} /> Transparent commission
          </li>
          <li>
            <IconCheck size={14} /> Scheduled settlements
          </li>
        </ul>
      </div>

      <div className="biz-mock panel--raised" ref={mockRef} aria-label="Preview of the Hungora owner dashboard">
        <div className="biz-mock__bar">
          <span />
          <span />
          <span />
          <em className="mono">owner.hungora.com/dashboard</em>
        </div>
        <div className="biz-mock__body">
          <div className="biz-mock__stats">
            <div>
              <span className="mono">Covers tonight</span>
              <strong>128</strong>
              <small className="up">+18% vs last Fri</small>
            </div>
            <div>
              <span className="mono">Tables live</span>
              <strong>14/18</strong>
              <small>4 free at 8:30</small>
            </div>
            <div>
              <span className="mono">Receivable</span>
              <strong>₹42,860</strong>
              <small className="up">Next payout Mon</small>
            </div>
          </div>
          <div className="biz-mock__list">
            <div className="biz-mock__list-head mono">
              <span>Live bookings</span>
              <span className="biz-mock__pulse">● Live</span>
            </div>
            {liveBookings.map((b) => (
              <div className="biz-mock__row" key={b.table}>
                <span className="mono">{b.time}</span>
                <span>{b.guest}</span>
                <span className="mono">{b.table}</span>
                <span className={`biz-mock__status biz-mock__status--${b.tone} mono`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
        <span className="biz-mock__toast mono">
          <IconQr size={14} /> Bill paid · T-04 · ₹2,340
        </span>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- what sets us apart */

const pillars = [
  {
    icon: IconBolt,
    title: 'Real-time floor control',
    body: 'Every booking, hold and seating update lands on your dashboard the moment it happens.',
  },
  {
    icon: IconScale,
    title: 'Fair, transparent money',
    body: 'Commission is calculated only on what you actually earn. Platform-funded offers never cut your share.',
  },
  {
    icon: IconHandshake,
    title: 'Guests who come back',
    body: 'Offers, reviews and a smooth pay-at-table experience turn first visits into regulars.',
  },
]

function Pillars() {
  const gridRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.1 })
  return (
    <section className="section biz-pillars" id="why">
      <div className="section-head">
        <span className="eyebrow">What sets us apart</span>
        <h2>Built for how restaurants actually run.</h2>
      </div>
      <div className="biz-pillars__grid" ref={gridRef}>
        {pillars.map(({ icon: Icon, title, body }) => (
          <article className="biz-pillar panel ticks" key={title}>
            <span className="chip-icon biz-pillar__icon">
              <Icon size={22} />
            </span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- feature grid */

const features = [
  {
    icon: IconCalendar,
    title: 'Live bookings',
    body: 'Accept or decline requests, then mark guests seated and completed. Every step notifies the guest automatically.',
  },
  {
    icon: IconClock,
    title: '5-minute table hold',
    body: 'A table is locked while the guest checks out, then released on its own if they drop off. No double bookings.',
  },
  {
    icon: IconUsers,
    title: 'Tables & branches',
    body: 'Set up floors, capacities and time slots for every branch, and see availability in real time.',
  },
  {
    icon: IconFork,
    title: 'Menu management',
    body: 'Update dishes, prices and availability whenever you like. Guests always see your real menu price.',
  },
  {
    icon: IconTag,
    title: 'Offers you control',
    body: 'Create percentage, flat or BOGO offers with limits, valid days and funding split between you, Hungora or a bank.',
  },
  {
    icon: IconQr,
    title: 'QR pay-at-table',
    body: 'Guests scan, apply offers and pay through Razorpay or wallet. The bill is marked paid on your screen instantly.',
  },
  {
    icon: IconReceipt,
    title: 'Invoices & reports',
    body: 'Every completed visit becomes a locked invoice with a full discount and commission breakup.',
  },
  {
    icon: IconStar,
    title: 'Reviews',
    body: 'Guests are asked to review after their meal, so you hear real feedback from verified diners.',
  },
]

function FeatureGrid() {
  const headRef = useRevealSelf<HTMLDivElement>()
  const gridRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.06 })
  return (
    <section className="section band biz-features" id="features">
      <div className="display-head" ref={headRef}>
        <span className="display-tag">The owner panel</span>
        <h2 className="display-title">
          Everything your restaurant needs,
          <span className="display-title-accent">in one place.</span>
        </h2>
        <span className="display-rule" aria-hidden="true" />
      </div>
      <div className="biz-features__grid" ref={gridRef}>
        {features.map(({ icon: Icon, title, body }) => (
          <article className="biz-feature panel" key={title}>
            <span className="chip-icon biz-feature__icon">
              <Icon size={20} />
            </span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- booking lifecycle */

const lifecycle = [
  ['Held', 'Table locked for 5 minutes while the guest books.'],
  ['Pending', 'Deposit paid (if you ask for one). You get an alert.'],
  ['Confirmed', 'You accept. The guest is notified straight away.'],
  ['Seated', 'Guest arrives. Mark them seated in one tap.'],
  ['Completed', 'Meal done. Invoice is locked and a review is requested.'],
]

function Lifecycle() {
  const headRef = useRevealSelf<HTMLDivElement>()
  const listRef = useStaggerReveal<HTMLOListElement>({ stagger: 0.08 })
  return (
    <section className="section biz-flow" id="how">
      <div className="section-head" ref={headRef}>
        <span className="eyebrow">How a booking flows</span>
        <h2>From tap to table, every step tracked.</h2>
        <p>Each status change updates your dashboard and the guest's app at the same time.</p>
      </div>
      <ol className="biz-flow__steps" ref={listRef}>
        {lifecycle.map(([title, body], i) => (
          <li className="biz-flow__step" key={title}>
            <span className="biz-flow__num mono">{String(i + 1).padStart(2, '0')}</span>
            <strong>{title}</strong>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ---------------------------------------------------------------- transparent earnings */

const chain = [
  { label: 'Food bill (gross)', value: '₹1,000', kind: 'base' },
  { label: 'Offer funded by you (20%)', value: '− ₹200', kind: 'minus' },
  { label: 'Offer funded by Hungora (10%)', value: 'Not deducted', kind: 'note' },
  { label: 'Commission base', value: '₹800', kind: 'base' },
  { label: 'Commission @ 10%', value: '− ₹80', kind: 'minus' },
  { label: 'You receive', value: '₹720', kind: 'total' },
]

const payoutSteps = ['Pending', 'Processing', 'Generated', 'Paid']

function Earnings() {
  const copyRef = useRevealSelf<HTMLDivElement>()
  const cardRef = useRevealSelf<HTMLDivElement>()
  return (
    <section className="section band biz-earn" id="earnings">
      <div className="biz-earn__copy" ref={copyRef}>
        <span className="eyebrow">Beyond reservations</span>
        <h2>Know exactly what you earn, on every bill.</h2>
        <p>
          Commission is charged only on the amount after the discounts you fund. Offers paid for by Hungora or a bank
          partner never reduce your share. Every invoice shows the full breakup.
        </p>
        <div className="biz-earn__payout">
          <span className="mono biz-earn__payout-label">Settlement cycle</span>
          <ol>
            {payoutSteps.map((s, i) => (
              <li key={s} className={i === payoutSteps.length - 1 ? 'is-done' : ''}>
                <span className="mono">{s}</span>
              </li>
            ))}
          </ol>
          <p>
            Daily, weekly, bi-weekly or monthly, whichever you choose. Payouts go straight to your bank account with a
            transaction reference and a downloadable report.
          </p>
        </div>
      </div>

      <div className="biz-earn__card panel--raised ticks" ref={cardRef}>
        <span className="mono biz-earn__card-title">
          <IconWallet size={15} /> Example invoice
        </span>
        <ul>
          {chain.map((c) => (
            <li key={c.label} className={`biz-earn__row biz-earn__row--${c.kind}`}>
              <span>{c.label}</span>
              <span className="mono">{c.value}</span>
            </li>
          ))}
        </ul>
        <p className="biz-earn__foot mono">Guest pays ₹700 + GST · Hungora absorbs its ₹100 offer</p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- why team up */

const reasons = [
  { icon: IconEye, title: 'More visibility', body: 'Get discovered by diners searching and booking on the Hungora app.' },
  { icon: IconShield, title: 'Offers with guardrails', body: 'Usage limits, minimum bill and approval checks keep every offer under control.' },
  { icon: IconBolt, title: 'Faster table turns', body: 'Pay-at-table and instant status updates free up tables sooner.' },
]

function Reasons() {
  const gridRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.1 })
  return (
    <section className="section biz-reasons">
      <div className="section-head">
        <span className="eyebrow">Why team up with Hungora</span>
        <h2>Fill more tables without giving up control.</h2>
      </div>
      <div className="biz-reasons__grid" ref={gridRef}>
        {reasons.map(({ icon: Icon, title, body }) => (
          <article className="biz-reason" key={title}>
            <Icon size={26} />
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- FAQ */

const faqs = [
  {
    q: 'How do I manage reservations?',
    a: 'Every new booking shows up in the owner panel with a notification. Accept or decline it, then mark the guest seated and completed as the meal goes on.',
  },
  {
    q: 'Can two guests book the same table?',
    a: 'No. While a guest is booking, the table is held for 5 minutes. If they don’t finish, the hold is released automatically and the table is free again.',
  },
  {
    q: 'Can I ask guests for a deposit?',
    a: 'Yes. Turn on deposits in your booking settings. Guests pay through Razorpay or their Hungora wallet, and cancelled bookings are refunded automatically.',
  },
  {
    q: 'How do offers work?',
    a: 'You create the offer (type, value, limits, valid days and who funds it). Offers that need review go to the Hungora team for approval, and you are notified once they go live.',
  },
  {
    q: 'How is commission calculated?',
    a: 'Commission is charged on the bill after the discounts you fund. Discounts funded by Hungora or a bank partner are not taken out of your share.',
  },
  {
    q: 'When do I get paid?',
    a: 'Settlements run on your chosen cycle (daily, weekly, bi-weekly or monthly). You get a settlement report and the payout is transferred to your bank account.',
  },
  {
    q: 'Do guests pay the bill through Hungora?',
    a: 'They can. Guests scan your QR code, apply any eligible offer, and pay. The bill is marked paid on your dashboard and an invoice is created automatically.',
  },
  {
    q: 'I run multiple outlets. Is that supported?',
    a: 'Yes. Add each branch with its own tables, menu and timings, and manage all of them from one login.',
  },
]

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const listRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.05 })
  return (
    <section className="section band biz-faq" id="faqs">
      <div className="section-head">
        <span className="eyebrow">FAQs</span>
        <h2>Questions restaurant owners ask us.</h2>
      </div>
      <div className="biz-faq__list" ref={listRef}>
        {faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <div className={`biz-faq__item panel ${isOpen ? 'is-open' : ''}`} key={f.q}>
              <button
                type="button"
                className="biz-faq__q"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{f.q}</span>
                {isOpen ? <IconMinus size={18} /> : <IconPlus size={18} />}
              </button>
              <div className="biz-faq__a" id={`faq-${i}`} role="region" hidden={!isOpen}>
                <p>{f.a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- demo form */

function Demo() {
  const cardRef = useRevealSelf<HTMLDivElement>()
  const [sent, setSent] = useState(false)

  // No lead endpoint on the backend yet, so the form opens a pre-filled email to the team.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const get = (k: string) => String(d.get(k) ?? '').trim()
    const body = [
      `Name: ${get('name')}`,
      `Restaurant: ${get('restaurant')}`,
      `City: ${get('city')}`,
      `Phone: ${get('phone')}`,
      `Outlets: ${get('outlets')}`,
    ].join('\n')
    const subject = `Demo request — ${get('restaurant') || 'Hungora for Business'}`
    window.location.href = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section className="section biz-demo" id="demo">
      <div className="biz-demo__card" ref={cardRef}>
        <div className="biz-demo__copy">
          <span className="eyebrow biz-demo__eyebrow">Ready to join us?</span>
          <h2>
            Book your demo. <span>See your restaurant on Hungora.</span>
          </h2>
          <p>
            Tell us a little about your place and our team will walk you through the owner panel, set up your tables
            and menu, and get you live.
          </p>
          <p className="biz-demo__login">
            Already a partner?{' '}
            <a href={OWNER_LOGIN}>
              Sign in to the owner panel <IconArrowRight size={14} />
            </a>
          </p>
        </div>

        <form className="biz-demo__form" onSubmit={onSubmit}>
          <label>
            <span className="mono">Your name</span>
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            <span className="mono">Restaurant name</span>
            <input name="restaurant" required autoComplete="organization" />
          </label>
          <div className="biz-demo__pair">
            <label>
              <span className="mono">City</span>
              <input name="city" required autoComplete="address-level2" />
            </label>
            <label>
              <span className="mono">Outlets</span>
              <select name="outlets" defaultValue="1">
                <option value="1">1</option>
                <option value="2-5">2–5</option>
                <option value="6+">6+</option>
              </select>
            </label>
          </div>
          <label>
            <span className="mono">Phone</span>
            <input name="phone" type="tel" required autoComplete="tel" pattern="[0-9+\s\-]{8,15}" />
          </label>
          <button type="submit" className="btn btn-primary biz-demo__submit">
            {sent ? (
              <>
                <IconCheck size={16} /> Opening your email…
              </>
            ) : (
              <>
                Request a free demo <IconArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}

export default function Business() {
  return (
    <>
      <Hero />
      <Pillars />
      <FeatureGrid />
      <Lifecycle />
      <Earnings />
      <Reasons />
      <Faq />
      <Demo />
    </>
  )
}
