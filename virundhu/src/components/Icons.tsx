type P = { size?: number; className?: string }
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export const Arrow = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const Play = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
  </svg>
)
export const Menu = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </svg>
)
export const Close = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const Heart = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 20s-7-4.35-9.5-8.5C.8 8.4 2.4 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.6 0 5.2 3.4 3.5 6.5C19 15.65 12 20 12 20Z" />
  </svg>
)
export const Spark = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
  </svg>
)
export const Flame = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 22c3.87 0 6-2.6 6-6 0-3-2-5-3-7-.5 1.5-1.5 2-2.5 2 .5-2 .2-4.5-2.5-7-.3 3-2 4-3.5 6C5 6 4 8 4 11c0 4.5 3 11 8 11Z" />
  </svg>
)
export const Frames = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="6" width="11" height="13" rx="1" transform="rotate(-6 3 6)" />
    <rect x="10" y="5" width="11" height="13" rx="1" transform="rotate(7 10 5)" />
  </svg>
)
export const Star = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.8L12 3.5Z" />
  </svg>
)
export const Window = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <path d="M12 4v16M4 12h16" />
  </svg>
)
export const Users = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c.7-3 3-4.5 5.5-4.5S13.8 16 14.5 19M16 6.5a3 3 0 0 1 0 5.6M20.5 19c-.4-2-1.6-3.4-3.2-4" />
  </svg>
)
export const Clock = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)
export const Pin = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)
export const Phone = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 3h4l1.5 5-2.5 1.5a12 12 0 0 0 5.5 5.5L16 17.5 21 19v4a1 1 0 0 1-1 1C10.6 24 0 13.4 0 4a1 1 0 0 1 1-1Z" transform="translate(1.5 -1.5) scale(0.9)" />
  </svg>
)
export const Mail = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
)
export const Scroll = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="8.5" y="3" width="7" height="13" rx="3.5" />
    <path d="M12 6.5v3M12 20l-2.5-2.5M12 20l2.5-2.5M12 20v-1.5" />
  </svg>
)
