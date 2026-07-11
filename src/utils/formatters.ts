// ─────────────────────────────────────────────────────────────────────────────
// src/utils/formatters.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Colors } from '../theme/colors';
import type { RiskLevel, TestType } from '../types';

// ─── Date / Time ──────────────────────────────────────────────────────────────

export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Confidence ───────────────────────────────────────────────────────────────

export function formatConfidence(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatConfidenceInt(value: number): number {
  return Math.round(value * 100);
}

// ─── Risk ─────────────────────────────────────────────────────────────────────

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'HIGH':         return Colors.danger;
    case 'MODERATE':     return Colors.primary;
    case 'LOW-MODERATE': return '#F5A623';
    case 'LOW':          return Colors.success;
    case 'UNCERTAIN':    return Colors.textMuted;
    default:             return Colors.textMuted;
  }
}

export function getRiskGlow(level: RiskLevel): string {
  switch (level) {
    case 'HIGH':         return Colors.dangerGlow;
    case 'MODERATE':     return Colors.warningGlow;
    case 'LOW-MODERATE': return 'rgba(245, 166, 35, 0.25)';
    case 'LOW':          return Colors.successGlow;
    case 'UNCERTAIN':    return 'rgba(158, 158, 158, 0.20)';
    default:             return 'rgba(158, 158, 158, 0.20)';
  }
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 'HIGH':         return '⚠ HIGH RISK';
    case 'MODERATE':     return '◈ MODERATE';
    case 'LOW-MODERATE': return '◈ LOW-MODERATE';
    case 'LOW':          return '✓ LOW RISK';
    case 'UNCERTAIN':    return '? UNCERTAIN';
    default:             return level;
  }
}

// ─── Test Type ────────────────────────────────────────────────────────────────

export function getTestTypeLabel(type: TestType): string {
  switch (type) {
    case 'glaucoma': return 'Glaucoma';
    case 'dr':       return 'Diabetic Retinopathy';
    case 'both':     return 'Combined Scan';
    default:         return type;
  }
}

export function getTestTypeIcon(type: TestType): string {
  switch (type) {
    case 'glaucoma': return 'eye-outline';
    case 'dr':       return 'cellular-outline';
    case 'both':     return 'scan-outline';
    default:         return 'medical-outline';
  }
}

// ─── Greeting ─────────────────────────────────────────────────────────────────

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Initials ─────────────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// ─── Error ────────────────────────────────────────────────────────────────────

export function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>;
    if (e.response && typeof e.response === 'object') {
      const res = e.response as Record<string, unknown>;
      if (res.data && typeof res.data === 'object') {
        const data = res.data as Record<string, unknown>;
        if (typeof data.detail === 'string') return data.detail;
        if (Array.isArray(data.detail)) return data.detail[0]?.msg ?? 'An error occurred';
      }
    }
    if (typeof e.message === 'string') return e.message;
  }
  return 'An unexpected error occurred.';
}
