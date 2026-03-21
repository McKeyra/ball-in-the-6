'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, Home } from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface ShotStats {
  made: number;
  missed: number;
}

interface PendingStats {
  twoPointers: ShotStats;
  threePointers: ShotStats;
  freeThrows: string[];
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  reboundsOff: number;
  reboundsDef: number;
  fouls: string[];
}

interface Player {
  id: string;
  name: string;
  jersey_number: number;
  position: string;
  team: 'home' | 'away';
  on_court: boolean;
  points: number;
  fgm: number;
  fga: number;
  three_pm: number;
  three_pa: number;
  ftm: number;
  fta: number;
  assists: number;
  rebounds_off: number;
  rebounds_def: number;
  steals: number;
  blocks: number;
  turnovers: number;
  personal_fouls: number;
}

interface Game {
  id: string;
  quarter: number;
  game_clock_seconds: number;
  home_score: number;
  away_score: number;
  home_team_color: string;
  away_team_color: string;
  home_team_name: string;
  away_team_name: string;
}

// ----------------------------------------------------------------
// StatButton placeholder
// ----------------------------------------------------------------
function StatButton({
  label,
  value,
  onIncrement,
  color,
  variant,
  icon,
}: {
  label: string;
  value: number;
  onIncrement: () => void;
  color?: string;
  variant?: 'make' | 'miss';
  icon?: string;
}): React.ReactElement {
  const bg =
    variant === 'make'
      ? color
        ? `${color}30`
        : 'rgba(34,197,94,0.2)'
      : variant === 'miss'
        ? 'rgba(239,68,68,0.2)'
        : 'rgba(255,255,255,0.07)';

  return (
    <button
      onClick={onIncrement}
      className="min-h-[64px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-transform active:scale-95"
      style={{
        background: bg,
        boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.05)',
        border: 'none',
      }}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span className="text-xs text-white/50 font-semibold uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-bold text-white">{value}</span>
    </button>
  );
}

