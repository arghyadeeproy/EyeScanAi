// ─────────────────────────────────────────────────────────────────────────────
// src/theme/colors.ts
// ─────────────────────────────────────────────────────────────────────────────

export const Colors = {
  background:   '#0A0A0A',
  surface:      '#141414',
  card:         '#1A1A1A',
  cardAlt:      '#1F1F1F',
  border:       '#2A2A2A',
  borderGlow:   '#F5C51840',

  primary:      '#F5C518',   // amber yellow
  primaryDark:  '#C9A000',
  primaryLight: '#FFD700',
  primaryGlow:  'rgba(245, 197, 24, 0.25)',
  primaryGlow2: 'rgba(245, 197, 24, 0.10)',

  text:         '#FFFFFF',
  textMuted:    '#9E9E9E',
  textDim:      '#6B6B6B',

  danger:       '#FF4444',
  dangerGlow:   'rgba(255, 68, 68, 0.25)',
  success:      '#44BB77',
  successGlow:  'rgba(68, 187, 119, 0.25)',
  warning:      '#F5C518',
  warningGlow:  'rgba(245, 197, 24, 0.25)',

  // Glass effect layers
  glass:        'rgba(255, 255, 255, 0.04)',
  glassBorder:  'rgba(255, 255, 255, 0.08)',

  overlay:      'rgba(0, 0, 0, 0.75)',

  tabBar:       '#111111',
  tabBarBorder: '#1E1E1E',
} as const;

export type ColorKey = keyof typeof Colors;
