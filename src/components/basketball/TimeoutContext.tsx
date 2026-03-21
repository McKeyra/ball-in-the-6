'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

interface TimeoutContextValue {
  isTimeoutActive: boolean;
  timeoutTeam: string | null;
  timeoutType: string | null;
  startTimeout: (team: string, type?: string) => void;
  endTimeout: () => void;
}

const TimeoutContext = createContext<TimeoutContextValue | undefined>(undefined);

export function useTimeout(): TimeoutContextValue {
  const context = useContext(TimeoutContext);
  if (!context) {
    throw new Error('useTimeout must be used within TimeoutProvider');
  }
  return context;
}

interface TimeoutProviderProps {
  children: ReactNode;
}

export function TimeoutProvider({ children }: TimeoutProviderProps) {
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const [timeoutTeam, setTimeoutTeam] = useState<string | null>(null);
  const [timeoutType, setTimeoutType] = useState<string | null>(null);

  const startTimeout = useCallback((team: string, type: string = 'full') => {
    setIsTimeoutActive(true);
    setTimeoutTeam(team);
    setTimeoutType(type);
  }, []);

  const endTimeout = useCallback(() => {
    setIsTimeoutActive(false);
    setTimeoutTeam(null);
    setTimeoutType(null);
  }, []);

  const value: TimeoutContextValue = {
    isTimeoutActive,
    timeoutTeam,
    timeoutType,
    startTimeout,
    endTimeout,
  };

  return (
    <TimeoutContext.Provider value={value}>
      {children}
    </TimeoutContext.Provider>
  );
}
