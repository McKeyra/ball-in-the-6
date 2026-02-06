import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Trophy, Clock, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GamesSection() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('live');
  const [selectedDivision, setSelectedDivision] = useState('all');

  const { data: games = [] } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.list('-game_date', 100),
    refetchOnWindowFocus: false,
  });

  const today = new Date().toISOString().split('T')[0];

  const divisions = [
    'all',
    'OSBA Mens',
    'OSBA Womens',
    'Trillium Mens',
    'D-League Boys',
    'D-League Girls'
  ];

  const filterGamesByDivision = (gamesList) => {
    if (selectedDivision === 'all') return gamesList;
    return gamesList.filter(game => {
      // We'll need to get the team's division - for now filter by team names
      return true; // Simplified for now
    });
  };

  const resultsGames = filterGamesByDivision(
    games.filter(g => g.status === 'finished' && g.game_date < today)
  );

  const liveGames = filterGamesByDivision(
    games.filter(g => g.game_date === today)
  );

  const upcomingGames = filterGamesByDivision(
    games.filter(g => g.status === 'not_started' && g.game_date > today)
  );

  const GameCard = ({ game }) => {
    const winner = game.home_score > game.away_score ? 'home' : 'away';
    const isLive = game.status === 'in_progress';

    return (
      <button
        onClick={() => navigate(createPageUrl("DetailedGameView") + `?gameId=${game.id}`)}
        className="w-full p-4 rounded-2xl text-left transition-all hover:scale-[1.02]"
        style={{
          background: '#e0e0e0',
          boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{game.game_date}</span>
            {game.game_time && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{game.game_time}</span>
              </>
            )}
          </div>
          {isLive && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          )}
          {game.status === 'finished' && (
            <span className="text-xs text-gray-500 font-semibold">FINAL</span>
          )}
        </div>

        <div className="space-y-2">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div 
                className="w-10 h-10 rounded-full"
                style={{ background: game.home_team_color }}
              />
              <div className="flex-1">
                <div className={`font-semibold ${winner === 'home' && game.status === 'finished' ? 'text-gray-900' : 'text-gray-700'}`}>
                  {game.home_team_name}
                </div>
              </div>
            </div>
            <div className={`text-2xl font-bold ml-4 ${winner === 'home' && game.status === 'finished' ? 'text-gray-900' : 'text-gray-600'}`}>
              {game.home_score}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div 
                className="w-10 h-10 rounded-full"
                style={{ background: game.away_team_color }}
              />
              <div className="flex-1">
                <div className={`font-semibold ${winner === 'away' && game.status === 'finished' ? 'text-gray-900' : 'text-gray-700'}`}>
                  {game.away_team_name}
                </div>
              </div>
            </div>
            <div className={`text-2xl font-bold ml-4 ${winner === 'away' && game.status === 'finished' ? 'text-gray-900' : 'text-gray-600'}`}>
              {game.away_score}
            </div>
          </div>
        </div>

        {game.location && (
          <div className="mt-3 pt-3 border-t border-gray-300 flex items-center justify-between">
            <span className="text-xs text-gray-500">{game.location}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div>
      {/* View Toggle Buttons */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => setActiveView('results')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeView === 'results' ? 'scale-100' : 'scale-95 opacity-60'
          }`}
          style={{
            background: activeView === 'results' ? '#000435' : '#e0e0e0',
            color: activeView === 'results' ? 'white' : '#666',
            boxShadow: activeView === 'results' 
              ? '6px 6px 12px rgba(0,0,0,0.2)' 
              : '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
          }}
        >
          <Trophy className="w-4 h-4 inline mr-2" />
          Results
        </button>

        <button
          onClick={() => setActiveView('live')}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
            activeView === 'live' ? 'scale-105' : 'scale-95 opacity-60'
          }`}
          style={{
            background: activeView === 'live' ? '#000435' : '#e0e0e0',
            color: activeView === 'live' ? 'white' : '#666',
            boxShadow: activeView === 'live' 
              ? '8px 8px 16px rgba(0,0,0,0.3)' 
              : '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
          }}
        >
          <Clock className="w-5 h-5 inline mr-2" />
          Live / Today
        </button>

        <button
          onClick={() => setActiveView('upcoming')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeView === 'upcoming' ? 'scale-100' : 'scale-95 opacity-60'
          }`}
          style={{
            background: activeView === 'upcoming' ? '#000435' : '#e0e0e0',
            color: activeView === 'upcoming' ? 'white' : '#666',
            boxShadow: activeView === 'upcoming' 
              ? '6px 6px 12px rgba(0,0,0,0.2)' 
              : '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
          }}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Schedule
        </button>
      </div>

      {/* Division Filter */}
      <div className="mb-6">
        <Select value={selectedDivision} onValueChange={setSelectedDivision}>
          <SelectTrigger 
            className="w-64"
            style={{
              background: '#e0e0e0',
              boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)'
            }}
          >
            <SelectValue placeholder="Filter by division" />
          </SelectTrigger>
          <SelectContent>
            {divisions.map(div => (
              <SelectItem key={div} value={div}>
                {div === 'all' ? 'All Divisions' : div}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {activeView === 'results' && (
          <>
            {resultsGames.length === 0 ? (
              <div 
                className="p-12 rounded-2xl text-center"
                style={{
                  background: '#e0e0e0',
                  boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                }}
              >
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No completed games yet</p>
              </div>
            ) : (
              resultsGames.map(game => <GameCard key={game.id} game={game} />)
            )}
          </>
        )}

        {activeView === 'live' && (
          <>
            {liveGames.length === 0 ? (
              <div 
                className="p-12 rounded-2xl text-center"
                style={{
                  background: '#e0e0e0',
                  boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                }}
              >
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No games today</p>
              </div>
            ) : (
              liveGames.map(game => <GameCard key={game.id} game={game} />)
            )}
          </>
        )}

        {activeView === 'upcoming' && (
          <>
            {upcomingGames.length === 0 ? (
              <div 
                className="p-12 rounded-2xl text-center"
                style={{
                  background: '#e0e0e0',
                  boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                }}
              >
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming games scheduled</p>
              </div>
            ) : (
              upcomingGames.map(game => <GameCard key={game.id} game={game} />)
            )}
          </>
        )}
      </div>
    </div>
  );
}