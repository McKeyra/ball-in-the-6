import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Undo2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";

export default function EventLog({ events, players, gameId }) {
  const queryClient = useQueryClient();

  const undoEventMutation = useMutation({
    mutationFn: async (event) => {
      await base44.entities.GameEvent.delete(event.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events', gameId]);
      queryClient.invalidateQueries(['stats', gameId]);
      queryClient.invalidateQueries(['game', gameId]);
    }
  });

  const getEventLabel = (eventType) => {
    const labels = {
      "shot_2pt_make": "2PT ✓",
      "shot_2pt_miss": "2PT ✗",
      "shot_3pt_make": "3PT ✓",
      "shot_3pt_miss": "3PT ✗",
      "free_throw_make": "FT ✓",
      "free_throw_miss": "FT ✗",
      "rebound_off": "Off Reb",
      "rebound_def": "Def Reb",
      "assist": "Assist",
      "steal": "Steal",
      "block": "Block",
      "turnover": "Turnover",
      "foul_personal": "Personal Foul",
      "foul_technical": "Technical",
      "foul_unsportsmanlike": "Unsportsmanlike"
    };
    return labels[eventType] || eventType;
  };

  const getEventColor = (eventType) => {
    if (eventType.includes("make")) return "bg-green-100 text-green-800";
    if (eventType.includes("miss")) return "bg-red-100 text-red-800";
    if (eventType.includes("foul")) return "bg-yellow-100 text-yellow-800";
    if (eventType.includes("rebound")) return "bg-blue-100 text-blue-800";
    return "bg-purple-100 text-purple-800";
  };

  return (
    <Card className="shadow-lg border-0 rounded-2xl h-full bg-white">
      <CardHeader className="border-b bg-slate-50">
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Undo2 className="w-5 h-5" />
          Recent Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-slate-400 text-center py-12 text-sm">No events recorded yet</p>
          ) : (
            events.map(event => {
              const player = players.find(p => p.id === event.playerId);
              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">
                        #{player?.number} {player?.name}
                      </span>
                    </div>
                    <Badge className={`${getEventColor(event.eventType)} border-0 text-xs font-semibold`}>
                      {getEventLabel(event.eventType)}
                    </Badge>
                    <div className="text-xs text-slate-500 mt-2">
                      {event.quarter} • {Math.floor(event.gameClock / 60)}:{(event.gameClock % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => undoEventMutation.mutate(event)}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}