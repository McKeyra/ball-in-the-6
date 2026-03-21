'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  Users,
  Search,
  Clock,
  Calendar,
  BookOpen,
  Timer,
} from 'lucide-react';

// TODO: Replace with actual API route

interface SessionData {
  id: string;
  athlete_id?: string;
  athlete_name?: string;
  session_date?: string;
  status?: string;
  duration_minutes?: number;
  program_name?: string;
}

interface AggregatedAthlete {
  id: string;
  name: string;
  total_minutes: number;
  sessions_completed: number;
  current_program: string | null;
  last_session_date: string | null;
}

interface TrainerAthleteCardProps {
  athlete: AggregatedAthlete;
}

function TrainerAthleteCard({ athlete }: TrainerAthleteCardProps): React.ReactElement {
  const daysSinceLastSession = athlete.last_session_date
    ? Math.floor(
        (Date.now() - new Date(athlete.last_session_date).getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
          <span className="text-sm font-bold text-red-400">
            {athlete.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{athlete.name}</p>
          {athlete.current_program && (
            <p className="text-xs text-slate-400 truncate flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {athlete.current_program}
            </p>
          )}
        </div>
        {daysSinceLastSession !== null && (
          <span
            className={cn(
              'inline-flex items-center border text-[10px] px-2 py-0.5 rounded-full',
              daysSinceLastSession <= 7
                ? 'border-green-600/30 text-green-400'
                : daysSinceLastSession <= 30
                ? 'border-yellow-600/30 text-yellow-400'
                : 'border-red-600/30 text-red-400'
            )}
          >
            {daysSinceLastSession === 0 ? 'Today' : `${daysSinceLastSession}d ago`}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-slate-800/50 text-center">
          <Timer className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-white">{athlete.total_minutes}</p>
          <p className="text-[10px] text-slate-500">Minutes</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/50 text-center">
          <Calendar className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-white">{athlete.sessions_completed}</p>
          <p className="text-[10px] text-slate-500">Sessions</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/50 text-center">
          <Clock className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-white">
            {athlete.sessions_completed > 0
              ? Math.round(athlete.total_minutes / athlete.sessions_completed)
              : 0}
          </p>
          <p className="text-[10px] text-slate-500">Avg Min</p>
        </div>
      </div>

      {athlete.last_session_date && (
        <p className="text-xs text-slate-500">
          Last session: {new Date(athlete.last_session_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      )}
    </div>
  );
}

export function TrainerAthletesPage(): React.ReactElement {
  const userId = 'current-user';
  const [search, setSearch] = useState('');

  const { data: sessions = [], isLoading } = useQuery<SessionData[]>({
    queryKey: ['trainer', 'athlete-sessions'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/trainer/sessions')
      return [];
    },
    enabled: !!userId,
  });

  const athletes = useMemo((): AggregatedAthlete[] => {
    const athleteMap: Record<string, AggregatedAthlete> = {};
    sessions.forEach((s) => {
      if (!s.athlete_id) return;
      if (!athleteMap[s.athlete_id]) {
        athleteMap[s.athlete_id] = {
          id: s.athlete_id,
          name: s.athlete_name ?? 'Unknown Athlete',
          total_minutes: 0,
          sessions_completed: 0,
          current_program: s.program_name ?? null,
          last_session_date: null,
        };
      }
      const athlete = athleteMap[s.athlete_id];
      if (s.status === 'completed') {
        athlete.sessions_completed++;
        athlete.total_minutes += s.duration_minutes ?? 60;
      }
      if (s.program_name) {
        athlete.current_program = s.program_name;
      }
      const sessionDate = s.session_date?.split('T')[0];
      if (sessionDate && (!athlete.last_session_date || sessionDate > athlete.last_session_date)) {
        athlete.last_session_date = sessionDate;
      }
    });
    return Object.values(athleteMap);
  }, [sessions]);

  const filtered = useMemo((): AggregatedAthlete[] => {
    if (!search.trim()) return athletes;
    const q = search.toLowerCase();
    return athletes.filter((a) => a.name.toLowerCase().includes(q));
  }, [athletes, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Athletes</h1>
          <p className="text-slate-400 text-sm mt-1">
            {athletes.length} active athlete{athletes.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search athletes..."
          className="w-full bg-slate-900 border border-slate-800 text-white pl-9 px-3 py-2 rounded-lg text-sm focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 animate-pulse" />
              <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
              <div className="h-3 w-full bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg py-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white mb-1">
            {search ? 'No Athletes Found' : 'No Athletes Yet'}
          </h3>
          <p className="text-sm text-slate-400">
            {search
              ? 'Try a different search term.'
              : 'When athletes book sessions with you, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered
            .sort((a, b) => (b.last_session_date ?? '').localeCompare(a.last_session_date ?? ''))
            .map((athlete) => (
              <TrainerAthleteCard key={athlete.id} athlete={athlete} />
            ))}
        </div>
      )}
    </div>
  );
}
