'use client';

import { createContext, useContext, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '@/lib/auth/types';
import { useAuthStore } from '@/lib/auth/auth-store';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; dateOfBirth: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const tokens = useAuthStore((s) => s.tokens);
  const hydrate = useAuthStore((s) => s.hydrate);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const loginAction = useAuthStore((s) => s.login);
  const registerAction = useAuthStore((s) => s.register);
  const logoutAction = useAuthStore((s) => s.logout);
  const refreshSession = useAuthStore((s) => s.refreshSession);

  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isHydrated) {
      checkAuth();
    }
  }, [isHydrated, checkAuth]);

  useEffect(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    if (isAuthenticated && tokens) {
      refreshIntervalRef.current = setInterval(() => {
        refreshSession();
      }, REFRESH_INTERVAL_MS);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isAuthenticated, tokens, refreshSession]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      await loginAction(email, password);
    },
    [loginAction],
  );

  const register = useCallback(
    async (data: { email: string; password: string; name: string; dateOfBirth: string }): Promise<void> => {
      await registerAction(data);
    },
    [registerAction],
  );

  const logout = useCallback(async (): Promise<void> => {
    await logoutAction();
  }, [logoutAction]);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