// ----------------------------------------------------------------
// FreeThrowTracker placeholder
// ----------------------------------------------------------------
function FreeThrowTracker({
  freeThrows,
  onChange,
  color,
}: {
  freeThrows: string[];
  onChange: (fts: string[]) => void;
  color?: string;
}): React.ReactElement {
  const made = freeThrows.filter((ft) => ft === 'made').length;
  const missed = freeThrows.filter((ft) => ft === 'missed').length;

  return (
    <div
      className="p-4 rounded-2xl"
      style={{
        background: '#0f0f0f',
        boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-white/60">
          {made}/{freeThrows.length} FT
        </span>
        {freeThrows.length > 0 && (
          <span className="text-xs text-white/40">
            ({((made / freeThrows.length) * 100).toFixed(0)}%)
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {freeThrows.map((ft, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              ft === 'made' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
            }`}
          >
            {ft === 'made' ? 'O' : 'X'}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onChange([...freeThrows, 'made'])}
          className="min-h-[44px] rounded-xl font-semibold text-sm"
          style={{ background: color ? `${color}30` : 'rgba(34,197,94,0.2)', color: '#4ade80', border: 'none' }}
        >
          Made
        </button>
        <button
          onClick={() => onChange([...freeThrows, 'missed'])}
          className="min-h-[44px] rounded-xl font-semibold text-sm"
          style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none' }}
        >
          Missed
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// CurrentStats placeholder
// ----------------------------------------------------------------
function CurrentStats({ player }: { player: Player }): React.ReactElement {
  const stats = [
    { label: 'PTS', value: player.points },
    { label: 'FGM/A', value: `${player.fgm}/${player.fga}` },
    { label: '3PM/A', value: `${player.three_pm}/${player.three_pa}` },
    { label: 'FTM/A', value: `${player.ftm}/${player.fta}` },
    { label: 'AST', value: player.assists },
    { label: 'REB', value: player.rebounds_off + player.rebounds_def },
    { label: 'STL', value: player.steals },
    { label: 'BLK', value: player.blocks },
    { label: 'TO', value: player.turnovers },
    { label: 'PF', value: player.personal_fouls },
  ];

  return (
    <div
      className="p-4 rounded-2xl"
      style={{
        background: '#0f0f0f',
        boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.05)',
      }}
    >
      <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Current Game Stats</h3>
      <div className="grid grid-cols-5 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-lg font-bold text-white">{s.value}</div>
            <div className="text-[10px] text-white/40">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Page
// ----------------------------------------------------------------
export function PlayerSheetPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerId = searchParams.get('playerId');
  const gameId = searchParams.get('gameId');

  const [pendingStats, setPendingStats] = useState<PendingStats>({
    twoPointers: { made: 0, missed: 0 },
    threePointers: { made: 0, missed: 0 },
    freeThrows: [],
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    reboundsOff: 0,
    reboundsDef: 0,
    fouls: [],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = (): void => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { data: player = null } = useQuery<Player | null>({
    queryKey: ['sheet-player', playerId],
    queryFn: async () => {
      if (!playerId) return null;
      const res = await fetch(`/api/players/${playerId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!playerId,
  });

  const { data: game = null } = useQuery<Game | null>({
    queryKey: ['sheet-game', gameId],
    queryFn: async () => {
      if (!gameId) return null;
      const res = await fetch(`/api/games/${gameId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!gameId,
  });

  const allPlayers: Player[] = [];

  const handleStatChange = (category: string, type: string | null, value: number | null): void => {
    setPendingStats((prev) => {
      const updated = { ...prev };
      if (category === 'twoPointers' || category === 'threePointers') {
        const key = category as 'twoPointers' | 'threePointers';
        updated[key] = { ...prev[key], [type as string]: prev[key][type as 'made' | 'missed'] + (value ?? 1) };
      } else if (category === 'freeThrows') {
        updated.freeThrows = [...prev.freeThrows, type as string];
      } else if (category === 'fouls') {
        updated.fouls = [...prev.fouls, type as string];
      } else {
        (updated as unknown as Record<string, unknown>)[category] = (prev as unknown as Record<string, unknown>)[category] as number + (value ?? 1);
      }
      return updated;
    });
  };

  const handleConfirm = async (): Promise<void> => {
    if (!player || !game) return;
    // TODO: Implement stat submission via API
    // POST /api/games/${gameId}/events with all pending stats
    // PATCH /api/players/${playerId} with updated totals
    // PATCH /api/games/${gameId} with updated score
    router.back();
  };

  const switchToPlayer = (newPlayerId: string): void => {
    router.push(`/players/sheet?playerId=${newPlayerId}&gameId=${gameId}`);
  };

  if (!player || !game) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-white/60 mb-2">Player Stat Sheet</div>
          <p className="text-sm text-white/40">Select a player from a live game to begin tracking stats.</p>
        </div>
      </div>
    );
  }

  const teamColor = player.team === 'home' ? game.home_team_color : game.away_team_color;
  const teamName = player.team === 'home' ? game.home_team_name : game.away_team_name;
  const teamStarters = allPlayers.filter((p) => p.team === player.team && p.on_court);

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24">
      {/* Hero Header */}
      <div
        className="relative overflow-hidden p-4 md:p-6"
        style={{
          background: `linear-gradient(135deg, ${teamColor}20, ${teamColor}40)`,
        }}
      >
        <div className="absolute inset-0 backdrop-blur-xl" />
        <button
          className="absolute top-4 left-4 md:top-6 md:left-6 z-20 text-white/70 hover:bg-white/30 min-h-[44px] min-w-[44px] rounded-lg flex items-center justify-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="relative z-10 flex items-center gap-4 md:gap-6 max-w-7xl mx-auto pt-10 md:pt-0">
          <div className="flex-1 min-w-0">
            <div className="text-xs md:text-sm text-white/60 mb-1">
              {player.position} &bull; {teamName}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white/90 truncate">{player.name}</h1>
          </div>

          <div
            className="w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl md:text-5xl font-bold relative flex-shrink-0"
            style={{
              background: teamColor,
              boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.05)',
              color: 'white',
            }}
          >
            {player.jersey_number}
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-8 max-w-7xl mx-auto">
        {!isMobile ? (
          <div className="flex gap-6">
            {/* LEFT & CENTER - Stats Input */}
            <div className="flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN - Scoring & Free Throws */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Scoring</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <StatButton
                        label="2PT Make"
                        value={pendingStats.twoPointers.made}
                        onIncrement={() => handleStatChange('twoPointers', 'made', 1)}
                        color={teamColor}
                        variant="make"
                      />
                      <StatButton
                        label="2PT Miss"
                        value={pendingStats.twoPointers.missed}
                        onIncrement={() => handleStatChange('twoPointers', 'missed', 1)}
                        variant="miss"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <StatButton
                        label="3PT Make"
                        value={pendingStats.threePointers.made}
                        onIncrement={() => handleStatChange('threePointers', 'made', 1)}
                        color={teamColor}
                        variant="make"
                      />
                      <StatButton
                        label="3PT Miss"
                        value={pendingStats.threePointers.missed}
                        onIncrement={() => handleStatChange('threePointers', 'missed', 1)}
                        variant="miss"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Free Throws</h3>
                    <FreeThrowTracker
                      freeThrows={pendingStats.freeThrows}
                      onChange={(fts) => setPendingStats((prev) => ({ ...prev, freeThrows: fts }))}
                      color={teamColor}
                    />
                  </div>
                </div>

                {/* CENTER COLUMN - Other Stats */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Other Stats</h3>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <StatButton label="Assist" value={pendingStats.assists} onIncrement={() => handleStatChange('assists', null, 1)} />
                      <StatButton label="Steal" value={pendingStats.steals} onIncrement={() => handleStatChange('steals', null, 1)} />
                      <StatButton label="Block" value={pendingStats.blocks} onIncrement={() => handleStatChange('blocks', null, 1)} />
                      <StatButton label="Turnover" value={pendingStats.turnovers} onIncrement={() => handleStatChange('turnovers', null, 1)} />
                      <StatButton label="Off Reb" value={pendingStats.reboundsOff} onIncrement={() => handleStatChange('reboundsOff', null, 1)} />
                      <StatButton label="Def Reb" value={pendingStats.reboundsDef} onIncrement={() => handleStatChange('reboundsDef', null, 1)} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <StatButton label="Personal" value={pendingStats.fouls.filter((f) => f === 'personal').length} onIncrement={() => handleStatChange('fouls', 'personal', null)} />
                      <StatButton label="Offensive" value={pendingStats.fouls.filter((f) => f === 'offensive').length} onIncrement={() => handleStatChange('fouls', 'offensive', null)} />
                      <StatButton label="Technical" value={pendingStats.fouls.filter((f) => f === 'technical').length} onIncrement={() => handleStatChange('fouls', 'technical', null)} />
                      <StatButton label="Flagrant" value={pendingStats.fouls.filter((f) => f === 'unsportsmanlike').length} onIncrement={() => handleStatChange('fouls', 'unsportsmanlike', null)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Tabs */}
              <div className="mt-8">
                <div
                  className="grid w-full grid-cols-2 mb-6 p-1 rounded-xl"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.05)',
                  }}
                >
                  <button className="py-3 rounded-lg text-sm font-semibold bg-white/10 text-white">Current Stats</button>
                  <button className="py-3 rounded-lg text-sm font-semibold text-white/40">Advanced Metrics</button>
                </div>
                <CurrentStats player={player} />
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="w-64 flex-shrink-0 space-y-4 hidden lg:block">
              <button
                onClick={() => router.push('/games/court-view')}
                className="w-full min-h-[44px] py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white/70"
                style={{
                  background: '#0f0f0f',
                  boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.05)',
                  border: 'none',
                }}
              >
                <Home className="w-5 h-5" />
                Back to Court
              </button>

              <div
                className="p-4 rounded-2xl"
                style={{
                  background: '#0f0f0f',
                  boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.05)',
                }}
              >
                <div className="text-xs text-white/40 mb-2">Q{game.quarter} Score</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white/70">{game.home_score}</div>
                  <div className="text-sm text-white/40">-</div>
                  <div className="text-2xl font-bold text-white/70">{game.away_score}</div>
                </div>
              </div>

              <div
                className="p-4 rounded-2xl"
                style={{
                  background: '#0f0f0f',
                  boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.05)',
                }}
              >
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  {teamName} Starters
                </div>
                <div className="space-y-2">
                  {teamStarters.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => switchToPlayer(p.id)}
                      className={`w-full min-h-[44px] p-3 rounded-xl text-left transition-all ${p.id === player.id ? 'ring-2 ring-[#c9a962]' : ''}`}
                      style={{
                        background: p.id === player.id ? `${teamColor}30` : '#0f0f0f',
                        boxShadow:
                          p.id === player.id
                            ? 'inset 2px 2px 4px rgba(0,0,0,0.1)'
                            : '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.05)',
                        border: 'none',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                          style={{ background: teamColor }}
                        >
                          {p.jersey_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white/70 truncate">{p.name}</div>
                          <div className="text-xs text-white/40">{p.position}</div>
                        </div>
                        <div className="text-xs text-white/60">{p.points}p</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <CurrentStats player={player} />
            {/* TODO: MobileStatPanel component for stat entry on mobile */}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-[#0f0f0f] safe-area-inset-bottom"
        style={{
          boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-2xl mx-auto flex gap-3 md:gap-4">
          <button
            className="flex-1 min-h-[48px] md:h-16 text-base md:text-lg rounded-xl text-white/70"
            onClick={() => router.back()}
            style={{
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.05)',
              border: 'none',
              background: '#0f0f0f',
            }}
          >
            Cancel
          </button>
          <button
            className="flex-1 min-h-[48px] md:h-16 text-base md:text-lg font-semibold rounded-xl flex items-center justify-center gap-2"
            onClick={handleConfirm}
            style={{
              background: teamColor || '#c9a962',
              color: 'white',
              boxShadow: '4px 4px 12px rgba(0,0,0,0.2), -2px -2px 6px rgba(255,255,255,0.05)',
              border: 'none',
            }}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Confirm Stats</span>
            <span className="sm:hidden">Confirm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
