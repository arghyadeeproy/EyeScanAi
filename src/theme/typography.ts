// ─────────────────────────────────────────────────────────────────────────────
// src/theme/typography.ts
// ─────────────────────────────────────────────────────────────────────────────

import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';

export { useFonts };

export const FontWeights = {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
};

export const FontFamily = {
  light:     'Inter_300Light',
  regular:   'Inter_400Regular',
  medium:    'Inter_500Medium',
  semiBold:  'Inter_600SemiBold',
  bold:      'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
};

export const FontSize = {
  xs:   11,
  sm:   13,
  md:   15,
  base: 16,
  lg:   18,
  xl:   20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
  '5xl': 42,
};

export const LineHeight = {
  tight:  1.2,
  normal: 1.5,
  loose:  1.8,
};
