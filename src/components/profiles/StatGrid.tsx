'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

interface StatGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  accentText?: string;
  accentBg?: string;
  accentBorder?: string;
}

const AnimatedValue: React.FC<{
  value: number | string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}> = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (typeof value === 'string') {
      setDisplayValue(value);
      return;
    }

    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const target = value;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (decimals > 0) {
        setDisplayValue(current.toFixed(decimals));
      } else {
        setDisplayValue(Math.round(current).toLocaleString());
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, decimals]);

  return (
    <span ref={ref} className="font-mono text-2xl font-black tracking-tighter text-neutral-900">
      {prefix}{displayValue}{suffix}
    </span>
  );
};

export const StatGrid: React.FC<StatGridProps> = ({
  stats,
  columns = 3,
  accentText = 'text-neutral-500',
  accentBg = 'bg-neutral-50',
  accentBorder = 'border-neutral-200',
}) => {
  const gridCols =
    columns === 2
      ? 'grid-cols-2'
      : columns === 4
        ? 'grid-cols-2 sm:grid-cols-4'
        : 'grid-cols-3';

  return (
    <div className={cn('grid gap-2', gridCols)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            className={cn(
              'rounded-[20px] border p-4 text-center',
              accentBorder,
              accentBg
            )}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.1 * index,
              duration: 0.4,
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
          >
            {Icon && (
              <div className="flex justify-center mb-1.5">
                <Icon className={cn('h-4 w-4', accentText)} />
              </div>
            )}
            <AnimatedValue
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              decimals={stat.decimals}
            />
            <p className="mt-1 text-[8px] font-mono uppercase tracking-widest text-neutral-500">
              {stat.label}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};
