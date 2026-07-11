// ─────────────────────────────────────────────────────────────────────────────
// src/components/ui/GlassCard.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  glowColor?: string;
  noPadding?: boolean;
}

export function GlassCard({
  children,
  style,
  glowColor = Colors.borderGlow,
  noPadding = false,
}: GlassCardProps) {
  return (
    <View style={[styles.shadow, { shadowColor: glowColor }]}>
      <View
        style={[
          styles.card,
          { borderColor: glowColor },
          !noPadding && styles.padding,
          style,
        ]}
      >
        {/* Inner subtle highlight */}
        <View style={styles.highlight} pointerEvents="none" />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padding: {
    padding: 20,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.glassBorder,
  },
});
