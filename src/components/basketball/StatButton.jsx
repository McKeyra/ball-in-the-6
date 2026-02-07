import { Plus } from 'lucide-react';

export default function StatButton({ label, value, onIncrement, color, variant, icon }) {
  const isMake = variant === 'make';
  const isMiss = variant === 'miss';

  return (
    <button
      onClick={onIncrement}
      className="relative flex flex-col items-center justify-center py-6 rounded-2xl transition-all"
      style={{
        background: isMake && color ? `linear-gradient(135deg, ${color}20, ${color}40)` : 
                    isMiss ? '#f5f5f5' : '#e0e0e0',
        boxShadow: isMiss ? 
          'inset 4px 4px 8px rgba(0,0,0,0.08), inset -4px -4px 8px rgba(255,255,255,0.5)' :
          '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
        border: 'none',
        minHeight: '96px'
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.boxShadow = 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.boxShadow = isMiss ? 
          'inset 4px 4px 8px rgba(0,0,0,0.08), inset -4px -4px 8px rgba(255,255,255,0.5)' :
          '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = isMiss ? 
          'inset 4px 4px 8px rgba(0,0,0,0.08), inset -4px -4px 8px rgba(255,255,255,0.5)' :
          '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)';
      }}
    >
      {value > 0 && (
        <div 
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{
            background: isMake && color ? color : '#666',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {value}
        </div>
      )}

      {icon && <div className="text-3xl mb-2">{icon}</div>}
      
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4 text-gray-600" />
        <span className="text-base font-semibold text-gray-700">{label}</span>
      </div>
    </button>
  );
}