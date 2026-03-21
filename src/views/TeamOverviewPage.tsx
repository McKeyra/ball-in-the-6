'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';

/* ---------- Types ---------- */
interface Team {
  id: string;
  team_name: string;
  league?: string;
  division?: string;
  team_color?: string;
}

interface TeamRecord {
  team: Team;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  winPct: number;
  lastFive: string[];
  streak: string[];
}

interface Game {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  status: string;
  game_date: string;
}

/* ---------- Component ---------- */
export function TeamOverviewPage(): React.ReactElement {
  const router = useRouter();
  const [filterLeague, setFilterLeague] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');
  const [activeTab, setActiveTab] = useState<'standings' | 'teams'>('standings');

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['overview-teams'],
    queryFn: async () => {
      const res = await fetch('/api/teams?sport=basketball');
      if (!res.ok) throw new Error('Failed to fetch teams');
      return res.json();
    },
  });

  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ['overview-games'],
    queryFn: async () => {
      const res = await fetch('/api/games?sport=basketball');
      if (!res.ok) throw new Error('Failed to fetch games');
      return res.json();
    },
  });

  const teamRecords = useMemo(() => {
    const records: Record<string, TeamRecord> = {};

    teams.forEach((team) => {
      records[team.id] = {
        team,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        winPct: 0,
        lastFive: [],
        streak: [],
      };
    });

    const finishedGames = games
      .filter((g) => g.status === 'finished')
      .sort((a, b) => new Date(b.game_date).getTime() - new Date(a.game_date).getTime());

    finishedGames.forEach((game) => {
      const homeWon = game.home_score > game.away_score;

      if (records[game.home_team_id]) {
        records[game.home_team_id].pointsFor += game.home_score || 0;
        records[game.home_team_id].pointsAgainst += game.away_score || 0;
        if (homeWon) {
          records[game.home_team_id].wins++;
          records[game.home_team_id].streak.push('W');
        } else {
          records[game.home_team_id].losses++;
          records[game.home_team_id].streak.push('L');
        }
      }

      if (records[game.away_team_id]) {
        records[game.away_team_id].pointsFor += game.away_score || 0;
        records[game.away_team_id].pointsAgainst += game.home_score || 0;
        if (!homeWon) {
          records[game.away_team_id].wins++;
          records[game.away_team_id].streak.push('W');
        } else {
          records[game.away_team_id].losses++;
          records[game.away_team_id].streak.push('L');
        }
      }
    });

    Object.keys(records).forEach((teamId) => {
      records[teamId].lastFive = records[teamId].streak.slice(0, 5);
      const total = records[teamId].wins + records[teamId].losses;
      records[teamId].winPct = total > 0 ? records[teamId].wins / total : 0;
    });

    return records;
  }, [teams, games]);

  const filteredTeams = teams.filter((team) => {
    if (filterLeague !== 'all' && team.league !== filterLeague) return false;
    if (filterDivision !== 'all' && team.division !== filterDivision) return false;
    return true;
  });

  const leagues = ['all', ...new Set(teams.map((t) => t.league).filter(Boolean) as string[])];
  const divisions = ['all', ...new Set(teams.map((t) => t.division).filter(Boolean) as string[])];

  const sortedTeams = [...filteredTeams].sort((a, b) => {
    const recordA = teamRecords[a.id];
    const recordB = teamRecords[b.id];
    if (!recordA || !recordB) return 0;
    if (recordB.winPct !== recordA.winPct) return recordB.winPct - recordA.winPct;
    return recordB.wins - recordA.wins;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="p-4 md:p-6 lg:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="/teams"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md"
                style={{
                  background: '#0f0f0f',
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90 mb-1 md:mb-2">
                  Team Overview
                </h1>
                <p className="text-sm md:text-base text-white/60">League standings and team performance</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 md:mb-6">
            <select
              value={filterLeague}
              onChange={(e) => setFilterLeague(e.target.value)}
              className="w-full sm:w-40 min-h-[44px] bg-white/[0.05] border border-white/[0.06] rounded-md px-3 text-white"
              style={{
                boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)',
              }}
            >
              {leagues.map((league) => (
                <option key={league} value={league}>
                  {league === 'all' ? 'All Leagues' : league}
                </option>
              ))}
            </select>

            <select
              value={filterDivision}
              onChange={(e) => setFilterDivision(e.target.value)}
              className="w-full sm:w-52 min-h-[44px] bg-white/[0.05] border border-white/[0.06] rounded-md px-3 text-white"
              style={{
                boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)',
              }}
            >
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div === 'all' ? 'All Divisions' : div}
                </option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          <div
            className="grid grid-cols-2 mb-4 md:mb-6 p-1 rounded-2xl"
            style={{
              background: '#0f0f0f',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
            }}
          >
            <button
              onClick={() => setActiveTab('standings')}
              className={`flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 min-h-[44px] text-sm md:text-base rounded-xl font-medium ${
                activeTab === 'standings' ? 'bg-[#c9a962] text-[#0f0f0f]' : 'text-white/50'
              }`}
            >
              <Medal className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">League</span> Standings
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 min-h-[44px] text-sm md:text-base rounded-xl font-medium ${
                activeTab === 'teams' ? 'bg-[#c9a962] text-[#0f0f0f]' : 'text-white/50'
              }`}
            >
              <Trophy className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Team</span> Cards
            </button>
          </div>

          {/* Standings Table */}
          {activeTab === 'standings' && (
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-3 px-4 text-sm text-white/40 font-medium">#</th>
                    <th className="text-left py-3 px-4 text-sm text-white/40 font-medium">Team</th>
                    <th className="text-center py-3 px-4 text-sm text-white/40 font-medium">W</th>
                    <th className="text-center py-3 px-4 text-sm text-white/40 font-medium">L</th>
                    <th className="text-center py-3 px-4 text-sm text-white/40 font-medium">Win%</th>
                    <th className="text-center py-3 px-4 text-sm text-white/40 font-medium">Last 5</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeams.map((team, idx) => {
                    const record = teamRecords[team.id];
                    return (
                      <tr
                        key={team.id}
                        className="border-b border-white/[0.04] hover:bg-white/[0.03] cursor-pointer"
                        onClick={() => router.push(`/teams/${team.id}/performance`)}
                      >
                        <td className="py-3 px-4 text-white/60">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-white/90">{team.team_name}</td>
                        <td className="py-3 px-4 text-center text-white/70">{record?.wins ?? 0}</td>
                        <td className="py-3 px-4 text-center text-white/70">{record?.losses ?? 0}</td>
                        <td className="py-3 px-4 text-center text-white/70">
                          {((record?.winPct ?? 0) * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-1">
                            {(record?.lastFive ?? []).map((r, i) => (
                              <span
                                key={i}
                                className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                                  r === 'W' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {sortedTeams.length === 0 && (
                <div className="text-center py-12 text-white/40">No teams found</div>
              )}
            </div>
          )}

          {/* Team Cards */}
          {activeTab === 'teams' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {sortedTeams.map((team) => {
                const record = teamRecords[team.id];
                return (
                  <div
                    key={team.id}
                    onClick={() => router.push(`/teams/${team.id}/performance`)}
                    className="p-4 rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform"
                    style={{
                      background: '#0f0f0f',
                      boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: team.team_color || '#666' }}
                      >
                        {team.team_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white/90">{team.team_name}</h3>
                        <p className="text-xs text-white/40">{team.division}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">
                        {record?.wins ?? 0}-{record?.losses ?? 0}
                      </span>
                      <span className="text-[#c9a962] font-semibold">
                        {((record?.winPct ?? 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
