import { Card } from "@/components/ui/card";
import { Trophy, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function GameScoreCard({ game, team }) {
  const won = game.our_score > game.opponent_score;
  const tied = game.our_score === game.opponent_score;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${
          won ? 'from-green-500 to-emerald-500' : 
          tied ? 'from-yellow-500 to-orange-500' : 
          'from-red-500 to-pink-500'
        }`} />
        
        <div className="p-6">
          {/* Game Result Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              won ? 'bg-green-500/20 text-green-400' :
              tied ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {won ? '🏆 VICTORY' : tied ? '⚖️ TIE' : '❌ LOSS'}
            </div>
            <p className="text-xs text-gray-400">
              {format(new Date(game.date), 'MMM d, yyyy')}
            </p>
          </div>

          {/* Score Display */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-400 mb-2">{team?.name || 'Our Team'}</p>
              <p className={`text-5xl font-bold ${won ? 'text-[#D0FF00]' : 'text-white'}`}>
                {game.our_score}
              </p>
            </div>

            <div className="px-6">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-gray-400" />
              </div>
            </div>

            <div className="flex-1 text-center">
              <p className="text-sm text-gray-400 mb-2">Opponent</p>
              <p className={`text-5xl font-bold ${!won && !tied ? 'text-red-400' : 'text-white'}`}>
                {game.opponent_score}
              </p>
            </div>
          </div>

          {/* Venue */}
          {game.venue_id && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Venue details</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}