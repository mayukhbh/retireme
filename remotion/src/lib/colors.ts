// RetireMe Cosmic Color Palette
export const colors = {
  // Background colors
  spaceBg: '#020616',
  space950: '#020616',
  space900: '#050819',
  space800: '#0B1120',

  // Primary accent - Cosmic Purple
  cosmic600: '#9333EA',
  cosmic500: '#A855F7',
  cosmic400: '#C084FC',

  // Secondary accent - Cyan
  cyan500: '#06B6D4',
  cyan400: '#22D3EE',

  // Semantic colors
  emerald500: '#10B981',
  amber500: '#F59E0B',
  red500: '#EF4444',

  // Neutral
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  white: '#FFFFFF',

  // Gradients
  gradients: {
    cosmicPurple: 'linear-gradient(135deg, #9333EA 0%, #A855F7 100%)',
    cosmicCyan: 'linear-gradient(135deg, #A855F7 0%, #22D3EE 100%)',
    cosmicFull: 'linear-gradient(135deg, #C084FC 0%, #A855F7 50%, #22D3EE 100%)',
    lifestyle: 'linear-gradient(to right, #10B981, #22D3EE, #F59E0B)',
  },
} as const;

// Scene-specific color configs
export const sceneColors = {
  baseline: {
    primary: colors.slate400,
    accent: colors.slate300,
  },
  skillBoosted: {
    primary: colors.cosmic500,
    accent: colors.cosmic400,
  },
  geoArbitrage: {
    primary: colors.cyan400,
    accent: colors.cyan500,
  },
} as const;
