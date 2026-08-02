export { COLORS, GRADIENTS } from './colors';
export { FONTS, SIZES, LINE_HEIGHTS } from './fonts';

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

export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
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
