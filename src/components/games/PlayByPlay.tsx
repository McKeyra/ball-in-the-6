'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import {
  Target,
  AlertTriangle,
  ArrowLeftRight,
  Timer,
  Play,
  Flag,
} from 'lucide-react';

type EventType =
  | 'score'
  | 'foul'
  | 'substitution'
  | 'timeout'
  | 'quarter_start'
  | 'quarter_end';

interface PlayEvent {
  id: string;
  type: EventType;
  time: string;
  period: string;
  description: string;
  team?: 'home' | 'away';
  teamName?: string;
  teamColor?: string;
  scoreAfter?: { away: number; home: number };
}

interface PlayByPlayProps {
  events: PlayEvent[];
  homeTeamName: string;
  awayTeamName: string;
  homeTeamColor: string;
  awayTeamColor: string;
}

const EVENT_CONFIG: Record<
  EventType,
  { icon: React.ElementType; label: string; bgClass: string }
> = {
  score: {
    icon: Target,
    label: 'Score',
    bgClass: 'bg-[#c8ff00]/10 text-[#9ab800]',
  },
  foul: {
    icon: AlertTriangle,
    label: 'Foul',
    bgClass: 'bg-red-500/10 text-red-500',
  },
  substitution: {
    icon: ArrowLeftRight,
    label: 'Sub',
    bgClass: 'bg-blue-500/10 text-blue-500',
  },
  timeout: {
    icon: Timer,
    label: 'Timeout',
    bgClass: 'bg-orange-500/10 text-orange-500',
  },
  quarter_start: {
    icon: Play,
    label: 'Start',
    bgClass: 'bg-emerald-500/10 text-emerald-500',
  },
  quarter_end: {
    icon: Flag,
    label: 'End',
    bgClass: 'bg-neutral-500/10 text-neutral-500',
  },
};

export const PlayByPlay: React.FC<PlayByPlayProps> = ({
  events,
  homeTeamName,
  awayTeamName,
  homeTeamColor,
  awayTeamColor,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length]);

  const getTeamColor = (team?: 'home' | 'away'): string => {
    if (team === 'home') return homeTeamColor;
    if (team === 'away') return awayTeamColor;
    return '#a3a3a3';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-[20px] border border-neutral-200/60 bg-white overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
          Play-by-Play
        </h3>
        <span className="text-[10px] font-mono text-neutral-400">
          {events.length} plays
        </span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[480px] overflow-y-auto scroll-smooth"
      >
        <div className="divide-y divide-neutral-50">
          {events.map((event, idx) => {
            const config = EVENT_CONFIG[event.type];
            const Icon = config.icon;
            const isSystemEvent =
              event.type === 'quarter_start' ||
              event.type === 'quarter_end';

            if (isSystemEvent) {
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  className="flex items-center justify-center gap-2 bg-neutral-50/50 px-5 py-3"
                >
                  <div className="h-px flex-1 bg-neutral-200/50" />
                  <div className={cn('flex items-center gap-1.5 rounded-full px-3 py-1', config.bgClass)}>
                    <Icon className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {event.description}
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-neutral-200/50" />
                </motion.div>
              );
            }

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: event.team === 'home' ? 12 : -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className="flex items-start gap-3 px-5 py-3 hover:bg-neutral-50/30 transition-colors"
              >
                {/* Time */}
                <div className="flex flex-col items-center pt-0.5 shrink-0 w-12">
                  <span className="text-[10px] font-mono font-bold text-neutral-400">
                    {event.period}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-300">
                    {event.time}
                  </span>
                </div>

                {/* Team indicator */}
                <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: getTeamColor(event.team),
                    }}
                  />
                  <div
                    className="w-px flex-1 min-h-[16px]"
                    style={{
                      backgroundColor: `${getTeamColor(event.team)}30`,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div
                      className={cn(
                        'flex items-center gap-1 rounded-md px-1.5 py-0.5',
                        config.bgClass
                      )}
                    >
                      <Icon className="h-2.5 w-2.5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {config.label}
                      </span>
                    </div>
                    {event.teamName && (
                      <span className="text-[10px] font-bold text-neutral-400">
                        {event.teamName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    {event.description}
                  </p>
                  {event.scoreAfter && event.type === 'score' && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-neutral-400">
                        {awayTeamName}{' '}
                        <span className="text-neutral-900">
                          {event.scoreAfter.away}
                        </span>
                      </span>
                      <span className="text-neutral-200">-</span>
                      <span className="font-mono text-[10px] font-bold text-neutral-400">
                        <span className="text-neutral-900">
                          {event.scoreAfter.home}
                        </span>{' '}
                        {homeTeamName}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
