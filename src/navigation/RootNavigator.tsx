// ─────────────────────────────────────────────────────────────────────────────
// src/navigation/RootNavigator.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { SplashScreen } from '../screens/SplashScreen';
import type { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen isInitializing />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      ) : (
        <Stack.Screen name="AppTabs" component={AppTabs} />
      )}
    </Stack.Navigator>
  );
}
