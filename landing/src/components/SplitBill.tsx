import { useMemo, useState } from 'react'
import { useRevealSelf } from '../hooks/useReveal'
import { IconCheck, IconSplit } from './Icons'
import './SplitBill.css'

const items = [
  { name: 'Hyderabadi Biryani', qty: 2, price: 840, who: [0, 1] },
  { name: 'Masala Dosa', qty: 1, price: 180, who: [2] },
  { name: 'Paneer Tikka', qty: 1, price: 320, who: [0, 1, 2] },
  { name: 'Filter Coffee', qty: 3, price: 180, who: [0, 1, 2] },
]

const diners = ['You', 'Ravi', 'Meena']
const OFFER = 260

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export default function SplitBill() {
  const ref = useRevealSelf<HTMLDivElement>()
  const [mode, setMode] = useState<'even' | 'item'>('item')
  const [paid, setPaid] = useState(false)

  const gross = items.reduce((s, it) => s + it.price, 0)
  const total = gross - OFFER

  const shares = useMemo(() => {
    if (mode === 'even') {
      const each = Math.round(total / diners.length)
      return diners.map((_, i) => (i === 0 ? total - each * (diners.length - 1) : each))
    }
    // by item, then spread the offer proportionally
    const raw = diners.map((_, d) =>
      items.reduce((s, it) => (it.who.includes(d) ? s + it.price / it.who.length : s), 0),
    )
    return raw.map((r) => Math.round(r * (total / gross)))
  }, [mode, total, gross])

  return (
    <section className="split section" >
      <div className="split__grid" ref={ref}>
        <div className="split__copy">
          <span className="eyebrow">The moment of truth</span>
          <h2>
            The check <span className="accent">clears itself.</span>
          </h2>
          <p>
            Every item is on the bill the second it&rsquo;s served. Split it evenly or by who ordered what,
            hit settle, and each person pays their share at once — the restaurant is reconciled in the
            background before you&rsquo;ve stood up.
          </p>
          <ul className="split__points">
            <li>
              <IconCheck size={15} /> Itemised, live, and tamper-proof
            </li>
            <li>
              <IconCheck size={15} /> Offers spread fairly across the table
            </li>
            <li>
              <IconCheck size={15} /> One settlement, zero IOUs
            </li>
          </ul>
        </div>

        <div className="split__bill panel--raised panel ticks">
          <div className="split__bill-head">
            <div>
              <strong>Table 12</strong>
              <span className="mono">Ember &amp; Oak · Bengaluru</span>
            </div>
            <span className="split__live mono">
              <span className="split__live-dot" /> Live
            </span>
          </div>

          <div className="split__items">
            {items.map((it) => (
              <div className="split__item" key={it.name}>
                <span className="split__item-qty mono">{it.qty}×</span>
                <span className="split__item-name">{it.name}</span>
                <span className="split__item-price mono">{inr(it.price)}</span>
              </div>
            ))}
          </div>

          <div className="split__totals">
            <div>
              <span>Subtotal</span>
              <span className="mono">{inr(gross)}</span>
            </div>
            <div className="split__totals-offer">
              <span>Restaurant offer</span>
              <span className="mono">−{inr(OFFER)}</span>
            </div>
            <div className="split__totals-grand">
              <span>Total</span>
              <span className="mono">{inr(total)}</span>
            </div>
          </div>

          <div className="split__modes" role="tablist">
            <button
              className={`split__mode ${mode === 'even' ? 'is-active' : ''}`}
              onClick={() => { setMode('even'); setPaid(false) }}
              role="tab"
              aria-selected={mode === 'even'}
            >
              Even split
            </button>
            <button
              className={`split__mode ${mode === 'item' ? 'is-active' : ''}`}
              onClick={() => { setMode('item'); setPaid(false) }}
              role="tab"
              aria-selected={mode === 'item'}
            >
              <IconSplit size={13} /> By item
            </button>
          </div>

          <div className="split__diners">
            {diners.map((d, i) => (
              <div className={`split__diner ${paid ? 'is-paid' : ''}`} key={d}>
                <span className="split__diner-avatar">{paid ? <IconCheck size={14} /> : d[0]}</span>
                <span className="split__diner-name">{d}</span>
                <span className="split__diner-amt mono">{inr(shares[i])}</span>
              </div>
            ))}
          </div>

          <button className={`split__settle btn btn-primary ${paid ? 'is-done' : ''}`} onClick={() => setPaid((p) => !p)}>
            {paid ? (
              <>
                <IconCheck size={16} /> Settled · {inr(total)}
              </>
            ) : (
              <>Settle bill · {inr(total)}</>
            )}
          </button>

          <p className={`split__status mono ${paid ? 'is-shown' : ''}`}>
            Restaurant settled automatically · commission reconciled
          </p>
        </div>
      </div>
    </section>
  )
}
