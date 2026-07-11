// ─────────────────────────────────────────────────────────────────────────────
// src/components/ui/LoadingOverlay.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false,
      );
      pulse.value = withRepeat(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    }
  }, [visible, rotation, pulse]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: pulse.value }],
  }));

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Glow ring */}
          <Animated.View style={[styles.glowRing, glowStyle]} />

          {/* Spinner */}
          <Animated.View style={[styles.spinner, spinStyle]}>
            <View style={styles.spinnerArc} />
          </Animated.View>

          {/* Eye icon centre */}
          <View style={styles.iconCentre}>
            <View style={styles.eyeOuter}>
              <View style={styles.eyeInner} />
            </View>
          </View>

          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const SPINNER_SIZE = 64;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 160,
    paddingVertical: 32,
    backgroundColor: Colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderGlow,
    alignItems: 'center',
    gap: 16,
  },
  glowRing: {
    position: 'absolute',
    width: SPINNER_SIZE + 24,
    height: SPINNER_SIZE + 24,
    borderRadius: (SPINNER_SIZE + 24) / 2,
    backgroundColor: Colors.primaryGlow,
    top: 32 - 12,
  },
  spinner: {
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    borderRadius: SPINNER_SIZE / 2,
  },
  spinnerArc: {
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    borderRadius: SPINNER_SIZE / 2,
    borderWidth: 4,
    borderColor: Colors.primary,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  iconCentre: {
    position: 'absolute',
    top: 32,
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeOuter: {
    width: 22,
    height: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeInner: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  message: {
    color: Colors.textMuted,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
