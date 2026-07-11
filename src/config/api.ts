// ─────────────────────────────────────────────────────────────────────────────
// src/config/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// To change the backend URL: edit the EXPO_PUBLIC_API_BASE_URL value in .env
// ─────────────────────────────────────────────────────────────────────────────

export const BASE_URL: string =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:8000';

export const API_TIMEOUT_MS = 30_000;

// Route prefixes
export const AUTH_PREFIX    = '/auth';
export const PATIENTS_PREFIX = '/patients';
export const PREDICT_PREFIX  = '/predict';
export const RECORDS_PREFIX  = '/records';
