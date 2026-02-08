import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Menu, CheckCircle, Play, Pause, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPageUrl } from "@/utils";
import StatButton from "../components/basketball/StatButton";
import FreeThrowTracker from "../components/basketball/FreeThrowTracker";
import GameClockManager from "../components/basketball/GameClockManager";

export default function PlayerProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const playerId = urlParams.get('playerId');
  const gameId = urlParams.get('gameId');
  const [showPlayerSwitcher, setShowPlayerSwitcher] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isRunning, setIsRunning] = useState(() => {
    const saved = localStorage.getItem('clockRunning');
    return saved ? JSON.parse(saved) : false;
  });

  const [pendingStats, setPendingStats] = useState({
    twoPointers: { made: 0, missed: 0 },
    threePointers: { made: 0, missed: 0 },
    freeThrows: [],
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    reboundsOff: 0,
    reboundsDef: 0,
    fouls: []
  });

  useEffect(() => {
    localStorage.setItem('clockRunning', JSON.stringify(isRunning));
  }, [isRunning]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: player } = useQuery({
    queryKey: ['player', playerId],
    queryFn: async () => {
      const players = await base44.entities.Player.filter({ id: playerId });
      return players[0];
    },
    enabled: !!playerId,
    refetchOnWindowFocus: false,
  });

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const games = await base44.entities.Game.filter({ id: gameId });
      return games[0];
    },
    enabled: !!gameId,
    refetchOnWindowFocus: false,
  });

  const { data: allPlayers } = useQuery({
    queryKey: ['allPlayers', gameId],
    queryFn: () => base44.entities.Player.filter({ game_id: gameId }),
    enabled: !!gameId,
    initialData: [],
    refetchOnWindowFocus: false,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', playerId],
    queryFn: async () => {
      const profiles = await base44.entities.PlayerProfile.filter({ player_id: playerId });
      return profiles[0] || null;
    },
    enabled: !!playerId,
    refetchOnWindowFocus: false,
  });

  const { data: playerEvents } = useQuery({
    queryKey: ['playerEvents', playerId],
    queryFn: () => base44.entities.GameEvent.filter({ player_id: playerId }, '-created_date', 50),
    enabled: !!playerId,
    initialData: [],
    refetchOnWindowFocus: false,
  });

  const createEventsMutation = useMutation({
    mutationFn: async (events) => {
      await base44.entities.GameEvent.bulkCreate(events);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      queryClient.invalidateQueries(['playerEvents']);
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: async ({ playerId, updates }) => {
      await base44.entities.Player.update(playerId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['player']);
      queryClient.invalidateQueries(['players']);
      queryClient.invalidateQueries(['allPlayers']);
    },
  });

  const updateGameMutation = useMutation({
    mutationFn: async ({ gameId, updates }) => {
      await base44.entities.Game.update(gameId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['games']);
      queryClient.invalidateQueries(['game']);
    },
  });

  const handleStatChange = (category, type, value) => {
    setPendingStats(prev => {
      const updated = { ...prev };
      if (category === 'twoPointers' || category === 'threePointers') {
        updated[category] = { ...prev[category], [type]: prev[category][type] + value };
      } else if (category === 'freeThrows') {
        updated.freeThrows = [...prev.freeThrows, type];
      } else if (category === 'fouls') {
        updated.fouls = [...prev.fouls, type];
      } else {
        updated[category] = prev[category] + value;
      }
      return updated;
    });
  };

  const resetShotClock = () => {
    updateGameMutation.mutate({
      gameId,
      updates: { shot_clock_seconds: 24 }
    });
  };

  const handleConfirm = async () => {
    if (!player || !game) return;

    const events = [];
    let pointsAdded = 0;
    let shouldResetShotClock = false;

    // 2-pointers
    for (let i = 0; i < pendingStats.twoPointers.made; i++) {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: "2pt_make",
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        points: 2,
        team: player.team,
        description: `${player.name} made 2PT`
      });
      pointsAdded += 2;
      shouldResetShotClock = true;
    }
    for (let i = 0; i < pendingStats.twoPointers.missed; i++) {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: "2pt_miss",
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        points: 0,
        team: player.team,
        description: `${player.name} missed 2PT`
      });
    }

    // 3-pointers
    for (let i = 0; i < pendingStats.threePointers.made; i++) {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: "3pt_make",
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        points: 3,
        team: player.team,
        description: `${player.name} made 3PT`
      });
      pointsAdded += 3;
      shouldResetShotClock = true;
    }
    for (let i = 0; i < pendingStats.threePointers.missed; i++) {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: "3pt_miss",
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        points: 0,
        team: player.team,
        description: `${player.name} missed 3PT`
      });
    }

    // Free throws
    pendingStats.freeThrows.forEach(result => {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: result === 'made' ? "ft_make" : "ft_miss",
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        points: result === 'made' ? 1 : 0,
        team: player.team,
        description: `${player.name} ${result === 'made' ? 'made' : 'missed'} FT`
      });
      if (result === 'made') pointsAdded += 1;
    });

    // Other stats
    for (let i = 0; i < pendingStats.assists; i++) {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: "assist",
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        team: player.team,
        description: `${player.name} assist`
      });
    }

    for (let i = 0; i < pendingStats.steals; i++) {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: "steal",
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        team: player.team,
        description: `${player.name} steal`
      });
    }

    for (let i = 0; i < pendingStats.blocks; i++) {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: "block",
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        team: player.team,
        description: `${player.name} block`
      });
    }

    for (let i = 0; i < pendingStats.turnovers; i++) {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: "turnover",
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        team: player.team,
        description: `${player.name} turnover`
      });
    }

    for (let i = 0; i < pendingStats.reboundsOff; i++) {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: "rebound_off",
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        team: player.team,
        description: `${player.name} offensive rebound`
      });
    }

    for (let i = 0; i < pendingStats.reboundsDef; i++) {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: "rebound_def",
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        team: player.team,
        description: `${player.name} defensive rebound`
      });
    }

    pendingStats.fouls.forEach(foulType => {
      events.push({
        game_id: gameId,
        player_id: playerId,
        event_type: `foul_${foulType}`,
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        team: player.team,
        description: `${player.name} ${foulType} foul`
      });
    });

    // Update player stats
    const ftMade = pendingStats.freeThrows.filter(ft => ft === 'made').length;
    const ftAttempted = pendingStats.freeThrows.length;
    
    const scoreField = player.team === 'home' ? 'home_score' : 'away_score';

    // Prepare game updates
    const gameUpdates = {
      [scoreField]: game[scoreField] + pointsAdded
    };
    
    // Reset shot clock if 2pt or 3pt was made
    if (shouldResetShotClock) {
      gameUpdates.shot_clock_seconds = 24;
    }

    // Execute all updates in parallel for speed
    await Promise.all([
      events.length > 0 ? createEventsMutation.mutateAsync(events) : Promise.resolve(),
      updatePlayerMutation.mutateAsync({
        playerId,
        updates: {
          fgm: player.fgm + pendingStats.twoPointers.made + pendingStats.threePointers.made,
          fga: player.fga + pendingStats.twoPointers.made + pendingStats.twoPointers.missed + pendingStats.threePointers.made + pendingStats.threePointers.missed,
          three_pm: player.three_pm + pendingStats.threePointers.made,
          three_pa: player.three_pa + pendingStats.threePointers.made + pendingStats.threePointers.missed,
          ftm: player.ftm + ftMade,
          fta: player.fta + ftAttempted,
          points: player.points + pointsAdded,
          assists: player.assists + pendingStats.assists,
          rebounds_off: player.rebounds_off + pendingStats.reboundsOff,
          rebounds_def: player.rebounds_def + pendingStats.reboundsDef,
          steals: player.steals + pendingStats.steals,
          blocks: player.blocks + pendingStats.blocks,
          turnovers: player.turnovers + pendingStats.turnovers,
          personal_fouls: player.personal_fouls + pendingStats.fouls.length
        }
      }),
      updateGameMutation.mutateAsync({
        gameId,
        updates: gameUpdates
      })
    ]);

    // Force immediate refetch of all queries before navigating
    await Promise.all([
      queryClient.refetchQueries(['games']),
      queryClient.refetchQueries(['game']),
      queryClient.refetchQueries(['players']),
      queryClient.refetchQueries(['player']),
      queryClient.refetchQueries(['events']),
      queryClient.refetchQueries(['playerEvents'])
    ]);

    // Navigate back to CourtView
    navigate(createPageUrl("CourtView"));
  };

  const getEventIcon = (eventType) => {
    const icons = {
      '2pt_make': '🏀',
      '2pt_miss': '🚫',
      '3pt_make': '🎯',
      '3pt_miss': '🚫',
      'ft_make': '✔️',
      'ft_miss': '✖️',
      'assist': '🤝',
      'rebound_off': '⬆️',
      'rebound_def': '⬇️',
      'steal': '👋',
      'block': '✋',
      'turnover': ' turnovers',
      'foul_personal': '⚠️',
      'foul_offensive': '🫸',
      'foul_technical': '⚡',
      'foul_unsportsmanlike': '😠',
      'substitution': '🔄'
    };
    return icons[eventType] || '📋';
  };

  const formatEventTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!player || !game) {
    return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">Loading...</div>;
  }

  const teamColor = player.team === 'home' ? game.home_team_color : game.away_team_color;
  const teamName = player.team === 'home' ? game.home_team_name : game.away_team_name;

  const careerAvgs = profile && profile.career_games > 0 ? {
    ppg: (profile.career_points / profile.career_games).toFixed(1),
    rpg: (profile.career_rebounds / profile.career_games).toFixed(1),
    apg: (profile.career_assists / profile.career_games).toFixed(1),
    fgPct: profile.career_fga > 0 ? ((profile.career_fgm / profile.career_fga) * 100).toFixed(1) : '0.0',
    threePct: profile.career_three_pa > 0 ? ((profile.career_three_pm / profile.career_three_pa) * 100).toFixed(1) : '0.0',
  } : null;

  const hasPendingStats = 
    pendingStats.twoPointers.made > 0 || 
    pendingStats.twoPointers.missed > 0 ||
    pendingStats.threePointers.made > 0 || 
    pendingStats.threePointers.missed > 0 ||
    pendingStats.freeThrows.length > 0 ||
    pendingStats.assists > 0 ||
    pendingStats.steals > 0 ||
    pendingStats.blocks > 0 ||
    pendingStats.turnovers > 0 ||
    pendingStats.reboundsOff > 0 ||
    pendingStats.reboundsDef > 0 ||
    pendingStats.fouls.length > 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const homePlayers = allPlayers.filter(p => p.team === 'home');
  const awayPlayers = allPlayers.filter(p => p.team === 'away');
  const homeStarters = homePlayers.filter(p => p.on_court);
  const homeBench = homePlayers.filter(p => !p.on_court);
  const awayStarters = awayPlayers.filter(p => p.on_court);
  const awayBench = awayPlayers.filter(p => !p.on_court);

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24">
      <GameClockManager game={game} isRunning={isRunning} />
      
      {/* Top Bar with Controls */}
      <div 
        className="sticky top-0 z-30 p-3 md:p-4"
        style={{
          background: '#0f0f0f',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
          {/* Left: Back Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:bg-white/30 min-h-[44px] min-w-[44px] flex-shrink-0"
            onClick={() => navigate(createPageUrl("CourtView"))}
            style={{
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
              background: '#0f0f0f'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* Center: Clock Controls */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            {/* Game Clock */}
            <div 
              className="px-3 py-2 rounded-xl text-center"
              style={{
                background: '#0f0f0f',
                boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)',
                minWidth: '80px'
              }}
            >
              <div className="text-xs text-white/40">Game</div>
              <div className="text-lg font-bold text-white/70">{formatTime(game.game_clock_seconds)}</div>
            </div>

            {/* Play/Pause */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center"
              style={{
                background: isRunning ? teamColor : '#0f0f0f',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                color: isRunning ? 'white' : '#666'
              }}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Shot Clock */}
            <div 
              className="px-3 py-2 rounded-xl text-center cursor-pointer"
              onClick={resetShotClock}
              style={{
                background: '#0f0f0f',
                boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)',
                minWidth: '60px'
              }}
            >
              <div className="text-xs text-white/40">24s</div>
              <div className="text-lg font-bold text-white/70">{game.shot_clock_seconds}</div>
            </div>

            <button
              onClick={resetShotClock}
              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center"
              style={{
                background: '#0f0f0f',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                color: '#666'
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Switch Player Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:bg-white/30 min-h-[44px] min-w-[44px] flex-shrink-0"
            onClick={() => setShowPlayerSwitcher(true)}
            style={{
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
              background: '#0f0f0f'
            }}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Hero Section with Confirm Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-4 md:p-6 mx-4 mt-4 rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${teamColor}20, ${teamColor}40)`,
          boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)'
        }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{
              background: teamColor,
              boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            {profile?.photo_url ? (
              <img src={profile.photo_url} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-2xl md:text-4xl font-bold text-white">{player.jersey_number}</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs text-white/60">{player.position} • #{player.jersey_number}</div>
            <h1 className="text-xl md:text-2xl font-bold text-white/90 truncate">{player.name}</h1>
            <div className="text-xs text-white/60">{teamName}</div>
          </div>

          {hasPendingStats && (
            <Button
              onClick={handleConfirm}
              className="min-h-[44px] px-4 md:px-6 font-semibold flex-shrink-0 text-sm md:text-base"
              style={{
                background: teamColor,
                color: 'white',
                boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
                border: 'none'
              }}
            >
              <CheckCircle className="w-4 h-4 mr-1 md:mr-2" />
              Confirm
            </Button>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
        <Tabs defaultValue="log" className="w-full">
          <TabsList 
            // Changed grid-cols-3 to grid-cols-4 to accommodate the new "Player Log" tab while keeping "Career"
            className="grid w-full grid-cols-4 mb-4"
            style={{
              background: '#0f0f0f',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
              padding: '4px',
              borderRadius: '12px'
            }}
          >
            <TabsTrigger value="log" className="text-sm md:text-base">Log Stats</TabsTrigger>
            <TabsTrigger value="current" className="text-sm md:text-base">Current</TabsTrigger>
            {/* New Player Log Tab */}
            <TabsTrigger value="playerlog" className="text-sm md:text-base">Player Log</TabsTrigger>
            {/* Kept Career Tab */}
            <TabsTrigger value="career" className="text-sm md:text-base">Career</TabsTrigger>
          </TabsList>

          <TabsContent value="log">
            {/* Stat Logging Interface */}
            <div className="space-y-6">
              {/* Scoring */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Scoring</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
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
                <div className="grid grid-cols-2 gap-3">
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

              {/* Free Throws */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Free Throws</h3>
                <FreeThrowTracker 
                  freeThrows={pendingStats.freeThrows}
                  onChange={(fts) => setPendingStats(prev => ({ ...prev, freeThrows: fts }))}
                  color={teamColor}
                />
              </div>

              {/* Other Stats */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Other Stats</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <StatButton 
                    label="Assist"
                    value={pendingStats.assists}
                    onIncrement={() => handleStatChange('assists', null, 1)}
                    icon="👏"
                  />
                  <StatButton 
                    label="Steal"
                    value={pendingStats.steals}
                    onIncrement={() => handleStatChange('steals', null, 1)}
                    icon="🤚"
                  />
                  <StatButton 
                    label="Block"
                    value={pendingStats.blocks}
                    onIncrement={() => handleStatChange('blocks', null, 1)}
                    icon="🚫"
                  />
                  <StatButton 
                    label="Turnover"
                    value={pendingStats.turnovers}
                    onIncrement={() => handleStatChange('turnovers', null, 1)}
                    icon="❌"
                  />
                  <StatButton 
                    label="Off Reb"
                    value={pendingStats.reboundsOff}
                    onIncrement={() => handleStatChange('reboundsOff', null, 1)}
                    icon="⬆️"
                  />
                  <StatButton 
                    label="Def Reb"
                    value={pendingStats.reboundsDef}
                    onIncrement={() => handleStatChange('reboundsDef', null, 1)}
                    icon="⬇️"
                  />
                </div>

                {/* Fouls */}
                <div className="grid grid-cols-2 gap-2">
                  <StatButton 
                    label="Personal"
                    value={pendingStats.fouls.filter(f => f === 'personal').length}
                    onIncrement={() => handleStatChange('fouls', 'personal', null)}
                    icon="⚠️"
                  />
                  <StatButton 
                    label="Offensive"
                    value={pendingStats.fouls.filter(f => f === 'offensive').length}
                    onIncrement={() => handleStatChange('fouls', 'offensive', null)}
                    icon="🛑"
                  />
                  <StatButton 
                    label="Technical"
                    value={pendingStats.fouls.filter(f => f === 'technical').length}
                    onIncrement={() => handleStatChange('fouls', 'technical', null)}
                    icon="⚡"
                  />
                  <StatButton 
                    label="Unsportsmanlike"
                    value={pendingStats.fouls.filter(f => f === 'unsportsmanlike').length}
                    onIncrement={() => handleStatChange('fouls', 'unsportsmanlike', null)}
                    icon="🔴"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="current">
            {/* Current Game Stats */}
            <div className="space-y-4">
              <div 
                className="grid grid-cols-3 md:grid-cols-5 gap-3 p-4 md:p-6 rounded-2xl"
                style={{
                  background: '#0f0f0f',
                  boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                }}
              >
                {[
                  { label: 'PTS', value: player.points },
                  { label: 'REB', value: player.rebounds_off + player.rebounds_def },
                  { label: 'AST', value: player.assists },
                  { label: 'STL', value: player.steals },
                  { label: 'BLK', value: player.blocks }
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white/70">{stat.value}</div>
                    <div className="text-xs md:text-sm text-white/40">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div 
                className="grid grid-cols-3 gap-3 p-4 md:p-6 rounded-2xl"
                style={{
                  background: '#0f0f0f',
                  boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                }}
              >
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold text-white/70">{player.fgm}-{player.fga}</div>
                  <div className="text-xs md:text-sm text-white/40">FG</div>
                  <div className="text-xs text-white/30">
                    {player.fga > 0 ? ((player.fgm / player.fga) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold text-white/70">{player.three_pm}-{player.three_pa}</div>
                  <div className="text-xs md:text-sm text-white/40">3PT</div>
                  <div className="text-xs text-white/30">
                    {player.three_pa > 0 ? ((player.three_pm / player.three_pa) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold text-white/70">{player.ftm}-{player.fta}</div>
                  <div className="text-xs md:text-sm text-white/40">FT</div>
                  <div className="text-xs text-white/30">
                    {player.fta > 0 ? ((player.ftm / player.fta) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* New TabsContent for Player Log */}
          <TabsContent value="playerlog">
            <div className="space-y-2">
              {playerEvents.length === 0 ? (
                <div 
                  className="p-8 rounded-2xl text-center"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                  }}
                >
                  <p className="text-white/40">No events logged yet for this player</p>
                </div>
              ) : (
                playerEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-2xl flex items-center gap-4"
                    style={{
                      background: '#0f0f0f',
                      boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                    }}
                  >
                    <div className="text-3xl">{getEventIcon(event.event_type)}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white/70">{event.description}</div>
                      <div className="text-xs text-white/40">
                        Q{event.quarter} • {formatEventTime(event.game_clock_seconds)}
                        {event.points > 0 && ` • +${event.points} pts`}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="career">
            {careerAvgs ? (
              <div>
                <div 
                  className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 md:p-6 rounded-2xl mb-4"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                  }}
                >
                  {[
                    { label: 'PPG', value: careerAvgs.ppg },
                    { label: 'RPG', value: careerAvgs.rpg },
                    { label: 'APG', value: careerAvgs.apg },
                    { label: 'FG%', value: careerAvgs.fgPct + '%' },
                    { label: '3P%', value: careerAvgs.threePct + '%' }
                  ].map(stat => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-white/70">{stat.value}</div>
                      <div className="text-xs md:text-sm text-white/40">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {profile?.bio && (
                  <div 
                    className="p-4 md:p-6 rounded-2xl"
                    style={{
                      background: '#0f0f0f',
                      boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                    }}
                  >
                    <p className="text-sm md:text-base text-white/70 leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="p-6 md:p-8 rounded-2xl text-center"
                style={{
                  background: '#0f0f0f',
                  boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                }}
              >
                <p className="text-white/40">No career data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Player Switcher Modal */}
      {showPlayerSwitcher && (
        <div className="fixed inset-0 bg-black/30 flex items-end md:items-center justify-center z-50">
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full md:max-w-2xl md:max-h-[80vh] rounded-t-3xl md:rounded-3xl overflow-hidden"
            style={{
              background: '#0f0f0f',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.2)'
            }}
          >
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white/70">Switch Player</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPlayerSwitcher(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <Tabs defaultValue="home" className="w-full">
              <TabsList 
                className="grid w-full grid-cols-2 p-2"
                style={{
                  background: '#0f0f0f',
                  borderBottom: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                <TabsTrigger 
                  value="home"
                  style={{ 
                    background: game.home_team_color + '20',
                    borderRadius: '8px'
                  }}
                >
                  {game.home_team_name}
                </TabsTrigger>
                <TabsTrigger 
                  value="away"
                  style={{ 
                    background: game.away_team_color + '20',
                    borderRadius: '8px'
                  }}
                >
                  {game.away_team_name}
                </TabsTrigger>
              </TabsList>

              <div className="max-h-[60vh] overflow-auto p-4">
                <TabsContent value="home" className="space-y-4 mt-0">
                  <div>
                    <h3 className="text-xs font-semibold text-white/40 uppercase mb-2">Starting Lineup</h3>
                    <div className="space-y-2">
                      {homeStarters.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            navigate(createPageUrl("PlayerProfile") + `?playerId=${p.id}&gameId=${gameId}`);
                            setShowPlayerSwitcher(false);
                          }}
                          className={`w-full p-3 rounded-xl flex items-center gap-3 ${p.id === playerId ? 'ring-2' : ''}`}
                          style={{
                            background: p.id === playerId ? `${game.home_team_color}30` : '#0f0f0f',
                            boxShadow: '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.7)',
                            ringColor: game.home_team_color
                          }}
                        >
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                            style={{ background: game.home_team_color }}
                          >
                            {p.jersey_number}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white/70">{p.name}</div>
                            <div className="text-xs text-white/40">{p.position}</div>
                          </div>
                          <div className="text-sm text-white/60">{p.points}p</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-white/40 uppercase mb-2">Bench</h3>
                    <div className="space-y-2">
                      {homeBench.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            navigate(createPageUrl("PlayerProfile") + `?playerId=${p.id}&gameId=${gameId}`);
                            setShowPlayerSwitcher(false);
                          }}
                          className="w-full p-3 rounded-xl flex items-center gap-3"
                          style={{
                            background: '#0f0f0f',
                            boxShadow: '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.7)'
                          }}
                        >
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                            style={{ background: game.home_team_color }}
                          >
                            {p.jersey_number}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white/70">{p.name}</div>
                            <div className="text-xs text-white/40">{p.position}</div>
                          </div>
                          <div className="text-sm text-white/60">{p.points}p</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="away" className="space-y-4 mt-0">
                  <div>
                    <h3 className="text-xs font-semibold text-white/40 uppercase mb-2">Starting Lineup</h3>
                    <div className="space-y-2">
                      {awayStarters.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            navigate(createPageUrl("PlayerProfile") + `?playerId=${p.id}&gameId=${gameId}`);
                            setShowPlayerSwitcher(false);
                          }}
                          className={`w-full p-3 rounded-xl flex items-center gap-3 ${p.id === playerId ? 'ring-2' : ''}`}
                          style={{
                            background: p.id === playerId ? `${game.away_team_color}30` : '#0f0f0f',
                            boxShadow: '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.7)',
                            ringColor: game.away_team_color
                          }}
                        >
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                            style={{ background: game.away_team_color }}
                          >
                            {p.jersey_number}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white/70">{p.name}</div>
                            <div className="text-xs text-white/40">{p.position}</div>
                          </div>
                          <div className="text-sm text-white/60">{p.points}p</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-white/40 uppercase mb-2">Bench</h3>
                    <div className="space-y-2">
                      {awayBench.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            navigate(createPageUrl("PlayerProfile") + `?playerId=${p.id}&gameId=${gameId}`);
                            setShowPlayerSwitcher(false);
                          }}
                          className="w-full p-3 rounded-xl flex items-center gap-3"
                          style={{
                            background: '#0f0f0f',
                            boxShadow: '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.7)'
                          }}
                        >
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                            style={{ background: game.away_team_color }}
                          >
                            {p.jersey_number}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white/70">{p.name}</div>
                            <div className="text-xs text-white/40">{p.position}</div>
                          </div>
                          <div className="text-sm text-white/60">{p.points}p</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      )}
    </div>
  );
}