'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

// TODO: Replace with actual API client (was base44)
const gameApi = {
  async listGames(): Promise<Game[]> {
    const res = await fetch('/api/games?sort=-created_date&limit=1');
    if (!res.ok) return [];
    return res.json();
  },
  async updateGame(id: string, updates: Partial<Game>): Promise<void> {
    await fetch(`/api/games/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  },
};

interface Game {
  id: string;
  game_clock_seconds?: number;
  shot_clock_seconds?: number;
  quarter?: number;
  quarter_length_minutes?: number;
  overtime_length_minutes?: number;
  home_team_fouls?: number;
  away_team_fouls?: number;
}

interface GameClockContextValue {
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  toggleClock: () => void;
  pauseClocks: () => void;
  resumeClocks: () => void;
  gameClockSeconds: number;
  shotClockSeconds: number;
  resetGameClock: () => void;
  resetShotClock: (seconds?: number) => void;
  setGameClock: (seconds: number) => void;
  setShotClock: (seconds: number) => void;
  nextPeriod: () => void;
  game: Game | undefined;
}

const GameClockContext = createContext<GameClockContextValue | undefined>(undefined);

export function useGameClock(): GameClockContextValue {
  const context = useContext(GameClockContext);
  if (!context) {
    throw new Error('useGameClock must be used within GameClockProvider');
  }
  return context;
}

interface GameClockProviderProps {
  children: ReactNode;
}

export function GameClockProvider({ children }: GameClockProviderProps) {
  const queryClient = useQueryClient();

  const [isRunning, setIsRunning] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('clockRunning');
    return saved ? JSON.parse(saved) : false;
  });

  const localGameClockRef = useRef<number>(0);
  const localShotClockRef = useRef<number>(24);
  const [, forceUpdate] = useState({});

  const { data: games } = useQuery<Game[]>({
    queryKey: ['games'],
    queryFn: () => gameApi.listGames(),
    initialData: [],
    refetchInterval: isRunning ? 5000 : false,
    refetchOnWindowFocus: false,
  });

  const game = games?.[0];

  useEffect(() => {
    if (game) {
      localGameClockRef.current = game.game_clock_seconds ?? 0;
      localShotClockRef.current = game.shot_clock_seconds ?? 24;
      forceUpdate({});
    }
  }, [game?.id, game?.game_clock_seconds, game?.shot_clock_seconds]);

  useEffect(() => {
    localStorage.setItem('clockRunning', JSON.stringify(isRunning));
  }, [isRunning]);

  const updateGameMutation = useMutation({
    mutationFn: async (updates: Partial<Game>) => {
      if (!game?.id) return;
      await gameApi.updateGame(game.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['game'] });
    },
  });

  useEffect(() => {
    if (!isRunning || !game) return;

    const interval = setInterval(() => {
      localGameClockRef.current = Math.max(0, localGameClockRef.current - 1);
      localShotClockRef.current = Math.max(0, localShotClockRef.current - 1);

      if (localShotClockRef.current <= 0) {
        setIsRunning(false);
      }

      if (localGameClockRef.current <= 0) {
        setIsRunning(false);
      }

      forceUpdate({});
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, game?.id]);

  useEffect(() => {
    if (!isRunning || !game) return;

    const syncInterval = setInterval(() => {
      updateGameMutation.mutate({
        game_clock_seconds: localGameClockRef.current,
        shot_clock_seconds: localShotClockRef.current,
      });
    }, 3000);

    return () => clearInterval(syncInterval);
  }, [isRunning, game?.id]);

  const toggleClock = useCallback(() => {
    const newState = !isRunning;
    setIsRunning(newState);

    if (!newState && game) {
      updateGameMutation.mutate({
        game_clock_seconds: localGameClockRef.current,
        shot_clock_seconds: localShotClockRef.current,
      });
    }
  }, [isRunning, game]);

  const pauseClocks = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (game) {
        updateGameMutation.mutate({
          game_clock_seconds: localGameClockRef.current,
          shot_clock_seconds: localShotClockRef.current,
        });
      }
    }
  }, [isRunning, game]);

  const resumeClocks = useCallback(() => {
    if (!isRunning && localGameClockRef.current > 0) {
      setIsRunning(true);
    }
  }, [isRunning]);

  const resetGameClock = useCallback(() => {
    if (!game) return;
    const resetTime = (game.quarter_length_minutes || 10) * 60;
    localGameClockRef.current = resetTime;
    updateGameMutation.mutate({ game_clock_seconds: resetTime });
    forceUpdate({});
  }, [game]);

  const resetShotClock = useCallback(
    (seconds: number = 24) => {
      localShotClockRef.current = seconds;
      if (game) {
        updateGameMutation.mutate({ shot_clock_seconds: seconds });
      }
      forceUpdate({});
    },
    [game]
  );

  const setGameClock = useCallback(
    (seconds: number) => {
      localGameClockRef.current = Math.max(0, seconds);
      if (game) {
        updateGameMutation.mutate({
          game_clock_seconds: localGameClockRef.current,
        });
      }
      forceUpdate({});
    },
    [game]
  );

  const setShotClock = useCallback(
    (seconds: number) => {
      localShotClockRef.current = Math.max(0, Math.min(24, seconds));
      if (game) {
        updateGameMutation.mutate({
          shot_clock_seconds: localShotClockRef.current,
        });
      }
      forceUpdate({});
    },
    [game]
  );

  const nextPeriod = useCallback(() => {
    if (!game) return;
    const currentQuarter = game.quarter || 1;
    const newQuarter = currentQuarter + 1;
    const resetTime =
      newQuarter > 4
        ? (game.overtime_length_minutes || 5) * 60
        : (game.quarter_length_minutes || 10) * 60;

    localGameClockRef.current = resetTime;
    localShotClockRef.current = 24;
    setIsRunning(false);

    updateGameMutation.mutate({
      quarter: newQuarter,
      game_clock_seconds: resetTime,
      shot_clock_seconds: 24,
      home_team_fouls: 0,
      away_team_fouls: 0,
    });
    forceUpdate({});
  }, [game]);

  const value: GameClockContextValue = {
    isRunning,
    setIsRunning,
    toggleClock,
    pauseClocks,
    resumeClocks,
    gameClockSeconds: localGameClockRef.current,
    shotClockSeconds: localShotClockRef.current,
    resetGameClock,
    resetShotClock,
    setGameClock,
    setShotClock,
    nextPeriod,
    game,
  };

  return (
    <GameClockContext.Provider value={value}>
      {children}
    </GameClockContext.Provider>
  );
}
