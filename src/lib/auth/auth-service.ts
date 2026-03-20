import type {
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthUser,
  AuthErrorResponse,
} from './types';

const AUTH_BASE_URL = 'https://auth.226.wtf';

class AuthServiceError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.name = 'AuthServiceError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const body = await response.json();

  if (!response.ok) {
    const errorBody = body as AuthErrorResponse;
    throw new AuthServiceError(
      errorBody.message || 'Authentication request failed',
      errorBody.statusCode || response.status,
      errorBody.error || 'UNKNOWN_ERROR',
    );
  }

  return body as T;
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        brand: credentials.brand,
      }),
    });

    return handleResponse<AuthTokens>(response);
  },

  register: async (data: RegisterData): Promise<AuthTokens> => {
    const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
        date_of_birth: data.dateOfBirth,
        brand: data.brand,
      }),
    });

    return handleResponse<AuthTokens>(response);
  },

  logout: async (): Promise<void> => {
    const response = await fetch(`${AUTH_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new AuthServiceError('Logout failed', response.status, 'LOGOUT_FAILED');
    }
  },

  refreshToken: async (): Promise<AuthTokens> => {
    const response = await fetch(`${AUTH_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    return handleResponse<AuthTokens>(response);
  },

  getMe: async (token: string): Promise<AuthUser> => {
    const response = await fetch(`${AUTH_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    return handleResponse<AuthUser>(response);
  },
} as const;

export { AuthServiceError };
