import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flag, UserPlus, Send } from "lucide-react";

export default function RefAssignor({ scheduleItems }) {
  const mockReferees = [
    { id: 1, name: 'John Smith', level: 'Level 3', games: 12, available: true },
    { id: 2, name: 'Sarah Johnson', level: 'Level 2', games: 8, available: true },
    { id: 3, name: 'Mike Williams', level: 'Level 3', games: 15, available: false },
    { id: 4, name: 'Emily Brown', level: 'Level 1', games: 5, available: true },
  ];

  const upcomingGames = scheduleItems
    .filter(item => item.type === 'game' && new Date(item.date) >= new Date())
    .slice(0, 8);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Games Needing Refs */}
      <div className="lg:col-span-2">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-yellow-400" />
              Games Needing Refs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingGames.map((game) => (
              <div key={game.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col md:flex-row justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-white mb-2">{game.title}</p>
                    <div className="text-sm text-gray-400">
                      <span>{new Date(game.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{game.time || 'TBD'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select>
                      <SelectTrigger className="w-48 bg-white/5 border-white/10">
                        <SelectValue placeholder="Assign referee..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        {mockReferees.filter(r => r.available).map(ref => (
                          <SelectItem key={ref.id} value={ref.id.toString()}>
                            {ref.name} ({ref.level})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="bg-[#D0FF00] text-[#0A0A0A]">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Referee Pool */}
      <div>
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Referee Pool</CardTitle>
              <Button size="sm" variant="outline" className="border-white/10">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Ref
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockReferees.map((ref) => (
              <div key={ref.id} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{ref.name}</p>
                  <span className={`w-2 h-2 rounded-full ${ref.available ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{ref.level}</span>
                  <span className="text-gray-400">{ref.games} games</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}