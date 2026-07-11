// ─────────────────────────────────────────────────────────────────────────────
// src/components/forms/InputField.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  secureToggle?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
}

export function InputField({
  label,
  error,
  secureToggle = false,
  leftIcon,
  style,
  ...rest
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const borderAnim = useSharedValue(0);

  const handleFocus = useCallback(() => {
    setFocused(true);
    borderAnim.value = withTiming(1, { duration: 200 });
  }, [borderAnim]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    borderAnim.value = withTiming(0, { duration: 200 });
  }, [borderAnim]);

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: error
      ? Colors.danger
      : borderAnim.value === 1
      ? Colors.primary
      : Colors.border,
    shadowOpacity: borderAnim.value * 0.4,
    shadowColor: Colors.primary,
    shadowRadius: borderAnim.value * 8,
  }));

  return (
    <View style={[styles.wrapper, style as object]}>
      <Text style={[styles.label, focused && styles.labelFocused, error ? styles.labelError : null]}>
        {label}
      </Text>
      <Animated.View style={[styles.inputRow, borderStyle]}>
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={18}
            color={focused ? Colors.primary : Colors.textMuted}
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          {...rest}
          style={styles.input}
          placeholderTextColor={Colors.textDim}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureToggle ? !showPass : rest.secureTextEntry}
          selectionColor={Colors.primary}
          cursorColor={Colors.primary}
          accessibilityLabel={label}
        />
        {secureToggle ? (
          <TouchableOpacity
            onPress={() => setShowPass((v) => !v)}
            style={styles.eyeBtn}
            accessibilityLabel={showPass ? 'Hide password' : 'Show password'}
          >
            <Ionicons
              name={showPass ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </Animated.View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  labelFocused: {
    color: Colors.primary,
  },
  labelError: {
    color: Colors.danger,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  leftIcon: {
    marginLeft: 14,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 14,
    color: Colors.text,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
  },
  eyeBtn: {
    paddingHorizontal: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    marginTop: 6,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.danger,
  },
});
