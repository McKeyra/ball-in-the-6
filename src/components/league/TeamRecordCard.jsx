import React from 'react';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

export default function TeamRecordCard({ team, record, onClick }) {
  const gamesPlayed = record.wins + record.losses;
  const winPct = gamesPlayed > 0 ? ((record.wins / gamesPlayed) * 100).toFixed(1) : '0.0';
  const ppg = gamesPlayed > 0 ? (record.pointsFor / gamesPlayed).toFixed(1) : '0.0';
  const oppg = gamesPlayed > 0 ? (record.pointsAgainst / gamesPlayed).toFixed(1) : '0.0';
  const diff = gamesPlayed > 0 ? ((record.pointsFor - record.pointsAgainst) / gamesPlayed).toFixed(1) : '0.0';

  // Calculate streak
  let currentStreak = '';
  if (record.lastFive.length > 0) {
    const firstResult = record.lastFive[0];
    let count = 0;
    for (const r of record.lastFive) {
      if (r === firstResult) count++;
      else break;
    }
    currentStreak = `${firstResult}${count}`;
  }

  return (
    <div
      onClick={onClick}
      className="p-5 rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform"
      style={{
        background: '#e0e0e0',
        boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
      }}
    >
      {/* Team Header */}
      <div className="flex items-center gap-3 mb-4">
        {team.logo_url ? (
          <img 
            src={team.logo_url} 
            alt={team.team_name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ background: team.team_color || '#666' }}
          >
            {team.team_name?.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-lg">{team.team_name}</h3>
          <div className="text-xs text-gray-500">
            {team.league} • {team.division}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Record */}
      <div 
        className="p-4 rounded-xl mb-4"
        style={{
          background: 'rgba(0,0,0,0.03)',
          boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {record.wins}-{record.losses}
            </div>
            <div className="text-xs text-gray-500">Record</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{winPct}%</div>
            <div className="text-xs text-gray-500">Win %</div>
          </div>
          {currentStreak && (
            <div className="text-center">
              <div className={`text-xl font-bold ${currentStreak.startsWith('W') ? 'text-green-600' : 'text-red-500'}`}>
                {currentStreak}
              </div>
              <div className="text-xs text-gray-500">Streak</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-lg font-semibold text-gray-700">{ppg}</div>
          <div className="text-xs text-gray-500">PPG</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-700">{oppg}</div>
          <div className="text-xs text-gray-500">Opp PPG</div>
        </div>
        <div>
          <div className={`text-lg font-semibold flex items-center justify-center gap-1 ${parseFloat(diff) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {parseFloat(diff) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {parseFloat(diff) >= 0 ? '+' : ''}{diff}
          </div>
          <div className="text-xs text-gray-500">Diff</div>
        </div>
      </div>

      {/* Last 5 Games */}
      {record.lastFive.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <div className="text-xs text-gray-500 mb-2">Last 5 Games</div>
          <div className="flex gap-1">
            {record.lastFive.map((result, i) => (
              <span
                key={i}
                className={`flex-1 py-1 rounded text-xs font-bold text-center ${
                  result === 'W' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {result}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}