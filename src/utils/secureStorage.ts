// ─────────────────────────────────────────────────────────────────────────────
// src/utils/secureStorage.ts — Typed wrappers around expo-secure-store
// ─────────────────────────────────────────────────────────────────────────────

import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ID_TOKEN:      'eyescan_id_token',
  REFRESH_TOKEN: 'eyescan_refresh_token',
  UID:           'eyescan_uid',
  DISPLAY_NAME:  'eyescan_display_name',
  EMAIL:         'eyescan_email',
} as const;

// ─── Save ─────────────────────────────────────────────────────────────────────

export async function saveTokens(params: {
  id_token: string;
  refresh_token: string;
  uid: string;
  display_name: string;
  email?: string;
}): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.ID_TOKEN,      params.id_token),
    SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, params.refresh_token),
    SecureStore.setItemAsync(KEYS.UID,           params.uid),
    SecureStore.setItemAsync(KEYS.DISPLAY_NAME,  params.display_name),
    params.email
      ? SecureStore.setItemAsync(KEYS.EMAIL, params.email)
      : Promise.resolve(),
  ]);
}

export async function updateIdToken(id_token: string, refresh_token: string): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.ID_TOKEN,      id_token),
    SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refresh_token),
  ]);
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getIdToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.ID_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
}

export async function getUid(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.UID);
}

export async function getDisplayName(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.DISPLAY_NAME);
}

export async function getEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.EMAIL);
}

export async function getAllStoredUser(): Promise<{
  id_token: string | null;
  refresh_token: string | null;
  uid: string | null;
  display_name: string | null;
  email: string | null;
}> {
  const [id_token, refresh_token, uid, display_name, email] = await Promise.all([
    SecureStore.getItemAsync(KEYS.ID_TOKEN),
    SecureStore.getItemAsync(KEYS.REFRESH_TOKEN),
    SecureStore.getItemAsync(KEYS.UID),
    SecureStore.getItemAsync(KEYS.DISPLAY_NAME),
    SecureStore.getItemAsync(KEYS.EMAIL),
  ]);
  return { id_token, refresh_token, uid, display_name, email };
}

// ─── Clear ────────────────────────────────────────────────────────────────────

export async function clearAllTokens(): Promise<void> {
  await Promise.all(
    Object.values(KEYS).map((k) => SecureStore.deleteItemAsync(k)),
  );
}
