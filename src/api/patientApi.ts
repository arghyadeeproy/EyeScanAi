// ─────────────────────────────────────────────────────────────────────────────
// src/api/patientApi.ts
// ─────────────────────────────────────────────────────────────────────────────

import axiosInstance from './axiosInstance';
import { PATIENTS_PREFIX } from '../config/api';
import type { PatientProfile } from '../types';

export async function createPatient(body: PatientProfile): Promise<PatientProfile> {
  const { data } = await axiosInstance.post<PatientProfile>(PATIENTS_PREFIX, body);
  return data;
}

export async function getMyPatient(): Promise<PatientProfile> {
  const { data } = await axiosInstance.get<PatientProfile>(`${PATIENTS_PREFIX}/me`);
  return data;
}

export async function updatePatient(body: Partial<PatientProfile>): Promise<PatientProfile> {
  const { data } = await axiosInstance.put<PatientProfile>(`${PATIENTS_PREFIX}/me`, body);
  return data;
}
