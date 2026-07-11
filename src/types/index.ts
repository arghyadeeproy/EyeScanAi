// ─────────────────────────────────────────────────────────────────────────────
// src/types/index.ts  — All shared TypeScript types for EyeScan AI
// ─────────────────────────────────────────────────────────────────────────────

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  id_token: string;
  refresh_token: string;
  uid: string;
  display_name: string;
  email?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  display_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  uid: string;
  email: string;
  display_name: string;
  id_token: string;
  refresh_token: string;
}

export interface RefreshResponse {
  id_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface MeResponse {
  uid: string;
  email: string;
  display_name: string;
  photo_url: string | null;
  email_verified: boolean;
}

// ─── Patient Profile ─────────────────────────────────────────────────────────

export type Gender = 'Male' | 'Female' | 'Other';
export type DiabetesType = 'Type 1' | 'Type 2' | 'Pre-diabetic' | '';

export const EYE_CONDITIONS = [
  'Glaucoma',
  'Cataract',
  'Macular Degeneration',
  'Retinal Detachment',
] as const;

export type EyeCondition = typeof EYE_CONDITIONS[number];

export interface PatientProfile {
  name: string;
  age: number;
  gender: Gender;
  location: string;
  optical_power_left: number;
  optical_power_right: number;
  has_diabetes: boolean;
  diabetes_type: DiabetesType;
  bp_systolic: number;
  bp_diastolic: number;
  existing_eye_conditions: EyeCondition[];
  is_smoker: boolean;
  notes: string;
}

// ─── Predictions ─────────────────────────────────────────────────────────────

export type RiskLevel =
  | 'HIGH'
  | 'MODERATE'
  | 'LOW-MODERATE'
  | 'LOW'
  | 'UNCERTAIN';

export interface OpticDisc {
  detected: boolean;
  confidence: number;
  bbox: number[] | null;
}

export interface GlaucomaResult {
  prediction: 'glaucoma' | 'normal';
  confidence: number;
  probabilities: Record<string, number>;
  optic_disc: OpticDisc;
  inference_time_ms: number;
  risk_level: RiskLevel;
  recommendation: string;
}

export interface DRResult {
  prediction: 'Diabetic Retinopathy' | 'No_DR';
  confidence: number;
  probabilities: Record<string, number>;
  inference_time_ms: number;
  risk_level: RiskLevel;
  recommendation: string;
}

export interface BothResult {
  glaucoma: GlaucomaResult;
  dr: DRResult;
}

// ─── Records ─────────────────────────────────────────────────────────────────

export type TestType = 'glaucoma' | 'dr' | 'both';

export interface CreateRecordRequest {
  test_type: TestType;
  image_name: string;
  glaucoma_result?: GlaucomaResult;
  dr_result?: DRResult;
  notes?: string;
}

export interface TestRecord {
  id: string;
  test_type: TestType;
  image_name: string;
  glaucoma_result?: GlaucomaResult;
  dr_result?: DRResult;
  notes?: string;
  created_at: string;
}

export interface RecordsResponse {
  records: TestRecord[];
  total: number;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  AuthStack: undefined;
  AppTabs: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type AppTabsParamList = {
  Home: undefined;
  Scan: undefined;
  Records: undefined;
  Profile: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
};

export type RecordsStackParamList = {
  RecordsList: undefined;
  RecordDetail: { recordId: string };
};
