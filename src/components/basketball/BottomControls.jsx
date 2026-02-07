import { Clock, Users, Settings, Undo2 } from 'lucide-react';

export default function BottomControls({ onTimeout, onSubstitution, onSettings, onUndo, canUndo }) {
  const controls = [
    { icon: Clock, label: 'Timeout', onClick: onTimeout },
    { icon: Users, label: 'Sub', onClick: onSubstitution },
    { icon: Settings, label: 'Game', onClick: onSettings },
    { icon: Undo2, label: 'Undo', onClick: onUndo, disabled: !canUndo }
  ];

  return (
    <div 
      className="px-6 py-4"
      style={{
        background: '#e0e0e0',
        boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
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
              boxShadow: control.disabled ? 'none' : '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
              border: 'none',
              minHeight: '96px'
            }}
            onMouseDown={(e) => {
              if (!control.disabled) {
                e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)';
              }
            }}
            onMouseUp={(e) => {
              if (!control.disabled) {
                e.currentTarget.style.boxShadow = '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)';
              }
            }}
            onMouseLeave={(e) => {
              if (!control.disabled) {
                e.currentTarget.style.boxShadow = '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)';
              }
            }}
          >
            <control.icon className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">{control.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}