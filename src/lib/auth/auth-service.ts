import type {
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthUser,
  AuthErrorResponse,
} from './types';

/**
 * Auth service — all calls go through our own /api/auth/* proxy routes,
 * which handle cookie setting and user sync to the ballinthe6 database.
 */

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
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    if (!response.ok) {
      throw new AuthServiceError(
        `Request failed with status ${response.status}`,
        response.status,
        'REQUEST_FAILED',
      );
    }
    throw new AuthServiceError('Invalid response from server', 500, 'INVALID_RESPONSE');
  }

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
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    return handleResponse<AuthTokens>(response);
  },

  register: async (data: RegisterData): Promise<AuthTokens> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
        dateOfBirth: data.dateOfBirth,
      }),
    });

    return handleResponse<AuthTokens>(response);
  },

  logout: async (): Promise<void> => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new AuthServiceError('Logout failed', response.status, 'LOGOUT_FAILED');
    }
  },

  refreshToken: async (): Promise<AuthTokens> => {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
    });

    return handleResponse<AuthTokens>(response);
  },

  getMe: async (): Promise<AuthUser> => {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    return handleResponse<AuthUser>(response);
  },
} as const;

export { AuthServiceError };
