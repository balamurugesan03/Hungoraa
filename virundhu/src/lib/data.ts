export const NAV_LINKS = [
  { label: 'HOME', href: '#home' },
  { label: 'EXPLORE', href: '#explore' },
  { label: 'MENU', href: '#menu' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'GALLERY', href: '#gallery' },
  { label: 'CONTACT', href: '#contact' },
]

export type StateCard = {
  id: string
  name: string
  lines: [string, string]
  blurb: string
  grad: string
}

export const STATES: StateCard[] = [
  {
    id: 'tn',
    name: 'TAMIL NADU',
    lines: ['Chettinad Flavors', 'Kongu Delicacies'],
    blurb: 'Fire-roasted spice blends, black pepper and stone-ground masalas.',
    grad: 'linear-gradient(155deg, #3a1c10, #12100c 70%)',
  },
  {
    id: 'kl',
    name: 'KERALA',
    lines: ['Sadya', 'Seafood Special'],
    blurb: 'Coconut, curry leaf and the slow warmth of the Malabar coast.',
    grad: 'linear-gradient(155deg, #123020, #0d100c 70%)',
  },
  {
    id: 'ka',
    name: 'KARNATAKA',
    lines: ['Bisi Bele Bath', 'Mysore Delicacies'],
    blurb: 'Royal Mysore kitchens — ghee, jaggery and gentle heat.',
    grad: 'linear-gradient(155deg, #2c2410, #10100c 70%)',
  },
  {
    id: 'ap',
    name: 'ANDHRA',
    lines: ['Spicy Curries', 'Gongura & More'],
    blurb: 'Unapologetic heat, tamarind sharpness and pickled greens.',
    grad: 'linear-gradient(155deg, #3a1414, #120e0c 70%)',
  },
]

export type Experience = {
  id: string
  title: string
  body: string
  cta: string
  glyph: string
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'ai',
    title: 'AI FOOD RECOMMENDATION',
    body: 'Let our AI suggest the perfect meal based on your taste.',
    cta: 'TRY NOW',
    glyph: 'spark',
  },
  {
    id: 'dining',
    title: 'EXPERIENCE DINING',
    body: 'More than just food. Choose the ambiance that matches your occasion.',
    cta: 'EXPLORE',
    glyph: 'flame',
  },
  {
    id: 'gallery',
    title: 'GALLERY',
    body: 'A glimpse of our food, ambiance and happy guests.',
    cta: 'VIEW GALLERY',
    glyph: 'frames',
  },
  {
    id: 'events',
    title: 'SPECIAL EVENTS',
    body: 'Celebrate your special moments with us. We make it memorable.',
    cta: 'KNOW MORE',
    glyph: 'star',
  },
]

export type MenuCategory = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'DESSERTS' | 'BEVERAGES'

export type Dish = {
  name: string
  desc: string
  price: string
  cat: MenuCategory
  model: import('../components/three/dishes').DishId
}

export const DISHES: Dish[] = [
  { name: 'Masala Dosa', desc: 'Crisp fermented crepe, mustard-tempered potato, sambar & chutney.', price: '₹280', cat: 'BREAKFAST', model: 'dosa' },
  { name: 'Podi Idli', desc: 'Steamed rice cakes tossed in ghee and gunpowder podi.', price: '₹190', cat: 'BREAKFAST', model: 'idli-vada' },
  { name: 'Appam', desc: 'Lace-edged hoppers, coconut milk, soft centre.', price: '₹220', cat: 'BREAKFAST', model: 'naan' },
  { name: 'Chettinad Chicken', desc: 'Black-pepper roast, star anise and stone-ground masala.', price: '₹460', cat: 'LUNCH', model: 'butter-chicken' },
  { name: 'Kerala Fish Curry', desc: 'Kodampuli-soured coconut gravy, line-caught catch.', price: '₹520', cat: 'LUNCH', model: 'butter-chicken' },
  { name: 'Hyderabadi Biryani', desc: 'Dum-cooked basmati, saffron, slow-spiced meat.', price: '₹480', cat: 'DINNER', model: 'biryani' },
  { name: 'Malabar Parotta', desc: 'Hand-slapped flaky layers, off the tawa.', price: '₹120', cat: 'DINNER', model: 'naan' },
  { name: 'Mysore Pak', desc: 'Ghee-rich gram-flour fudge that melts on contact.', price: '₹160', cat: 'DESSERTS', model: 'dessert' },
  { name: 'Payasam', desc: 'Slow-reduced milk, cardamom, toasted cashew.', price: '₹180', cat: 'DESSERTS', model: 'dessert' },
  { name: 'Filter Coffee', desc: 'Dark decoction, first-press milk, tumbler & dabarah.', price: '₹90', cat: 'BEVERAGES', model: 'dessert' },
]

export const GALLERY: { label: string; grad: string; tall?: boolean }[] = [
  { label: 'Banana leaf sadya', grad: 'linear-gradient(160deg,#16351f,#0b0f0b)', tall: true },
  { label: 'Brass thali', grad: 'linear-gradient(160deg,#3a2c12,#100d09)' },
  { label: 'Candlelit table', grad: 'linear-gradient(160deg,#2a1a10,#0c0a08)' },
  { label: 'Dosa on the tawa', grad: 'linear-gradient(160deg,#3a2410,#100c09)', tall: true },
  { label: 'Chef at the pass', grad: 'linear-gradient(160deg,#1c1c1c,#0a0a0a)' },
  { label: 'Spice mise en place', grad: 'linear-gradient(160deg,#3a1414,#120d0c)' },
  { label: 'Private dining room', grad: 'linear-gradient(160deg,#241d10,#0e0c09)', tall: true },
  { label: 'Payasam pour', grad: 'linear-gradient(160deg,#2c2418,#0d0b09)' },
]

export type TableStatus = 'available' | 'soon' | 'booked'
export type FloorTable = {
  id: string
  x: number
  y: number
  seats: number
  kind: 'window' | 'couple' | 'family' | 'private'
  status: TableStatus
  best: string
}

export const FLOOR_TABLES: FloorTable[] = [
  { id: '01', x: 14, y: 22, seats: 2, kind: 'window', status: 'available', best: 'Romantic' },
  { id: '02', x: 14, y: 52, seats: 2, kind: 'window', status: 'booked', best: 'Romantic' },
  { id: '03', x: 14, y: 80, seats: 4, kind: 'window', status: 'available', best: 'Family' },
  { id: '04', x: 40, y: 30, seats: 2, kind: 'couple', status: 'soon', best: 'Romantic' },
  { id: '05', x: 40, y: 62, seats: 4, kind: 'family', status: 'available', best: 'Family' },
  { id: '06', x: 62, y: 24, seats: 6, kind: 'family', status: 'available', best: 'Celebration' },
  { id: '07', x: 62, y: 58, seats: 4, kind: 'family', status: 'available', best: 'Family' },
  { id: '08', x: 85, y: 30, seats: 8, kind: 'private', status: 'soon', best: 'Business' },
  { id: '09', x: 85, y: 66, seats: 10, kind: 'private', status: 'booked', best: 'Celebration' },
]

export const EXPERIENCE_TYPES = [
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'romantic', label: 'Romantic', emoji: '❤️' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'celebration', label: 'Celebration', emoji: '🎉' },
]

export const SOCIALS = ['Instagram', 'Facebook', 'YouTube', 'WhatsApp']
