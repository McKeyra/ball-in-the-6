import React from 'react';
import { motion } from 'framer-motion';

export default function StartingLineup({ 
  players, 
  teamColor, 
  onPlayerTap, 
  onDragStart,
  draggedPlayer,
  isMobile = false
}) {
  return (
    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} gap-4`}>
      {players.map((player, index) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          draggable={!isMobile}
          onDragStart={() => !isMobile && onDragStart && onDragStart(player)}
          onClick={() => onPlayerTap(player)}
          className={`relative group cursor-pointer ${!isMobile && 'hover:scale-105'} transition-transform`}
          style={{
            background: '#e0e0e0',
            boxShadow: draggedPlayer?.id === player.id ? 
              'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)' :
              '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
            borderRadius: '16px',
            padding: '16px',
            minHeight: isMobile ? '140px' : '180px',
            opacity: draggedPlayer?.id === player.id ? 0.5 : 1
          }}
        >
          {/* Position Badge */}
          <div 
            className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold"
            style={{
              background: `${teamColor}30`,
              color: teamColor,
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {player.position}
          </div>

          {/* Jersey Number */}
          <div className="flex flex-col items-center justify-center mb-3 mt-6">
            <div 
              className={`${isMobile ? 'w-16 h-16 text-3xl' : 'w-20 h-20 text-4xl'} rounded-full flex items-center justify-center font-bold`}
              style={{
                background: teamColor,
                color: 'white',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.15), -2px -2px 4px rgba(255,255,255,0.5)',
              }}
            >
              {player.jersey_number}
            </div>
            
            {/* Player Name */}
            <div className="text-center mt-2">
              <div className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700`}>
                {player.name}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`flex justify-center gap-${isMobile ? '3' : '4'} mt-3 text-xs`}>
            <div className="text-center">
              <div className="font-bold text-gray-700">{player.points}</div>
              <div className="text-gray-500">PTS</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-700">{player.rebounds_off + player.rebounds_def}</div>
              <div className="text-gray-500">REB</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-700">{player.assists}</div>
              <div className="text-gray-500">AST</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}