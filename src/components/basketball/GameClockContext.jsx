import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

const GameClockContext = createContext();

export function useGameClock() {
  const context = useContext(GameClockContext);
  if (!context) {
    throw new Error('useGameClock must be used within GameClockProvider');
  }
  return context;
}

export function GameClockProvider({ children }) {
  const queryClient = useQueryClient();

  const [isRunning, setIsRunning] = useState(() => {
    const saved = localStorage.getItem('clockRunning');
    return saved ? JSON.parse(saved) : false;
  });

  const localGameClockRef = useRef(0);
  const localShotClockRef = useRef(24);
  const [, forceUpdate] = useState({});

  // Fetch the most recent game
  const { data: games } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.list('-created_date', 1),
    initialData: [],
    refetchInterval: isRunning ? 5000 : false,
    refetchOnWindowFocus: false,
  });

  const game = games?.[0];

  // Sync refs with game data when game changes
  useEffect(() => {
    if (game) {
      localGameClockRef.current = game.game_clock_seconds ?? 0;
      localShotClockRef.current = game.shot_clock_seconds ?? 24;
      forceUpdate({});
    }
  }, [game?.id, game?.game_clock_seconds, game?.shot_clock_seconds]);

  // Save isRunning to localStorage
  useEffect(() => {
    localStorage.setItem('clockRunning', JSON.stringify(isRunning));
  }, [isRunning]);

  const updateGameMutation = useMutation({
    mutationFn: async (updates) => {
      if (!game?.id) return;
      await base44.entities.Game.update(game.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['games']);
      queryClient.invalidateQueries(['game']);
    },
  });

  // Clock tick - both clocks decrement together and stop together
  useEffect(() => {
    if (!isRunning || !game) return;

    const interval = setInterval(() => {
      // Decrement game clock
      localGameClockRef.current = Math.max(0, localGameClockRef.current - 1);
      // Decrement shot clock
      localShotClockRef.current = Math.max(0, localShotClockRef.current - 1);

      // Shot clock violation - stop both clocks
      if (localShotClockRef.current <= 0) {
        setIsRunning(false);
      }

      // Quarter end - stop both clocks
      if (localGameClockRef.current <= 0) {
        setIsRunning(false);
      }

      forceUpdate({});
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, game?.id]);

  // Sync to database every 3 seconds while running
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

  // Toggle clock - start/stop both clocks in unison
  const toggleClock = useCallback(() => {
    const newState = !isRunning;
    setIsRunning(newState);

    // Sync current values to DB on pause
    if (!newState && game) {
      updateGameMutation.mutate({
        game_clock_seconds: localGameClockRef.current,
        shot_clock_seconds: localShotClockRef.current,
      });
    }
  }, [isRunning, game]);

  // Pause both clocks (for timeouts, fouls, etc.)
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

  // Resume both clocks
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

  const resetShotClock = useCallback((seconds = 24) => {
    localShotClockRef.current = seconds;
    if (game) {
      updateGameMutation.mutate({ shot_clock_seconds: seconds });
    }
    forceUpdate({});
  }, [game]);

  // Set arbitrary time values (for timer adjustment from TimeoutPanel)
  const setGameClock = useCallback((seconds) => {
    localGameClockRef.current = Math.max(0, seconds);
    if (game) {
      updateGameMutation.mutate({ game_clock_seconds: localGameClockRef.current });
    }
    forceUpdate({});
  }, [game]);

  const setShotClock = useCallback((seconds) => {
    localShotClockRef.current = Math.max(0, Math.min(24, seconds));
    if (game) {
      updateGameMutation.mutate({ shot_clock_seconds: localShotClockRef.current });
    }
    forceUpdate({});
  }, [game]);

  // Advance to next period
  const nextPeriod = useCallback(() => {
    if (!game) return;
    const currentQuarter = game.quarter || 1;
    const newQuarter = currentQuarter + 1;
    const resetTime = newQuarter > 4
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

  const value = {
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
