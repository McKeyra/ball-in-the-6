import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, Clock, Users } from 'lucide-react';

export default function DetailedGameView() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const games = await base44.entities.Game.filter({ id: gameId });
      return games[0];
    },
    enabled: !!gameId,
    refetchOnWindowFocus: false,
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players', gameId],
    queryFn: () => base44.entities.Player.filter({ game_id: gameId }),
    enabled: !!gameId,
    refetchOnWindowFocus: false,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events', gameId],
    queryFn: () => base44.entities.GameEvent.filter({ game_id: gameId }, '-created_date', 100),
    enabled: !!gameId,
    refetchOnWindowFocus: false,
  });

  if (!game) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-xl text-white/60">Loading game details...</div>
      </div>
    );
  }

  const homePlayers = players.filter(p => p.team === 'home');
  const awayPlayers = players.filter(p => p.team === 'away');
  const winner = game.home_score > game.away_score ? 'home' : game.home_score < game.away_score ? 'away' : 'tie';

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl("LeagueManagement"))}
            style={{
              boxShadow: '0 10px 26px rgba(0,0,0,.10)',
              background: '#1a1a1a'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white/90">Game Details</h1>
            <p className="text-white/60">Complete game information and statistics</p>
          </div>
        </div>

        {/* Game Header Card */}
        <div 
          className="p-8 rounded-3xl mb-6"
          style={{
            background: '#1a1a1a',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {/* Teams and Score */}
          <div className="flex items-center justify-between mb-6">
            {/* Home Team */}
            <div className="flex items-center gap-4 flex-1">
              <div 
                className="w-20 h-20 rounded-full"
                style={{ background: game.home_team_color }}
              />
              <div>
                <div className={`text-2xl font-bold ${winner === 'home' ? 'text-white' : 'text-white/70'}`}>
                  {game.home_team_name}
                </div>
                {winner === 'home' && game.status === 'finished' && (
                  <div className="text-sm text-green-600 font-semibold">WINNER</div>
                )}
              </div>
            </div>

            {/* Score */}
            <div className="text-center px-8">
              <div className="flex items-center gap-4">
                <div className={`text-6xl font-bold ${winner === 'home' ? 'text-white' : 'text-white/60'}`}>
                  {game.home_score}
                </div>
                <div className="text-3xl text-white/30">-</div>
                <div className={`text-6xl font-bold ${winner === 'away' ? 'text-white' : 'text-white/60'}`}>
                  {game.away_score}
                </div>
              </div>
              {game.status === 'finished' && (
                <div className="text-sm text-white/40 mt-2">FINAL</div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="text-right">
                <div className={`text-2xl font-bold ${winner === 'away' ? 'text-white' : 'text-white/70'}`}>
                  {game.away_team_name}
                </div>
                {winner === 'away' && game.status === 'finished' && (
                  <div className="text-sm text-green-600 font-semibold">WINNER</div>
                )}
              </div>
              <div 
                className="w-20 h-20 rounded-full"
                style={{ background: game.away_team_color }}
              />
            </div>
          </div>

          {/* Game Info */}
          <div className="flex items-center justify-center gap-8 text-sm text-white/60">
            {game.game_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {game.game_date}
              </div>
            )}
            {game.game_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {game.game_time}
              </div>
            )}
            {game.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {game.location}
              </div>
            )}
          </div>
        </div>

        {/* Player Stats */}
        {players.length > 0 && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Home Team Stats */}
            <div 
              className="p-6 rounded-2xl"
              style={{
                background: '#1a1a1a',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              <h3 className="text-lg font-bold text-white/90 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                {game.home_team_name} Stats
              </h3>
              <div className="space-y-2">
                {homePlayers.length > 0 ? (
                  homePlayers.map(player => (
                    <div 
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.10)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                          style={{ background: game.home_team_color }}
                        >
                          {player.jersey_number}
                        </div>
                        <div className="text-sm font-semibold text-white/70">{player.name}</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <span>{player.points} PTS</span>
                        <span>{player.rebounds_off + player.rebounds_def} REB</span>
                        <span>{player.assists} AST</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/40 text-sm">No player stats available</div>
                )}
              </div>
            </div>

            {/* Away Team Stats */}
            <div 
              className="p-6 rounded-2xl"
              style={{
                background: '#1a1a1a',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              <h3 className="text-lg font-bold text-white/90 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                {game.away_team_name} Stats
              </h3>
              <div className="space-y-2">
                {awayPlayers.length > 0 ? (
                  awayPlayers.map(player => (
                    <div 
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.10)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                          style={{ background: game.away_team_color }}
                        >
                          {player.jersey_number}
                        </div>
                        <div className="text-sm font-semibold text-white/70">{player.name}</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <span>{player.points} PTS</span>
                        <span>{player.rebounds_off + player.rebounds_def} REB</span>
                        <span>{player.assists} AST</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/40 text-sm">No player stats available</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Event Log */}
        {events.length > 0 && (
          <div 
            className="p-6 rounded-2xl"
            style={{
              background: '#1a1a1a',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <h3 className="text-lg font-bold text-white/90 mb-4">Game Events</h3>
            <div className="space-y-2 max-h-96 overflow-auto">
              {events.map(event => (
                <div 
                  key={event.id}
                  className="p-3 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.10)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">{event.description}</span>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>Q{event.quarter}</span>
                      {event.points > 0 && (
                        <span className="font-semibold text-green-600">+{event.points}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {game.status !== 'finished' && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => navigate(createPageUrl("CourtView"))}
              style={{
                background: '#c9a962',
                color: 'white',
                boxShadow: '0 10px 26px rgba(0,0,0,.10)'
              }}
            >
              Go to Live Court View
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}