'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  TrendingUp, Trophy, Target, Calendar, DollarSign,
  GraduationCap, Shirt, FileText, BarChart3, Star,
} from 'lucide-react';

/* ---------- Types ---------- */
interface PlayerStat {
  stat_type: string;
  value: number;
  created_date: string;
}

/* ---------- Component ---------- */
export function PlayerDashboardPage(): React.ReactElement {
  const { data: user } = useQuery<{ id: string; full_name?: string; player_id?: string }>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
  });

  const playerId = user?.player_id;

  const { data: playerData } = useQuery<{ first_name?: string; last_name?: string; stats?: PlayerStat[] }>({
    queryKey: ['player', playerId],
    queryFn: async () => {
      const res = await fetch(`/api/players/${playerId}`);
      if (!res.ok) throw new Error('Failed to fetch player');
      return res.json();
    },
    enabled: !!playerId,
  });

  const playerName = playerData?.first_name || user?.full_name || 'Player';
  const profileColor = 'from-[#c9a962] to-yellow-500';

  const stats: PlayerStat[] = playerData?.stats || [];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
            Welcome back, {playerName}
          </h1>
          <p className="text-sm md:text-base text-white/40">Your athlete dashboard & brand hub</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { icon: Trophy, color: 'text-[#c9a962]', value: '0', label: 'Active Teams' },
            { icon: BarChart3, color: 'text-blue-400', value: '0', label: 'Stats Logged' },
            { icon: Star, color: 'text-purple-400', value: '$0', label: 'NIL Earnings' },
            { icon: Target, color: 'text-green-400', value: '17/20', label: 'Goals Complete' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-gradient-to-br from-white/5 to-white/10 border border-white/[0.06] rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs md:text-sm text-white/40">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* NIL Merch Store */}
            <div className="bg-gradient-to-br from-[#c9a962]/10 to-yellow-500/10 border border-[#c9a962]/30 rounded-xl overflow-hidden">
              <div className={`h-24 md:h-32 bg-gradient-to-br ${profileColor} relative`}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shirt className="w-12 h-12 md:w-16 md:h-16 text-white opacity-50" />
                </div>
              </div>
              <div className="p-4 md:p-6 -mt-6 md:-mt-8 relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#c9a962] rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-lg">
                  <Shirt className="w-6 h-6 md:w-8 md:h-8 text-[#0f0f0f]" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">Your NIL Merch Store</h3>
                <p className="text-sm md:text-base text-white/50 mb-4">
                  Launch your personal brand. Sell custom gear with your name, number & logo.
                  <span className="text-[#c9a962] font-semibold"> You keep 90%.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 flex-1 min-h-[44px] rounded-md font-medium">
                    Launch Store
                  </button>
                  <button className="border border-white/[0.06] min-h-[44px] rounded-md px-4 text-white/70">
                    View Samples
                  </button>
                </div>
              </div>
            </div>

            {/* College Recruiting Resume */}
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-semibold">College Recruiting Resume</h2>
                    <p className="text-xs md:text-sm text-white/40">NCAA-compliant PDF + highlight reel</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">Set Grad Year</span>
              </div>
              <div className="p-4 md:p-6 pt-0 space-y-4">
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {[
                    { value: '-', label: 'Height' },
                    { value: '-', label: 'Weight' },
                    { value: '-', label: 'Position' },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-2 md:p-3 bg-white/[0.05] rounded-lg">
                      <p className="text-lg md:text-2xl font-bold text-white">{s.value}</p>
                      <p className="text-xs text-white/40">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 border border-white/[0.06] min-h-[44px] rounded-md flex items-center justify-center gap-2 text-sm md:text-base text-white/70">
                    <FileText className="w-4 h-4" /> Edit Resume
                  </button>
                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 min-h-[44px] rounded-md text-white text-sm md:text-base font-medium">
                    Export PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Performance */}
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="p-4 md:p-6">
                <h2 className="flex items-center gap-2 text-base md:text-lg font-semibold mb-4">
                  <BarChart3 className="w-5 h-5 text-[#c9a962]" /> Recent Performance
                </h2>
                {stats.length === 0 ? (
                  <p className="text-sm md:text-base text-white/40 text-center py-6 md:py-8">No stats recorded yet</p>
                ) : (
                  <div className="space-y-2">
                    {stats.slice(0, 5).map((stat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.05] rounded-lg min-h-[44px]">
                        <div>
                          <p className="text-sm md:text-base font-medium text-white capitalize">{stat.stat_type.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-white/40">{new Date(stat.created_date).toLocaleDateString()}</p>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-[#c9a962]">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/players/profiles" className="w-full justify-start border border-white/[0.06] min-h-[44px] rounded-md flex items-center gap-3 px-3 text-sm md:text-base text-white/70 hover:bg-white/[0.05]">
                  <Trophy className="w-4 h-4" /> My Brand Page
                </Link>
                <Link href="/community/feed" className="w-full justify-start border border-white/[0.06] min-h-[44px] rounded-md flex items-center gap-3 px-3 text-sm md:text-base text-white/70 hover:bg-white/[0.05]">
                  <Star className="w-4 h-4" /> View Feed
                </Link>
                <button className="w-full justify-start border border-white/[0.06] min-h-[44px] rounded-md flex items-center gap-3 px-3 text-sm md:text-base text-white/70 hover:bg-white/[0.05]">
                  <DollarSign className="w-4 h-4" /> Track Earnings
                </button>
              </div>
            </div>

            {/* Next Game */}
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-4 md:p-6">
              <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold mb-4">
                <Calendar className="w-5 h-5 text-[#c9a962]" /> Next Game
              </h3>
              <div className="p-3 md:p-4 bg-white/[0.05] rounded-lg">
                <p className="text-xs md:text-sm text-white/40 mb-1">Saturday, Nov 16</p>
                <p className="text-sm md:text-base font-semibold text-white mb-2">vs Toronto Elite</p>
                <p className="text-xs md:text-sm text-white/40">7:00 PM - Home Court</p>
              </div>
            </div>

            {/* Training Progress */}
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-4 md:p-6">
              <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold mb-4">
                <Target className="w-5 h-5 text-green-400" /> Training Progress
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Ball Handling', pct: 85, colors: 'from-[#c9a962] to-green-400' },
                  { label: 'Shooting Form', pct: 60, colors: 'from-blue-500 to-cyan-400' },
                  { label: 'Conditioning', pct: 92, colors: 'from-green-500 to-emerald-400' },
                ].map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between text-xs md:text-sm mb-1">
                      <span className="text-white/40">{skill.label}</span>
                      <span className="text-white font-semibold">{skill.pct}%</span>
                    </div>
                    <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${skill.colors}`} style={{ width: `${skill.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
