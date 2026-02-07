import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ScoreBoard from "../components/basketball/ScoreBoard";
import DesktopCourtView from "../components/basketball/DesktopCourtView";
import MobileCourtView from "../components/basketball/MobileCourtView";
import EventFeed from "../components/basketball/EventFeed";
import TimeoutPanel from "../components/basketball/TimeoutPanel";
import SubstitutionPanel from "../components/basketball/SubstitutionPanel";
import GameSettings from "../components/basketball/GameSettings";
import SubstitutionConfirmDialog from "../components/basketball/SubstitutionConfirmDialog";
import QuickStatModal from "../components/basketball/QuickStatModal";
import { Settings, Users, Clock, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CourtView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [gameId, setGameId] = useState(null);
  const [showEventFeed, setShowEventFeed] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showSubstitution, setShowSubstitution] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuickStat, setShowQuickStat] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [showSubConfirm, setShowSubConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [initError, setInitError] = useState(null);
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: games, isLoading: gamesLoading, error: gamesError } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.list('-created_date', 1),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const { data: players } = useQuery({
    queryKey: ['players', gameId],
    queryFn: () => base44.entities.Player.filter({ game_id: gameId }),
    enabled: !!gameId,
    initialData: [],
    refetchOnWindowFocus: false,
  });

  const { data: events } = useQuery({
    queryKey: ['events', gameId],
    queryFn: () => base44.entities.GameEvent.filter({ game_id: gameId }, '-created_date', 50),
    enabled: !!gameId,
    initialData: [],
  });

  const createGameMutation = useMutation({
    mutationFn: async () => {
      const game = await base44.entities.Game.create({
        home_team_name: "Wildcats",
        away_team_name: "Hawks",
        home_team_color: "#444444",
        away_team_color: "#47b4b2",
        status: "in_progress"
      });

      const homeNames = ["Michael", "Trevor", "Bob", "Arnie", "James", "Marcus", "Kevin", "Tyler", "Brandon", "Jason"];
      const awayNames = ["Chris", "David", "Alex", "Ryan", "Jordan", "Lucas", "Nathan", "Derek", "Isaiah", "Cameron"];

      const homePlayers = Array.from({ length: 10 }, (_, i) => ({
        game_id: game.id,
        name: homeNames[i],
        jersey_number: i + 1,
        team: "home",
        position: ["PG", "SG", "SF", "PF", "C"][i % 5],
        on_court: i < 5
      }));

      const awayPlayers = Array.from({ length: 10 }, (_, i) => ({
        game_id: game.id,
        name: awayNames[i],
        jersey_number: i + 1,
        team: "away",
        position: ["PG", "SG", "SF", "PF", "C"][i % 5],
        on_court: i < 5
      }));

      await base44.entities.Player.bulkCreate([...homePlayers, ...awayPlayers]);
      return game;
    },
    onSuccess: async (game) => {
      setGameId(game.id);
      setIsCreatingGame(false);
      setInitError(null);
      await queryClient.invalidateQueries(['games']);
      await queryClient.invalidateQueries(['players']);
    },
    onError: (error) => {
      setIsCreatingGame(false);
      setInitError('Failed to create game: ' + error.message);
      console.error('Game creation error:', error);
    },
  });

  const substituteMutation = useMutation({
    mutationFn: async ({ playerOut, playerIn }) => {
      const latestGameData = await base44.entities.Game.get(gameId);

      await base44.entities.Player.update(playerOut.id, { on_court: false });
      await base44.entities.Player.update(playerIn.id, { on_court: true });
      
      await base44.entities.GameEvent.create({
        game_id: gameId,
        player_id: playerIn.id,
        event_type: 'substitution',
        quarter: latestGameData.quarter,
        game_clock_seconds: latestGameData.game_clock_seconds,
        team: playerIn.team,
        description: `${playerIn.name} (${playerIn.jersey_number}) in for ${playerOut.name} (${playerOut.jersey_number})`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['players']);
      queryClient.invalidateQueries(['events']);
      setDraggedPlayer(null);
      setDropTarget(null);
      setShowSubConfirm(false);
    },
  });

  useEffect(() => {
    if (games.length > 0 && !gameId) {
      setGameId(games[0].id);
    } else if (games.length === 0 && !gameId && !gamesLoading && !isCreatingGame && !initError) {
      setIsCreatingGame(true);
      createGameMutation.mutate();
    }
  }, [games, gameId, gamesLoading, isCreatingGame, initError]);

  const game = games ? games[0] : null;
  const homePlayers = players.filter(p => p.team === "home");
  const awayPlayers = players.filter(p => p.team === "away");

  const handlePlayerTap = (player) => {
    navigate(createPageUrl("PlayerProfile") + `?playerId=${player.id}&gameId=${gameId}`);
  };

  const handleUndo = async () => {
    if (events.length === 0) return;
    
    const lastEvent = events[0];
    await base44.entities.GameEvent.delete(lastEvent.id);
    
    queryClient.invalidateQueries(['events']);
    queryClient.invalidateQueries(['players']);
    queryClient.invalidateQueries(['games']);
  };

  const handleDragStart = (player) => {
    setDraggedPlayer(player);
  };

  const handleDrop = (targetPlayer) => {
    if (draggedPlayer && targetPlayer.team === draggedPlayer.team && 
        draggedPlayer.on_court && !targetPlayer.on_court && draggedPlayer.id !== targetPlayer.id) {
      setDropTarget(targetPlayer);
      setShowSubConfirm(true);
    } else {
      setDraggedPlayer(null);
    }
  };

  const confirmSubstitution = () => {
    if (draggedPlayer && dropTarget) {
      substituteMutation.mutate({
        playerOut: draggedPlayer,
        playerIn: dropTarget
      });
    }
  };

  // Error state
  if (gamesError || initError) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 md:p-6 pb-24">
        <div
          className="max-w-md w-full p-6 md:p-8 rounded-3xl text-center"
          style={{
            background: '#1a1a1a',
            boxShadow: '0 10px 26px rgba(0,0,0,.10)'
          }}
        >
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-white/90 mb-2">Error Loading Game</h2>
          <p className="text-sm md:text-base text-white/60 mb-6">{initError || gamesError?.message || 'Unable to load game data'}</p>
          <Button
            onClick={() => {
              setInitError(null);
              setIsCreatingGame(false);
              queryClient.invalidateQueries(['games']);
            }}
            className="min-h-[44px] px-6"
            style={{
              background: '#c9a962',
              color: 'white'
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (gamesLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 pb-24">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-semibold text-white/60 mb-2">Loading games...</div>
          <div className="text-sm text-white/40">Please wait</div>
        </div>
      </div>
    );
  }

  // Creating game state
  if (isCreatingGame || (!game && !gameId)) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 pb-24">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-semibold text-white/60 mb-2">Creating new game...</div>
          <div className="text-sm text-white/40">Setting up players and court</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] overflow-hidden relative pb-24">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'%3E%3Crect fill='none' stroke='%23000' stroke-width='2' x='10' y='10' width='380' height='580'/%3E%3Ccircle fill='none' stroke='%23000' stroke-width='2' cx='200' cy='300' r='60'/%3E%3Cpath fill='none' stroke='%23000' stroke-width='2' d='M 10 10 L 10 150 L 100 150 L 100 10 M 390 10 L 390 150 L 300 150 L 300 10 M 10 590 L 10 450 L 100 450 L 100 590 M 390 590 L 390 450 L 300 450 L 300 590'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="relative z-10 flex flex-col h-screen">
        <ScoreBoard 
          game={game} 
          onEventFeedToggle={() => setShowEventFeed(!showEventFeed)}
          onQuickStat={() => setShowQuickStat(true)}
        />

        <div
          className="px-4 md:px-6 py-3"
          style={{
            background: '#1a1a1a',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-4 gap-2 md:gap-3">
            <button
              onClick={() => setShowTimeout(true)}
              className="min-h-[44px] py-3 rounded-xl flex items-center justify-center gap-1 md:gap-2 font-semibold text-sm md:text-base"
              style={{
                background: '#1a1a1a',
                boxShadow: '0 10px 26px rgba(0,0,0,.10)',
                color: 'rgba(255,255,255,0.5)'
              }}
            >
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Timeout</span>
            </button>

            <button
              onClick={() => setShowSubstitution(true)}
              className="min-h-[44px] py-3 rounded-xl flex items-center justify-center gap-1 md:gap-2 font-semibold text-sm md:text-base"
              style={{
                background: '#1a1a1a',
                boxShadow: '0 10px 26px rgba(0,0,0,.10)',
                color: 'rgba(255,255,255,0.5)'
              }}
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Sub</span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="min-h-[44px] py-3 rounded-xl flex items-center justify-center gap-1 md:gap-2 font-semibold text-sm md:text-base"
              style={{
                background: '#1a1a1a',
                boxShadow: '0 10px 26px rgba(0,0,0,.10)',
                color: 'rgba(255,255,255,0.5)'
              }}
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Game</span>
            </button>

            <button
              onClick={handleUndo}
              disabled={events.length === 0}
              className="min-h-[44px] py-3 rounded-xl flex items-center justify-center gap-1 md:gap-2 font-semibold disabled:opacity-40 text-sm md:text-base"
              style={{
                background: '#1a1a1a',
                boxShadow: '0 10px 26px rgba(0,0,0,.10)',
                color: 'rgba(255,255,255,0.5)'
              }}
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Undo</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {!isMobile ? (
            <DesktopCourtView 
              game={game}
              homePlayers={homePlayers}
              awayPlayers={awayPlayers}
              onPlayerTap={handlePlayerTap}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              draggedPlayer={draggedPlayer}
            />
          ) : (
            <MobileCourtView 
              game={game}
              homePlayers={homePlayers}
              awayPlayers={awayPlayers}
              onPlayerTap={handlePlayerTap}
              onSubstitution={() => setShowSubstitution(true)}
            />
          )}
        </div>
      </div>

      {showEventFeed && (
        <EventFeed 
          events={events}
          players={players}
          onClose={() => setShowEventFeed(false)}
        />
      )}

      {showTimeout && (
        <TimeoutPanel 
          game={game}
          players={players}
          onClose={() => setShowTimeout(false)}
          onSubstitution={() => {
            setShowTimeout(false);
            setShowSubstitution(true);
          }}
        />
      )}

      {showSubstitution && (
        <SubstitutionPanel 
          game={game}
          players={players}
          onClose={() => setShowSubstitution(false)}
        />
      )}

      {showSettings && (
        <GameSettings 
          game={game}
          players={players}
          events={events}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showQuickStat && (
        <QuickStatModal
          game={game}
          players={players}
          onClose={() => setShowQuickStat(false)}
        />
      )}

      {showSubConfirm && draggedPlayer && dropTarget && (
        <SubstitutionConfirmDialog
          playerOut={draggedPlayer}
          playerIn={dropTarget}
          teamColor={draggedPlayer.team === 'home' ? game.home_team_color : game.away_team_color}
          onConfirm={confirmSubstitution}
          onCancel={() => {
            setShowSubConfirm(false);
            setDraggedPlayer(null);
            setDropTarget(null);
          }}
        />
      )}
    </div>
  );
}