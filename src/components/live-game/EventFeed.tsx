'use client';

import { cn } from '@/lib/utils';
import { Zap, AlertTriangle, Clock, ArrowRightLeft, XCircle } from 'lucide-react';

interface GameEvent {
  id: string;
  type: string;
  description: string;
  quarter: number;
  gameClock: number;
  teamSide: string | null;
  playerName: string | null;
  points: number | null;
  createdAt: string;
}

interface EventFeedProps {
  events: GameEvent[];
  homeColor?: string;
  awayColor?: string;
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
  score: <Zap className="h-3 w-3" />,
  foul: <AlertTriangle className="h-3 w-3" />,
  timeout: <Clock className="h-3 w-3" />,
  substitution: <ArrowRightLeft className="h-3 w-3" />,
  violation: <XCircle className="h-3 w-3" />,
};

export function EventFeed({ events, homeColor = '#3b82f6', awayColor = '#ef4444' }: EventFeedProps): React.ReactElement {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">Play-by-Play</h3>
        <span className="text-[10px] font-mono text-neutral-400">{events.length} events</span>
      </div>
      <div className="max-h-[400px] overflow-y-auto divide-y divide-neutral-50">
        {events.length === 0 && (
          <div className="py-12 text-center text-sm text-neutral-400">No events yet</div>
        )}
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50/50 transition-colors">
            <div
              className={cn(
                'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg',
                event.type === 'score' ? 'bg-[#c8ff00]/20 text-[#3d6b00]' :
                event.type === 'foul' ? 'bg-red-50 text-red-500' :
                'bg-neutral-100 text-neutral-500',
              )}
            >
              {EVENT_ICONS[event.type] || <Zap className="h-3 w-3" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-neutral-800">{event.description}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono text-neutral-400">
                  Q{event.quarter} {formatClock(event.gameClock)}
                </span>
                {event.teamSide && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: event.teamSide === 'home' ? homeColor : awayColor }}
                  />
                )}
              </div>
            </div>
            {event.points && (
              <span className="text-sm font-black text-[#c8ff00]">+{event.points}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
