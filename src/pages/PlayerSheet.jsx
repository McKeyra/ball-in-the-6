
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatButton from "../components/basketball/StatButton";
import FreeThrowTracker from "../components/basketball/FreeThrowTracker";
import AdvancedStats from "../components/basketball/AdvancedStats";
import CurrentStats from "../components/basketball/CurrentStats";
import MobileStatPanel from "../components/basketball/MobileStatPanel";
import { createPageUrl } from "@/utils";

export default function PlayerSheet() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const playerId = urlParams.get('playerId');
  const gameId = urlParams.get('gameId');

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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    refetchInterval: 2000, // Refetch for real-time updates
  });

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const games = await base44.entities.Game.filter({ id: gameId });
      return games[0];
    },
    enabled: !!gameId,
  });

  const { data: allPlayers } = useQuery({
    queryKey: ['allPlayers', gameId],
    queryFn: () => base44.entities.Player.filter({ game_id: gameId }),
    enabled: !!gameId,
    initialData: [],
  });

  const createEventsMutation = useMutation({
    mutationFn: async (events) => {
      await base44.entities.GameEvent.bulkCreate(events);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      queryClient.invalidateQueries(['players']);
      queryClient.invalidateQueries(['games']);
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: async ({ playerId, updates }) => {
      await base44.entities.Player.update(playerId, updates);
    },
    onSuccess: () => {
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

  const handleConfirm = async () => {
    if (!player || !game) return;

    const events = [];
    let pointsAdded = 0;

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

    // Create all events
    await createEventsMutation.mutateAsync(events);

    // Update player stats
    const ftMade = pendingStats.freeThrows.filter(ft => ft === 'made').length;
    const ftAttempted = pendingStats.freeThrows.length;
    
    await updatePlayerMutation.mutateAsync({
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
    });

    // Update game score
    const scoreField = player.team === 'home' ? 'home_score' : 'away_score';
    await updateGameMutation.mutateAsync({
      gameId,
      updates: {
        [scoreField]: game[scoreField] + pointsAdded
      }
    });

    navigate(-1);
  };

  const switchToPlayer = (newPlayerId) => {
    navigate(createPageUrl("PlayerSheet") + `?playerId=${newPlayerId}&gameId=${gameId}`);
  };

  if (!player || !game) {
    return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">Loading...</div>;
  }

  const teamColor = player.team === 'home' ? game.home_team_color : game.away_team_color;
  const teamName = player.team === 'home' ? game.home_team_name : game.away_team_name;
  const teamStarters = allPlayers.filter(p => p.team === player.team && p.on_court);

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-4 md:p-6"
        style={{
          background: `linear-gradient(135deg, ${teamColor}20, ${teamColor}40)`
        }}
      >
        <div className="absolute inset-0 backdrop-blur-xl" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 md:top-6 md:left-6 z-20 text-white/70 hover:bg-white/30 min-h-[44px] min-w-[44px]"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </Button>

        <div className="relative z-10 flex items-center gap-4 md:gap-6 max-w-7xl mx-auto pt-10 md:pt-0">
          <div className="flex-1 min-w-0">
            <div className="text-xs md:text-sm text-white/60 mb-1">{player.position} • {teamName}</div>
            <h1 className="text-2xl md:text-4xl font-bold text-white/90 truncate">{player.name}</h1>
          </div>

          <div
            className="w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl md:text-5xl font-bold relative flex-shrink-0"
            style={{
              background: teamColor,
              boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.5)',
              color: 'white'
            }}
          >
            {player.jersey_number}
          </div>
        </div>
      </motion.div>

      {/* Main Content with Sidebar */}
      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-8 max-w-7xl mx-auto">
        {!isMobile ? (
          <div className="flex gap-6">
            {/* LEFT & CENTER - Stats Input (Main Focus) */}
            <div className="flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN - Scoring & Free Throws */}
                <div className="space-y-8">
                  {/* Scoring Band */}
                  <div>
                    <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Scoring</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
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
                    <div className="grid grid-cols-2 gap-4">
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
                    <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Free Throws</h3>
                    <FreeThrowTracker 
                      freeThrows={pendingStats.freeThrows}
                      onChange={(fts) => setPendingStats(prev => ({ ...prev, freeThrows: fts }))}
                      color={teamColor}
                    />
                  </div>
                </div>

                {/* CENTER COLUMN - Other Stats */}
                <div className="space-y-8">
                  {/* Other Stats Band */}
                  <div>
                    <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Other Stats</h3>
                    <div className="grid grid-cols-3 gap-3 mb-4">
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
                    <div className="grid grid-cols-2 gap-3">
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
              </div>

              {/* Stats Tabs - Full Width Below */}
              <div className="mt-8">
                <Tabs defaultValue="current" className="w-full">
                  <TabsList 
                    className="grid w-full grid-cols-2 mb-6"
                    style={{
                      background: '#0f0f0f',
                      boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
                      padding: '4px',
                      borderRadius: '12px'
                    }}
                  >
                    <TabsTrigger 
                      value="current"
                      style={{
                        borderRadius: '8px',
                        border: 'none'
                      }}
                    >
                      Current Stats
                    </TabsTrigger>
                    <TabsTrigger 
                      value="advanced"
                      style={{
                        borderRadius: '8px',
                        border: 'none'
                      }}
                    >
                      Advanced Metrics
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="current">
                    <CurrentStats player={player} />
                  </TabsContent>
                  <TabsContent value="advanced">
                    <AdvancedStats player={player} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* RIGHT SIDEBAR - Navigation & Quick Access */}
            <div className="w-64 flex-shrink-0 space-y-4 hidden lg:block">
              {/* Back to Court */}
              <button
                onClick={() => navigate(createPageUrl("CourtView"))}
                className="w-full min-h-[44px] py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white/70"
                style={{
                  background: '#0f0f0f',
                  boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
                  border: 'none'
                }}
              >
                <Home className="w-5 h-5" />
                Back to Court
              </button>

              {/* Game Score */}
              <div 
                className="p-4 rounded-2xl"
                style={{
                  background: '#0f0f0f',
                  boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                }}
              >
                <div className="text-xs text-white/40 mb-2">Q{game.quarter} Score</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white/70">{game.home_score}</div>
                  <div className="text-sm text-white/40">-</div>
                  <div className="text-2xl font-bold text-white/70">{game.away_score}</div>
                </div>
              </div>

              {/* Starting Lineup Quick Switcher */}
              <div 
                className="p-4 rounded-2xl"
                style={{
                  background: '#0f0f0f',
                  boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                }}
              >
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  {teamName} Starters
                </div>
                <div className="space-y-2">
                  {teamStarters.map(p => (
                    <button
                      key={p.id}
                      onClick={() => switchToPlayer(p.id)}
                      className={`w-full min-h-[44px] p-3 rounded-xl text-left transition-all ${
                        p.id === player.id ? 'ring-2' : ''
                      }`}
                      style={{
                        background: p.id === player.id ? `${teamColor}30` : '#0f0f0f',
                        boxShadow: p.id === player.id
                          ? 'inset 2px 2px 4px rgba(0,0,0,0.1)'
                          : '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.7)',
                        border: 'none',
                        ringColor: teamColor
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                          style={{ background: teamColor }}
                        >
                          {p.jersey_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white/70 truncate">{p.name}</div>
                          <div className="text-xs text-white/40">{p.position}</div>
                        </div>
                        <div className="text-xs text-white/60">
                          <div>{p.points}p</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div 
                className="p-4 rounded-2xl"
                style={{
                  background: '#0f0f0f',
                  boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.7)'
                }}
              >
                <div className="text-xs text-white/40 text-center">
                  💡 Click any starter to switch players instantly
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Mobile: Just show current stats, panel handles input
          <div>
            <CurrentStats player={player} />
          </div>
        )}
      </div>

      {/* Mobile Stat Panel */}
      {isMobile && (
        <MobileStatPanel
          teamColor={teamColor}
          onStatChange={handleStatChange}
          pendingStats={pendingStats}
        />
      )}

      {/* Bottom Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-[#0f0f0f] safe-area-inset-bottom"
        style={{
          boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
        }}
      >
        <div className="max-w-2xl mx-auto flex gap-3 md:gap-4">
          <Button
            variant="outline"
            className="flex-1 min-h-[48px] md:h-16 text-base md:text-lg"
            onClick={() => navigate(-1)}
            style={{
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
              border: 'none',
              background: '#0f0f0f'
            }}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 min-h-[48px] md:h-16 text-base md:text-lg font-semibold"
            onClick={handleConfirm}
            style={{
              background: teamColor,
              color: 'white',
              boxShadow: '4px 4px 12px rgba(0,0,0,0.2), -2px -2px 6px rgba(255,255,255,0.3)',
              border: 'none'
            }}
          >
            <CheckCircle className="w-5 h-5 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Confirm Stats</span>
            <span className="sm:hidden">Confirm</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
