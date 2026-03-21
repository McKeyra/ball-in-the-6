'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Search,
  Shield,
  Users,
  Trophy,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  code?: string;
  coach?: string;
  division?: string;
  wins?: number;
  losses?: number;
  ties?: number;
  points_for?: number;
  points_against?: number;
  roster_count?: number;
  player_count?: number;
  roster_max?: number;
  max_players?: number;
}

interface TeamRecord {
  wins: number;
  losses: number;
  ties: number;
}

function getRecord(team: Team): TeamRecord {
  const wins = team.wins || 0;
  const losses = team.losses || 0;
  const ties = team.ties || 0;
  return { wins, losses, ties };
}

function getPoints(team: Team): number {
  const { wins, ties } = getRecord(team);
  return wins * 2 + ties;
}

export function TeamsPage(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('all');

  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ['command-center', 'teams'],
    queryFn: async () => {
      const res = await fetch('/api/teams?sport=basketball');
      if (!res.ok) throw new Error('Failed to fetch teams');
      return res.json();
    },
  });

  const divisions = [...new Set(teams.map((t) => t.division).filter(Boolean))] as string[];

  const filtered = teams.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.coach || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDivision = divisionFilter === 'all' || t.division === divisionFilter;
    return matchesSearch && matchesDivision;
  });

  const sorted = [...filtered].sort((a, b) => getPoints(b) - getPoints(a));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Teams</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage teams, rosters, and standings
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            className="bg-slate-900 border-slate-800 text-white pl-9"
            placeholder="Search teams, coaches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {divisions.length > 0 && (
          <Select value={divisionFilter} onValueChange={setDivisionFilter}>
            <SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full sm:w-44">
              <Filter className="w-4 h-4 mr-2 text-slate-500" />
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white hover:bg-slate-700">All Divisions</SelectItem>
              {divisions.map((d) => (
                <SelectItem key={d} value={d} className="text-white hover:bg-slate-700">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <Skeleton className="h-6 w-28 mb-3 bg-slate-800" />
                <Skeleton className="h-4 w-20 mb-2 bg-slate-800" />
                <Skeleton className="h-4 w-full mb-2 bg-slate-800" />
                <Skeleton className="h-4 w-24 bg-slate-800" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-12 text-center">
            <Shield className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No teams found</p>
            <p className="text-slate-500 text-sm mt-1">
              {searchQuery || divisionFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Teams will appear here once created'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((team) => {
            const { wins, losses, ties } = getRecord(team);
            const totalGames = wins + losses + ties;
            const winPct = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(0) : '0';
            const pf = team.points_for || 0;
            const pa = team.points_against || 0;
            const diff = pf - pa;
            const rosterCount = team.roster_count || team.player_count || 0;
            const rosterMax = team.roster_max || team.max_players || 0;

            return (
              <Card
                key={team.id}
                className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{team.name}</h3>
                        {team.code && (
                          <span className="text-[10px] text-slate-500 font-mono">{team.code}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {team.division && (
                    <Badge
                      variant="outline"
                      className="border-slate-700 text-slate-400 text-[10px] mb-3"
                    >
                      {team.division}
                    </Badge>
                  )}

                  <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Record</span>
                      <span className="text-sm font-bold text-white">
                        {wins}-{losses}{ties > 0 ? `-${ties}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Win %</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-white">{winPct}%</span>
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${winPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">PF / PA</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white">{pf} / {pa}</span>
                        <div className="flex items-center gap-0.5">
                          {diff > 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          ) : diff < 0 ? (
                            <TrendingDown className="w-3 h-3 text-red-400" />
                          ) : (
                            <Minus className="w-3 h-3 text-slate-500" />
                          )}
                          <span
                            className={cn(
                              'text-[10px] font-medium',
                              diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-400' : 'text-slate-500'
                            )}
                          >
                            {diff > 0 ? '+' : ''}{diff}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {team.coach && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Trophy className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[120px]">{team.coach}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      <span>{rosterCount}{rosterMax ? `/${rosterMax}` : ''}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
