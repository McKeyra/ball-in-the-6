import { useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function GameClockManager({ game, isRunning }) {
  const queryClient = useQueryClient();
  const lastUpdateRef = useRef(Date.now());
  const localClocksRef = useRef({
    game_clock: game.game_clock_seconds,
    shot_clock: game.shot_clock_seconds
  });

  // Sync local clocks with game data when game updates
  useEffect(() => {
    localClocksRef.current = {
      game_clock: game.game_clock_seconds,
      shot_clock: game.shot_clock_seconds
    };
  }, [game.game_clock_seconds, game.shot_clock_seconds]);

  const updateGameMutation = useMutation({
    mutationFn: async (updates) => {
      await base44.entities.Game.update(game.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['games']);
      queryClient.invalidateQueries(['game']);
    },
  });

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdateRef.current) / 1000);
      
      if (elapsed >= 1) {
        lastUpdateRef.current = now;
        
        // Update local clocks
        localClocksRef.current.game_clock = Math.max(0, localClocksRef.current.game_clock - 1);
        localClocksRef.current.shot_clock = Math.max(0, localClocksRef.current.shot_clock - 1);

        // Update database every second
        updateGameMutation.mutate({
          game_clock_seconds: localClocksRef.current.game_clock,
          shot_clock_seconds: localClocksRef.current.shot_clock,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, game.id]);

  // This component doesn't render anything
  return null;
}