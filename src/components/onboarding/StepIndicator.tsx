'use client';

import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        const isFuture = stepNum > currentStep;

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              {/* Circle */}
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? '#C8FF00' : '#f5f5f5',
                  borderColor: isCompleted || isCurrent ? '#C8FF00' : '#e5e5e5',
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-full border-2',
                  isCurrent && 'shadow-[0_0_12px_rgba(200,255,0,0.4)]',
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, type: 'spring', stiffness: 400 }}
                  >
                    <Check className="h-4 w-4 text-black" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <span
                    className={cn(
                      'text-xs font-bold font-[family-name:var(--font-mono)]',
                      isCurrent ? 'text-black' : 'text-neutral-400',
                    )}
                  >
                    {stepNum}
                  </span>
                )}
              </motion.div>

              {/* Label */}
              <span
                className={cn(
                  'mt-1.5 max-w-[72px] text-center text-[10px] font-semibold leading-tight',
                  isCurrent ? 'text-neutral-900' : isCompleted ? 'text-neutral-500' : 'text-neutral-300',
                )}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="relative mx-1.5 mb-5 h-0.5 w-8 overflow-hidden rounded-full bg-neutral-100 sm:w-12">
                <motion.div
                  initial={false}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-y-0 left-0 rounded-full bg-lime"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
