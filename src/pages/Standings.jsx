import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function Standings() {
  const navigate = useNavigate();
  const [leagueFilter, setLeagueFilter] = useState('all');
  const [divisionFilter, setDivisionFilter] = useState('all');

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  // Get unique leagues and divisions
  const leagues = [...new Set(teams.map(t => t.league).filter(Boolean))];
  const divisions = [...new Set(
    teams
      .filter(t => leagueFilter === 'all' || t.league === leagueFilter)
      .map(t => t.division)
      .filter(Boolean)
  )];

  // Filter and sort teams
  const filteredTeams = teams
    .filter(team => {
      const matchesLeague = leagueFilter === 'all' || team.league === leagueFilter;
      const matchesDivision = divisionFilter === 'all' || team.division === divisionFilter;
      return matchesLeague && matchesDivision;
    })
    .map(team => {
      const wins = team.wins || 0;
      const losses = team.losses || 0;
      const ties = team.ties || 0;
      const totalGames = wins + losses + ties;
      const winPct = totalGames > 0 ? wins / totalGames : 0;
      const points = (wins * 2) + ties; // 2 points for win, 1 for tie
      
      return {
        ...team,
        wins,
        losses,
        ties,
        totalGames,
        winPct,
        points
      };
    })
    .sort((a, b) => {
      // Sort by points, then win percentage, then wins
      if (b.points !== a.points) return b.points - a.points;
      if (b.winPct !== a.winPct) return b.winPct - a.winPct;
      return b.wins - a.wins;
    });

  // Group by division if no division filter
  const groupedTeams = divisionFilter === 'all' && leagueFilter !== 'all'
    ? filteredTeams.reduce((acc, team) => {
        const div = team.division || 'Other';
        if (!acc[div]) acc[div] = [];
        acc[div].push(team);
        return acc;
      }, {})
    : { 'All Teams': filteredTeams };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-xl text-white/60">Loading standings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white/90 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Standings
          </h1>
          <p className="text-white/60 mt-1">Team rankings by league and division</p>
        </div>

        {/* Filters */}
        <div 
          className="p-4 rounded-2xl mb-6"
          style={{
            background: '#0f0f0f',
            boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/60 mb-1 block">League</label>
              <Select value={leagueFilter} onValueChange={(val) => {
                setLeagueFilter(val);
                setDivisionFilter('all'); // Reset division when league changes
              }}>
                <SelectTrigger className="bg-white/[0.07]">
                  <SelectValue placeholder="All Leagues" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leagues</SelectItem>
                  {leagues.map(league => (
                    <SelectItem key={league} value={league}>{league}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-white/60 mb-1 block">Division</label>
              <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                <SelectTrigger className="bg-white/[0.07]">
                  <SelectValue placeholder="All Divisions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Divisions</SelectItem>
                  {divisions.map(division => (
                    <SelectItem key={division} value={division}>{division}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Standings Tables */}
        {Object.keys(groupedTeams).length === 0 || filteredTeams.length === 0 ? (
          <div 
            className="p-12 rounded-3xl text-center"
            style={{
              background: '#0f0f0f',
              boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)'
            }}
          >
            <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/70 mb-2">No Teams Found</h3>
            <p className="text-white/40">
              {leagueFilter !== 'all' || divisionFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Create teams to see standings'}
            </p>
          </div>
        ) : (
          Object.entries(groupedTeams).map(([divisionName, divTeams]) => (
            <div key={divisionName} className="mb-8">
              {divisionName !== 'All Teams' && (
                <h2 className="text-xl font-bold text-white/70 mb-4">{divisionName}</h2>
              )}
              
              <div 
                className="rounded-3xl overflow-hidden"
                style={{
                  background: '#0f0f0f',
                  boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)'
                }}
              >
                {/* Table Header */}
                <div 
                  className="grid grid-cols-12 gap-2 px-4 py-3 text-sm font-semibold text-white/60 border-b border-white/[0.06]"
                  style={{ background: 'rgba(0,0,0,0.03)' }}
                >
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-5">Team</div>
                  <div className="col-span-1 text-center">W</div>
                  <div className="col-span-1 text-center">L</div>
                  <div className="col-span-1 text-center">T</div>
                  <div className="col-span-1 text-center">PTS</div>
                  <div className="col-span-2 text-center">WIN%</div>
                </div>

                {/* Table Rows */}
                {divTeams.map((team, index) => {
                  const isFirst = index === 0;
                  const isSecond = index === 1;
                  const isThird = index === 2;
                  
                  return (
                    <button
                      key={team.id}
                      onClick={() => navigate(createPageUrl("TeamManagement") + `?teamId=${team.id}`)}
                      className="w-full grid grid-cols-12 gap-2 px-4 py-4 items-center hover:bg-black/5 transition-colors text-left border-b border-white/[0.06] last:border-b-0"
                    >
                      {/* Rank */}
                      <div className="col-span-1 text-center">
                        {isFirst ? (
                          <div className="w-8 h-8 rounded-full bg-yellow-400 text-yellow-900 font-bold flex items-center justify-center mx-auto">
                            1
                          </div>
                        ) : isSecond ? (
                          <div className="w-8 h-8 rounded-full bg-gray-300 text-white/70 font-bold flex items-center justify-center mx-auto">
                            2
                          </div>
                        ) : isThird ? (
                          <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center mx-auto">
                            3
                          </div>
                        ) : (
                          <span className="text-white/40 font-semibold">{index + 1}</span>
                        )}
                      </div>

                      {/* Team Info */}
                      <div className="col-span-5 flex items-center gap-3">
                        {team.logo_url ? (
                          <img 
                            src={team.logo_url} 
                            alt={team.team_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                            style={{ background: team.team_color || '#666' }}
                          >
                            {team.team_name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white/90">{team.team_name}</div>
                          <div className="text-xs text-white/40">
                            {team.league && <span>{team.league}</span>}
                            {team.league && team.division && <span> • </span>}
                            {team.division && <span>{team.division}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Wins */}
                      <div className="col-span-1 text-center">
                        <span className="font-semibold text-green-600">{team.wins}</span>
                      </div>

                      {/* Losses */}
                      <div className="col-span-1 text-center">
                        <span className="font-semibold text-red-600">{team.losses}</span>
                      </div>

                      {/* Ties */}
                      <div className="col-span-1 text-center">
                        <span className="font-semibold text-white/40">{team.ties}</span>
                      </div>

                      {/* Points */}
                      <div className="col-span-1 text-center">
                        <span className="font-bold text-white/90">{team.points}</span>
                      </div>

                      {/* Win Percentage */}
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {team.totalGames > 0 ? (
                            <>
                              <span className="font-semibold text-white/70">
                                {(team.winPct * 100).toFixed(1)}%
                              </span>
                              {team.winPct >= 0.6 && <TrendingUp className="w-4 h-4 text-green-500" />}
                              {team.winPct <= 0.4 && team.totalGames > 0 && <TrendingDown className="w-4 h-4 text-red-500" />}
                              {team.winPct > 0.4 && team.winPct < 0.6 && <Minus className="w-4 h-4 text-white/30" />}
                            </>
                          ) : (
                            <span className="text-white/30">-</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Legend */}
        <div 
          className="p-4 rounded-xl mt-6 text-sm text-white/60"
          style={{
            background: '#0f0f0f',
            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.7)'
          }}
        >
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold">W</span> = Wins
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">L</span> = Losses
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">T</span> = Ties
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">PTS</span> = Points (2 per win, 1 per tie)
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">WIN%</span> = Win Percentage
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}