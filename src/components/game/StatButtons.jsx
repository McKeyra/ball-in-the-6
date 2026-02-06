import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StatButtons({ player, onRecordEvent }) {
  const statCategories = [
    {
      title: "Scoring",
      actions: [
        { label: "2PT Make", type: "shot_2pt_make", color: "bg-green-600 hover:bg-green-700" },
        { label: "2PT Miss", type: "shot_2pt_miss", color: "bg-red-600 hover:bg-red-700" },
        { label: "3PT Make", type: "shot_3pt_make", color: "bg-green-600 hover:bg-green-700" },
        { label: "3PT Miss", type: "shot_3pt_miss", color: "bg-red-600 hover:bg-red-700" },
        { label: "FT Make", type: "free_throw_make", color: "bg-green-500 hover:bg-green-600" },
        { label: "FT Miss", type: "free_throw_miss", color: "bg-red-500 hover:bg-red-600" }
      ]
    },
    {
      title: "Rebounding",
      actions: [
        { label: "Off Rebound", type: "rebound_off", color: "bg-blue-600 hover:bg-blue-700" },
        { label: "Def Rebound", type: "rebound_def", color: "bg-blue-500 hover:bg-blue-600" }
      ]
    },
    {
      title: "Other Stats",
      actions: [
        { label: "Assist", type: "assist", color: "bg-purple-600 hover:bg-purple-700" },
        { label: "Steal", type: "steal", color: "bg-indigo-600 hover:bg-indigo-700" },
        { label: "Block", type: "block", color: "bg-cyan-600 hover:bg-cyan-700" },
        { label: "Turnover", type: "turnover", color: "bg-orange-600 hover:bg-orange-700" }
      ]
    },
    {
      title: "Fouls",
      actions: [
        { label: "Personal Foul", type: "foul_personal", color: "bg-yellow-600 hover:bg-yellow-700" },
        { label: "Technical", type: "foul_technical", color: "bg-red-700 hover:bg-red-800" },
        { label: "Unsportsmanlike", type: "foul_unsportsmanlike", color: "bg-red-800 hover:bg-red-900" }
      ]
    }
  ];

  return (
    <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700 p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-white">
          Recording for: <span className="text-green-400">#{player.number} {player.name}</span>
        </h3>
      </div>

      <div className="space-y-6">
        {statCategories.map(category => (
          <div key={category.title}>
            <h4 className="text-lg font-semibold text-white/80 mb-3">{category.title}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {category.actions.map(action => (
                <Button
                  key={action.type}
                  onClick={() => onRecordEvent(action.type)}
                  className={`${action.color} text-white text-sm font-bold py-6 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95`}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}