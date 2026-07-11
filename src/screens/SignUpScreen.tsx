// ─────────────────────────────────────────────────────────────────────────────
// src/screens/SignUpScreen.tsx
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
import { signup as signupApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { extractErrorMessage } from '../utils/formatters';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AuthStackParamList, SignupRequest } from '../types';

type Props = StackScreenProps<AuthStackParamList, 'SignUp'>;

interface ExtendedSignupRequest extends SignupRequest {
  confirm_password?: string;
}

export function SignUpScreen({ navigation }: Props) {
  const { loginSuccess } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExtendedSignupRequest>({
    defaultValues: { display_name: '', email: '', password: '', confirm_password: '' },
  });

  const passwordVal = watch('password');

  const onSubmit = async (data: ExtendedSignupRequest) => {
    setLoading(true);
    try {
      const response = await signupApi({
        display_name: data.display_name,
        email: data.email,
        password: data.password,
      });
      await loginSuccess(response);
      Toast.show({
        type: 'success',
        text1: 'Account Created!',
        text2: `Logged in as ${response.display_name}`,
      });
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
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
          <Text style={styles.brand}>
            Join EyeScan <Text style={styles.brandAccent}>AI</Text>
          </Text>
          <Text style={styles.subtitle}>Start tracking your diagnostic history securely</Text>
        </View>

        <GlassCard style={styles.card} glowColor={Colors.borderGlow}>
          <Controller
            control={control}
            name="display_name"
            rules={{ required: 'Full name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Full Name"
                placeholder="Enter your name"
                autoCapitalize="words"
                autoComplete="name"
                leftIcon="person-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.display_name?.message}
              />
            )}
          />

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
                placeholder="Choose password"
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

          <Controller
            control={control}
            name="confirm_password"
            rules={{
              required: 'Confirm password is required',
              validate: (val) => val === passwordVal || 'Passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Confirm Password"
                placeholder="Re-enter password"
                secureToggle
                autoCapitalize="none"
                leftIcon="lock-closed-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.confirm_password?.message}
              />
            )}
          />

          <PrimaryButton
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.button}
          />
        </GlassCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
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
    paddingTop: Platform.OS === 'ios' ? 100 : 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brand: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['3xl'],
    color: Colors.text,
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
    marginTop: 24,
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  loginLink: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
});
