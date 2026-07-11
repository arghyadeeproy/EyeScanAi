// ─────────────────────────────────────────────────────────────────────────────
// src/screens/LoginScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { InputField } from '../components/forms/InputField';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { extractErrorMessage } from '../utils/formatters';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AuthStackParamList, LoginRequest } from '../types';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { loginSuccess } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const response = await loginApi(data);
      await loginSuccess(response);
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: `Logged in as ${response.display_name}`,
      });
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.brand}>
            EyeScan <Text style={styles.brandAccent}>AI</Text>
          </Text>
          <Text style={styles.subtitle}>Sign in to scan and track your eye health</Text>
        </View>

        <GlassCard style={styles.card} glowColor={Colors.borderGlow}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon="mail-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Password"
                placeholder="Enter your password"
                secureToggle
                autoCapitalize="none"
                leftIcon="lock-closed-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          <PrimaryButton
            title="Log In"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.button}
          />
        </GlassCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xl,
    color: Colors.textMuted,
  },
  brand: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['4xl'],
    color: Colors.text,
    marginTop: 4,
    letterSpacing: 1,
  },
  brandAccent: {
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(26, 26, 26, 0.45)',
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  signUpLink: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
});
