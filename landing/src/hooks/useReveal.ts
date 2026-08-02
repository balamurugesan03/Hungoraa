import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type RevealOptions = {
  y?: number
  duration?: number
  stagger?: number
  start?: string
}

/** Animates the direct children of the returned ref in as they scroll into view. */
export function useStaggerReveal<T extends HTMLElement>({
  y = 36,
  duration = 0.9,
  stagger = 0.12,
  start = 'top 82%',
}: RevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = Array.from(el.children)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start,
          },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return ref
}

/** Animates the returned element itself as it scrolls into view. */
export function useRevealSelf<T extends HTMLElement>({
  y = 40,
  duration = 1,
  start = 'top 85%',
}: RevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start,
          },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return ref
}
