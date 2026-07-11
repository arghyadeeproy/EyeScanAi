// ─────────────────────────────────────────────────────────────────────────────
// src/api/authApi.ts
// ─────────────────────────────────────────────────────────────────────────────

import axiosInstance from './axiosInstance';
import { AUTH_PREFIX } from '../config/api';
import type {
  AuthResponse,
  LoginRequest,
  MeResponse,
  RefreshResponse,
  SignupRequest,
} from '../types';

export async function signup(body: SignupRequest): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>(
    `${AUTH_PREFIX}/signup`,
    body,
  );
  return data;
}

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>(
    `${AUTH_PREFIX}/login`,
    body,
  );
  return data;
}

export async function refreshToken(refresh_token: string): Promise<RefreshResponse> {
  const { data } = await axiosInstance.post<RefreshResponse>(
    `${AUTH_PREFIX}/refresh`,
    { refresh_token },
  );
  return data;
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await axiosInstance.get<MeResponse>(`${AUTH_PREFIX}/me`);
  return data;
}
