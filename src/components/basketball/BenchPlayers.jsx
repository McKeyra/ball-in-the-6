import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function BenchPlayers({ 
  players, 
  teamColor, 
  onPlayerTap, 
  onDrop,
  canDrop
}) {
  const [dragOver, setDragOver] = useState(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {players.map((player, index) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onDragOver={(e) => {
            if (canDrop) {
              e.preventDefault();
              setDragOver(player.id);
            }
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(null);
            if (canDrop) {
              onDrop(player);
            }
          }}
          onClick={() => onPlayerTap(player)}
          className="relative cursor-pointer transition-all"
          style={{
            background: dragOver === player.id ? `${teamColor}20` : '#e0e0e0',
            boxShadow: dragOver === player.id ?
              'inset 4px 4px 8px rgba(0,0,0,0.15), inset -4px -4px 8px rgba(255,255,255,0.5)' :
              '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
            borderRadius: '12px',
            padding: '12px',
            minHeight: '120px',
            border: dragOver === player.id ? `2px dashed ${teamColor}` : 'none'
          }}
        >
          {/* Position Badge */}
          <div 
            className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs font-bold"
            style={{
              background: `${teamColor}20`,
              color: teamColor
            }}
          >
            {player.position}
          </div>

          {/* Jersey Number */}
          <div className="flex flex-col items-center justify-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mt-4 mb-2"
              style={{
                background: teamColor,
                color: 'white',
                boxShadow: '3px 3px 6px rgba(0,0,0,0.15)'
              }}
            >
              {player.jersey_number}
            </div>
            
            <div className="text-xs font-semibold text-gray-700 text-center">
              {player.name}
            </div>

            {/* Mini Stats */}
            <div className="flex gap-2 mt-2 text-xs">
              <span className="text-gray-600">{player.points}p</span>
              <span className="text-gray-600">{player.rebounds_off + player.rebounds_def}r</span>
              <span className="text-gray-600">{player.assists}a</span>
            </div>
          </div>

          {dragOver === player.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-xl">
              <div className="text-xs font-bold" style={{ color: teamColor }}>
                Drop to substitute
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}