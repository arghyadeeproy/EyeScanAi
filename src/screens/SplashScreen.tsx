// ─────────────────────────────────────────────────────────────────────────────
// src/screens/SplashScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AuthStackParamList } from '../types';

type Props = Partial<StackScreenProps<AuthStackParamList, 'Splash'>> & {
  isInitializing?: boolean;
};

const { width } = Dimensions.get('window');

export function SplashScreen({ navigation, isInitializing = false }: Props) {
  const pulse = useSharedValue(1);
  const opacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const underlineWidth = useSharedValue(0);

  useEffect(() => {
    // 1. Fade in the screen and logo
    opacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.back(1.5)),
    });

    // 2. Pulse the logo
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 3. Animate the underline accent
    underlineWidth.value = withTiming(width * 0.4, {
      duration: 1200,
      easing: Easing.out(Easing.quad),
    });

    // 4. Navigate after 2s using plain setTimeout (safe across Reanimated v3/v4)
    if (!isInitializing && navigation) {
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 400 });
        // Small extra delay so fade completes before navigation
        setTimeout(() => navigation.replace('Login'), 450);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [navigation, isInitializing]);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value * pulse.value }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedUnderlineStyle = useAnimatedStyle(() => ({
    width: underlineWidth.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={styles.content}>
        {/* Glow behind the logo */}
        <View style={styles.glow} />

        <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
          <Ionicons name="eye" size={80} color={Colors.primary} />
        </Animated.View>

        <Text style={styles.appName}>
          EyeScan <Text style={styles.accentText}>AI</Text>
        </Text>

        <View style={styles.underlineContainer}>
          <Animated.View style={[styles.underline, animatedUnderlineStyle]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primaryGlow,
    opacity: 0.6,
  },
  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['3xl'],
    color: Colors.text,
    letterSpacing: 1.5,
  },
  accentText: {
    color: Colors.primary,
  },
  underlineContainer: {
    height: 3,
    marginTop: 12,
    alignItems: 'center',
  },
  underline: {
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 1.5,
  },
});
