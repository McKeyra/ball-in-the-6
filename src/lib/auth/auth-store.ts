import { create } from 'zustand';
import type { AuthUser, AuthTokens, RegisterData } from './types';
import { authService } from './auth-service';

/**
 * Auth state store.
 * Tokens are stored in httpOnly cookies by the server-side /api/auth/* routes.
 * We keep a client-side copy of tokens for expiry checks and refreshing,
 * but the cookie is the source of truth for API requests.
 */

const TOKENS_STORAGE_KEY = 'b6_auth_tokens';

interface AuthStoreState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface AuthStoreActions {
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Omit<RegisterData, 'brand'>) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hydrate: () => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

const persistTokens = (tokens: AuthTokens | null): void => {
  if (typeof window === 'undefined') return;

  if (tokens) {
    try {
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
    } catch {
      /* storage full or unavailable */
    }
  } else {
    localStorage.removeItem(TOKENS_STORAGE_KEY);
  }
};

const loadTokens = (): AuthTokens | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(TOKENS_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AuthTokens;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  tokens: null,
  isLoading: false,
  isAuthenticated: false,
  isHydrated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: user !== null });
  },

  setTokens: (tokens) => {
    persistTokens(tokens);
    set({ tokens });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // Calls /api/auth/login which sets httpOnly cookies
      const tokens = await authService.login({ email, password, brand: 'b6' });
      persistTokens(tokens);

      const user = await authService.getMe();
      set({ user, tokens, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const tokens = await authService.register({ ...data, brand: 'b6' });
      persistTokens(tokens);

      const user = await authService.getMe();
      set({ user, tokens, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Calls /api/auth/logout which clears httpOnly cookies
      await authService.logout();
    } catch {
      /* best-effort server logout */
    }
    persistTokens(null);
    set({ user: null, tokens: null, isAuthenticated: false });
  },

  refreshSession: async () => {
    try {
      // Calls /api/auth/refresh which reads refresh cookie and sets new ones
      const tokens = await authService.refreshToken();
      persistTokens(tokens);

      const user = await authService.getMe();
      set({ user, tokens, isAuthenticated: true });
    } catch {
      persistTokens(null);
      set({ user: null, tokens: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    const { tokens } = get();
    if (!tokens) {
      // No client-side tokens — try cookie-based check
      try {
        const user = await authService.getMe();
        set({ user, isAuthenticated: true, isLoading: false });
      } catch {
        set({ isLoading: false, isAuthenticated: false });
      }
      return;
    }

    const now = Date.now();
    const bufferMs = 60_000;

    if (tokens.expiresAt * 1000 - now < bufferMs) {
      await get().refreshSession();
      set({ isLoading: false });
      return;
    }

    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      await get().refreshSession();
      set({ isLoading: false });
    }
  },

  hydrate: () => {
    const tokens = loadTokens();
    set({ tokens, isHydrated: true, isLoading: true });
  },
}));
