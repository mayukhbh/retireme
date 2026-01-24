// Load Inter font from Google Fonts
// In Remotion, we can use Google Fonts directly via CSS or load locally

export const loadFonts = async () => {
  // Use the @remotion/google-fonts package or inline import
  // For now, we'll use system fonts with fallbacks
};

export const fontFamilies = {
  primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
  '9xl': 128,
} as const;

// Typography presets
export const typography = {
  hero: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['7xl'],
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  headline: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['5xl'],
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  subheadline: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes['3xl'],
    lineHeight: 1.3,
  },
  body: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.lg,
    lineHeight: 1.6,
  },
  label: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.sm,
    lineHeight: 1.4,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  stat: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.extrabold,
    fontSize: fontSizes['8xl'],
    lineHeight: 1,
    letterSpacing: '-0.03em',
  },
} as const;
