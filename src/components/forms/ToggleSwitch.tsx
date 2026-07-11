// ─────────────────────────────────────────────────────────────────────────────
// src/components/forms/ToggleSwitch.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label: string;
  sublabel?: string;
  accessibilityLabel?: string;
}

const TRACK_W = 50;
const TRACK_H = 28;
const THUMB_SIZE = 22;
const THUMB_OFFSET = 3;

export function ToggleSwitch({
  value,
  onValueChange,
  label,
  sublabel,
  accessibilityLabel,
}: ToggleSwitchProps) {
  const thumbX = useSharedValue(value ? TRACK_W - THUMB_SIZE - THUMB_OFFSET : THUMB_OFFSET);

  const toggle = useCallback(() => {
    const next = !value;
    thumbX.value = withSpring(next ? TRACK_W - THUMB_SIZE - THUMB_OFFSET : THUMB_OFFSET, {
      damping: 15,
      stiffness: 220,
    });
    onValueChange(next);
  }, [value, onValueChange, thumbX]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={toggle}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={styles.labels}>
        <Text style={styles.label}>{label}</Text>
        {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
      </View>
      <View
        style={[
          styles.track,
          { backgroundColor: value ? Colors.primary : Colors.border },
        ]}
      >
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  labels: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  sublabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});
