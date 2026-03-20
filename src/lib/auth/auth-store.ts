import { create } from 'zustand';
import type { AuthUser, AuthTokens, LoginCredentials, RegisterData } from './types';
import { AUTH_BRAND } from './types';
import { authService } from './auth-service';

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
      const credentials: LoginCredentials = { email, password, brand: AUTH_BRAND };
      const tokens = await authService.login(credentials);
      persistTokens(tokens);

      const user = await authService.getMe(tokens.accessToken);
      set({ user, tokens, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const registerData: RegisterData = { ...data, brand: AUTH_BRAND };
      const tokens = await authService.register(registerData);
      persistTokens(tokens);

      const user = await authService.getMe(tokens.accessToken);
      set({ user, tokens, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      /* best-effort server logout */
    }
    persistTokens(null);
    set({ user: null, tokens: null, isAuthenticated: false });
  },

  refreshSession: async () => {
    try {
      const tokens = await authService.refreshToken();
      persistTokens(tokens);

      const user = await authService.getMe(tokens.accessToken);
      set({ user, tokens, isAuthenticated: true });
    } catch {
      persistTokens(null);
      set({ user: null, tokens: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    const { tokens } = get();
    if (!tokens) {
      set({ isLoading: false, isAuthenticated: false });
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
      const user = await authService.getMe(tokens.accessToken);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      await get().refreshSession();
      set({ isLoading: false });
    }
  },

  hydrate: () => {
    const tokens = loadTokens();
    set({ tokens, isHydrated: true, isLoading: !!tokens });
  },
}));
