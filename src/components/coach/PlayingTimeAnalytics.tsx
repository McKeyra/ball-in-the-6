'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock } from 'lucide-react';

interface Team {
  id: string;
  name: string;
}

interface TeamMember {
  id: string;
  player_id: string;
}

interface Player {
  id: string;
  first_name: string;
  last_name: string;
}

interface PlayingTimeEntry {
  id: string;
  player_id: string;
  player: Player | undefined;
  minutesPlayed: number;
  gamesPlayed: number;
  avgMinutes: number;
}

interface PlayingTimeAnalyticsProps {
  teams: Team[];
}

export function PlayingTimeAnalytics({
  teams,
}: PlayingTimeAnalyticsProps): React.ReactElement {
  const [selectedTeam, setSelectedTeam] = useState(teams[0]?.id || '');

  const { data: members = [] } = useQuery<TeamMember[]>({
    queryKey: ['team-members-analytics', selectedTeam],
    queryFn: async () => {
      // TODO: Replace with actual API call
      const res = await fetch(
        `/api/team-members?team_id=${selectedTeam}&role=player`
      );
      return res.json();
    },
    enabled: !!selectedTeam,
  });

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ['players-analytics'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      const res = await fetch('/api/players');
      return res.json();
    },
  });

  // Mock playing time data
  const playingTimeData: PlayingTimeEntry[] = members
    .map((member) => {
      const player = players.find((p) => p.id === member.player_id);
      return {
        id: member.id,
        player_id: member.player_id,
        player,
        minutesPlayed: Math.floor(Math.random() * 200) + 50,
        gamesPlayed: Math.floor(Math.random() * 15) + 5,
        avgMinutes: Math.floor(Math.random() * 25) + 5,
      };
    })
    .sort((a, b) => b.minutesPlayed - a.minutesPlayed);

  const maxMinutes = Math.max(
    ...playingTimeData.map((d) => d.minutesPlayed),
    1
  );

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Playing Time Analytics
          </CardTitle>
        </div>
        <div className="mt-4">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select team..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {playingTimeData.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No player data available
          </p>
        ) : (
          playingTimeData.map((data, idx) => (
            <div key={data.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-white">
                      {data.player
                        ? `${data.player.first_name} ${data.player.last_name}`
                        : 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {data.gamesPlayed} games
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#D0FF00]">
                    {data.minutesPlayed} min
                  </p>
                  <p className="text-xs text-gray-400">
                    {data.avgMinutes} avg/game
                  </p>
                </div>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  style={{
                    width: `${(data.minutesPlayed / maxMinutes) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
