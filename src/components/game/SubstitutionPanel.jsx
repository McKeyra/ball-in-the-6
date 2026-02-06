import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SubstitutionPanel({ game, homePlayers, awayPlayers, onClose }) {
  const queryClient = useQueryClient();
  const [homeOnCourt, setHomeOnCourt] = useState(game.onCourtHome || []);
  const [awayOnCourt, setAwayOnCourt] = useState(game.onCourtAway || []);
  const [error, setError] = useState(null);

  const updateLineupMutation = useMutation({
    mutationFn: async () => {
      if (homeOnCourt.length !== 5) {
        throw new Error("Home team must have exactly 5 players on court");
      }
      if (awayOnCourt.length !== 5) {
        throw new Error("Away team must have exactly 5 players on court");
      }

      await base44.entities.Game.update(game.id, {
        onCourtHome: homeOnCourt,
        onCourtAway: awayOnCourt
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['game', game.id]);
      setError(null);
      onClose();
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  const togglePlayer = (playerId, isHome) => {
    if (isHome) {
      if (homeOnCourt.includes(playerId)) {
        setHomeOnCourt(homeOnCourt.filter(id => id !== playerId));
      } else if (homeOnCourt.length < 5) {
        setHomeOnCourt([...homeOnCourt, playerId]);
      }
    } else {
      if (awayOnCourt.includes(playerId)) {
        setAwayOnCourt(awayOnCourt.filter(id => id !== playerId));
      } else if (awayOnCourt.length < 5) {
        setAwayOnCourt([...awayOnCourt, playerId]);
      }
    }
    setError(null);
  };

  return (
    <Card className="shadow-lg border-0 rounded-2xl mb-6 bg-white">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50">
        <CardTitle className="text-slate-900">Substitutions - Select 5 per team</CardTitle>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="text-slate-600 hover:bg-slate-200 rounded-xl"
        >
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-6 rounded-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-6">
          {/* Home Team */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Home Team</h3>
              <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {homeOnCourt.length}/5 selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {homePlayers.map(player => {
                const isOnCourt = homeOnCourt.includes(player.id);
                return (
                  <button
                    key={player.id}
                    onClick={() => togglePlayer(player.id, true)}
                    className={`p-4 rounded-xl transition-all border-2 ${
                      isOnCourt
                        ? 'bg-green-500 text-white border-green-600 shadow-lg scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-2xl font-black mb-1">#{player.number}</div>
                    <div className="text-sm font-medium">{player.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Away Team */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Away Team</h3>
              <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {awayOnCourt.length}/5 selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {awayPlayers.map(player => {
                const isOnCourt = awayOnCourt.includes(player.id);
                return (
                  <button
                    key={player.id}
                    onClick={() => togglePlayer(player.id, false)}
                    className={`p-4 rounded-xl transition-all border-2 ${
                      isOnCourt
                        ? 'bg-green-500 text-white border-green-600 shadow-lg scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-2xl font-black mb-1">#{player.number}</div>
                    <div className="text-sm font-medium">{player.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={() => updateLineupMutation.mutate()}
            disabled={updateLineupMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md"
          >
            {updateLineupMutation.isPending ? "Saving..." : "Save Lineup"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}