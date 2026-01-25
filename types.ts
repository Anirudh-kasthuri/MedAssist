export enum ViewState {
  LAUNCHPAD = 'LAUNCHPAD',
  DASHBOARD = 'DASHBOARD',
  IMAGE_ANALYSIS = 'IMAGE_ANALYSIS',
  VOICE_ANALYSIS = 'VOICE_ANALYSIS',
  TEXT_ANALYSIS = 'TEXT_ANALYSIS',
  EDUCATION = 'EDUCATION',
  SETTINGS = 'SETTINGS'
}

export interface DiagnosticResult {
  title: string;
  summary: string;
  technicalAnalysis?: string; // For Doctors
  confidence?: number;        // For Doctors
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
  disclaimer: string;
}

export interface AnalysisSession {
  id: string;
  type: 'image' | 'audio' | 'text';
  timestamp: number;
  previewUrl?: string; // For images
  result?: DiagnosticResult;
  status: 'idle' | 'analyzing' | 'complete' | 'error';
}

export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  TELUGU = 'Telugu'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'doctor' | 'patient';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}