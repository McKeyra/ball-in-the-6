'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface GameEvent {
  id: string;
  event_type: string;
  description: string;
  quarter: number;
  game_clock_seconds: number;
  points: number;
}

interface PlayerData {
  id: string;
  name: string;
}

interface EventFeedProps {
  events: GameEvent[];
  players: PlayerData[];
  onClose: () => void;
}

const EVENT_ICONS: Record<string, string> = {
  '2pt_make': '🏀',
  '2pt_miss': '❌',
  '3pt_make': '🎯',
  '3pt_miss': '❌',
  ft_make: '✓',
  ft_miss: '✗',
  assist: '👏',
  steal: '🤚',
  block: '🚫',
  turnover: '⚠️',
  rebound_off: '⬆️',
  rebound_def: '⬇️',
  foul_personal: '⚠️',
  foul_offensive: '🛑',
  foul_technical: '⚡',
  foul_unsportsmanlike: '🔴',
  substitution: '🔄',
  timeout: '⏸️',
};

export function EventFeed({
  events,
  players,
  onClose,
}: EventFeedProps): React.ReactElement {
  const queryClient = useQueryClient();

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      // TODO: Replace with actual API call
      await fetch(`/api/game-events/${eventId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const getPlayerName = (playerId: string): string => {
    const player = players.find((p) => p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEventIcon = (eventType: string): string => {
    return EVENT_ICONS[eventType] || '•';
  };

  const handleDeleteEvent = (event: GameEvent): void => {
    if (
      confirm(
        `Delete this event?\n\n${event.description}\n\nNote: This will NOT automatically adjust player stats or game scores. Use manual score adjustment if needed.`
      )
    ) {
      deleteEventMutation.mutate(event.id);
    }
  };

  return (
    <motion.div
      initial={{ x: -400 }}
      animate={{ x: 0 }}
      exit={{ x: -400 }}
      className="fixed left-0 top-0 bottom-0 w-96 z-50"
      style={{
        background: '#e0e0e0',
        boxShadow: '8px 0 24px rgba(0,0,0,0.15)',
      }}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div>
            <h2 className="text-2xl font-bold text-gray-700">Event Feed</h2>
            <p className="text-xs text-gray-500 mt-1">Tap event to delete</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            style={{
              boxShadow:
                '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
              background: '#e0e0e0',
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          <AnimatePresence>
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div
                  className="p-4 rounded-xl relative overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    background: '#e0e0e0',
                    boxShadow:
                      '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                  }}
                  onClick={() => handleDeleteEvent(event)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {getEventIcon(event.event_type)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-700">
                        {event.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Q{event.quarter} •{' '}
                        {formatTime(event.game_clock_seconds)}
                      </div>
                    </div>
                    {event.points > 0 && (
                      <div
                        className="px-2 py-1 rounded-lg text-xs font-bold"
                        style={{
                          background: '#10B98120',
                          color: '#10B981',
                        }}
                      >
                        +{event.points}
                      </div>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {events.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No events yet
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
