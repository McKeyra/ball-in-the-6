'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value = [0], onValueChange, min = 0, max = 100, step = 1, disabled = false, ...props }, ref) => {
    const percentage = ((value[0] - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const newValue = Number(e.target.value);
      onValueChange?.([newValue]);
    };

    return (
      <div ref={ref} className={cn('relative flex w-full touch-none select-none items-center', className)} {...props}>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="absolute h-full bg-red-600 rounded-full" style={{ width: `${percentage}%` }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label="Slider"
        />
      </div>
    );
  },
);
Slider.displayName = 'Slider';

export { Slider };
