import React from 'react';
import { Check, X } from 'lucide-react';

export default function FreeThrowTracker({ freeThrows, onChange, color }) {
  const addFreeThrow = (result) => {
    if (freeThrows.length < 3) {
      onChange([...freeThrows, result]);
    }
  };

  const removeLast = () => {
    onChange(freeThrows.slice(0, -1));
  };

  return (
    <div 
      className="p-4 rounded-2xl"
      style={{
        background: '#e0e0e0',
        boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Free Throws</span>
        {freeThrows.length > 0 && (
          <button
            onClick={removeLast}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Undo Last
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="flex-1 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: index < freeThrows.length ? 
                (freeThrows[index] === 'made' ? `${color}40` : '#f0f0f0') :
                '#f8f8f8',
              boxShadow: index < freeThrows.length ?
                'inset 2px 2px 4px rgba(0,0,0,0.08)' :
                '2px 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            {index < freeThrows.length && (
              freeThrows[index] === 'made' ? (
                <Check className="w-5 h-5" style={{ color }} />
              ) : (
                <X className="w-5 h-5 text-gray-400" />
              )
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => addFreeThrow('made')}
          disabled={freeThrows.length >= 3}
          className="py-3 rounded-xl text-sm font-semibold disabled:opacity-40"
          style={{
            background: color,
            color: 'white',
            boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -2px -2px 4px rgba(255,255,255,0.3)',
            border: 'none'
          }}
        >
          Made
        </button>
        <button
          onClick={() => addFreeThrow('missed')}
          disabled={freeThrows.length >= 3}
          className="py-3 rounded-xl text-sm font-semibold text-gray-700 disabled:opacity-40"
          style={{
            background: '#e0e0e0',
            boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
            border: 'none'
          }}
        >
          Missed
        </button>
      </div>
    </div>
  );
}