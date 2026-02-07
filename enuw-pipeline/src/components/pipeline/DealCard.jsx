import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { VENTURE_COLORS, formatCurrency } from "../scoring/scoringUtils";

export default function DealCard({ deal, onClick }) {
  const ventureColor = VENTURE_COLORS[deal?.venture] || "#3B82F6";

  const ventureIcons = {
    "Vance": "🎰",
    "Ball_in_the_6": "🏀",
    "Wear_US": "👔",
    "enuwWEB": "🌐"
  };

  return (
    <Card 
      className="bg-slate-900/50 border-slate-800 hover:border-slate-700 cursor-pointer transition-all duration-200 group overflow-hidden"
      onClick={() => onClick?.(deal)}
    >
      <div className="flex">
        <div 
          className="w-1"
          style={{ backgroundColor: ventureColor }}
        />
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                {deal?.deal_name}
              </h4>
            </div>
            <span className="text-lg">{ventureIcons[deal?.venture]}</span>
          </div>

          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            {formatCurrency(deal?.deal_value || 0)}
          </div>

          <div className="flex items-center justify-between">
            <Badge 
              variant="outline"
              className="text-xs border-slate-700"
              style={{ color: ventureColor, borderColor: ventureColor + '40' }}
            >
              {deal?.venture?.replace(/_/g, ' ')}
            </Badge>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <span className="text-blue-400 font-medium">{deal?.probability || 0}%</span>
            </span>
          </div>

          {deal?.expected_close_date && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              {format(new Date(deal.expected_close_date), "MMM d")}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}