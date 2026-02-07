
import { ArrowLeftRight, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export default function SubstitutionConfirmDialog({ 
  playerOut, 
  playerIn, 
  teamColor,
  onConfirm, 
  onCancel 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
        className="w-full max-w-md rounded-3xl p-8 mt-8"
        style={{
          background: '#e0e0e0',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Confirm Substitution</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            style={{
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
              background: '#e0e0e0'
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Player Out */}
          <div>
            <div className="text-sm font-semibold text-gray-500 mb-3">Coming Out</div>
            <div 
              className="p-4 rounded-2xl flex items-center gap-4"
              style={{
                background: '#e0e0e0',
                boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
              }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold"
                style={{
                  background: teamColor,
                  color: 'white',
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {playerOut.jersey_number}
              </div>
              <div>
                <div className="font-bold text-gray-700 text-lg">{playerOut.name}</div>
                <div className="text-sm text-gray-500">{playerOut.position}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {playerOut.points}p • {playerOut.rebounds_off + playerOut.rebounds_def}r • {playerOut.assists}a
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div 
              className="p-4 rounded-full"
              style={{
                boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
              }}
            >
              <ArrowLeftRight className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          {/* Player In */}
          <div>
            <div className="text-sm font-semibold text-gray-500 mb-3">Coming In</div>
            <div 
              className="p-4 rounded-2xl flex items-center gap-4"
              style={{
                background: `${teamColor}20`,
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
              }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold"
                style={{
                  background: teamColor,
                  color: 'white',
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {playerIn.jersey_number}
              </div>
              <div>
                <div className="font-bold text-gray-700 text-lg">{playerIn.name}</div>
                <div className="text-sm text-gray-500">{playerIn.position}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {playerIn.points}p • {playerIn.rebounds_off + playerIn.rebounds_def}r • {playerIn.assists}a
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="h-14 text-base"
              style={{
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                background: '#e0e0e0',
                border: 'none'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="h-14 text-base font-bold"
              style={{
                background: teamColor,
                color: 'white',
                boxShadow: '6px 6px 12px rgba(0,0,0,0.2)',
                border: 'none'
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
