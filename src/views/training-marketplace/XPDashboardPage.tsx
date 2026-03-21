'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Trophy, Star, Flame, Zap, Lock, Medal, Crown, Target } from 'lucide-react';

interface XPLevel { name: string; min: number; max: number; color: string; bg: string; }
interface BadgeDef { id: string; name: string; desc: string; icon: React.ComponentType<{ className?: string }>; xp: number; }
interface XPData { total_xp: number; current_streak: number; earned_badges: string[]; xp_history: Array<{ reason?: string; amount: number }>; }
interface LeaderboardEntry { id?: string; athlete_id?: string; athlete_name?: string; total_xp?: number; }

const XP_LEVELS: XPLevel[] = [
  { name: 'Rookie', min: 0, max: 500, color: 'text-slate-400', bg: 'bg-slate-600' },
  { name: 'Starter', min: 500, max: 1500, color: 'text-blue-400', bg: 'bg-blue-600' },
  { name: 'Varsity', min: 1500, max: 3500, color: 'text-green-400', bg: 'bg-green-600' },
  { name: 'All-Star', min: 3500, max: 7000, color: 'text-purple-400', bg: 'bg-purple-600' },
  { name: 'MVP', min: 7000, max: 15000, color: 'text-yellow-400', bg: 'bg-yellow-600' },
  { name: 'Hall of Fame', min: 15000, max: 999999, color: 'text-red-400', bg: 'bg-red-600' },
];

const BADGE_CATALOG: BadgeDef[] = [
  { id: 'first_session', name: 'First Session', desc: 'Complete your first training session', icon: Star, xp: 50 },
  { id: 'streak_3', name: '3-Day Streak', desc: 'Train 3 days in a row', icon: Flame, xp: 100 },
  { id: 'streak_7', name: 'Week Warrior', desc: '7-day training streak', icon: Flame, xp: 250 },
  { id: 'streak_30', name: 'Iron Discipline', desc: '30-day training streak', icon: Crown, xp: 1000 },
  { id: 'module_10', name: 'Module Master', desc: 'Complete 10 modules', icon: Target, xp: 200 },
  { id: 'module_50', name: 'Knowledge Seeker', desc: 'Complete 50 modules', icon: Target, xp: 500 },
  { id: 'quiz_perfect', name: 'Perfect Score', desc: 'Get 100% on a quiz', icon: Zap, xp: 150 },
  { id: 'challenge_5', name: 'Challenger', desc: 'Complete 5 challenges', icon: Medal, xp: 300 },
  { id: 'hours_10', name: '10 Hour Club', desc: 'Log 10 hours of training', icon: Trophy, xp: 400 },
  { id: 'hours_50', name: 'Grinder', desc: '50 hours of training logged', icon: Trophy, xp: 1000 },
  { id: 'hours_100', name: 'Century', desc: '100 hours of training', icon: Crown, xp: 2500 },
  { id: 'first_program', name: 'Program Graduate', desc: 'Complete a full program', icon: Medal, xp: 500 },
];

function getCurrentLevel(xp: number): XPLevel { for (let i = XP_LEVELS.length - 1; i >= 0; i--) { if (xp >= XP_LEVELS[i].min) return XP_LEVELS[i]; } return XP_LEVELS[0]; }
function getNextLevel(xp: number): XPLevel { for (const level of XP_LEVELS) { if (xp < level.max) return level; } return XP_LEVELS[XP_LEVELS.length - 1]; }
function getLevelProgress(xp: number): number { const c = getCurrentLevel(xp); const range = c.max - c.min; return Math.min(100, Math.round(((xp - c.min) / range) * 100)); }

