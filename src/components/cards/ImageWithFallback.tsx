'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className }) => {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div className={cn('flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900', className)}>
        <Zap className="h-10 w-10 text-neutral-400" />
      </div>
    );
  }

  return (
    <img src={src} alt={alt} onError={() => setFailed(true)} className={cn('h-full w-full object-cover', className)} />
  );
};
