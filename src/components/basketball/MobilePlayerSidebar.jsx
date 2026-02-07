import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function MobilePlayerSidebar({ 
  players, 
  currentPlayerId, 
  gameId, 
  teamColor, 
  isOpen, 
  onClose 
}) {
  const navigate = useNavigate();

  const switchToPlayer = (playerId) => {
    navigate(createPageUrl("PlayerProfile") + `?playerId=${playerId}&gameId=${gameId}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-80 z-50 p-6 overflow-auto"
            style={{
              background: '#e0e0e0',
              boxShadow: '8px 0 24px rgba(0,0,0,0.2)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-700">Starting Lineup</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                  background: '#e0e0e0',
                  border: 'none'
                }}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3">
              {players.map(player => (
                <motion.button
                  key={player.id}
                  onClick={() => switchToPlayer(player.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    player.id === currentPlayerId ? 'ring-2' : ''
                  }`}
                  style={{
                    background: player.id === currentPlayerId ? `${teamColor}30` : '#e0e0e0',
                    boxShadow: player.id === currentPlayerId 
                      ? 'inset 3px 3px 6px rgba(0,0,0,0.1)'
                      : '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
                    border: 'none',
                    ringColor: teamColor
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ background: teamColor }}
                    >
                      {player.jersey_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-gray-700 truncate">
                        {player.name}
                      </div>
                      <div className="text-sm text-gray-500">{player.position}</div>
                    </div>
                    <div className="flex flex-col items-end text-xs text-gray-600">
                      <div className="font-bold">{player.points}p</div>
                      <div>{player.rebounds_off + player.rebounds_def}r</div>
                      <div>{player.assists}a</div>
                    </div>
                    {player.id === currentPlayerId && (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}