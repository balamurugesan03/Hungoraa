type IconProps = { size?: number; className?: string }

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export function IconCalendar({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </svg>
  )
}

export function IconReceipt({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 3h12v18l-2.5-1.6L13 21l-1-1.6-1 1.6-2.5-1.6L6 21V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  )
}

export function IconTag({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 12.5 11.5 3H19a2 2 0 0 1 2 2v7.5L12.5 21a2 2 0 0 1-2.8 0L3 13.8a2 2 0 0 1 0-2.8Z" />
      <circle cx="15.5" cy="8.5" r="1.5" />
    </svg>
  )
}

export function IconWallet({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" />
      <path d="M3 7v10a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H6a2 2 0 0 1 0-4" />
      <circle cx="16.5" cy="14" r="1.4" />
    </svg>
  )
}

export function IconStar({ size, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
      <path d="M12 2.5l2.9 6.1 6.6.7-5 4.5 1.4 6.6L12 17l-5.9 3.4 1.4-6.6-5-4.5 6.6-.7L12 2.5Z" />
    </svg>
  )
}

export function IconArrowRight({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  )
}

export function IconChevron({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function IconBolt({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  )
}

export function IconShield({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function IconFork({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 2v8M5 2v6a2 2 0 0 0 4 0V2M7 10v12" />
      <path d="M17 2c-2 0-3 2-3 5s1 4 3 5v10" />
    </svg>
  )
}

export function IconApple({ size, className }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor" stroke="none" viewBox="0 0 24 24" className={className}>
      <path d="M16.7 12.4c0-2.6 2.1-3.9 2.2-4-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.3 3.1-2.5.7-1 1.1-2 1.4-3-1.9-.7-3-2.6-3-3.7Z" />
      <path d="M14.7 4.3c.7-.9 1.2-2.1 1-3.3-1.1 0-2.4.7-3.1 1.6-.7.8-1.2 2-1 3.2 1.2.1 2.4-.6 3.1-1.5Z" />
    </svg>
  )
}

export function IconPlay({ size, className }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor" stroke="none" viewBox="0 0 24 24" className={className}>
      <path d="M4.5 2.7c0-.6.6-1 1.2-.7l14.6 9.3c.5.3.5 1 0 1.4L5.7 22c-.6.3-1.2-.1-1.2-.7V2.7Z" />
    </svg>
  )
}

export function IconQr({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
    </svg>
  )
}
