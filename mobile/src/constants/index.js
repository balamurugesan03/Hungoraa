export { COLORS, GRADIENTS } from './colors';
export { FONTS, SIZES, LINE_HEIGHTS } from './fonts';
export {
  COLOR, RADII, ELEVATION, MOTION, GRADIENT, scale, SCREEN_WIDTH, FONT, text, theme,
} from '../theme';

export const 
API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// Blue-tinted layered elevation (logo blue), for a subtle 3D lift off the
// light-blue app background.
export const SHADOW = {
  sm: {
    shadowColor: '#0C2F4E',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  md: {
    shadowColor: '#0C2F4E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 9,
  },
  lg: {
    shadowColor: '#0C2F4E',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.22,
    shadowRadius: 40,
    elevation: 20,
  },
};

export const CUISINE_ICONS = {
  indian: '🍛',
  chinese: '🥢',
  italian: '🍕',
  mexican: '🌮',
  japanese: '🍣',
  thai: '🍜',
  continental: '🥩',
  seafood: '🦞',
  desserts: '🍰',
  cafe: '☕',
  biryani: '🍚',
  pizza: '🍕',
  burger: '🍔',
};
