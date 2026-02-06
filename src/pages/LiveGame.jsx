import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play, Pause, Plus, Minus, TrendingUp, Users,
  Target, Trophy, Clock, ChevronRight, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function LiveGame() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [period, setPeriod] = useState("Q1");
  const [isLive, setIsLive] = useState(false);
  const queryClient = useQueryClient();

  const { data: games = [] } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.list('-created_date'),
    initialData: []
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
    initialData: []
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => base44.entities.Player.list(),
    initialData: []
  });

  const { data: gameEvents = [] } = useQuery({
    queryKey: ['gameEvents', selectedGame?.id],
    queryFn: () => selectedGame ? base44.entities.GameEvent.filter({ game_id: selectedGame.id }) : [],
    enabled: !!selectedGame,
    initialData: []
  });

  const createEventMutation = useMutation({
    mutationFn: (eventData) => base44.entities.GameEvent.create(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameEvents'] });
      toast.success('Event recorded!');
    }
  });

  const updateGameMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Game.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    }
  });

  useEffect(() => {
    if (selectedGame) {
      setHomeScore(selectedGame.home_score || 0);
      setAwayScore(selectedGame.away_score || 0);
      setPeriod(selectedGame.period || "Q1");
      setIsLive(selectedGame.status === 'live');
    }
  }, [selectedGame]);

  const homeTeam = teams.find(t => t.id === selectedGame?.home_team_id);
  const awayTeam = teams.find(t => t.id === selectedGame?.away_team_id);
  const gamePlayers = players.filter(p => p.game_id === selectedGame?.id);
  const homePlayers = gamePlayers.filter(p => p.team_id === selectedGame?.home_team_id);
  const awayPlayers = gamePlayers.filter(p => p.team_id === selectedGame?.away_team_id);

  const recordEvent = async (eventType, points = 0) => {
    if (!selectedPlayer || !selectedGame) {
      toast.error('Please select a player first');
      return;
    }

    const isHomeTeam = homePlayers.some(p => p.user_email === selectedPlayer);

    await createEventMutation.mutateAsync({
      game_id: selectedGame.id,
      player_email: selectedPlayer,
      team_id: isHomeTeam ? selectedGame.home_team_id : selectedGame.away_team_id,
      event_type: eventType,
      period: period,
      points: points,
      timestamp: new Date().toISOString()
    });

    if (points > 0) {
      if (isHomeTeam) {
        const newScore = homeScore + points;
        setHomeScore(newScore);
        await updateGameMutation.mutateAsync({
          id: selectedGame.id,
          data: { home_score: newScore }
        });
      } else {
        const newScore = awayScore + points;
        setAwayScore(newScore);
        await updateGameMutation.mutateAsync({
          id: selectedGame.id,
          data: { away_score: newScore }
        });
      }
    }

    setSelectedPlayer(null);
  };

  const toggleGameStatus = async () => {
    if (!selectedGame) return;

    const newStatus = isLive ? 'scheduled' : 'live';
    setIsLive(!isLive);

    await updateGameMutation.mutateAsync({
      id: selectedGame.id,
      data: { status: newStatus, period: period }
    });

    toast.success(newStatus === 'live' ? 'Game started!' : 'Game paused');
  };

  const eventButtons = [
    { type: '2pt_made', label: '2 Points', points: 2, color: 'from-indigo-500 to-indigo-600' },
    { type: '3pt_made', label: '3 Points', points: 3, color: 'from-purple-500 to-purple-600' },
    { type: 'free_throw_made', label: 'Free Throw', points: 1, color: 'from-emerald-500 to-emerald-600' },
    { type: 'assist', label: 'Assist', points: 0, color: 'from-[#c9a962] to-[#b8943f]' },
    { type: 'rebound', label: 'Rebound', points: 0, color: 'from-orange-500 to-orange-600' },
    { type: 'steal', label: 'Steal', points: 0, color: 'from-pink-500 to-pink-600' },
    { type: 'block', label: 'Block', points: 0, color: 'from-cyan-500 to-cyan-600' },
    { type: 'foul', label: 'Foul', points: 0, color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#c9a962] rounded-xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-[#0f0f0f]" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tight text-white">Live Game Tracker</h1>
              <p className="text-white/40 font-light">Real-time stats & play-by-play</p>
            </div>
          </div>

          {/* Game Selector */}
          <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
            <label className="text-sm text-white/40 mb-2 block font-light">Select Game</label>
            <Select value={selectedGame?.id} onValueChange={(value) => setSelectedGame(games.find(g => g.id === value))}>
              <SelectTrigger className="bg-white/[0.08] border-white/[0.08] text-white">
                <SelectValue placeholder="Choose a game to track..." />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => {
                  const home = teams.find(t => t.id === game.home_team_id);
                  const away = teams.find(t => t.id === game.away_team_id);
                  return (
                    <SelectItem key={game.id} value={game.id}>
                      {home?.name || 'Home'} vs {away?.name || 'Away'} - {new Date(game.game_date).toLocaleDateString()}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedGame ? (
          <div className="space-y-6">
            {/* Scoreboard */}
            <div className="rounded-[28px] bg-white/[0.07] border border-white/[0.055] shadow-[0_20px_50px_rgba(0,0,0,.10)] overflow-hidden">
              <div className="p-8">
                <div className="grid grid-cols-3 gap-8 items-center">
                  {/* Home Team */}
                  <div className="text-center">
                    <div className="text-white/40 text-xs tracking-[0.2em] uppercase mb-2 font-light">Home</div>
                    <div className="text-2xl font-light text-white mb-2">{homeTeam?.name || 'Home Team'}</div>
                    <motion.div
                      key={homeScore}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-6xl font-extralight text-[#c9a962]"
                    >
                      {homeScore}
                    </motion.div>
                  </div>

                  {/* Center Controls */}
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-white/40">
                      <Clock className="w-4 h-4" />
                      <span className="text-xl font-light">{period}</span>
                    </div>
                    <Button
                      size="lg"
                      onClick={toggleGameStatus}
                      className={`w-full ${isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                      {isLive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                      {isLive ? 'Pause Game' : 'Start Game'}
                    </Button>
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger className="bg-white/[0.08] border-white/[0.08] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Q1">Quarter 1</SelectItem>
                        <SelectItem value="Q2">Quarter 2</SelectItem>
                        <SelectItem value="Q3">Quarter 3</SelectItem>
                        <SelectItem value="Q4">Quarter 4</SelectItem>
                        <SelectItem value="OT">Overtime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Away Team */}
                  <div className="text-center">
                    <div className="text-white/40 text-xs tracking-[0.2em] uppercase mb-2 font-light">Away</div>
                    <div className="text-2xl font-light text-white mb-2">{awayTeam?.name || 'Away Team'}</div>
                    <motion.div
                      key={awayScore}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-6xl font-extralight text-indigo-400"
                    >
                      {awayScore}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Player Selection & Actions */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Player Selector */}
              <div className="rounded-[28px] bg-white/[0.07] border border-white/[0.055] shadow-[0_20px_50px_rgba(0,0,0,.10)] p-8">
                <h3 className="text-white font-light text-lg flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-[#c9a962]" />
                  Select Player
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/40 mb-2 block font-light">{homeTeam?.name || 'Home Team'}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {homePlayers.map((player) => (
                        <Button
                          key={player.user_email}
                          variant={selectedPlayer === player.user_email ? "default" : "outline"}
                          className={`justify-start ${
                            selectedPlayer === player.user_email
                              ? 'bg-[#c9a962] text-[#0f0f0f] hover:bg-[#b8943f]'
                              : 'bg-white/[0.08] border-white/[0.06] text-white hover:bg-white/[0.12]'
                          }`}
                          onClick={() => setSelectedPlayer(player.user_email)}
                        >
                          <span className="mr-2 font-bold">#{player.jersey_number || '0'}</span>
                          {player.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/40 mb-2 block font-light">{awayTeam?.name || 'Away Team'}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {awayPlayers.map((player) => (
                        <Button
                          key={player.user_email}
                          variant={selectedPlayer === player.user_email ? "default" : "outline"}
                          className={`justify-start ${
                            selectedPlayer === player.user_email
                              ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                              : 'bg-white/[0.08] border-white/[0.06] text-white hover:bg-white/[0.12]'
                          }`}
                          onClick={() => setSelectedPlayer(player.user_email)}
                        >
                          <span className="mr-2 font-bold">#{player.jersey_number || '0'}</span>
                          {player.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Buttons */}
              <div className="rounded-[28px] bg-white/[0.07] border border-white/[0.055] shadow-[0_20px_50px_rgba(0,0,0,.10)] p-8">
                <h3 className="text-white font-light text-lg flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-[#c9a962]" />
                  Record Event
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {eventButtons.map((btn) => (
                    <Button
                      key={btn.type}
                      onClick={() => recordEvent(btn.type, btn.points)}
                      disabled={!selectedPlayer || !isLive}
                      className={`h-16 bg-gradient-to-r ${btn.color} hover:opacity-90 transition-opacity disabled:opacity-30`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{btn.label}</div>
                        {btn.points > 0 && <div className="text-xs opacity-90">+{btn.points}</div>}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Play by Play */}
            <div className="rounded-[28px] bg-white/[0.07] border border-white/[0.055] shadow-[0_20px_50px_rgba(0,0,0,.10)] p-8">
              <h3 className="text-white font-light text-lg flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#c9a962]" />
                Play-by-Play
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {gameEvents.slice().reverse().map((event) => {
                    const player = players.find(p => p.user_email === event.player_email);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-white/[0.05] rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#c9a962] flex items-center justify-center text-[#0f0f0f] font-bold text-sm">
                            {player?.jersey_number || '0'}
                          </div>
                          <div>
                            <p className="text-white font-light">
                              {player?.name}
                            </p>
                            <p className="text-white/40 text-sm font-light">
                              {event.event_type.replace(/_/g, ' ')} • {event.period}
                            </p>
                          </div>
                        </div>
                        {event.points > 0 && (
                          <div className="text-2xl font-light text-[#c9a962]">+{event.points}</div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {gameEvents.length === 0 && (
                  <div className="text-center py-12 text-white/30">
                    <RotateCcw className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-light">No events recorded yet</p>
                    <p className="text-sm mt-1 font-light">Select a player and start tracking!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] bg-white/[0.07] border border-white/[0.055] shadow-[0_20px_50px_rgba(0,0,0,.10)]">
            <div className="py-20 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <h3 className="text-xl font-light text-white mb-2">No Game Selected</h3>
              <p className="text-white/40 font-light">Choose a game from the dropdown above to start tracking</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
