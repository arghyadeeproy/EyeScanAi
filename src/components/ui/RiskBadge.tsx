// ─────────────────────────────────────────────────────────────────────────────
// src/components/ui/RiskBadge.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getRiskColor, getRiskLabel } from '../../utils/formatters';
import { FontFamily, FontSize } from '../../theme/typography';
import type { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const color = getRiskColor(level);
  const label = getRiskLabel(level);

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' && styles.sm,
        size === 'lg' && styles.lg,
        {
          backgroundColor: `${color}20`,
          borderColor: `${color}60`,
        },
      ]}
      accessibilityLabel={`Risk level: ${label}`}
    >
      <Text
        style={[
          styles.text,
          size === 'sm' && styles.textSm,
          size === 'lg' && styles.textLg,
          { color },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lg: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  text: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    letterSpacing: 0.8,
  },
  textSm: {
    fontSize: 10,
  },
  textLg: {
    fontSize: FontSize.sm,
  },
});
