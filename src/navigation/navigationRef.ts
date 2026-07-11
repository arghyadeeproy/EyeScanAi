// ─────────────────────────────────────────────────────────────────────────────
// src/navigation/navigationRef.ts
// Navigation reference used by the axios interceptor to redirect outside React
// ─────────────────────────────────────────────────────────────────────────────

import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateToLogin(): void {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    });
  }
}
