'use client';

import { useTimeout } from './TimeoutContext';
import { Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalTimeoutDisplay(): React.ReactElement | null {
  const { isTimeoutActive, timeoutTeam, timeoutType, endTimeout } = useTimeout();

  if (!isTimeoutActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-center p-3"
      >
        <div className="rounded-2xl bg-neutral-900 px-6 py-3 flex items-center gap-4 shadow-2xl">
          <Clock className="w-6 h-6 text-white animate-pulse" />
          <div className="text-white">
            <div className="text-xs font-semibold opacity-90">
              {timeoutTeam} - {timeoutType ?? 'TIMEOUT'}
            </div>
            <div className="text-2xl font-bold">TIMEOUT</div>
          </div>
          <button
            onClick={endTimeout}
            className="ml-2 p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
