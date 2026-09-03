import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FLOOR_TABLES, EXPERIENCE_TYPES, type FloorTable, type TableStatus } from '../lib/data'
import { Arrow, Window, Users, Clock, Star } from './Icons'
import { useReveal } from '../hooks/useReveal'

const STATUS: Record<TableStatus, { dot: string; label: string; ring: string }> = {
  available: { dot: '#3fae54', label: 'Available', ring: 'rgba(63,174,84,0.5)' },
  soon: { dot: '#e0902c', label: 'Reserved Soon', ring: 'rgba(224,144,44,0.5)' },
  booked: { dot: '#c0392b', label: 'Booked', ring: 'rgba(192,57,43,0.45)' },
}

const KIND_LABEL: Record<FloorTable['kind'], string> = {
  window: 'Window View',
  couple: 'Couple Table',
  family: 'Family Table',
  private: 'Premium Private',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cream-dim">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-gold/20 bg-void/60 px-3.5 py-3 text-sm text-cream outline-none transition-colors focus:border-gold/60 [color-scheme:dark]'

export default function BookYourTable() {
  const head = useReveal<HTMLDivElement>()
  const [exp, setExp] = useState('family')
  const [selected, setSelected] = useState<string>('07')
  const table = useMemo(() => FLOOR_TABLES.find((t) => t.id === selected) ?? null, [selected])

  return (
    <section id="book" className="section">
      <div ref={head} className="reveal section-head">
        <span className="eyebrow">Book Your Table</span>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] text-cream">
          Choose Your <span className="gold-text">Perfect Spot</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr_300px]">
        {/* LEFT — form */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-6"
        >
          <div className="space-y-4">
            <Field label="Select Date">
              <input type="date" className={inputCls} defaultValue="2026-02-14" />
            </Field>
            <Field label="Select Time">
              <select className={inputCls} defaultValue="19:00">
                {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Guests">
              <select className={inputCls} defaultValue="4">
                {[2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} guests
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Experience Type">
              <div className="grid grid-cols-2 gap-2">
                {EXPERIENCE_TYPES.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setExp(e.id)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-[0.72rem] transition-all ${
                      exp === e.id
                        ? 'border-gold/70 bg-gold/10 text-cream'
                        : 'border-gold/15 text-cream-dim hover:border-gold/40'
                    }`}
                  >
                    <span className="text-sm">{e.emoji}</span>
                    {e.label}
                  </button>
                ))}
              </div>
            </Field>

            <button className="btn btn-gold mt-2 w-full">Find a Table</button>
          </div>
        </motion.div>

        {/* CENTER — isometric floor plan */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass relative overflow-hidden rounded-3xl p-4"
        >
          <div className="mb-3 flex flex-wrap gap-4 px-2 text-[0.62rem] uppercase tracking-[0.16em] text-cream-dim">
            {(['available', 'soon', 'booked'] as TableStatus[]).map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: STATUS[s].dot }} />
                {STATUS[s].label}
              </span>
            ))}
          </div>

          <div
            className="relative mx-auto aspect-[4/3] w-full max-w-[560px]"
            style={{ perspective: '1100px' }}
          >
            <div
              className="absolute inset-0 rounded-2xl border border-gold/15"
              style={{
                transform: 'rotateX(50deg) rotateZ(-14deg)',
                transformStyle: 'preserve-3d',
                background:
                  'radial-gradient(ellipse 60% 55% at 50% 40%, rgba(212,175,55,0.12), transparent 70%), linear-gradient(160deg, #14110c, #0a0a0a)',
                boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)',
              }}
            >
              {/* entrance */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-t-md border border-b-0 border-gold/30 bg-void px-4 py-1 text-[0.55rem] uppercase tracking-[0.16em] text-gold-soft">
                Entrance
              </div>
              {/* window strip */}
              <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-gold/50 via-gold/10 to-gold/50" />
              {/* plants */}
              {[
                [6, 6],
                [92, 90],
              ].map(([x, y], i) => (
                <span
                  key={i}
                  className="absolute h-3 w-3 rounded-full"
                  style={{ left: `${x}%`, top: `${y}%`, background: 'radial-gradient(circle,#3f8a35,#173d17)' }}
                />
              ))}

              {FLOOR_TABLES.map((t) => {
                const st = STATUS[t.status]
                const on = selected === t.id
                const clickable = t.status !== 'booked'
                return (
                  <button
                    key={t.id}
                    disabled={!clickable}
                    onClick={() => setSelected(t.id)}
                    className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border text-[0.55rem] font-semibold transition-all"
                    style={{
                      left: `${t.x}%`,
                      top: `${t.y}%`,
                      width: t.seats >= 6 ? 46 : 34,
                      height: t.seats >= 6 ? 34 : 26,
                      color: '#f5e7c1',
                      borderColor: on ? '#d4af37' : st.ring,
                      background: on
                        ? 'linear-gradient(160deg, rgba(212,175,55,0.35), rgba(212,175,55,0.12))'
                        : 'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
                      boxShadow: on
                        ? '0 0 22px rgba(212,175,55,0.55)'
                        : `0 0 12px ${st.ring}`,
                      cursor: clickable ? 'pointer' : 'not-allowed',
                      opacity: clickable ? 1 : 0.55,
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.dot }} />
                    {t.id}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* RIGHT — details */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass flex flex-col rounded-3xl p-6"
        >
          <AnimatePresence mode="wait">
            {table ? (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-cream-dim">Table</p>
                <p className="font-display text-4xl text-cream">{table.id}</p>

                <span
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.65rem]"
                  style={{ borderColor: STATUS[table.status].ring, color: STATUS[table.status].dot }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS[table.status].dot }} />
                  {STATUS[table.status].label}
                </span>

                <div className="mt-6 space-y-3 text-sm text-cream-dim">
                  <p className="flex items-center gap-2.5">
                    <Window className="text-gold" /> {KIND_LABEL[table.kind]}
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Users className="text-gold" /> {table.seats} Seats
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Star className="text-gold" /> Best for {table.best}
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Clock className="text-gold" /> 07:00 PM{' '}
                    <span style={{ color: STATUS[table.status].dot }}>
                      {table.status === 'available' ? 'Available' : table.status === 'soon' ? 'Filling fast' : 'Unavailable'}
                    </span>
                  </p>
                </div>

                <button
                  disabled={table.status === 'booked'}
                  className="btn btn-gold mt-8 w-full disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Reserve This Table <Arrow size={15} />
                </button>
              </motion.div>
            ) : (
              <p className="my-auto text-center text-sm text-cream-dim">Select a table on the floor plan.</p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