export function XPDashboardPage(): React.ReactElement {
  const userId = 'current-user';
  const { data: xpData = { total_xp: 0, current_streak: 0, earned_badges: [], xp_history: [] } } = useQuery<XPData>({
    queryKey: ['athlete', 'xp'], queryFn: async () => { /* TODO: fetch('/api/training/xp') */ return { total_xp: 0, current_streak: 0, earned_badges: [], xp_history: [] }; }, enabled: !!userId,
  });
  const { data: leaderboard = [], isLoading: loadingLeaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ['athlete', 'leaderboard'], queryFn: async () => { /* TODO: fetch('/api/training/leaderboard') */ return []; },
  });

  const totalXP = xpData.total_xp || 0;
  const currentStreak = xpData.current_streak || 0;
  const earnedBadges = xpData.earned_badges || [];
  const xpHistory = xpData.xp_history || [];
  const currentLevel = getCurrentLevel(totalXP);
  const nextLevel = getNextLevel(totalXP);
  const levelProgress = getLevelProgress(totalXP);
  const xpToNext = nextLevel.max - totalXP;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">XP & Progress</h1><p className="text-slate-400 text-sm mt-1">Track your training achievements and level up.</p></div>

      {/* XP Bar & Level */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width="100" height="100" className="transform -rotate-90"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-800" /><circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" strokeLinecap="round" className={currentLevel.color} stroke="currentColor" strokeDasharray={`${(levelProgress / 100) * 264} 264`} /></svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><span className={cn('text-lg font-bold', currentLevel.color)}>{XP_LEVELS.indexOf(currentLevel) + 1}</span><span className="text-[10px] text-slate-400">Level</span></div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between"><h2 className={cn('text-xl font-bold', currentLevel.color)}>{currentLevel.name}</h2><span className="text-sm text-slate-400">{totalXP.toLocaleString()} XP</span></div>
            <div className="w-full bg-slate-800 rounded-full h-3"><div className={cn('h-3 rounded-full transition-all', currentLevel.bg)} style={{ width: `${levelProgress}%` }} /></div>
            <div className="flex items-center justify-between text-xs text-slate-500"><span>{currentLevel.min.toLocaleString()} XP</span><span>{xpToNext.toLocaleString()} XP to {nextLevel.name}</span><span>{nextLevel.max.toLocaleString()} XP</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center"><Flame className={cn('w-8 h-8 mx-auto mb-2', currentStreak >= 7 ? 'text-orange-400' : currentStreak >= 3 ? 'text-yellow-400' : 'text-slate-500')} /><p className="text-3xl font-bold text-white">{currentStreak}</p><p className="text-sm text-slate-400">Day Streak</p></div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center"><Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" /><p className="text-3xl font-bold text-white">{earnedBadges.length}</p><p className="text-sm text-slate-400">Badges Earned</p><p className="text-xs text-slate-500 mt-1">{BADGE_CATALOG.length - earnedBadges.length} remaining</p></div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center"><Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" /><p className="text-3xl font-bold text-white">{totalXP.toLocaleString()}</p><p className="text-sm text-slate-400">Total XP</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Badge Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg lg:col-span-2">
          <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Badges</h2></div>
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {BADGE_CATALOG.map((badge) => { const earned = earnedBadges.includes(badge.id); const Icon = badge.icon; return (
                <div key={badge.id} className={cn('flex flex-col items-center p-3 rounded-lg border transition-colors', earned ? 'bg-yellow-600/10 border-yellow-600/30' : 'bg-slate-800/30 border-slate-800 opacity-50')}>
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mb-2', earned ? 'bg-yellow-600/20' : 'bg-slate-800')}>{earned ? <Icon className="w-5 h-5 text-yellow-400" /> : <Lock className="w-4 h-4 text-slate-600" />}</div>
                  <p className={cn('text-xs font-medium text-center', earned ? 'text-white' : 'text-slate-500')}>{badge.name}</p>
                  <p className="text-[10px] text-slate-500 text-center mt-0.5">{badge.desc}</p>
                  <span className={cn('text-[9px] mt-1.5 border px-2 py-0.5 rounded-full', earned ? 'border-yellow-600/30 text-yellow-400' : 'border-slate-700 text-slate-500')}>+{badge.xp} XP</span>
                </div>
              ); })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Recent XP */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg">
            <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Recent XP</h2></div>
            <div className="p-4">{xpHistory.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No XP earned yet</p> : <div className="space-y-2">{xpHistory.slice(0, 8).map((entry, i) => (<div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30"><div className="flex items-center gap-2"><Zap className="w-3 h-3 text-purple-400" /><span className="text-xs text-slate-300">{entry.reason || 'Training'}</span></div><span className="text-xs font-bold text-green-400">+{entry.amount} XP</span></div>))}</div>}</div>
          </div>
          {/* Leaderboard */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg">
            <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Leaderboard</h2></div>
            <div className="p-4">{loadingLeaderboard ? <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="h-10 bg-slate-800 rounded animate-pulse" />)}</div> : leaderboard.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No data yet</p> : <div className="space-y-1">{leaderboard.map((entry, i) => { const isMe = entry.athlete_id === userId; const level = getCurrentLevel(entry.total_xp || 0); return (<div key={entry.id || i} className={cn('flex items-center gap-3 p-2 rounded-lg', isMe ? 'bg-red-600/10 border border-red-600/30' : 'bg-slate-800/30')}><span className={cn('w-6 text-center text-xs font-bold', i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-500')}>{i + 1}</span><div className="flex-1 min-w-0"><p className={cn('text-xs font-medium truncate', isMe ? 'text-red-400' : 'text-white')}>{entry.athlete_name || 'Athlete'}{isMe && ' (You)'}</p><p className={cn('text-[10px]', level.color)}>{level.name}</p></div><span className="text-xs font-bold text-white">{(entry.total_xp || 0).toLocaleString()}</span></div>); })}</div>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
