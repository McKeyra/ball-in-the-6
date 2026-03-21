'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Target,
  CheckCircle,
  XCircle,
  User,
} from 'lucide-react';

// TODO: Replace with actual API route

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-600/20 text-green-400 border-green-600/30',
  pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  completed: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  cancelled: 'bg-red-600/20 text-red-400 border-red-600/30',
  declined: 'bg-red-600/20 text-red-400 border-red-600/30',
};

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

interface SessionData {
  id: string;
  athlete_name?: string;
  session_date?: string;
  start_time?: string;
  focus_area?: string;
  location?: string;
  status?: string;
}

function getMonthDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }
  return days;
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function TrainerSchedulePage(): React.ReactElement {
  const userId = 'current-user';
  const queryClient = useQueryClient();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())
  );

  const { data: sessions = [], isLoading } = useQuery<SessionData[]>({
    queryKey: ['trainer', 'schedule', currentYear, currentMonth],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/trainer/schedule')
      return [];
    },
    enabled: !!userId,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // TODO: Replace with fetch(`/api/training-marketplace/trainer/sessions/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
      return { id, status };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trainer', 'schedule'] }),
  });

  const sessionsByDate = useMemo((): Record<string, SessionData[]> => {
    const map: Record<string, SessionData[]> = {};
    sessions.forEach((s) => {
      const dateKey = s.session_date?.split('T')[0];
      if (!dateKey) return;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(s);
    });
    return map;
  }, [sessions]);

  const monthDays = getMonthDays(currentYear, currentMonth);
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedSessions = sessionsByDate[selectedDate] ?? [];

  const navigateMonth = (dir: number): void => {
    let m = currentMonth + dir;
    let y = currentYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  const pendingSessions = sessions.filter((s) => s.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Schedule</h1>
        <p className="text-slate-400 text-sm mt-1">View and manage your training schedule.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg lg:col-span-2">
          <div className="p-4 pb-2 flex items-center justify-between">
            <button
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-semibold text-white">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <button
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 pt-2">
            <div className="grid grid-cols-7 gap-1">
              {DAYS_SHORT.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-slate-500 py-2">
                  {d}
                </div>
              ))}
              {monthDays.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} className="p-2" />;
                }
                const dateKey = formatDateKey(currentYear, currentMonth, day);
                const daySessions = sessionsByDate[dateKey] ?? [];
                const isToday = dateKey === todayKey;
                const isSelected = dateKey === selectedDate;

                return (
                  <button
                    key={dateKey}
                    onClick={() => setSelectedDate(dateKey)}
                    className={cn(
                      'relative p-2 rounded-lg text-sm transition-colors min-h-[48px] flex flex-col items-center',
                      isSelected && 'bg-red-600/20 border border-red-600',
                      isToday && !isSelected && 'bg-slate-800 border border-slate-700',
                      !isSelected && !isToday && 'hover:bg-slate-800/50',
                    )}
                  >
                    <span className={cn(
                      'font-medium',
                      isSelected ? 'text-red-400' : isToday ? 'text-white' : 'text-slate-300'
                    )}>
                      {day}
                    </span>
                    {daySessions.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {daySessions.slice(0, 3).map((s, si) => (
                          <div
                            key={si}
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              s.status === 'pending' ? 'bg-yellow-400' :
                              s.status === 'confirmed' ? 'bg-green-400' :
                              s.status === 'completed' ? 'bg-blue-400' : 'bg-slate-500'
                            )}
                          />
                        ))}
                        {daySessions.length > 3 && (
                          <span className="text-[8px] text-slate-400">+{daySessions.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">
              Pending Bookings ({pendingSessions.length})
            </h2>
          </div>
          <div className="p-4 pt-2">
            {pendingSessions.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No pending bookings</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {pendingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">
                        {session.athlete_name ?? 'Athlete'}
                      </p>
                      <span className="inline-flex items-center border border-yellow-600/30 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full">
                        pending
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {session.session_date?.split('T')[0]}
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.start_time ?? 'TBD'}
                      </p>
                      <p className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {session.focus_area ?? 'General'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 flex items-center justify-center bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600/30 px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 transition-colors"
                        onClick={() => updateMutation.mutate({ id: session.id, status: 'confirmed' })}
                        disabled={updateMutation.isPending}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" /> Accept
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30 px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 transition-colors"
                        onClick={() => updateMutation.mutate({ id: session.id, status: 'declined' })}
                        disabled={updateMutation.isPending}
                      >
                        <XCircle className="w-3 h-3 mr-1" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Date Sessions */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4 pb-2">
          <h2 className="text-base font-semibold text-white">
            Sessions for {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h2>
        </div>
        <div className="p-4 pt-2">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-slate-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : selectedSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No sessions on this day</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedSessions
                .sort((a, b) => (a.start_time ?? '').localeCompare(b.start_time ?? ''))
                .map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-800"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-600/20">
                      <User className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {session.athlete_name ?? 'Athlete'}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {session.start_time ?? 'TBD'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" /> {session.focus_area ?? 'General Training'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {session.location ?? 'TBD'}
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center border text-[10px] px-2 py-0.5 rounded-full',
                        STATUS_COLORS[session.status ?? 'confirmed'] ?? STATUS_COLORS.confirmed
                      )}
                    >
                      {session.status ?? 'confirmed'}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
