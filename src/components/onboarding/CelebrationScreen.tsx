'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryItem {
  label: string;
  value: string;
}

interface CelebrationScreenProps {
  title?: string;
  subtitle?: string;
  summaryItems?: SummaryItem[];
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
}

const CONFETTI_COLORS = ['#C8FF00', '#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#FB923C'] as const;
const CONFETTI_COUNT = 24;

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  title = "You're all set!",
  subtitle,
  summaryItems = [],
  primaryAction,
  secondaryAction,
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const generateConfetti = useCallback((): void => {
    const pieces: ConfettiPiece[] = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 1.5 + Math.random() * 1.5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ?? '#C8FF00',
      size: 4 + Math.random() * 6,
    }));
    setConfetti(pieces);
  }, []);

  useEffect(() => {
    generateConfetti();
  }, [generateConfetti]);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Confetti layer */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800,
              x: (Math.random() - 0.5) * 200,
              opacity: 0,
              rotate: 360 + Math.random() * 360,
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: 'easeIn',
            }}
            style={{
              position: 'absolute',
              left: `${piece.left}%`,
              top: -20,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.size > 7 ? 2 : '50%',
            }}
          />
        ))}
      </div>

      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 15 }}
        className="relative mb-6"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime shadow-[0_0_40px_rgba(200,255,0,0.4)]">
          <Check className="h-10 w-10 text-black" strokeWidth={3} />
        </div>
        {/* Pulse ring */}
        <motion.div
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.2, repeat: 2, repeatDelay: 0.3 }}
          className="absolute inset-0 rounded-full border-2 border-lime"
        />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-2xl font-bold tracking-tight text-neutral-900"
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-2 text-sm text-neutral-500"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Summary */}
      {summaryItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-6 w-full rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <div className="space-y-3">
            {summaryItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-neutral-900">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-8 flex w-full flex-col gap-3"
      >
        <button
          type="button"
          onClick={primaryAction.onClick}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-2xl bg-lime px-6 py-3.5 text-sm font-bold text-black',
            'shadow-[0_4px_24px_rgba(200,255,0,0.3)]',
            'transition-all duration-200',
            'hover:shadow-[0_8px_40px_rgba(200,255,0,0.4)]',
            'active:scale-[0.98]',
          )}
        >
          {primaryAction.label}
          <ArrowRight className="h-4 w-4" />
        </button>

        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-6 py-3.5 text-sm font-bold text-neutral-700 transition-all duration-200 hover:bg-neutral-50 active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" />
            {secondaryAction.label}
          </button>
        )}
      </motion.div>
    </div>
  );
};
