'use client';

import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Calendar,
  Zap,
  Trophy,
  Clock,
  Star,
  Flame,
} from 'lucide-react';

// TODO: Replace with actual API route

interface XPLevel {
  name: string;
  min: number;
  max: number;
  color: string;
}

const XP_LEVELS: XPLevel[] = [
  { name: 'Rookie', min: 0, max: 500, color: 'text-slate-400' },
  { name: 'Starter', min: 500, max: 1500, color: 'text-blue-400' },
  { name: 'Varsity', min: 1500, max: 3500, color: 'text-green-400' },
  { name: 'All-Star', min: 3500, max: 7000, color: 'text-purple-400' },
  { name: 'MVP', min: 7000, max: 15000, color: 'text-yellow-400' },
  { name: 'Hall of Fame', min: 15000, max: 999999, color: 'text-red-400' },
];

function getCurrentLevel(xp: number): XPLevel {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].min) return XP_LEVELS[i];
  }
  return XP_LEVELS[0];
}

function getLevelProgress(xp: number): number {
  const level = getCurrentLevel(xp);
  const range = level.max - level.min;
  return Math.min(100, Math.round(((xp - level.min) / range) * 100));
}

interface ChildData {
  id: string;
  athlete_id?: string;
  name?: string;
}

interface ChildProgram {
  id: string;
  athlete_id?: string;
  program_name?: string;
  trainer_name?: string;
}

interface ChildSession {
  id: string;
  athlete_id?: string;
  session_date?: string;
  start_time?: string;
  trainer_name?: string;
  status?: string;
}

interface ChildXP {
  athlete_id?: string;
  total_xp?: number;
  current_streak?: number;
  earned_badges?: string[];
}

interface MiniStatProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}

function MiniStat({ icon: Icon, label, value }: MiniStatProps): React.ReactElement {
  return (
    <div className="p-2 rounded-lg bg-slate-800/50 text-center">
      <Icon className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
      <p className="text-sm font-bold text-white">{value}</p>
      <p className="text-[10px] text-slate-500">{label}</p>
    </div>
  );
}

export function TrainingOverviewPage(): React.ReactElement {
  const userId = 'current-user';

  const { data: children = [], isLoading: loadingChildren } = useQuery<ChildData[]>({
    queryKey: ['parent', 'children-training'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/parent/children')
      return [];
    },
    enabled: !!userId,
  });

  const childIds = children.map((c) => c.athlete_id).filter(Boolean) as string[];

  const { data: programs = [], isLoading: loadingPrograms } = useQuery<ChildProgram[]>({
    queryKey: ['parent', 'child-programs', childIds],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/parent/programs')
      return [];
    },
    enabled: childIds.length > 0,
  });

  const { data: sessions = [], isLoading: loadingSessions } = useQuery<ChildSession[]>({
    queryKey: ['parent', 'child-sessions', childIds],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/parent/sessions')
      return [];
    },
    enabled: childIds.length > 0,
  });

  const { data: xpRecords = [] } = useQuery<ChildXP[]>({
    queryKey: ['parent', 'child-xp', childIds],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/parent/xp')
      return [];
    },
    enabled: childIds.length > 0,
  });

  const isLoading = loadingChildren || loadingPrograms || loadingSessions;

  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);
  const thisWeekStr = thisWeekStart.toISOString().split('T')[0];

  const weekSessions = sessions.filter(
    (s) => (s.session_date ?? '') >= thisWeekStr && s.status !== 'cancelled'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Training Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor your child's training progress.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : children.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg py-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white mb-1">No Children Linked</h3>
          <p className="text-sm text-slate-400">Add your child from the Parent Hub to see their training data.</p>
        </div>
      ) : (
        children.map((child) => {
          const childPrograms = programs.filter((p) => p.athlete_id === child.athlete_id);
          const childWeekSessions = weekSessions.filter((s) => s.athlete_id === child.athlete_id);
          const childXP = xpRecords.find((x) => x.athlete_id === child.athlete_id);
          const totalXP = childXP?.total_xp ?? 0;
          const streak = childXP?.current_streak ?? 0;
          const badges = childXP?.earned_badges ?? [];
          const level = getCurrentLevel(totalXP);
          const progress = getLevelProgress(totalXP);

          const childNextSession = sessions
            .filter(
              (s) =>
                s.athlete_id === child.athlete_id &&
                (s.session_date ?? '') >= new Date().toISOString().split('T')[0] &&
                s.status !== 'cancelled'
            )
            .sort((a, b) => (a.session_date ?? '').localeCompare(b.session_date ?? ''))[0];

          return (
            <div key={child.id} className="bg-slate-900 border border-slate-800 rounded-lg">
              <div className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-red-400">
                        {(child.name ?? 'C').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-base font-semibold">{child.name ?? 'Child'}</p>
                      <p className={cn('text-xs font-medium', level.color)}>{level.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {streak > 0 && (
                      <span className="inline-flex items-center border border-orange-600/30 text-orange-400 text-[10px] px-2 py-0.5 rounded-full">
                        <Flame className="w-3 h-3 mr-1" /> {streak} day streak
                      </span>
                    )}
                    <span className="inline-flex items-center border border-purple-600/30 text-purple-400 text-[10px] px-2 py-0.5 rounded-full">
                      <Zap className="w-3 h-3 mr-1" /> {totalXP.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {/* XP Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={level.color}>{level.name}</span>
                    <span className="text-slate-400">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MiniStat icon={BookOpen} label="Programs" value={childPrograms.length} />
                  <MiniStat icon={Calendar} label="This Week" value={`${childWeekSessions.length} sessions`} />
                  <MiniStat icon={Trophy} label="Badges" value={badges.length} />
                  <MiniStat icon={Flame} label="Streak" value={`${streak} days`} />
                </div>

                {/* Current Programs */}
                {childPrograms.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Current Programs
                    </p>
                    {childPrograms.map((prog) => (
                      <div
                        key={prog.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm text-white">{prog.program_name}</span>
                        </div>
                        <span className="text-xs text-slate-400">{prog.trainer_name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent Badges */}
                {badges.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Recent Badges
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {badges.slice(0, 5).map((badge, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center border border-yellow-600/30 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full"
                        >
                          <Star className="w-3 h-3 mr-1" /> {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Session */}
                {childNextSession && (
                  <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/30">
                    <p className="text-xs text-blue-400 font-medium mb-1">Next Session</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-white">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {new Date(childNextSession.session_date!).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                        {childNextSession.start_time && ` at ${childNextSession.start_time}`}
                      </div>
                      <span className="text-xs text-slate-400">
                        {childNextSession.trainer_name ?? 'Trainer'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
