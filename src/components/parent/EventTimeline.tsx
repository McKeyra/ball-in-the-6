'use client';

import { motion } from 'motion/react';
import { Clock, Dumbbell, Trophy, GraduationCap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ParentEvent } from '@/types/parent';

const EVENT_TYPE_CONFIG = {
  practice: { icon: Dumbbell, color: 'text-blue-500', bg: 'bg-blue-50', ring: 'ring-blue-200' },
  game: { icon: Trophy, color: 'text-lime-dark', bg: 'bg-lime-dim', ring: 'ring-lime/30' },
  clinic: { icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-50', ring: 'ring-purple-200' },
  meeting: { icon: Users, color: 'text-orange-500', bg: 'bg-orange-50', ring: 'ring-orange-200' },
} as const;

const formatDateHeader = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const eventDate = new Date(dateStr + 'T00:00:00');
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate.getTime() === today.getTime()) return 'Today';
  if (eventDate.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return date.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
};

const isDatePast = (dateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateStr + 'T00:00:00');
  eventDate.setHours(0, 0, 0, 0);
  return eventDate.getTime() < today.getTime();
};

const isToday = (dateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateStr + 'T00:00:00');
  eventDate.setHours(0, 0, 0, 0);
  return eventDate.getTime() === today.getTime();
};

interface EventTimelineProps {
  events: ParentEvent[];
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
  /* Group events by date */
  const grouped = events.reduce<Record<string, ParentEvent[]>>((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-6 bottom-6 w-px bg-neutral-200/80" />

      {sortedDates.map((date, dateIndex) => {
        const dateEvents = grouped[date];
        const past = isDatePast(date);
        const todayDate = isToday(date);

        return (
          <div key={date} className="mb-5 last:mb-0">
            {/* Date header */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: dateIndex * 0.06, duration: 0.25 }}
              className="flex items-center gap-3 mb-2"
            >
              <div
                className={cn(
                  'relative z-10 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-2',
                  todayDate
                    ? 'bg-lime border-lime shadow-[0_0_10px_rgba(200,255,0,0.3)]'
                    : past
                      ? 'bg-neutral-100 border-neutral-200'
                      : 'bg-white border-neutral-200'
                )}
              >
                <Clock
                  className={cn(
                    'h-4 w-4',
                    todayDate ? 'text-black' : past ? 'text-neutral-300' : 'text-neutral-500'
                  )}
                  strokeWidth={2}
                />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-sm font-black',
                    todayDate ? 'text-neutral-900' : past ? 'text-neutral-300' : 'text-neutral-700'
                  )}
                >
                  {formatDateHeader(date)}
                </span>
                {todayDate && (
                  <span className="h-2 w-2 rounded-full bg-lime animate-pulse shadow-[0_0_6px_rgba(200,255,0,0.5)]" />
                )}
              </div>
            </motion.div>

            {/* Event cards */}
            <div className="ml-[47px] space-y-2">
              {dateEvents.map((event, eventIndex) => {
                const typeConfig = EVENT_TYPE_CONFIG[event.type];
                const Icon = typeConfig.icon;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dateIndex * 0.06 + eventIndex * 0.04, duration: 0.2 }}
                    className={cn(
                      'rounded-[14px] border px-3 py-2.5 transition-colors',
                      past
                        ? 'bg-neutral-50 border-neutral-100 opacity-50'
                        : 'bg-white border-neutral-200/60 hover:border-neutral-300/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ring-1',
                          typeConfig.bg,
                          typeConfig.ring
                        )}
                      >
                        <Icon className={cn('h-3.5 w-3.5', typeConfig.color)} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={cn('text-sm font-bold truncate', past ? 'text-neutral-400' : 'text-neutral-900')}>
                            {event.title}
                          </span>
                          <span className={cn('text-[11px] font-medium shrink-0 ml-2', past ? 'text-neutral-300' : 'text-neutral-400')}>
                            {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={cn('text-xs truncate', past ? 'text-neutral-300' : 'text-neutral-400')}>
                            {event.venue}
                          </span>
                          <span className={cn('text-xs shrink-0', past ? 'text-neutral-300' : 'text-neutral-400')}>&middot;</span>
                          <span
                            className={cn(
                              'text-xs font-medium shrink-0',
                              past ? 'text-neutral-300' : 'text-neutral-500'
                            )}
                          >
                            {event.childName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
