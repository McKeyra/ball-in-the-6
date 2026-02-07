import { createContext, useContext, useState, useEffect, useRef } from 'react';
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

  // Fetch the most recent game - only refresh when game is running
  const { data: games } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.list('-created_date', 1),
    initialData: [],
    refetchInterval: isRunning ? 5000 : false,
    refetchOnWindowFocus: false,
  });

  const game = games?.[0];

  // Sync refs with game data when it changes
  useEffect(() => {
    if (game) {
      localGameClockRef.current = game.game_clock_seconds;
      localShotClockRef.current = game.shot_clock_seconds;
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

  // Clock tick effect
  useEffect(() => {
    if (!isRunning || !game) return;

    const interval = setInterval(() => {
      // Decrement game clock
      localGameClockRef.current = Math.max(0, localGameClockRef.current - 1);
      
      // Decrement shot clock
      localShotClockRef.current = Math.max(0, localShotClockRef.current - 1);
      
      // Stop if game clock reaches 0
      if (localGameClockRef.current <= 0) {
        setIsRunning(false);
      }

      // Force re-render to show updated values
      forceUpdate({});
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, game?.id]);

  // Sync to database periodically
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

  const resetGameClock = () => {
    if (!game) return;
    const resetTime = game.quarter_length_minutes * 60;
    localGameClockRef.current = resetTime;
    updateGameMutation.mutate({ game_clock_seconds: resetTime });
    forceUpdate({});
  };

  const resetShotClock = () => {
    localShotClockRef.current = 24;
    updateGameMutation.mutate({ shot_clock_seconds: 24 });
    forceUpdate({});
  };

  const value = {
    isRunning,
    setIsRunning,
    gameClockSeconds: localGameClockRef.current,
    shotClockSeconds: localShotClockRef.current,
    resetGameClock,
    resetShotClock,
    game,
  };

  return (
    <GameClockContext.Provider value={value}>
      {children}
    </GameClockContext.Provider>
  );
}