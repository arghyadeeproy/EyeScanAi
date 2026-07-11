// ─────────────────────────────────────────────────────────────────────────────
// src/navigation/AuthStack.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import type { AuthStackParamList } from '../types';

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontFamily: FontFamily.bold,
          color: Colors.text,
        },
        headerTintColor: Colors.primary,
        cardStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          title: 'Create Account',
          headerTransparent: true,
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
}
