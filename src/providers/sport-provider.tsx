'use client';

import {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from 'react';
import { SPORT_CONFIGS, type SportConfig } from '@/lib/sports';

interface SportContextValue {
  activeSport: string;
  sportConfig: SportConfig;
  switchSport: (sportId: string) => void;
  allSports: string[];
}

const SportContext = createContext<SportContextValue | null>(null);

interface SportProviderProps {
  children: ReactNode;
}

export const SportProvider = ({ children }: SportProviderProps): React.JSX.Element => {
  const [activeSport, setActiveSport] = useState<string>(() => {
    if (typeof window === 'undefined') return 'basketball';
    return localStorage.getItem('bit6_active_sport') ?? 'basketball';
  });

  const switchSport = (sportId: string): void => {
    if (SPORT_CONFIGS[sportId]) {
      setActiveSport(sportId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bit6_active_sport', sportId);
      }
    }
  };

  const sportConfig = SPORT_CONFIGS[activeSport] ?? SPORT_CONFIGS.basketball;

  return (
    <SportContext.Provider
      value={{
        activeSport,
        sportConfig,
        switchSport,
        allSports: Object.keys(SPORT_CONFIGS),
      }}
    >
      {children}
    </SportContext.Provider>
  );
};

export const useSport = (): SportContextValue => {
  const context = useContext(SportContext);
  if (!context) {
    throw new Error('useSport must be used within a SportProvider');
  }
  return context;
};
