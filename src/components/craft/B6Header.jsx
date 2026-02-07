import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.svg';

export default function B6Header({ onMenuToggle, menuOpen }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
      {/* Safe area for notched devices */}
      <div className="pt-[env(safe-area-inset-top)]">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="backdrop-blur-[20px] bg-[#0f0f0f]/95 shadow-[0_2px_8px_rgba(0,0,0,0.2),0_8px_16px_rgba(0,0,0,0.3)] rounded-[16px] sm:rounded-[20px] md:rounded-[24px] px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4 max-w-[720px] mx-auto flex items-center justify-between border border-white/[0.08]"
        >
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 sm:gap-2.5 hover:opacity-80 transition-opacity active:scale-[0.98] min-h-[44px]"
          >
            {/* Logo */}
            <img
              src={logo}
              alt="Ball in the 6"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex-shrink-0 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white leading-tight">
                Ball in the 6
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#c9a962] font-medium tracking-wider uppercase hidden sm:block">
                Toronto Basketball
              </span>
            </div>
          </button>

          {/* Hamburger Menu Button - 44px minimum touch target */}
          <button
            onClick={onMenuToggle}
            className="flex flex-col gap-[5px] w-11 h-11 sm:w-12 sm:h-12 items-center justify-center rounded-xl hover:bg-white/[0.06] transition-colors duration-200 active:bg-white/[0.1]"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 7 : 0
              }}
              transition={{ duration: 0.2 }}
              className="w-5 sm:w-6 h-0.5 bg-white rounded-full origin-center"
            />
            <motion.span
              animate={{
                opacity: menuOpen ? 0 : 1,
                scaleX: menuOpen ? 0 : 1
              }}
              transition={{ duration: 0.2 }}
              className="w-5 sm:w-6 h-0.5 bg-white rounded-full"
            />
            <motion.span
              animate={{
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? -7 : 0
              }}
              transition={{ duration: 0.2 }}
              className="w-5 sm:w-6 h-0.5 bg-white rounded-full origin-center"
            />
          </button>
        </motion.nav>
      </div>
    </header>
  );
}
