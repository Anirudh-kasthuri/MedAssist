export enum ViewState {
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
  TELUGU = 'Telugu'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}