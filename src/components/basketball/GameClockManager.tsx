'use client';

import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface GameData {
  id: string;
  game_clock_seconds: number;
  shot_clock_seconds: number;
}

interface GameClockManagerProps {
  game: GameData;
  isRunning: boolean;
}

export function GameClockManager({
  game,
  isRunning,
}: GameClockManagerProps): null {
  const queryClient = useQueryClient();
  const lastUpdateRef = useRef(Date.now());
  const localClocksRef = useRef({
    game_clock: game.game_clock_seconds,
    shot_clock: game.shot_clock_seconds,
  });

  useEffect(() => {
    localClocksRef.current = {
      game_clock: game.game_clock_seconds,
      shot_clock: game.shot_clock_seconds,
    };
  }, [game.game_clock_seconds, game.shot_clock_seconds]);

  const updateGameMutation = useMutation({
    mutationFn: async (updates: Record<string, number>) => {
      // TODO: Replace with actual API call
      await fetch(`/api/games/${game.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['game'] });
    },
  });

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdateRef.current) / 1000);

      if (elapsed >= 1) {
        lastUpdateRef.current = now;

        localClocksRef.current.game_clock = Math.max(
          0,
          localClocksRef.current.game_clock - 1
        );
        localClocksRef.current.shot_clock = Math.max(
          0,
          localClocksRef.current.shot_clock - 1
        );

        updateGameMutation.mutate({
          game_clock_seconds: localClocksRef.current.game_clock,
          shot_clock_seconds: localClocksRef.current.shot_clock,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, game.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
