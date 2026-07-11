// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/usePatientProfile.ts
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from 'react';
import { getMyPatient, createPatient, updatePatient } from '../api/patientApi';
import { useAuth } from '../context/AuthContext';
import type { PatientProfile } from '../types';

interface UsePatientProfileReturn {
  profile: PatientProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  save: (data: PatientProfile) => Promise<void>;
  profileExists: boolean;
}

export function usePatientProfile(): UsePatientProfileReturn {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState(false);
  const hasFetched = useRef(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMyPatient();
      setProfile(data);
      setProfileExists(true);
    } catch (e: unknown) {
      const err = e as { response?: { status?: number } };
      if (err?.response?.status === 404) {
        setProfile(null);
        setProfileExists(false);
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !hasFetched.current) {
      hasFetched.current = true;
      refresh();
    }
  }, [isAuthenticated, refresh]);

  const save = useCallback(
    async (data: PatientProfile) => {
      setLoading(true);
      setError(null);
      try {
        let saved: PatientProfile;
        if (profileExists) {
          saved = await updatePatient(data);
        } else {
          saved = await createPatient(data);
          setProfileExists(true);
        }
        setProfile(saved);
      } catch {
        setError('Failed to save profile');
        throw new Error('Failed to save profile');
      } finally {
        setLoading(false);
      }
    },
    [profileExists],
  );

  return { profile, loading, error, refresh, save, profileExists };
}
