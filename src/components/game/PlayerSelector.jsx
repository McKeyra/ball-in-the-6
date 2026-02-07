import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PlayerSelector({ players, team, stats, onSelectPlayer, onCourt }) {
  const getPlayerStats = (playerId) => {
    return stats.find(s => s.playerId === playerId) || {};
  };

  return (
    <Card 
      className="shadow-lg border-0 rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(to right, ${team?.gradientStart || '#6B7280'}10, white)`
      }}
    >
      <div 
        className="px-6 py-4 border-b"
        style={{
          background: `linear-gradient(135deg, ${team?.gradientStart || '#6B7280'}20, transparent)`
        }}
      >
        <h3 className="text-2xl font-bold text-slate-900">{team?.name || "Team"}</h3>
        <p className="text-sm text-slate-600">Tap a player to record stats</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {players.map(player => {
            const playerStats = getPlayerStats(player.id);
            const isOnCourt = onCourt.includes(player.id);

            return (
              <button
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="group relative p-5 rounded-2xl text-center transition-all hover:scale-105 hover:shadow-xl bg-white border-2 border-slate-200 hover:border-slate-300"
              >
                {isOnCourt && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div 
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${team?.gradientStart}, ${team?.gradientEnd})`
                  }}
                >
                  {player.number}
                </div>
                
                <div className="text-sm font-semibold text-slate-900 mb-1">{player.name}</div>
                
                <Badge 
                  variant="secondary" 
                  className="bg-slate-100 text-slate-700 font-bold text-sm"
                >
                  {playerStats.points || 0} PTS
                </Badge>
                
                <div className="text-xs text-slate-500 mt-2">
                  {playerStats.fgm || 0}/{playerStats.fga || 0} FG • {playerStats.ast || 0} AST
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}