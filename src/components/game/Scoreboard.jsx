import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Clock, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Scoreboard({ game, homeTeam, awayTeam }) {
  const [displayClock, setDisplayClock] = useState(game.gameClock);

  useEffect(() => {
    setDisplayClock(game.gameClock);
  }, [game.gameClock]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-6 items-center">
          {/* Home Team */}
          <Card 
            className="p-6 text-center border-0 rounded-2xl shadow-lg"
            style={{
              background: homeTeam ? `linear-gradient(135deg, ${homeTeam.gradientStart}, ${homeTeam.gradientEnd})` : '#6B7280'
            }}
          >
            <h2 className="text-xl font-bold text-white mb-3 tracking-tight">{homeTeam?.name || "Home"}</h2>
            <div className="text-7xl font-black text-white mb-2">{game.homeScore}</div>
            {game.homeBonusActive && (
              <Badge className="bg-white/20 text-white border-white/40 backdrop-blur-sm mt-2">
                BONUS
              </Badge>
            )}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: game.homeTimeouts }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-white/80" />
              ))}
            </div>
          </Card>

          {/* Clock & Quarter */}
          <div className="text-center">
            <Card className="bg-slate-50 border-slate-200 rounded-2xl shadow-lg p-6">
              <Badge className="bg-slate-800 text-white text-sm mb-3">
                {game.quarter}
              </Badge>
              <div className="text-6xl font-black text-slate-900 mb-4 tracking-tight">
                {formatTime(displayClock)}
              </div>
              <div className="flex items-center justify-center gap-3 text-orange-600 mb-3">
                <Clock className="w-6 h-6" />
                <span className="text-3xl font-bold">{game.shotClock}s</span>
              </div>
              <div className="text-sm text-slate-600 border-t pt-3">
                <div className="font-medium">Team Fouls</div>
                <div className="text-lg font-bold text-slate-800">
                  {game.homeTeamFouls} - {game.awayTeamFouls}
                </div>
              </div>
            </Card>
          </div>

          {/* Away Team */}
          <Card 
            className="p-6 text-center border-0 rounded-2xl shadow-lg"
            style={{
              background: awayTeam ? `linear-gradient(135deg, ${awayTeam.gradientStart}, ${awayTeam.gradientEnd})` : '#6B7280'
            }}
          >
            <h2 className="text-xl font-bold text-white mb-3 tracking-tight">{awayTeam?.name || "Away"}</h2>
            <div className="text-7xl font-black text-white mb-2">{game.awayScore}</div>
            {game.awayBonusActive && (
              <Badge className="bg-white/20 text-white border-white/40 backdrop-blur-sm mt-2">
                BONUS
              </Badge>
            )}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: game.awayTimeouts }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-white/80" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}