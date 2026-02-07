import { motion } from 'framer-motion';

export default function PlayerGrid({ team, teamName, teamColor, players, onPlayerTap }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-2 h-8 rounded-full"
          style={{ background: teamColor }}
        />
        <h2 className="text-2xl font-bold text-gray-700">{teamName}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {players.map((player, index) => (
          <motion.button
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onPlayerTap(player)}
            className="relative group"
            style={{
              background: '#e0e0e0',
              boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
              borderRadius: '16px',
              padding: '16px',
              minHeight: '160px',
              transition: 'all 0.2s',
              border: 'none'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow = 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.boxShadow = '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)';
            }}
          >
            {/* On Court Indicator */}
            {player.on_court && (
              <div 
                className="absolute top-3 right-3 w-3 h-3 rounded-full"
                style={{
                  background: '#10B981',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
                }}
              />
            )}

            {/* Jersey Number */}
            <div 
              className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl font-bold"
              style={{
                background: teamColor,
                color: 'white',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.15), -2px -2px 4px rgba(255,255,255,0.5)',
              }}
            >
              {player.jersey_number}
            </div>

            {/* Player Name */}
            <div className="text-sm font-semibold text-gray-700 mb-1">{player.name}</div>
            <div className="text-xs text-gray-500">{player.position}</div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-4 mt-3 text-xs">
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
          </motion.button>
        ))}
      </div>
    </div>
  );
}