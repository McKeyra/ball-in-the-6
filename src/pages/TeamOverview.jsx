import { useState, useMemo } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Trophy, Medal } from 'lucide-react';
import StandingsTable from '../components/league/StandingsTable';
import TeamRecordCard from '../components/league/TeamRecordCard';

export default function TeamOverview() {
  const navigate = useNavigate();
  const [filterLeague, setFilterLeague] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
    refetchOnWindowFocus: false,
  });

  const { data: games = [] } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.list('-game_date', 500),
    refetchOnWindowFocus: false,
  });

  // Calculate team records
  const teamRecords = useMemo(() => {
    const records = {};
    
    teams.forEach(team => {
      records[team.id] = {
        team,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        streak: [],
        lastFive: []
      };
    });

    // Process finished games
    const finishedGames = games
      .filter(g => g.status === 'finished')
      .sort((a, b) => new Date(b.game_date) - new Date(a.game_date));

    finishedGames.forEach(game => {
      const homeTeamId = game.home_team_id;
      const awayTeamId = game.away_team_id;
      const homeWon = game.home_score > game.away_score;

      if (records[homeTeamId]) {
        records[homeTeamId].pointsFor += game.home_score || 0;
        records[homeTeamId].pointsAgainst += game.away_score || 0;
        if (homeWon) {
          records[homeTeamId].wins++;
          records[homeTeamId].streak.push('W');
        } else {
          records[homeTeamId].losses++;
          records[homeTeamId].streak.push('L');
        }
      }

      if (records[awayTeamId]) {
        records[awayTeamId].pointsFor += game.away_score || 0;
        records[awayTeamId].pointsAgainst += game.home_score || 0;
        if (!homeWon) {
          records[awayTeamId].wins++;
          records[awayTeamId].streak.push('W');
        } else {
          records[awayTeamId].losses++;
          records[awayTeamId].streak.push('L');
        }
      }
    });

    // Calculate last 5 games for each team
    Object.keys(records).forEach(teamId => {
      records[teamId].lastFive = records[teamId].streak.slice(0, 5);
      records[teamId].winPct = records[teamId].wins + records[teamId].losses > 0
        ? (records[teamId].wins / (records[teamId].wins + records[teamId].losses))
        : 0;
    });

    return records;
  }, [teams, games]);

  const filteredTeams = teams.filter(team => {
    if (filterLeague !== 'all' && team.league !== filterLeague) return false;
    if (filterDivision !== 'all' && team.division !== filterDivision) return false;
    return true;
  });

  const leagues = ['all', ...new Set(teams.map(t => t.league).filter(Boolean))];
  const divisions = ['all', ...new Set(teams.map(t => t.division).filter(Boolean))];

  // Sort teams by win percentage for standings
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    const recordA = teamRecords[a.id];
    const recordB = teamRecords[b.id];
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(createPageUrl("LeagueManagement"))}
                className="min-h-[44px] min-w-[44px]"
                style={{
                  background: '#0f0f0f',
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90 mb-1 md:mb-2">Team Overview</h1>
                <p className="text-sm md:text-base text-white/60">League standings and team performance</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 md:mb-6">
            <Select value={filterLeague} onValueChange={setFilterLeague}>
              <SelectTrigger
                className="w-full sm:w-40 min-h-[44px]"
                style={{
                  background: '#0f0f0f',
                  boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)'
                }}
              >
                <SelectValue placeholder="League" />
              </SelectTrigger>
              <SelectContent>
                {leagues.map(league => (
                  <SelectItem key={league} value={league} className="min-h-[44px]">
                    {league === 'all' ? 'All Leagues' : league}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterDivision} onValueChange={setFilterDivision}>
              <SelectTrigger
                className="w-full sm:w-52 min-h-[44px]"
                style={{
                  background: '#0f0f0f',
                  boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)'
                }}
              >
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map(div => (
                  <SelectItem key={div} value={div} className="min-h-[44px]">
                    {div === 'all' ? 'All Divisions' : div}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="standings" className="w-full">
            <TabsList
              className="grid w-full grid-cols-2 mb-4 md:mb-6"
              style={{
                background: '#0f0f0f',
                boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
                padding: '4px md:6px',
                borderRadius: '16px',
                height: 'auto'
              }}
            >
              <TabsTrigger value="standings" className="flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 min-h-[44px] text-sm md:text-base">
                <Medal className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">League</span> Standings
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 min-h-[44px] text-sm md:text-base">
                <Trophy className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Team</span> Cards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="standings">
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <StandingsTable
                  teams={sortedTeams}
                  teamRecords={teamRecords}
                  onTeamClick={(teamId) => navigate(createPageUrl("TeamPerformance") + `?teamId=${teamId}`)}
                />
              </div>
            </TabsContent>

            <TabsContent value="teams">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {sortedTeams.map(team => (
                  <TeamRecordCard
                    key={team.id}
                    team={team}
                    record={teamRecords[team.id]}
                    onClick={() => navigate(createPageUrl("TeamPerformance") + `?teamId=${team.id}`)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}