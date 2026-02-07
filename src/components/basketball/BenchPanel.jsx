import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function BenchPanel({ 
  players, 
  teamColor, 
  onPlayerTap, 
  onDrop,
  canDrop,
  onClose
}) {
  const [dragOver, setDragOver] = useState(null);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="mt-4 overflow-hidden"
      >
        <div 
          className="rounded-2xl p-6"
          style={{
            background: '#e0e0e0',
            boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-700">Bench Players - Drag to Substitute</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              style={{
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                background: '#e0e0e0'
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                  borderRadius: '16px',
                  padding: '16px',
                  minHeight: '200px',
                  border: dragOver === player.id ? `2px dashed ${teamColor}` : 'none'
                }}
              >
                {/* Position Badge */}
                <div 
                  className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold"
                  style={{
                    background: `${teamColor}30`,
                    color: teamColor
                  }}
                >
                  {player.position}
                </div>

                {/* Jersey Number */}
                <div className="flex flex-col items-center justify-center mt-6">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mb-3"
                    style={{
                      background: teamColor,
                      color: 'white',
                      boxShadow: '4px 4px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {player.jersey_number}
                  </div>
                  
                  <div className="text-sm font-semibold text-gray-700 text-center mb-3">
                    {player.name}
                  </div>

                  {/* Statistics */}
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">PTS</span>
                      <span className="font-bold text-gray-700">{player.points}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">REB</span>
                      <span className="font-bold text-gray-700">{player.rebounds_off + player.rebounds_def}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">AST</span>
                      <span className="font-bold text-gray-700">{player.assists}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">FG</span>
                      <span className="font-bold text-gray-700">{player.fgm}/{player.fga}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">PF</span>
                      <span className="font-bold text-gray-700">{player.personal_fouls}</span>
                    </div>
                  </div>
                </div>

                {dragOver === player.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl">
                    <div className="text-sm font-bold px-4 py-2 rounded-lg" style={{ 
                      background: teamColor,
                      color: 'white'
                    }}>
                      Drop to Sub
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}