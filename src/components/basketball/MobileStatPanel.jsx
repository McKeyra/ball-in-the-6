import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronUp, ChevronDown, Check, X as XIcon } from 'lucide-react';

export default function MobileStatPanel({ 
  teamColor, 
  onStatChange,
  pendingStats 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('scoring');
  
  // Swipe detection
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - touchStartX.current;
    x.set(deltaX);
  };

  const handleTouchEnd = (e, stat, type) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    
    // If horizontal swipe is dominant (> 50px) and vertical movement is small
    if (Math.abs(deltaX) > 50 && deltaY < 30) {
      if (deltaX > 0) {
        // Swipe right for make/increment
        onStatChange(stat, type === 'make' ? 'made' : type, 1);
      }
      // Optionally: swipe left could decrement
    }
    
    x.set(0);
  };

  const StatSwipeButton = ({ label, stat, type, variant, icon, color }) => {
    const isPending = type === 'made' 
      ? pendingStats[stat]?.made > 0 
      : type === 'missed' 
        ? pendingStats[stat]?.missed > 0 
        : pendingStats[stat] > 0;
    
    const pendingValue = type === 'made' 
      ? pendingStats[stat]?.made 
      : type === 'missed' 
        ? pendingStats[stat]?.missed 
        : pendingStats[stat];

    return (
      <motion.div
        className="relative overflow-hidden rounded-xl"
        whileTap={{ scale: 0.95 }}
        style={{ opacity }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={(e) => handleTouchEnd(e, stat, type)}
        onClick={() => onStatChange(stat, type === 'make' ? 'made' : type, 1)}
      >
        <motion.div
          className="py-4 px-3 flex flex-col items-center justify-center gap-1 relative"
          style={{
            background: variant === 'make' 
              ? `linear-gradient(135deg, ${color || teamColor}20, ${color || teamColor}40)` 
              : variant === 'miss'
                ? 'linear-gradient(135deg, #E5E7EB, #F3F4F6)'
                : '#e0e0e0',
            boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
            border: 'none'
          }}
        >
          {icon ? (
            <span className="text-2xl">{icon}</span>
          ) : variant === 'make' ? (
            <Check className="w-6 h-6" style={{ color: color || teamColor }} />
          ) : variant === 'miss' ? (
            <XIcon className="w-6 h-6 text-gray-500" />
          ) : null}
          <span className="text-xs font-semibold text-gray-700">{label}</span>
          
          {isPending && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: variant === 'miss' ? '#6B7280' : color || teamColor }}
            >
              {pendingValue}
            </motion.div>
          )}
        </motion.div>
        
        {/* Swipe indicator */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-transparent"
          style={{ 
            background: `linear-gradient(to right, ${color || teamColor}40, transparent)`,
            opacity: 0.3
          }}
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    );
  };

  const categories = {
    scoring: [
      { label: '2PT', stat: 'twoPointers', hasMakeMiss: true },
      { label: '3PT', stat: 'threePointers', hasMakeMiss: true },
    ],
    other: [
      { label: 'AST', stat: 'assists', icon: '👏' },
      { label: 'STL', stat: 'steals', icon: '🤚' },
      { label: 'BLK', stat: 'blocks', icon: '🚫' },
      { label: 'TO', stat: 'turnovers', icon: '❌' },
      { label: 'OREB', stat: 'reboundsOff', icon: '⬆️' },
      { label: 'DREB', stat: 'reboundsDef', icon: '⬇️' },
    ]
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      {/* Collapse/Expand Handle */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-3 flex items-center justify-center gap-2 relative"
        style={{
          background: teamColor,
          boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
          borderRadius: '20px 20px 0 0'
        }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{ y: isExpanded ? 0 : [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          {isExpanded ? (
            <ChevronDown className="w-6 h-6 text-white" />
          ) : (
            <ChevronUp className="w-6 h-6 text-white" />
          )}
        </motion.div>
        <span className="text-white font-semibold">
          {isExpanded ? 'Hide Stats' : 'Quick Stats Entry'}
        </span>
        
        {/* Pending indicator */}
        {!isExpanded && Object.values(pendingStats).some(v => 
          (typeof v === 'number' && v > 0) || 
          (v?.made > 0 || v?.missed > 0) ||
          (Array.isArray(v) && v.length > 0)
        ) && (
          <motion.div
            className="absolute right-4 w-2 h-2 rounded-full bg-yellow-300"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Expandable Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
            style={{
              background: '#e0e0e0',
              boxShadow: '0 -8px 24px rgba(0,0,0,0.2)'
            }}
          >
            <div className="p-4 max-h-96 overflow-auto">
              {/* Category Tabs */}
              <motion.div 
                className="flex gap-2 mb-4"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {['scoring', 'other'].map(cat => (
                  <motion.button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-2 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: activeCategory === cat ? teamColor : '#e0e0e0',
                      color: activeCategory === cat ? 'white' : '#666',
                      boxShadow: activeCategory === cat 
                        ? 'inset 2px 2px 4px rgba(0,0,0,0.2)' 
                        : '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                      border: 'none'
                    }}
                  >
                    {cat === 'scoring' ? '🏀 Scoring' : '📊 Other Stats'}
                  </motion.button>
                ))}
              </motion.div>

              {/* Scoring Category */}
              <AnimatePresence mode="wait">
                {activeCategory === 'scoring' && (
                  <motion.div
                    key="scoring"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {categories.scoring.map((item, idx) => (
                      <motion.div 
                        key={item.stat}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="text-sm font-semibold text-gray-600 mb-2">{item.label}</div>
                        <div className="grid grid-cols-2 gap-3">
                          <StatSwipeButton
                            label="Make"
                            stat={item.stat}
                            type="make"
                            variant="make"
                            color={teamColor}
                          />
                          <StatSwipeButton
                            label="Miss"
                            stat={item.stat}
                            type="miss"
                            variant="miss"
                          />
                        </div>
                      </motion.div>
                    ))}

                    {/* Free Throws */}
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="text-sm font-semibold text-gray-600 mb-2">Free Throws</div>
                      <div className="grid grid-cols-2 gap-3">
                        <StatSwipeButton
                          label="FT Make"
                          stat="freeThrows"
                          type="made"
                          variant="make"
                          color={teamColor}
                        />
                        <StatSwipeButton
                          label="FT Miss"
                          stat="freeThrows"
                          type="missed"
                          variant="miss"
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Other Stats Category */}
                {activeCategory === 'other' && (
                  <motion.div
                    key="other"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-3 gap-3"
                  >
                    {categories.other.map((item, idx) => (
                      <motion.div
                        key={item.stat}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <StatSwipeButton
                          label={item.label}
                          stat={item.stat}
                          icon={item.icon}
                          color={teamColor}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Swipe Hint */}
              <motion.div 
                className="mt-4 text-center text-xs text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                💡 Tap to add stats • Swipe right for quick entry
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}