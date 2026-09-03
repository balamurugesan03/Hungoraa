# VIRUNDHU

> Beyond Food. Into Experience.

A cinematic, dark-luxury marketing site for a premium South Indian fine-dining
brand. Standalone from the Hungora apps.

**Stack:** Vite · React 18 · TypeScript · Tailwind CSS · Framer Motion · GSAP ·
React Three Fiber / three.js

## Run

```bash
npm install
npm run dev      # http://localhost:5175
npm run build    # tsc + vite build  ->  dist/
npm run preview
```

## Design system

- Near-black `#080808`, Temple Gold `#D4AF37`, warm cream `#F5E7C1`,
  banana-leaf green `#2E7D32`
- Playfair Display / Cinzel headings, Inter body
- SVG film grain, glassmorphism, soft golden glows

## Sections

Navbar (glassmorphic on scroll) · Hero (3D banana-leaf food composition,
mouse parallax) · Explore South India (state cards + interactive map card) ·
**Book Your Table** — the signature: booking form + isometric floor plan with
clickable, status-coloured tables + live table details · Premium Experience
cards · Menu Experience (3D-tilt floating dish cards) · Gallery (masonry) ·
Footer.

3D dish models live in `src/components/three/dishes.tsx`.
