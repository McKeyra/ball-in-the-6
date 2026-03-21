'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { BenchPanel } from './BenchPanel';

interface PlayerData {
  id: string;
  jersey_number: string;
  name: string;
  position: string;
  team: 'home' | 'away';
  on_court: boolean;
  points: number;
  rebounds_off: number;
  rebounds_def: number;
  assists: number;
  fgm: number;
  fga: number;
  personal_fouls: number;
}

interface GameData {
  home_team_name: string;
  away_team_name: string;
  home_team_color: string;
  away_team_color: string;
  home_timeouts: number;
  away_timeouts: number;
}

interface DesktopCourtViewProps {
  game: GameData;
  homePlayers: PlayerData[];
  awayPlayers: PlayerData[];
  onPlayerTap: (player: PlayerData) => void;
  onDragStart?: (player: PlayerData) => void;
  onDrop?: (player: PlayerData) => void;
  draggedPlayer?: PlayerData | null;
}

export function DesktopCourtView({
  game,
  homePlayers,
  awayPlayers,
  onPlayerTap,
  onDragStart,
  onDrop,
  draggedPlayer,
}: DesktopCourtViewProps): React.ReactElement {
  const [showHomeBench, setShowHomeBench] = useState(false);
  const [showAwayBench, setShowAwayBench] = useState(false);

  const homeStarters = homePlayers.filter((p) => p.on_court);
  const homeBench = homePlayers.filter((p) => !p.on_court);
  const awayStarters = awayPlayers.filter((p) => p.on_court);
  const awayBench = awayPlayers.filter((p) => !p.on_court);

  const renderPlayerCard = (
    player: PlayerData,
    teamColor: string
  ): React.ReactElement => (
    <div
      key={player.id}
      draggable
      onDragStart={() => onDragStart && onDragStart(player)}
      onClick={() => onPlayerTap(player)}
      className="cursor-pointer group hover:scale-105 transition-transform flex-shrink-0 relative"
      style={{
        background: '#e0e0e0',
        boxShadow:
          draggedPlayer?.id === player.id
            ? 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
            : '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
        borderRadius: '16px',
        padding: '12px',
        width: '140px',
        opacity: draggedPlayer?.id === player.id ? 0.5 : 1,
      }}
    >
      {/* Position Badge */}
      <div
        className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs font-bold"
        style={{
          background: `${teamColor}30`,
          color: teamColor,
          boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        {player.position}
      </div>

      {/* Jersey Number */}
      <div className="flex flex-col items-center justify-center mb-2 mt-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl"
          style={{
            background: teamColor,
            color: 'white',
            boxShadow: '3px 3px 6px rgba(0,0,0,0.15)',
          }}
        >
          {player.jersey_number}
        </div>

        <div className="text-center mt-2">
          <div className="text-xs font-semibold text-gray-700 truncate">
            {player.name}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex justify-center gap-2 mt-2 text-xs">
        <div className="text-center">
          <div className="font-bold text-gray-700">{player.points}</div>
          <div className="text-gray-500">PTS</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-gray-700">
            {player.rebounds_off + player.rebounds_def}
          </div>
          <div className="text-gray-500">REB</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-gray-700">{player.assists}</div>
          <div className="text-gray-500">AST</div>
        </div>
      </div>
    </div>
  );

  const renderTeamSection = (
    teamName: string,
    teamColor: string,
    starters: PlayerData[],
    bench: PlayerData[],
    showBench: boolean,
    setShowBench: (show: boolean) => void,
    timeouts: number,
    teamSide: 'home' | 'away'
  ): React.ReactElement => (
    <div className="relative">
      <div className="flex items-center justify-center gap-4">
        {/* Team Info */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex-shrink-0"
            style={{
              background: teamColor,
              boxShadow: '3px 3px 6px rgba(0,0,0,0.15)',
            }}
          />
          <div>
            <h2 className="text-lg font-bold text-gray-700 leading-tight">
              {teamName}
            </h2>
            <div className="text-xs text-gray-600">
              <span className="font-semibold">Timeouts:</span> {timeouts}
            </div>
          </div>
        </div>

        {/* Starting Lineup */}
        <div className="overflow-x-auto pb-2 scrollbar-hide flex-1 max-w-4xl">
          <div className="flex gap-3 justify-center min-w-max px-4">
            {starters.map((player) => renderPlayerCard(player, teamColor))}
          </div>
        </div>

        {/* Bench Button */}
        <button
          onClick={() => setShowBench(!showBench)}
          className="px-4 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all flex-shrink-0"
          style={{
            background: showBench ? teamColor : '#e0e0e0',
            color: showBench ? 'white' : '#666',
            boxShadow: showBench
              ? 'inset 4px 4px 8px rgba(0,0,0,0.2)'
              : '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
            border: 'none',
          }}
        >
          <Users className="w-5 h-5" />
          Bench ({bench.length})
        </button>
      </div>

      {/* Bench Panel */}
      {showBench && (
        <BenchPanel
          players={bench}
          teamColor={teamColor}
          onPlayerTap={onPlayerTap}
          onDrop={onDrop}
          canDrop={draggedPlayer?.team === teamSide}
          onClose={() => setShowBench(false)}
        />
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-auto px-6 py-6 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        {renderTeamSection(
          game.home_team_name,
          game.home_team_color,
          homeStarters,
          homeBench,
          showHomeBench,
          setShowHomeBench,
          game.home_timeouts,
          'home'
        )}
        {renderTeamSection(
          game.away_team_name,
          game.away_team_color,
          awayStarters,
          awayBench,
          showAwayBench,
          setShowAwayBench,
          game.away_timeouts,
          'away'
        )}
      </div>
    </div>
  );
}
