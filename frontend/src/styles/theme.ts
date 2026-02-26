export const theme = {
  colors: {
    primary: 'var(--color-primary)',
    primaryHover: 'var(--color-primary-hover)',
    secondary: 'var(--color-secondary)',
    secondaryHover: 'var(--color-secondary-hover)',
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    text: 'var(--color-text)',
    textLight: 'var(--color-text-light)',
    border: 'var(--color-border)',
    error: 'var(--color-error)',
    accent: 'var(--color-accent)',
    accentEnd: 'var(--color-accent-end)',
    warning: 'var(--color-warning)',
    gradientStart: 'var(--color-gradient-start)',
    gradientMid: 'var(--color-gradient-mid)',
    gradientEnd: 'var(--color-gradient-end)',
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: '8px',
} as const;

export type Theme = typeof theme;
