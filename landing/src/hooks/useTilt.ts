import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/** Applies a mouse-following 3D tilt + gloss highlight to the returned element. */
export function useTilt<T extends HTMLElement>(strength = 14) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const quickX = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power3.out' })
    const quickY = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power3.out' })

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      quickX(-py * strength)
      quickY(px * strength)
    }

    function onLeave() {
      quickX(0)
      quickY(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return ref
}
