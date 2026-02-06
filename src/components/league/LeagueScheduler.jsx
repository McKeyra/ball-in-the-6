import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, Plus, Wand2, Clock, MapPin 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function LeagueScheduler({ league, teams, games }) {
  const [showAddGame, setShowAddGame] = useState(false);
  const [newGame, setNewGame] = useState({
    home_team_id: "",
    away_team_id: "",
    game_date: "",
    location: "",
    sport: league.sport
  });
  const queryClient = useQueryClient();

  const createGameMutation = useMutation({
    mutationFn: (data) => base44.entities.Game.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      toast.success('Game scheduled!');
      setShowAddGame(false);
      setNewGame({
        home_team_id: "",
        away_team_id: "",
        game_date: "",
        location: "",
        sport: league.sport
      });
    }
  });

  const createScheduleMutation = useMutation({
    mutationFn: async () => {
      // Generate round-robin schedule
      const schedule = [];
      const teamList = [...teams];
      
      if (teamList.length < 2) {
        throw new Error('Need at least 2 teams');
      }

      // Round-robin algorithm
      for (let round = 0; round < teamList.length - 1; round++) {
        for (let match = 0; match < teamList.length / 2; match++) {
          const home = teamList[match];
          const away = teamList[teamList.length - 1 - match];
          
          if (home && away) {
            schedule.push({
              home_team_id: home.id,
              away_team_id: away.id,
              league_id: league.id,
              sport: league.sport,
              status: 'scheduled',
              game_date: new Date(Date.now() + (round * 7 + match) * 24 * 60 * 60 * 1000).toISOString(),
              location: home.location || 'TBD'
            });
          }
        }
        
        // Rotate teams
        teamList.splice(1, 0, teamList.pop());
      }

      // Create all games
      for (const game of schedule) {
        await base44.entities.Game.create(game);
      }

      return schedule;
    },
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      toast.success(`${schedule.length} games scheduled!`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate schedule');
    }
  });

  const handleAddGame = async () => {
    if (!newGame.home_team_id || !newGame.away_team_id || !newGame.game_date) {
      toast.error('Please fill in required fields');
      return;
    }

    if (newGame.home_team_id === newGame.away_team_id) {
      toast.error('Home and away teams must be different');
      return;
    }

    await createGameMutation.mutateAsync({
      ...newGame,
      league_id: league.id,
      organization_id: league.organization_id
    });
  };

  // Group games by date
  const gamesByDate = games.reduce((acc, game) => {
    const date = new Date(game.game_date).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(game);
    return acc;
  }, {});

  const sortedDates = Object.keys(gamesByDate).sort((a, b) => 
    new Date(a) - new Date(b)
  );

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex gap-3">
        <Dialog open={showAddGame} onOpenChange={setShowAddGame}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Game
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Game</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Home Team *</Label>
                <Select 
                  value={newGame.home_team_id} 
                  onValueChange={(value) => setNewGame({...newGame, home_team_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Away Team *</Label>
                <Select 
                  value={newGame.away_team_id} 
                  onValueChange={(value) => setNewGame({...newGame, away_team_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date & Time *</Label>
                <Input
                  type="datetime-local"
                  value={newGame.game_date}
                  onChange={(e) => setNewGame({...newGame, game_date: e.target.value})}
                />
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  placeholder="Game location"
                  value={newGame.location}
                  onChange={(e) => setNewGame({...newGame, location: e.target.value})}
                />
              </div>

              <Button 
                onClick={handleAddGame} 
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600"
                disabled={createGameMutation.isPending}
              >
                Schedule Game
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          onClick={() => createScheduleMutation.mutate()}
          disabled={createScheduleMutation.isPending || teams.length < 2}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Auto-Generate Schedule
        </Button>
      </div>

      {/* Schedule */}
      {sortedDates.length > 0 ? (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <Card key={date}>
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  {date}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {gamesByDate[date].map((game) => {
                    const homeTeam = teams.find(t => t.id === game.home_team_id);
                    const awayTeam = teams.find(t => t.id === game.away_team_id);
                    
                    return (
                      <div 
                        key={game.id} 
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-6 flex-1">
                          {/* Home Team */}
                          <div className="flex items-center gap-3 flex-1">
                            {homeTeam?.team_logo && (
                              <img src={homeTeam.team_logo} alt="" className="w-10 h-10 rounded-full object-cover" />
                            )}
                            <div className="text-right flex-1">
                              <p className="font-semibold">{homeTeam?.name || 'TBD'}</p>
                              {game.status === 'completed' && (
                                <p className="text-2xl font-bold text-slate-900">{game.home_score}</p>
                              )}
                            </div>
                          </div>

                          {/* VS */}
                          <div className="px-4">
                            <div className="text-slate-400 font-semibold">VS</div>
                            {game.status === 'live' && (
                              <div className="flex items-center gap-1 text-red-600 text-xs">
                                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                                LIVE
                              </div>
                            )}
                          </div>

                          {/* Away Team */}
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-1">
                              <p className="font-semibold">{awayTeam?.name || 'TBD'}</p>
                              {game.status === 'completed' && (
                                <p className="text-2xl font-bold text-slate-900">{game.away_score}</p>
                              )}
                            </div>
                            {awayTeam?.team_logo && (
                              <img src={awayTeam.team_logo} alt="" className="w-10 h-10 rounded-full object-cover" />
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex flex-col items-end gap-1 ml-6 min-w-[150px]">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            {new Date(game.game_date).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                          {game.location && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="w-4 h-4" />
                              {game.location}
                            </div>
                          )}
                          <div className="mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              game.status === 'completed' ? 'bg-green-100 text-green-700' :
                              game.status === 'live' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {game.status === 'completed' ? 'Final' :
                               game.status === 'live' ? 'Live' : 'Scheduled'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-20 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Games Scheduled</h3>
            <p className="text-slate-600 mb-4">Add games manually or auto-generate a schedule</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}