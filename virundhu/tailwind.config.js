/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#080808',
        deep: '#030303',
        panel: '#100f0e',
        gold: '#D4AF37',
        'gold-soft': '#E8CF8A',
        cream: '#F5E7C1',
        'cream-dim': '#C9BC9C',
        leaf: '#2E7D32',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Cinzel', 'Georgia', 'serif'],
        script: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.22em',
      },
      boxShadow: {
        'gold-glow': '0 0 40px -8px rgba(212,175,55,0.45)',
        'card-lux': '0 30px 60px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(245,231,193,0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'float-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
