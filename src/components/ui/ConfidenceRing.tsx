// ─────────────────────────────────────────────────────────────────────────────
// src/components/ui/ConfidenceRing.tsx
// Circular progress ring using pure RN (no SVG dependency)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';

interface ConfidenceRingProps {
  /** 0–1 */
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export function ConfidenceRing({
  value,
  size = 110,
  strokeWidth = 10,
  color = Colors.primary,
  label,
}: ConfidenceRingProps) {
  const pct = Math.max(0, Math.min(1, value));
  const degrees = pct * 360;

  // Shared value drives the two half-circle clips
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(pct, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [pct, progress]);

  // Right half: 0–50% fills 0–180°
  const rightStyle = useAnimatedStyle(() => {
    const deg = Math.min(progress.value, 0.5) * 360;
    return { transform: [{ rotate: `${deg}deg` }] };
  });

  // Left half: 50–100% fills 180–360°
  const leftStyle = useAnimatedStyle(() => {
    if (progress.value <= 0.5) return { opacity: 0 };
    const deg = (progress.value - 0.5) * 360;
    return { opacity: 1, transform: [{ rotate: `${deg}deg` }] };
  });

  const inner = size - strokeWidth * 2;
  const pctInt = Math.round(pct * 100);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Track */}
      <View
        style={[
          styles.track,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: `${color}22`,
          },
        ]}
      />

      {/* Right half (0–180°) */}
      <View style={[styles.halfWrap, { width: size / 2, height: size, left: size / 2 }]}>
        <Animated.View
          style={[
            styles.halfCircle,
            rightStyle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              left: -size / 2,
            },
          ]}
        />
      </View>

      {/* Left half (180–360°) */}
      <View style={[styles.halfWrap, { width: size / 2, height: size, right: size / 2, left: 0 }]}>
        <Animated.View
          style={[
            styles.halfCircle,
            leftStyle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
            },
          ]}
        />
      </View>

      {/* Centre label */}
      <View
        style={[
          styles.centre,
          {
            width: inner,
            height: inner,
            borderRadius: inner / 2,
            backgroundColor: Colors.card,
          },
        ]}
      >
        <Text style={[styles.pct, { color }]}>{pctInt}%</Text>
        {label ? <Text style={styles.sublabel}>{label}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
  },
  halfWrap: {
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  centre: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  pct: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
  sublabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
});
