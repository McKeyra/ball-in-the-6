import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { useGameClock } from "@/components/basketball/GameClockContext";
import { useTimeout } from "@/components/basketball/TimeoutContext";
import SubstitutionPanel from "@/components/basketball/SubstitutionPanel";
import TimeoutPanel from "@/components/basketball/TimeoutPanel";
import {
  Play, Pause, TrendingUp, Users, Target, Trophy, Clock, RotateCcw,
  Timer, ArrowRight, UserMinus, UserPlus, AlertCircle, Zap, X,
  ChevronRight, BarChart3, Minus, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function LiveGame() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const urlGameId = urlParams.get('gameId');

  const {
    isRunning, toggleClock, pauseClocks, resumeClocks,
    gameClockSeconds, shotClockSeconds,
    resetShotClock, resetGameClock, nextPeriod,
    game: clockGame
  } = useGameClock();

  const { startTimeout } = useTimeout();

  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activePanel, setActivePanel] = useState(null); // 'sub', 'timeout', 'freethrow'
  const [showEventFeed, setShowEventFeed] = useState(false);
  const [freeThrowPlayer, setFreeThrowPlayer] = useState(null);
  const [freeThrowCount, setFreeThrowCount] = useState(2);

  // Data queries
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

  const { data: allPlayers = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => base44.entities.Player.list(),
    initialData: []
  });

  const { data: gameEvents = [], refetch: refetchEvents } = useQuery({
    queryKey: ['gameEvents', selectedGame?.id],
    queryFn: () => selectedGame
      ? base44.entities.GameEvent.filter({ game_id: selectedGame.id }, '-created_date', 100)
      : [],
    enabled: !!selectedGame,
    initialData: [],
    refetchInterval: 5000,
  });

  const { data: playerStats = [], refetch: refetchStats } = useQuery({
    queryKey: ['playerStats', selectedGame?.id],
    queryFn: () => selectedGame
      ? base44.entities.PlayerStat.filter({ game_id: selectedGame.id })
      : [],
    enabled: !!selectedGame,
    initialData: [],
  });

  // Auto-select game from URL or most recent
  useEffect(() => {
    if (urlGameId && games.length > 0) {
      const game = games.find(g => g.id === urlGameId);
      if (game) setSelectedGame(game);
    } else if (games.length > 0 && !selectedGame) {
      const liveGame = games.find(g => g.status === 'live' || g.status === 'in_progress');
      if (liveGame) setSelectedGame(liveGame);
    }
  }, [urlGameId, games]);

  // Sync selectedGame with latest data
  useEffect(() => {
    if (selectedGame && games.length > 0) {
      const updated = games.find(g => g.id === selectedGame.id);
      if (updated) setSelectedGame(updated);
    }
  }, [games]);

  // Mutations
  const createEventMutation = useMutation({
    mutationFn: (eventData) => base44.entities.GameEvent.create(eventData),
    onSuccess: () => {
      refetchEvents();
    }
  });

  const updateGameMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Game.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    }
  });

  const updatePlayerStatMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PlayerStat.update(id, data),
    onSuccess: () => {
      refetchStats();
    }
  });

  // Derived data
  const game = selectedGame;
  const homeTeam = teams.find(t => t.id === game?.home_team_id);
  const awayTeam = teams.find(t => t.id === game?.away_team_id);

  // Get players for this game - try game_id first, then team_id
  const gamePlayers = allPlayers.filter(p =>
    p.game_id === game?.id ||
    p.team_id === game?.home_team_id || p.team_id === game?.away_team_id ||
    p.teamId === game?.home_team_id || p.teamId === game?.away_team_id
  );

  const homePlayers = gamePlayers.filter(p =>
    p.team === 'home' || p.team_id === game?.home_team_id || p.teamId === game?.home_team_id
  );
  const awayPlayers = gamePlayers.filter(p =>
    p.team === 'away' || p.team_id === game?.away_team_id || p.teamId === game?.away_team_id
  );

  const homeOnCourt = homePlayers.filter(p => p.on_court !== false).slice(0, 5);
  const awayOnCourt = awayPlayers.filter(p => p.on_court !== false).slice(0, 5);

  const getPlayerStat = (playerId) => {
    return playerStats.find(s => s.player_id === playerId);
  };

  const isHomePlayer = (player) => {
    return homePlayers.some(p => p.id === player?.id);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getQuarterLabel = (q) => {
    if (!q) return 'Q1';
    if (q <= 4) return `Q${q}`;
    return `OT${q - 4}`;
  };

  // Record a stat event
  const recordEvent = async (eventType, points = 0, isMiss = false) => {
    if (!selectedPlayer || !game) {
      toast.error('Select a player first');
      return;
    }

    const isHome = isHomePlayer(selectedPlayer);
    const teamId = isHome ? game.home_team_id : game.away_team_id;

    // Create game event
    await createEventMutation.mutateAsync({
      game_id: game.id,
      player_id: selectedPlayer.id,
      team_id: teamId,
      event_type: eventType,
      period: game.quarter || 1,
      quarter: game.quarter || 1,
      game_clock_seconds: gameClockSeconds,
      points: points,
      team: isHome ? 'home' : 'away',
      description: `${selectedPlayer.name} - ${eventType.replace(/_/g, ' ')}${points > 0 ? ` (+${points})` : ''}`,
      timestamp: new Date().toISOString()
    });

    // Update PlayerStat record
    const stat = getPlayerStat(selectedPlayer.id);
    if (stat) {
      const updates = {};

      switch (eventType) {
        case '2pt_made':
          updates.points = (stat.points || 0) + 2;
          updates.fgm = (stat.fgm || 0) + 1;
          updates.fga = (stat.fga || 0) + 1;
          break;
        case '2pt_miss':
          updates.fga = (stat.fga || 0) + 1;
          break;
        case '3pt_made':
          updates.points = (stat.points || 0) + 3;
          updates.fgm = (stat.fgm || 0) + 1;
          updates.fga = (stat.fga || 0) + 1;
          updates.fgm3 = (stat.fgm3 || 0) + 1;
          updates.fga3 = (stat.fga3 || 0) + 1;
          break;
        case '3pt_miss':
          updates.fga = (stat.fga || 0) + 1;
          updates.fga3 = (stat.fga3 || 0) + 1;
          break;
        case 'free_throw_made':
          updates.points = (stat.points || 0) + 1;
          updates.ftm = (stat.ftm || 0) + 1;
          updates.fta = (stat.fta || 0) + 1;
          break;
        case 'free_throw_miss':
          updates.fta = (stat.fta || 0) + 1;
          break;
        case 'assist':
          updates.ast = (stat.ast || 0) + 1;
          break;
        case 'offensive_rebound':
          updates.oreb = (stat.oreb || 0) + 1;
          break;
        case 'defensive_rebound':
          updates.dreb = (stat.dreb || 0) + 1;
          break;
        case 'rebound':
          updates.dreb = (stat.dreb || 0) + 1;
          break;
        case 'steal':
          updates.stl = (stat.stl || 0) + 1;
          break;
        case 'block':
          updates.blk = (stat.blk || 0) + 1;
          break;
        case 'turnover':
          updates.tov = (stat.tov || 0) + 1;
          break;
        case 'foul':
          updates.pf = (stat.pf || 0) + 1;
          break;
      }

      if (Object.keys(updates).length > 0) {
        await updatePlayerStatMutation.mutateAsync({ id: stat.id, data: updates });
      }
    }

    // Update game score
    if (points > 0) {
      const scoreField = isHome ? 'home_score' : 'away_score';
      const currentScore = game[scoreField] || 0;
      await updateGameMutation.mutateAsync({
        id: game.id,
        data: { [scoreField]: currentScore + points }
      });
    }

    // Update team fouls on personal foul
    if (eventType === 'foul') {
      const foulField = isHome ? 'home_team_fouls' : 'away_team_fouls';
      const currentFouls = game[foulField] || 0;
      const newFouls = currentFouls + 1;
      const bonusField = isHome ? 'home_bonus_active' : 'away_bonus_active';
      const bonusThreshold = game.settings?.bonus_threshold || 5;

      await updateGameMutation.mutateAsync({
        id: game.id,
        data: {
          [foulField]: newFouls,
          [bonusField]: newFouls >= bonusThreshold
        }
      });

      // Pause clock on foul
      pauseClocks();
    }

    // Reset shot clock on made basket
    if (['2pt_made', '3pt_made'].includes(eventType)) {
      resetShotClock(24);
    }

    toast.success(`${eventType.replace(/_/g, ' ')} recorded`);
    setSelectedPlayer(null);
  };

  // Free throw sequence
  const handleFreeThrow = async (made) => {
    if (!freeThrowPlayer || !game) return;

    const eventType = made ? 'free_throw_made' : 'free_throw_miss';
    const isHome = isHomePlayer(freeThrowPlayer);

    await createEventMutation.mutateAsync({
      game_id: game.id,
      player_id: freeThrowPlayer.id,
      team_id: isHome ? game.home_team_id : game.away_team_id,
      event_type: eventType,
      period: game.quarter || 1,
      quarter: game.quarter || 1,
      game_clock_seconds: gameClockSeconds,
      points: made ? 1 : 0,
      team: isHome ? 'home' : 'away',
      description: `${freeThrowPlayer.name} - FT ${made ? 'made' : 'missed'}`,
      timestamp: new Date().toISOString()
    });

    const stat = getPlayerStat(freeThrowPlayer.id);
    if (stat) {
      const updates = { fta: (stat.fta || 0) + 1 };
      if (made) {
        updates.ftm = (stat.ftm || 0) + 1;
        updates.points = (stat.points || 0) + 1;
      }
      await updatePlayerStatMutation.mutateAsync({ id: stat.id, data: updates });
    }

    if (made) {
      const scoreField = isHome ? 'home_score' : 'away_score';
      await updateGameMutation.mutateAsync({
        id: game.id,
        data: { [scoreField]: (game[scoreField] || 0) + 1 }
      });
    }

    setFreeThrowCount(prev => {
      if (prev <= 1) {
        setFreeThrowPlayer(null);
        setActivePanel(null);
        return 2;
      }
      return prev - 1;
    });
  };

  // Undo last event
  const undoLastEvent = async () => {
    if (gameEvents.length === 0) return;
    const lastEvent = gameEvents[0];

    try {
      await base44.entities.GameEvent.delete(lastEvent.id);

      // Reverse score if it was a scoring event
      if (lastEvent.points > 0) {
        const scoreField = lastEvent.team === 'home' ? 'home_score' : 'away_score';
        await updateGameMutation.mutateAsync({
          id: game.id,
          data: { [scoreField]: Math.max(0, (game[scoreField] || 0) - lastEvent.points) }
        });
      }

      refetchEvents();
      toast.success('Last event undone');
    } catch (err) {
      toast.error('Failed to undo');
    }
  };

  // End game
  const endGame = async () => {
    if (!game) return;
    pauseClocks();
    await updateGameMutation.mutateAsync({
      id: game.id,
      data: { status: 'completed' }
    });
    toast.success('Game ended!');
    navigate(createPageUrl('BoxScore') + `?gameId=${game.id}`);
  };

  // Stat buttons config
  const scoringButtons = [
    { type: '2pt_made', label: '2PT', sub: 'Made', points: 2, color: 'bg-indigo-600 hover:bg-indigo-700' },
    { type: '2pt_miss', label: '2PT', sub: 'Miss', points: 0, color: 'bg-indigo-600/40 hover:bg-indigo-600/60' },
    { type: '3pt_made', label: '3PT', sub: 'Made', points: 3, color: 'bg-purple-600 hover:bg-purple-700' },
    { type: '3pt_miss', label: '3PT', sub: 'Miss', points: 0, color: 'bg-purple-600/40 hover:bg-purple-600/60' },
  ];

  const otherButtons = [
    { type: 'assist', label: 'AST', points: 0, color: 'bg-[#c9a962] hover:bg-[#b8943f]' },
    { type: 'rebound', label: 'REB', points: 0, color: 'bg-orange-600 hover:bg-orange-700' },
    { type: 'steal', label: 'STL', points: 0, color: 'bg-pink-600 hover:bg-pink-700' },
    { type: 'block', label: 'BLK', points: 0, color: 'bg-cyan-600 hover:bg-cyan-700' },
    { type: 'turnover', label: 'TOV', points: 0, color: 'bg-red-600/70 hover:bg-red-600/90' },
    { type: 'foul', label: 'FOUL', points: 0, color: 'bg-red-600 hover:bg-red-700' },
  ];

  // Player card component
  const PlayerButton = ({ player, isHome: home }) => {
    const stat = getPlayerStat(player.id);
    const isSelected = selectedPlayer?.id === player.id;
    const teamColor = home ? (game?.home_team_color || '#3B82F6') : (game?.away_team_color || '#F97316');

    return (
      <button
        onClick={() => setSelectedPlayer(isSelected ? null : player)}
        className={`w-full p-3 rounded-xl text-left transition-all min-h-[52px] ${
          isSelected ? 'ring-2 ring-white scale-[1.02]' : 'hover:bg-white/[0.08]'
        }`}
        style={{
          background: isSelected ? `${teamColor}40` : 'rgba(255,255,255,0.05)',
          borderLeft: `3px solid ${teamColor}`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style={{ background: teamColor }}
            >
              {player.jersey_number || player.number || '#'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{player.name}</div>
              <div className="text-[10px] text-white/40">{player.position}</div>
            </div>
          </div>
          {stat && (
            <div className="text-right flex-shrink-0 ml-2">
              <div className="text-sm font-bold text-white">{stat.points || 0}</div>
              <div className="text-[10px] text-white/40">pts</div>
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-3 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#c9a962] rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#0f0f0f]" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-light tracking-tight text-white">Live Game</h1>
                <p className="text-xs md:text-sm text-white/40 font-light">Real-time stats & scoring</p>
              </div>
            </div>

            {/* Game Selector */}
            {!urlGameId && (
              <Select
                value={selectedGame?.id}
                onValueChange={(value) => setSelectedGame(games.find(g => g.id === value))}
              >
                <SelectTrigger className="bg-white/[0.08] border-white/[0.08] text-white w-48 min-h-[40px] text-sm">
                  <SelectValue placeholder="Select game..." />
                </SelectTrigger>
                <SelectContent>
                  {games.map((g) => {
                    const h = teams.find(t => t.id === g.home_team_id);
                    const a = teams.find(t => t.id === g.away_team_id);
                    return (
                      <SelectItem key={g.id} value={g.id}>
                        {g.home_team_name || h?.name || 'Home'} vs {g.away_team_name || a?.name || 'Away'}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {game ? (
          <div className="space-y-3 md:space-y-4">
            {/* Scoreboard with Clocks */}
            <div className="rounded-2xl bg-white/[0.07] border border-white/[0.055] overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 md:gap-6 items-center">
                  {/* Home Team */}
                  <div className="text-center">
                    <div className="text-white/40 text-[10px] tracking-[0.15em] uppercase mb-1 font-light">Home</div>
                    <div className="text-sm md:text-lg font-light text-white mb-1 truncate">
                      {game.home_team_name || homeTeam?.name || 'Home'}
                    </div>
                    <motion.div
                      key={game.home_score}
                      initial={{ scale: 1.15 }}
                      animate={{ scale: 1 }}
                      className="text-3xl md:text-5xl font-extralight"
                      style={{ color: game.home_team_color || '#c9a962' }}
                    >
                      {game.home_score || 0}
                    </motion.div>
                    <div className="flex items-center justify-center gap-3 mt-1 text-[10px] text-white/40">
                      <span>Fouls: {game.home_team_fouls || 0}</span>
                      <span>TO: {game.home_timeouts ?? 2}</span>
                      {game.home_bonus_active && (
                        <span className="text-yellow-400 font-bold">BONUS</span>
                      )}
                    </div>
                  </div>

                  {/* Center - Clocks & Controls */}
                  <div className="text-center space-y-2 px-2 md:px-4">
                    {/* Game Clock */}
                    <button onClick={toggleClock} className="group">
                      <div className="text-2xl md:text-4xl font-mono font-bold text-white tabular-nums">
                        {formatTime(gameClockSeconds)}
                      </div>
                    </button>

                    {/* Period */}
                    <div className="text-xs text-white/50 font-medium">
                      {getQuarterLabel(game.quarter)}
                    </div>

                    {/* Shot Clock */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => resetShotClock(24)}
                        className={`px-3 py-1 rounded-lg font-bold text-lg tabular-nums transition-all ${
                          shotClockSeconds <= 5
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-white/10 text-white/80'
                        }`}
                      >
                        {shotClockSeconds}
                      </button>
                      <button
                        onClick={() => resetShotClock(14)}
                        className="text-[10px] text-white/40 hover:text-white/60 px-1"
                      >
                        14
                      </button>
                    </div>

                    {/* Play/Pause */}
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={toggleClock}
                        className={`h-9 px-4 ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                      >
                        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="text-center">
                    <div className="text-white/40 text-[10px] tracking-[0.15em] uppercase mb-1 font-light">Away</div>
                    <div className="text-sm md:text-lg font-light text-white mb-1 truncate">
                      {game.away_team_name || awayTeam?.name || 'Away'}
                    </div>
                    <motion.div
                      key={game.away_score}
                      initial={{ scale: 1.15 }}
                      animate={{ scale: 1 }}
                      className="text-3xl md:text-5xl font-extralight"
                      style={{ color: game.away_team_color || '#6366f1' }}
                    >
                      {game.away_score || 0}
                    </motion.div>
                    <div className="flex items-center justify-center gap-3 mt-1 text-[10px] text-white/40">
                      <span>Fouls: {game.away_team_fouls || 0}</span>
                      <span>TO: {game.away_timeouts ?? 2}</span>
                      {game.away_bonus_active && (
                        <span className="text-yellow-400 font-bold">BONUS</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Control Bar */}
              <div className="border-t border-white/[0.06] px-3 py-2 flex items-center justify-center gap-2 flex-wrap">
                <Button
                  variant="ghost" size="sm"
                  onClick={() => { pauseClocks(); setActivePanel('timeout'); }}
                  className="text-white/50 hover:text-white h-8 text-xs gap-1"
                >
                  <Clock className="w-3.5 h-3.5" /> Timeout
                </Button>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => { pauseClocks(); setActivePanel('sub'); }}
                  className="text-white/50 hover:text-white h-8 text-xs gap-1"
                >
                  <Users className="w-3.5 h-3.5" /> Sub
                </Button>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => {
                    if (!selectedPlayer) { toast.error('Select a player first'); return; }
                    pauseClocks();
                    setFreeThrowPlayer(selectedPlayer);
                    setFreeThrowCount(2);
                    setActivePanel('freethrow');
                  }}
                  className="text-white/50 hover:text-white h-8 text-xs gap-1"
                >
                  <Target className="w-3.5 h-3.5" /> FT
                </Button>
                <Button
                  variant="ghost" size="sm"
                  onClick={nextPeriod}
                  className="text-white/50 hover:text-white h-8 text-xs gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> Next Q
                </Button>
                <Button
                  variant="ghost" size="sm"
                  onClick={undoLastEvent}
                  disabled={gameEvents.length === 0}
                  className="text-white/50 hover:text-white h-8 text-xs gap-1 disabled:opacity-30"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Undo
                </Button>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => setShowEventFeed(!showEventFeed)}
                  className="text-white/50 hover:text-white h-8 text-xs gap-1"
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Feed
                </Button>
                <Button
                  variant="ghost" size="sm"
                  onClick={endGame}
                  className="text-red-400/70 hover:text-red-400 h-8 text-xs gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> End
                </Button>
              </div>
            </div>

            {/* Main Content: Players + Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
              {/* Player Selection */}
              <div className="lg:col-span-1 space-y-3">
                {/* Home Players */}
                <div className="rounded-2xl bg-white/[0.04] border border-white/[0.055] p-3">
                  <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: game.home_team_color || '#c9a962' }} />
                    {game.home_team_name || 'Home'} ({homePlayers.length})
                  </h3>
                  <div className="space-y-1 max-h-[250px] overflow-y-auto">
                    {homePlayers.map(player => (
                      <PlayerButton key={player.id} player={player} isHome={true} />
                    ))}
                    {homePlayers.length === 0 && (
                      <p className="text-white/30 text-xs py-2">No players found</p>
                    )}
                  </div>
                </div>

                {/* Away Players */}
                <div className="rounded-2xl bg-white/[0.04] border border-white/[0.055] p-3">
                  <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: game.away_team_color || '#6366f1' }} />
                    {game.away_team_name || 'Away'} ({awayPlayers.length})
                  </h3>
                  <div className="space-y-1 max-h-[250px] overflow-y-auto">
                    {awayPlayers.map(player => (
                      <PlayerButton key={player.id} player={player} isHome={false} />
                    ))}
                    {awayPlayers.length === 0 && (
                      <p className="text-white/30 text-xs py-2">No players found</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons + Feed */}
              <div className="lg:col-span-2 space-y-3">
                {/* Selected Player Indicator */}
                {selectedPlayer && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-white/[0.08] border border-white/[0.08] p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: isHomePlayer(selectedPlayer) ? game.home_team_color : game.away_team_color }}
                      >
                        {selectedPlayer.jersey_number || selectedPlayer.number || '#'}
                      </div>
                      <div>
                        <div className="text-white font-medium">{selectedPlayer.name}</div>
                        <div className="text-xs text-white/40">
                          {isHomePlayer(selectedPlayer) ? game.home_team_name : game.away_team_name} - {selectedPlayer.position}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPlayer(null)} className="text-white/40 h-8">
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}

                {/* Scoring Buttons */}
                <div className="rounded-2xl bg-white/[0.04] border border-white/[0.055] p-3 md:p-4">
                  <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Scoring</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {scoringButtons.map((btn) => (
                      <Button
                        key={btn.type}
                        onClick={() => recordEvent(btn.type, btn.points)}
                        disabled={!selectedPlayer}
                        className={`h-14 md:h-16 ${btn.color} disabled:opacity-20 flex flex-col gap-0`}
                      >
                        <span className="font-bold text-sm">{btn.label}</span>
                        <span className="text-[10px] opacity-80">{btn.sub}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Other Stats Buttons */}
                <div className="rounded-2xl bg-white/[0.04] border border-white/[0.055] p-3 md:p-4">
                  <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Stats</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {otherButtons.map((btn) => (
                      <Button
                        key={btn.type}
                        onClick={() => recordEvent(btn.type, btn.points)}
                        disabled={!selectedPlayer}
                        className={`h-12 ${btn.color} disabled:opacity-20`}
                      >
                        <span className="font-bold text-xs">{btn.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Event Feed */}
                {showEventFeed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="rounded-2xl bg-white/[0.04] border border-white/[0.055] p-3 md:p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5" /> Play-by-Play
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowEventFeed(false)} className="h-6 w-6 p-0 text-white/30">
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                      <AnimatePresence>
                        {gameEvents.slice(0, 20).map((event) => {
                          const player = gamePlayers.find(p => p.id === event.player_id);
                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-2 bg-white/[0.03] rounded-lg"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0"
                                  style={{
                                    background: event.team === 'home' ? game.home_team_color : game.away_team_color
                                  }}
                                >
                                  {player?.jersey_number || '?'}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-white/80 text-xs truncate">{player?.name || 'Unknown'}</p>
                                  <p className="text-white/30 text-[10px]">
                                    {event.event_type?.replace(/_/g, ' ')} - {getQuarterLabel(event.quarter)}
                                  </p>
                                </div>
                              </div>
                              {event.points > 0 && (
                                <span className="text-[#c9a962] font-bold text-sm ml-2">+{event.points}</span>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      {gameEvents.length === 0 && (
                        <div className="text-center py-6 text-white/20 text-xs">
                          No events yet
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Quick Stats Summary */}
                <div className="rounded-2xl bg-white/[0.04] border border-white/[0.055] p-3 md:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5" /> Game Stats
                    </h3>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => navigate(createPageUrl('BoxScore') + `?gameId=${game.id}`)}
                      className="text-white/40 hover:text-white h-6 text-[10px] gap-1"
                    >
                      Full Box Score <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-white/30 border-b border-white/[0.06]">
                          <th className="text-left py-1.5 font-normal">Player</th>
                          <th className="text-center py-1.5 font-normal">PTS</th>
                          <th className="text-center py-1.5 font-normal">REB</th>
                          <th className="text-center py-1.5 font-normal">AST</th>
                          <th className="text-center py-1.5 font-normal hidden md:table-cell">STL</th>
                          <th className="text-center py-1.5 font-normal hidden md:table-cell">BLK</th>
                          <th className="text-center py-1.5 font-normal">FG</th>
                          <th className="text-center py-1.5 font-normal hidden md:table-cell">PF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerStats.filter(s => (s.points || 0) + (s.ast || 0) + (s.oreb || 0) + (s.dreb || 0) + (s.stl || 0) + (s.blk || 0) > 0).map(stat => {
                          const player = gamePlayers.find(p => p.id === stat.player_id);
                          if (!player) return null;
                          return (
                            <tr key={stat.id} className="border-b border-white/[0.03]">
                              <td className="py-1.5 text-white/70 font-medium">
                                <span className="font-bold mr-1" style={{ color: isHomePlayer(player) ? game.home_team_color : game.away_team_color }}>
                                  #{player.jersey_number || player.number}
                                </span>
                                {player.name}
                              </td>
                              <td className="text-center text-white font-bold">{stat.points || 0}</td>
                              <td className="text-center text-white/60">{(stat.oreb || 0) + (stat.dreb || 0)}</td>
                              <td className="text-center text-white/60">{stat.ast || 0}</td>
                              <td className="text-center text-white/60 hidden md:table-cell">{stat.stl || 0}</td>
                              <td className="text-center text-white/60 hidden md:table-cell">{stat.blk || 0}</td>
                              <td className="text-center text-white/60">{stat.fgm || 0}/{stat.fga || 0}</td>
                              <td className="text-center text-white/60 hidden md:table-cell">{stat.pf || 0}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {playerStats.every(s => (s.points || 0) + (s.ast || 0) + (s.oreb || 0) + (s.dreb || 0) + (s.stl || 0) + (s.blk || 0) === 0) && (
                      <div className="text-center py-4 text-white/20 text-xs">No stats recorded yet</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/[0.07] border border-white/[0.055]">
            <div className="py-12 md:py-20 text-center px-4">
              <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/20" />
              <h3 className="text-lg md:text-xl font-light text-white mb-2">No Game Selected</h3>
              <p className="text-sm md:text-base text-white/40 font-light mb-6">
                Choose a game from the dropdown or start a new one
              </p>
              <Button
                onClick={() => navigate(createPageUrl('GameSetup'))}
                className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#b8943f]"
              >
                <Play className="w-4 h-4 mr-2" /> New Game
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Panels */}
      {activePanel === 'sub' && game && (
        <SubstitutionPanel
          game={game}
          players={gamePlayers}
          onClose={() => setActivePanel(null)}
        />
      )}

      {activePanel === 'timeout' && game && (
        <TimeoutPanel
          game={game}
          players={gamePlayers}
          onClose={() => setActivePanel(null)}
          onSubstitution={() => setActivePanel('sub')}
        />
      )}

      {/* Free Throw Panel */}
      {activePanel === 'freethrow' && freeThrowPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1a1a] rounded-3xl p-6 md:p-8 max-w-sm w-full"
          >
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3"
                style={{ background: isHomePlayer(freeThrowPlayer) ? game.home_team_color : game.away_team_color }}
              >
                {freeThrowPlayer.jersey_number || freeThrowPlayer.number || '#'}
              </div>
              <h2 className="text-xl font-bold text-white">{freeThrowPlayer.name}</h2>
              <p className="text-white/40 text-sm">Free Throw - {freeThrowCount} remaining</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button
                onClick={() => handleFreeThrow(true)}
                className="h-16 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold"
              >
                Made
              </Button>
              <Button
                onClick={() => handleFreeThrow(false)}
                className="h-16 bg-red-600 hover:bg-red-700 text-lg font-bold"
              >
                Missed
              </Button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-white/40 text-sm">Free Throws:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost" size="sm"
                  onClick={() => setFreeThrowCount(Math.max(1, freeThrowCount - 1))}
                  className="h-8 w-8 p-0 text-white/40"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-white font-bold text-lg w-6 text-center">{freeThrowCount}</span>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => setFreeThrowCount(Math.min(3, freeThrowCount + 1))}
                  className="h-8 w-8 p-0 text-white/40"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => { setActivePanel(null); setFreeThrowPlayer(null); }}
              className="w-full text-white/40 hover:text-white"
            >
              Cancel
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
