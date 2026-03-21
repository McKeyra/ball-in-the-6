'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
}

interface MobileCourtViewProps {
  game: GameData;
  homePlayers: PlayerData[];
  awayPlayers: PlayerData[];
  onPlayerTap: (player: PlayerData) => void;
  onSubstitution?: () => void;
}

export function MobileCourtView({
  game,
  homePlayers,
  awayPlayers,
  onPlayerTap,
}: MobileCourtViewProps): React.ReactElement {
  const [showHomeBench, setShowHomeBench] = useState(false);
  const [showAwayBench, setShowAwayBench] = useState(false);

  const homeStarters = homePlayers.filter((p) => p.on_court);
  const homeBench = homePlayers.filter((p) => !p.on_court);
  const awayStarters = awayPlayers.filter((p) => p.on_court);
  const awayBench = awayPlayers.filter((p) => !p.on_court);

  const renderTeamSection = (
    teamName: string,
    teamColor: string,
    starters: PlayerData[],
    bench: PlayerData[],
    showBench: boolean,
    setShowBench: (show: boolean) => void,
    label: string,
    gradientDir: string
  ): React.ReactElement => (
    <div
      className="flex-1 p-3"
      style={{
        background: `linear-gradient(${gradientDir}, ${teamColor}10, transparent)`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-full"
            style={{ background: teamColor }}
          />
          <div>
            <div className="font-bold text-sm text-gray-800">{teamName}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        </div>
        <button
          onClick={() => setShowBench(!showBench)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: '#e0e0e0',
            boxShadow:
              '3px 3px 6px rgba(0,0,0,0.1), -3px -3px 6px rgba(255,255,255,0.7)',
            color: '#666',
          }}
        >
          Bench ({bench.length})
          {showBench ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Starting Lineup - Horizontal Scroll */}
      <div className="overflow-x-auto pb-2 -mx-3 px-3">
        <div className="flex gap-3" style={{ minWidth: 'min-content' }}>
          {starters.map((player) => (
            <button
              key={player.id}
              onClick={() => onPlayerTap(player)}
              className="flex-shrink-0 w-28 p-3 rounded-xl"
              style={{
                background: '#e0e0e0',
                boxShadow:
                  '3px 3px 6px rgba(0,0,0,0.1), -3px -3px 6px rgba(255,255,255,0.7)',
              }}
            >
              <div
                className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
                style={{ background: teamColor }}
              >
                {player.jersey_number}
              </div>
              <div className="text-xs font-semibold text-gray-800 truncate mb-1">
                {player.name}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {player.position}
              </div>
              <div className="text-center space-y-1">
                <div className="text-sm">
                  <span className="font-bold text-gray-700">
                    {player.points}
                  </span>
                  <span className="text-gray-500 text-xs"> pts</span>
                </div>
                <div className="text-xs text-gray-500">
                  {player.rebounds_off + player.rebounds_def}r &bull;{' '}
                  {player.assists}a
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showBench && (
        <BenchPanel
          players={bench}
          teamColor={teamColor}
          onPlayerTap={onPlayerTap}
          onClose={() => setShowBench(false)}
        />
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Away Team */}
      {renderTeamSection(
        game.away_team_name,
        game.away_team_color,
        awayStarters,
        awayBench,
        showAwayBench,
        setShowAwayBench,
        'Away',
        'to bottom'
      )}

      {/* Center Line */}
      <div
        className="h-0.5 mx-4"
        style={{
          background:
            'linear-gradient(to right, transparent, #666, transparent)',
        }}
      />

      {/* Home Team */}
      {renderTeamSection(
        game.home_team_name,
        game.home_team_color,
        homeStarters,
        homeBench,
        showHomeBench,
        setShowHomeBench,
        'Home',
        'to top'
      )}
    </div>
  );
}
