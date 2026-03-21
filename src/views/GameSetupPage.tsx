'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowLeft, ChevronDown, Users, Play } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  color: string | null;
  sport: string;
  players: { id: string; name: string; number: number; position: string }[];
}

export function GameSetupPage(): React.ReactElement {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [homeTeamId, setHomeTeamId] = useState<string>('');
  const [awayTeamId, setAwayTeamId] = useState<string>('');
  const [venue, setVenue] = useState('');
  const [quarterLength, setQuarterLength] = useState(10);
  const [shotClockSec, setShotClockSec] = useState(24);
  const [timeoutsPerHalf, setTimeoutsPerHalf] = useState(2);
  const [foulOutLimit, setFoulOutLimit] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    void fetch('/api/games/setup/teams')
      .then((r) => r.json())
      .then((data: Team[]) => setTeams(data))
      .catch(() => null);
  }, []);

  const homeTeam = teams.find((t) => t.id === homeTeamId);
  const awayTeam = teams.find((t) => t.id === awayTeamId);
  const canStart = homeTeamId && awayTeamId && homeTeamId !== awayTeamId;

  const startGame = async (): Promise<void> => {
    if (!canStart) return;
    setCreating(true);
    try {
      const res = await fetch('/api/games/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeTeamId, awayTeamId, venue, quarterLength, shotClockSec, timeoutsPerHalf, foulOutLimit }),
      });
      if (!res.ok) throw new Error('Failed to create game');
      const game = (await res.json()) as { id: string };
      router.push(`/games/live/${game.id}`);
    } catch {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.push('/games')} className="text-neutral-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-black text-neutral-900">Game Setup</h1>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 pt-6 space-y-6">
        {/* Team Selection */}
        <div className="grid grid-cols-2 gap-4">
          {/* Home */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Home Team</label>
            <select
              value={homeTeamId}
              onChange={(e) => setHomeTeamId(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm font-bold text-neutral-900 outline-none focus:border-[#c8ff00]"
            >
              <option value="">Select team</option>
              {teams.filter((t) => t.sport === 'basketball' && t.id !== awayTeamId).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {homeTeam && (
              <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-lg" style={{ backgroundColor: homeTeam.color ?? '#3b82f6' }} />
                  <span className="text-xs font-bold">{homeTeam.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                  <Users className="h-3 w-3" />
                  <span>{homeTeam.players.length} players</span>
                </div>
              </div>
            )}
          </div>

          {/* Away */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Away Team</label>
            <select
              value={awayTeamId}
              onChange={(e) => setAwayTeamId(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm font-bold text-neutral-900 outline-none focus:border-[#c8ff00]"
            >
              <option value="">Select team</option>
              {teams.filter((t) => t.sport === 'basketball' && t.id !== homeTeamId).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {awayTeam && (
              <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-lg" style={{ backgroundColor: awayTeam.color ?? '#ef4444' }} />
                  <span className="text-xs font-bold">{awayTeam.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                  <Users className="h-3 w-3" />
                  <span>{awayTeam.players.length} players</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Venue */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Venue</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Court or gym name"
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-900 outline-none focus:border-[#c8ff00] placeholder:text-neutral-400"
          />
        </div>

        {/* Game Settings */}
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="flex w-full items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-bold text-neutral-600"
        >
          Game Settings
          <ChevronDown className={cn('h-4 w-4 transition-transform', showSettings && 'rotate-180')} />
        </button>

        {showSettings && (
          <div className="space-y-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase">Quarter Length (min)</label>
                <input type="number" min={1} max={20} value={quarterLength} onChange={(e) => setQuarterLength(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase">Shot Clock (sec)</label>
                <input type="number" min={14} max={35} value={shotClockSec} onChange={(e) => setShotClockSec(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase">Timeouts/Half</label>
                <input type="number" min={1} max={5} value={timeoutsPerHalf} onChange={(e) => setTimeoutsPerHalf(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase">Foul Out Limit</label>
                <input type="number" min={4} max={6} value={foulOutLimit} onChange={(e) => setFoulOutLimit(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          type="button"
          onClick={() => void startGame()}
          disabled={!canStart || creating}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black transition-all',
            canStart && !creating
              ? 'bg-[#c8ff00] text-neutral-900 hover:bg-[#b8ef00] active:scale-[0.98]'
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed',
          )}
        >
          <Play className="h-4 w-4" />
          {creating ? 'Creating Game...' : 'Start Game'}
        </button>
      </div>
    </div>
  );
}
