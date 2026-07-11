// ─────────────────────────────────────────────────────────────────────────────
// src/components/ui/PrimaryButton.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'filled',
  style,
  accessibilityLabel,
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    variant === 'filled' && styles.filled,
    variant === 'outlined' && styles.outlined,
    variant === 'ghost' && styles.ghost,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.label,
    variant === 'filled' && styles.labelFilled,
    variant === 'outlined' && styles.labelOutlined,
    variant === 'ghost' && styles.labelGhost,
    isDisabled && styles.labelDisabled,
  ];

  return (
    <AnimatedTouchable
      style={[animatedStyle, containerStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.9}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'filled' ? Colors.background : Colors.primary}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  filled: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primaryGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: Colors.primaryGlow2,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: FontSize.base,
    letterSpacing: 0.3,
  },
  labelFilled: {
    color: Colors.background,
    fontFamily: FontFamily.bold,
  },
  labelOutlined: {
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
  },
  labelGhost: {
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
  },
  labelDisabled: {
    opacity: 0.6,
  },
});
