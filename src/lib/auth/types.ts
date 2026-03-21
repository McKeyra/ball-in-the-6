export const AGE_BRACKETS = ['child', 'teen', 'adult'] as const;
export type AgeBracket = (typeof AGE_BRACKETS)[number];

export const AUTH_BRAND = 'b6' as const;

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  brands: string[];
  ageBracket: AgeBracket;
  mfaVerified: boolean;
  idvVerified: boolean;
  profile?: {
    name?: string;
    avatarUrl?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  brand: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  dateOfBirth: string;
  brand: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export interface AuthSuccessResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  brands: string[];
  age_bracket: AgeBracket;
  mfa_verified: boolean;
  idv_verified: boolean;
  iat: number;
  exp: number;
}
