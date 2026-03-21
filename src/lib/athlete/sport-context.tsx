'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { SPORT_CONFIGS, getSportConfig, type SportConfig } from '@/lib/sports';

interface SportContextValue {
  sportConfig: SportConfig;
  activeSport: string;
  setSport: (id: string) => void;
}

const SportContext = createContext<SportContextValue>({
  sportConfig: getSportConfig('basketball'),
  activeSport: 'basketball',
  setSport: () => {},
});

export function SportProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [activeSport, setActiveSport] = useState('basketball');

  const handleSetSport = (id: string): void => {
    if (SPORT_CONFIGS[id]) {
      setActiveSport(id);
    }
  };

  return (
    <SportContext.Provider
      value={{
        sportConfig: getSportConfig(activeSport),
        activeSport,
        setSport: handleSetSport,
      }}
    >
      {children}
    </SportContext.Provider>
  );
}

export function useSport(): SportContextValue {
  return useContext(SportContext);
}
