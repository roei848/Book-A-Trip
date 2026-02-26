export const theme = {
  colors: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#64748b',
    secondaryHover: '#475569',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    error: '#ef4444',
    accent: '#7c3aed',
    accentEnd: '#6366f1',
    warning: '#f59e0b',
    gradientStart: '#0f172a',
    gradientMid: '#1e1b4b',
    gradientEnd: '#312e81',
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
