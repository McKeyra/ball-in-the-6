import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown, ChevronRight, X,
  PlayCircle, Users, Trophy, Calendar,
  Heart, MessageSquare, Store,
  Settings, LogOut, User
} from 'lucide-react';

const quickLinks = [
  { name: 'Live Games', icon: PlayCircle, path: '/LiveGame', color: '#c9a962' },
  { name: 'My Team', icon: Users, path: '/TeamDashboard', color: '#4A90E2' },
  { name: 'Schedule', icon: Calendar, path: '/Schedule', color: '#8BC9A8' },
  { name: 'Standings', icon: Trophy, path: '/Standings', color: '#FFB088' },
];

const menuSections = [
  {
    title: 'Games & Stats',
    items: [
      { name: 'Court View', path: '/CourtView' },
      { name: 'Box Score', path: '/BoxScore' },
      { name: 'Live Stats', path: '/LiveStats' },
    ]
  },
  {
    title: 'Teams',
    items: [
      { name: 'All Teams', path: '/Teams' },
      { name: 'Create Team', path: '/CreateTeam' },
      { name: 'Team Registration', path: '/TeamRegistration' },
    ]
  },
  {
    title: 'Community',
    items: [
      { name: 'Feed', path: '/Feed' },
      { name: 'Forum', path: '/Forum' },
      { name: 'Fan Zone', path: '/FanZone' },
      { name: 'Store', path: '/Store' },
    ]
  },
];

export default function B6MobileMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  const handleNavigate = (path) => {
    navigate(path);
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-50 max-w-[500px] md:max-w-[600px] mx-auto"
          >
            {/* Safe area for notched devices */}
            <div className="pt-[env(safe-area-inset-top)]">
              <div className="bg-[#0f0f0f]/98 backdrop-blur-[30px] rounded-[20px] sm:rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.4),0_12px_48px_rgba(0,0,0,0.5)] overflow-hidden border border-white/[0.08] max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-[#0f0f0f]/98 backdrop-blur-[30px] flex items-center justify-between p-4 sm:p-5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#c9a962] to-[#a8893f] rounded-lg sm:rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f0f0f]" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 2C12 12 12 12 12 22" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M2 12C12 12 12 12 22 12" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <span className="text-base sm:text-lg font-black tracking-tight text-white">Ball in the 6</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors active:scale-95"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Quick Links - 2x2 on mobile, 4 columns on tablet */}
                <div className="p-3 sm:p-4 border-b border-white/[0.06]">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {quickLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <button
                          key={link.name}
                          onClick={() => handleNavigate(link.path)}
                          className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl hover:bg-white/[0.04] transition-colors active:scale-95 min-h-[80px] sm:min-h-[90px]"
                        >
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${link.color}20` }}
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: link.color }} />
                          </div>
                          <span className="text-[11px] sm:text-xs font-medium text-white/70 text-center leading-tight">
                            {link.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Menu Sections - Side by side on tablet */}
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {menuSections.map((section) => (
                      <div key={section.title} className="md:mb-0">
                        <button
                          onClick={() => setExpandedSection(
                            expandedSection === section.title ? null : section.title
                          )}
                          className="w-full flex items-center justify-between py-3 px-3 sm:px-4 rounded-xl hover:bg-white/[0.04] transition-colors min-h-[48px] active:bg-white/[0.06]"
                        >
                          <span className="text-[15px] sm:text-[16px] font-medium text-white">{section.title}</span>
                          <motion.div
                            animate={{ rotate: expandedSection === section.title ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-white/40" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {expandedSection === section.title && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pl-3 sm:pl-4 space-y-1 pb-2">
                                {section.items.map((item) => (
                                  <button
                                    key={item.name}
                                    onClick={() => handleNavigate(item.path)}
                                    className="w-full flex items-center justify-between py-3 px-3 sm:px-4 rounded-xl hover:bg-white/[0.04] transition-colors text-left min-h-[48px] active:bg-white/[0.06]"
                                  >
                                    <span className="text-[14px] sm:text-[15px] text-white/70">{item.name}</span>
                                    <ChevronRight className="w-4 h-4 text-white/30" />
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-[#0f0f0f]/98 backdrop-blur-[30px] p-3 sm:p-4 border-t border-white/[0.06]">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={() => handleNavigate('/PlayerDashboard')}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] transition-colors min-h-[48px] active:scale-95"
                    >
                      <User className="w-5 h-5 text-white/60" />
                      <span className="text-[14px] sm:text-[15px] font-medium text-white">Profile</span>
                    </button>
                    <button
                      onClick={() => handleNavigate('/Dashboard')}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] transition-colors min-h-[48px] active:scale-95"
                    >
                      <Settings className="w-5 h-5 text-white/60" />
                      <span className="text-[14px] sm:text-[15px] font-medium text-white">Settings</span>
                    </button>
                  </div>
                  <button
                    className="w-full bg-[#c9a962] text-[#0f0f0f] py-3.5 sm:py-4 rounded-full font-semibold text-[15px] sm:text-[16px] hover:bg-[#d4b46d] transition-all duration-200 active:scale-[0.98] min-h-[48px]"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
