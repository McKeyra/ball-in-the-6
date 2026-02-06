import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid3X3, Globe, PlayCircle, User } from 'lucide-react';

const tabs = [
  { id: 'apps', label: 'Apps', icon: Grid3X3, path: '/Home' },
  { id: 'feed', label: 'Feed', icon: Globe, path: '/Feed' },
  { id: 'games', label: 'Games', icon: PlayCircle, path: '/LiveGame', special: true },
  { id: 'profile', label: 'Profile', icon: User, path: '/PlayerDashboard' },
];

export default function B6BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path === '/Home' || path.includes('Home')) return 'apps';
    if (path.includes('Feed') || path.includes('Forum') || path.includes('Fan')) return 'feed';
    if (path.includes('Game') || path.includes('Live') || path.includes('Court') || path.includes('Schedule')) return 'games';
    if (path.includes('Dashboard') || path.includes('Profile') || path.includes('Settings')) return 'profile';
    return 'apps';
  };

  const activeTab = getActiveTab();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="max-w-[420px] mx-auto bg-[#0f0f0f]/95 backdrop-blur-[20px] rounded-[16px] sm:rounded-[20px] shadow-[0_-4px_24px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.4)] border border-white/[0.08] px-1.5 py-1.5 sm:px-2 sm:py-2">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isSpecial = tab.special;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex flex-col items-center gap-0.5 sm:gap-1 py-2 px-3 sm:px-4 md:px-5 rounded-xl transition-all duration-200 min-w-[60px] sm:min-w-[70px] min-h-[52px] sm:min-h-[56px] ${
                    isSpecial
                      ? 'bg-[#c9a962] text-[#0f0f0f] mx-0.5 sm:mx-1'
                      : isActive
                        ? 'text-[#c9a962]'
                        : 'text-white/50 hover:text-white/70 active:bg-white/[0.04]'
                  }`}
                >
                  <motion.div
                    animate={{
                      scale: isActive && !isSpecial ? 1.1 : 1,
                      y: isActive && !isSpecial ? -2 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon
                      className="transition-all duration-200 w-5 h-5 sm:w-6 sm:h-6"
                      strokeWidth={isActive || isSpecial ? 2.5 : 2}
                    />
                  </motion.div>
                  <span className={`text-[10px] sm:text-[11px] font-semibold tracking-wide ${
                    isSpecial ? 'text-[#0f0f0f]' : ''
                  }`}>
                    {tab.label}
                  </span>

                  {/* Active Indicator */}
                  {isActive && !isSpecial && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-0.5 sm:-bottom-1 w-1 h-1 rounded-full bg-[#c9a962]"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safe area spacer for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </motion.nav>
  );
}
