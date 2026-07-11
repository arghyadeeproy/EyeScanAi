// ─────────────────────────────────────────────────────────────────────────────
// src/context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearAllTokens,
  getAllStoredUser,
  saveTokens,
} from '../utils/secureStorage';
import type { AuthResponse, MeResponse } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
  uid: string;
  display_name: string;
  email: string;
  email_verified?: boolean;
  photo_url?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginSuccess: (response: AuthResponse) => Promise<void>;
  updateUser: (me: MeResponse) => void;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Bootstrap: restore session from SecureStore on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await getAllStoredUser();
        if (stored.id_token && stored.uid) {
          setUser({
            uid:          stored.uid,
            display_name: stored.display_name ?? 'User',
            email:        stored.email ?? '',
          });
        }
      } catch {
        // Ignore read errors — treat as logged out
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    })();
  }, []);

  const loginSuccess = useCallback(async (response: AuthResponse) => {
    await saveTokens({
      id_token:      response.id_token,
      refresh_token: response.refresh_token,
      uid:           response.uid,
      display_name:  response.display_name,
      email:         response.email,
    });
    setUser({
      uid:          response.uid,
      display_name: response.display_name,
      email:        response.email,
    });
  }, []);

  const updateUser = useCallback((me: MeResponse) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            email:          me.email,
            display_name:   me.display_name,
            email_verified: me.email_verified,
            photo_url:      me.photo_url,
          }
        : null,
    );
  }, []);

  const logout = useCallback(async () => {
    await clearAllTokens();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      loginSuccess,
      updateUser,
      logout,
    }),
    [user, isLoading, loginSuccess, updateUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
