import React from 'react';

export default function CurrentStats({ player }) {
  const basicStats = [
    { label: 'PTS', value: player.points },
    { label: 'REB', value: player.rebounds_off + player.rebounds_def },
    { label: 'AST', value: player.assists },
    { label: 'STL', value: player.steals },
    { label: 'BLK', value: player.blocks },
    { label: 'TO', value: player.turnovers },
    { label: 'FG', value: `${player.fgm}/${player.fga}` },
    { label: '3PT', value: `${player.three_pm}/${player.three_pa}` },
    { label: 'FT', value: `${player.ftm}/${player.fta}` },
    { label: 'PF', value: player.personal_fouls }
  ];

  return (
    <div 
      className="grid grid-cols-5 gap-3 p-4 rounded-2xl"
      style={{
        background: '#e0e0e0',
        boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
      }}
    >
      {basicStats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-lg font-bold text-gray-700">{stat.value}</div>
          <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}