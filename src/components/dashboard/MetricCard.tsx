'use client';

import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

type ColorKey = 'blue' | 'green' | 'purple' | 'orange' | 'red';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: ColorKey;
}

const COLOR_CLASSES: Record<ColorKey, string> = {
  blue: 'bg-blue-500/10 text-blue-500',
  green: 'bg-emerald-500/10 text-emerald-500',
  purple: 'bg-violet-500/10 text-violet-500',
  orange: 'bg-orange-500/10 text-orange-500',
  red: 'bg-red-500/10 text-red-500',
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
}: MetricCardProps) {
  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden bg-white/[0.07] border border-white/[0.06] rounded-[20px] backdrop-blur-sm hover:bg-white/[0.09] transition-all duration-300">
        <div
          className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-20 ${COLOR_CLASSES[color].split(' ')[0]}`}
        />

        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white/60">{title}</p>
              <p className="text-3xl font-bold text-white tracking-tight">
                {value}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${COLOR_CLASSES[color]}`}>
              {Icon && <Icon className="w-5 h-5" />}
            </div>
          </div>

          {trendValue && (
            <div className="flex items-center mt-4 text-sm">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
              )}
              <span
                className={
                  isPositive ? 'text-emerald-500' : 'text-red-500'
                }
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
