import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle, Users, Plus, Minus, Target, TrendingUp, Shield, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlayerStatsModal({ 
  player, 
  playerStat, 
  game, 
  homeTeam, 
  awayTeam,
  onClose, 
  onRecordStat,
  onAssignFoul,
  onSubstitute 
}) {
  const [statUpdates, setStatUpdates] = useState({});

  const incrementStat = (statType, amount = 1) => {
    const newUpdates = { ...statUpdates };
    newUpdates[statType] = (newUpdates[statType] || 0) + amount;
    setStatUpdates(newUpdates);
    onRecordStat(statType, amount);
  };

  const getCurrentValue = (statKey) => {
    return (playerStat?.[statKey] || 0) + (statUpdates[statKey] || 0);
  };

  const isHomeTeam = player.teamId === game.homeTeamId;
  const playerTeam = isHomeTeam ? homeTeam : awayTeam;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-4 md:inset-8 lg:inset-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header with Score */}
          <div 
            className="relative px-6 py-8 text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${playerTeam?.gradientStart || '#6366F1'}, ${playerTeam?.gradientEnd || '#8B5CF6'})`
            }}
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Game Score */}
            <div className="text-center mb-6">
              <div className="text-sm font-medium text-white/80 mb-2">Current Score</div>
              <div className="text-4xl font-black tracking-tight">
                {homeTeam?.name} {game.homeScore} - {game.awayScore} {awayTeam?.name}
              </div>
            </div>

            {/* Player Info */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                <span className="text-4xl font-black">{player.number}</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold">{player.name}</h2>
                <p className="text-white/80 text-lg">{player.position || "Player"}</p>
                <Badge className="mt-1 bg-white/20 text-white border-white/30">
                  {getCurrentValue('points')} Points
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={onAssignFoul}
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-sm rounded-full px-6 font-semibold shadow-lg"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Assign Foul ({getCurrentValue('pf')})
              </Button>
              <Button
                onClick={onSubstitute}
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-sm rounded-full px-6 font-semibold shadow-lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Substitute
              </Button>
            </div>
          </div>

          {/* Scrollable Stats Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Offensive Stats Section */}
            <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Target className="w-6 h-6" />
                  Offensive Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Free Throws */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-slate-700 text-lg">Free Throws</span>
                    <Badge variant="outline" className="text-base">
                      {getCurrentValue('ftm')}/{getCurrentValue('fta')}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        incrementStat('ftm', 1);
                        incrementStat('fta', 1);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-6 text-base font-bold shadow-md"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Make
                    </Button>
                    <Button
                      onClick={() => incrementStat('fta', 1)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-6 text-base font-bold shadow-md"
                    >
                      <Minus className="w-5 h-5 mr-2" />
                      Miss
                    </Button>
                  </div>
                </div>

                {/* Two Points */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-slate-700 text-lg">Two Points (2PT)</span>
                    <Badge variant="outline" className="text-base">
                      {getCurrentValue('fgm') - getCurrentValue('fgm3')}/{getCurrentValue('fga') - getCurrentValue('fga3')}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        incrementStat('fgm', 1);
                        incrementStat('fga', 1);
                        incrementStat('points', 2);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-6 text-base font-bold shadow-md"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Make
                    </Button>
                    <Button
                      onClick={() => incrementStat('fga', 1)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-6 text-base font-bold shadow-md"
                    >
                      <Minus className="w-5 h-5 mr-2" />
                      Miss
                    </Button>
                  </div>
                </div>

                {/* Three Points */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-slate-700 text-lg">Three Points (3PT)</span>
                    <Badge variant="outline" className="text-base">
                      {getCurrentValue('fgm3')}/{getCurrentValue('fga3')}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        incrementStat('fgm', 1);
                        incrementStat('fga', 1);
                        incrementStat('fgm3', 1);
                        incrementStat('fga3', 1);
                        incrementStat('points', 3);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-6 text-base font-bold shadow-md"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Make
                    </Button>
                    <Button
                      onClick={() => {
                        incrementStat('fga', 1);
                        incrementStat('fga3', 1);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-6 text-base font-bold shadow-md"
                    >
                      <Minus className="w-5 h-5 mr-2" />
                      Miss
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assists & Rebounds Section */}
            <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <TrendingUp className="w-6 h-6" />
                  Assists & Rebounds
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCounter
                    label="Assists"
                    value={getCurrentValue('ast')}
                    onIncrement={() => incrementStat('ast', 1)}
                    color="blue"
                  />
                  <StatCounter
                    label="Off Rebounds"
                    value={getCurrentValue('oreb')}
                    onIncrement={() => incrementStat('oreb', 1)}
                    color="purple"
                  />
                  <StatCounter
                    label="Def Rebounds"
                    value={getCurrentValue('dreb')}
                    onIncrement={() => incrementStat('dreb', 1)}
                    color="indigo"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Defensive Stats Section */}
            <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Shield className="w-6 h-6" />
                  Defensive & Other Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCounter
                    label="Steals"
                    value={getCurrentValue('stl')}
                    onIncrement={() => incrementStat('stl', 1)}
                    color="green"
                  />
                  <StatCounter
                    label="Blocks"
                    value={getCurrentValue('blk')}
                    onIncrement={() => incrementStat('blk', 1)}
                    color="cyan"
                  />
                  <StatCounter
                    label="Turnovers"
                    value={getCurrentValue('tov')}
                    onIncrement={() => incrementStat('tov', 1)}
                    color="orange"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Fouls Summary */}
            <Card className="shadow-lg border-0 rounded-2xl overflow-hidden bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-yellow-700" />
                    <div>
                      <div className="text-sm text-slate-600">Total Fouls</div>
                      <div className="text-3xl font-black text-slate-900">
                        {getCurrentValue('pf')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <div>Technical: {getCurrentValue('tf')}</div>
                    <div>Unsportsmanlike: {getCurrentValue('uf')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function StatCounter({ label, value, onIncrement, color }) {
  const colorMap = {
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    green: "bg-green-600 hover:bg-green-700",
    cyan: "bg-cyan-600 hover:bg-cyan-700",
    orange: "bg-orange-600 hover:bg-orange-700"
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <div className="text-center mb-3">
        <div className="text-sm font-medium text-slate-600 mb-1">{label}</div>
        <div className="text-4xl font-black text-slate-900">{value}</div>
      </div>
      <Button
        onClick={onIncrement}
        className={`w-full ${colorMap[color]} text-white rounded-xl py-4 font-bold shadow-md`}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add
      </Button>
    </div>
  );
}