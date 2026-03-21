'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue>({
  open: false,
  setOpen: () => {},
});

export function Popover({ children }: { children: React.ReactNode }): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({
  children,
  asChild,
  className,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}): React.ReactElement {
  const { open, setOpen } = React.useContext(PopoverContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      onClick: () => setOpen(!open),
    });
  }
  return (
    <button onClick={() => setOpen(!open)} className={className}>
      {children}
    </button>
  );
}

export function PopoverContent({
  children,
  className,
  align = 'center',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}): React.ReactElement | null {
  const { open, setOpen } = React.useContext(PopoverContext);
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div
        className={cn(
          'absolute z-50 mt-2 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
          align === 'start' && 'left-0',
          align === 'center' && 'left-1/2 -translate-x-1/2',
          align === 'end' && 'right-0',
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
