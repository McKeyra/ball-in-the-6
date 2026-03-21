'use client';

import { type MouseEvent } from 'react';
import { Clock, Users, Settings, Undo2, type LucideIcon } from 'lucide-react';

interface ControlItem {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface BottomControlsProps {
  onTimeout: () => void;
  onSubstitution: () => void;
  onSettings: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

const NEUMORPHIC_SHADOW =
  '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)';
const PRESSED_SHADOW =
  'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)';

export function BottomControls({
  onTimeout,
  onSubstitution,
  onSettings,
  onUndo,
  canUndo,
}: BottomControlsProps): React.ReactElement {
  const controls: ControlItem[] = [
    { icon: Clock, label: 'Timeout', onClick: onTimeout },
    { icon: Users, label: 'Sub', onClick: onSubstitution },
    { icon: Settings, label: 'Game', onClick: onSettings },
    { icon: Undo2, label: 'Undo', onClick: onUndo, disabled: !canUndo },
  ];

  return (
    <div
      className="px-6 py-4"
      style={{
        background: '#e0e0e0',
        boxShadow:
          'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
      }}
    >
      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4">
        {controls.map((control, index) => (
          <button
            key={index}
            onClick={control.onClick}
            disabled={control.disabled}
            className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl transition-all disabled:opacity-40"
            style={{
              background: '#e0e0e0',
              boxShadow: control.disabled ? 'none' : NEUMORPHIC_SHADOW,
              border: 'none',
              minHeight: '96px',
            }}
            onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
              if (!control.disabled) {
                e.currentTarget.style.boxShadow = PRESSED_SHADOW;
              }
            }}
            onMouseUp={(e: MouseEvent<HTMLButtonElement>) => {
              if (!control.disabled) {
                e.currentTarget.style.boxShadow = NEUMORPHIC_SHADOW;
              }
            }}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
              if (!control.disabled) {
                e.currentTarget.style.boxShadow = NEUMORPHIC_SHADOW;
              }
            }}
          >
            <control.icon className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">
              {control.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
