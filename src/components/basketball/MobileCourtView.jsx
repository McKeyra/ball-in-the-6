import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import BenchPanel from "./BenchPanel";

export default function MobileCourtView({ 
  game, 
  homePlayers, 
  awayPlayers, 
  onPlayerTap,
  onSubstitution 
}) {
  const [showHomeBench, setShowHomeBench] = useState(false);
  const [showAwayBench, setShowAwayBench] = useState(false);

  const homeStarters = homePlayers.filter(p => p.on_court);
  const homeBench = homePlayers.filter(p => !p.on_court);
  const awayStarters = awayPlayers.filter(p => p.on_court);
  const awayBench = awayPlayers.filter(p => !p.on_court);

  return (
    <div className="h-full flex flex-col">
      {/* Away Team */}
      <div 
        className="flex-1 p-3"
        style={{
          background: `linear-gradient(to bottom, ${game.away_team_color}10, transparent)`
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-full"
              style={{ background: game.away_team_color }}
            />
            <div>
              <div className="font-bold text-sm text-gray-800">{game.away_team_name}</div>
              <div className="text-xs text-gray-500">Away</div>
            </div>
          </div>
          <button
            onClick={() => setShowAwayBench(!showAwayBench)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{
              background: '#e0e0e0',
              boxShadow: '3px 3px 6px rgba(0,0,0,0.1), -3px -3px 6px rgba(255,255,255,0.7)',
              color: '#666'
            }}
          >
            Bench ({awayBench.length})
            {showAwayBench ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Starting Lineup - Horizontal Scroll */}
        <div className="overflow-x-auto pb-2 -mx-3 px-3">
          <div className="flex gap-3" style={{ minWidth: 'min-content' }}>
            {awayStarters.map(player => (
              <button
                key={player.id}
                onClick={() => onPlayerTap(player)}
                className="flex-shrink-0 w-28 p-3 rounded-xl"
                style={{
                  background: '#e0e0e0',
                  boxShadow: '3px 3px 6px rgba(0,0,0,0.1), -3px -3px 6px rgba(255,255,255,0.7)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: game.away_team_color }}
                >
                  {player.jersey_number}
                </div>
                <div className="text-xs font-semibold text-gray-800 truncate mb-1">{player.name}</div>
                <div className="text-xs text-gray-500 mb-2">{player.position}</div>
                <div className="text-center space-y-1">
                  <div className="text-sm">
                    <span className="font-bold text-gray-700">{player.points}</span>
                    <span className="text-gray-500 text-xs"> pts</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {player.rebounds_off + player.rebounds_def}r • {player.assists}a
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {showAwayBench && (
          <BenchPanel
            players={awayBench}
            teamColor={game.away_team_color}
            onPlayerTap={onPlayerTap}
            onClose={() => setShowAwayBench(false)}
          />
        )}
      </div>

      {/* Center Line */}
      <div 
        className="h-0.5 mx-4"
        style={{
          background: 'linear-gradient(to right, transparent, #666, transparent)'
        }}
      />

      {/* Home Team */}
      <div 
        className="flex-1 p-3"
        style={{
          background: `linear-gradient(to top, ${game.home_team_color}10, transparent)`
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-full"
              style={{ background: game.home_team_color }}
            />
            <div>
              <div className="font-bold text-sm text-gray-800">{game.home_team_name}</div>
              <div className="text-xs text-gray-500">Home</div>
            </div>
          </div>
          <button
            onClick={() => setShowHomeBench(!showHomeBench)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{
              background: '#e0e0e0',
              boxShadow: '3px 3px 6px rgba(0,0,0,0.1), -3px -3px 6px rgba(255,255,255,0.7)',
              color: '#666'
            }}
          >
            Bench ({homeBench.length})
            {showHomeBench ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Starting Lineup - Horizontal Scroll */}
        <div className="overflow-x-auto pb-2 -mx-3 px-3">
          <div className="flex gap-3" style={{ minWidth: 'min-content' }}>
            {homeStarters.map(player => (
              <button
                key={player.id}
                onClick={() => onPlayerTap(player)}
                className="flex-shrink-0 w-28 p-3 rounded-xl"
                style={{
                  background: '#e0e0e0',
                  boxShadow: '3px 3px 6px rgba(0,0,0,0.1), -3px -3px 6px rgba(255,255,255,0.7)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: game.home_team_color }}
                >
                  {player.jersey_number}
                </div>
                <div className="text-xs font-semibold text-gray-800 truncate mb-1">{player.name}</div>
                <div className="text-xs text-gray-500 mb-2">{player.position}</div>
                <div className="text-center space-y-1">
                  <div className="text-sm">
                    <span className="font-bold text-gray-700">{player.points}</span>
                    <span className="text-gray-500 text-xs"> pts</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {player.rebounds_off + player.rebounds_def}r • {player.assists}a
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {showHomeBench && (
          <BenchPanel
            players={homeBench}
            teamColor={game.home_team_color}
            onPlayerTap={onPlayerTap}
            onClose={() => setShowHomeBench(false)}
          />
        )}
      </div>
    </div>
  );
}