// ─────────────────────────────────────────────────────────────────────────────
// src/api/axiosInstance.ts
// ─────────────────────────────────────────────────────────────────────────────

import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL, API_TIMEOUT_MS } from '../config/api';
import { getIdToken, getRefreshToken, updateIdToken, clearAllTokens } from '../utils/secureStorage';
import { navigateToLogin } from '../navigation/navigationRef';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Inject Bearer token ─────────────────────────────────

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getIdToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Track in-flight refresh to prevent duplicate calls ───────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

// ─── Response Interceptor: Handle 401 → refresh → retry ──────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        await updateIdToken(data.id_token, data.refresh_token);
        processQueue(null, data.id_token);

        if (originalRequest.headers) {
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${data.id_token}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await clearAllTokens();
        navigateToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
