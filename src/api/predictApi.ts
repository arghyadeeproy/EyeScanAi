// ─────────────────────────────────────────────────────────────────────────────
// src/api/predictApi.ts
// ─────────────────────────────────────────────────────────────────────────────

import axiosInstance from './axiosInstance';
import { PREDICT_PREFIX } from '../config/api';
import type { GlaucomaResult, DRResult, BothResult } from '../types';

interface ImageAsset {
  uri: string;
  name?: string;
  mimeType?: string;
}

function buildFormData(asset: ImageAsset): FormData {
  const form = new FormData();
  const filename = asset.name ?? `scan_${Date.now()}.jpg`;
  const mimeType = asset.mimeType ?? 'image/jpeg';
  // React Native FormData accepts this shape
  form.append('file', {
    uri: asset.uri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);
  return form;
}

const multipartHeaders = { 'Content-Type': 'multipart/form-data' };

export async function predictGlaucoma(asset: ImageAsset): Promise<GlaucomaResult> {
  const { data } = await axiosInstance.post<GlaucomaResult>(
    `${PREDICT_PREFIX}/glaucoma`,
    buildFormData(asset),
    { headers: multipartHeaders },
  );
  return data;
}

export async function predictDR(asset: ImageAsset): Promise<DRResult> {
  const { data } = await axiosInstance.post<DRResult>(
    `${PREDICT_PREFIX}/dr`,
    buildFormData(asset),
    { headers: multipartHeaders },
  );
  return data;
}

export async function predictBoth(asset: ImageAsset): Promise<BothResult> {
  const { data } = await axiosInstance.post<BothResult>(
    `${PREDICT_PREFIX}/both`,
    buildFormData(asset),
    { headers: multipartHeaders },
  );
  return data;
}
