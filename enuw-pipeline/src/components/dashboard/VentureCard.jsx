import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const ventureIcons = {
  "Vance": "🎰",
  "Ball_in_the_6": "🏀",
  "Wear_US": "👔",
  "enuwWEB": "🌐"
};

const ventureColors = {
  "Vance": { bg: "bg-violet-500/10", border: "border-violet-500/30", accent: "text-violet-400" },
  "Ball_in_the_6": { bg: "bg-orange-500/10", border: "border-orange-500/30", accent: "text-orange-400" },
  "Wear_US": { bg: "bg-emerald-500/10", border: "border-emerald-500/30", accent: "text-emerald-400" },
  "enuwWEB": { bg: "bg-blue-500/10", border: "border-blue-500/30", accent: "text-blue-400" }
};

export default function VentureCard({ venture, vitality, pipeline, deals, winRate, index }) {
  const colors = ventureColors[venture] || ventureColors["enuwWEB"];
  
  const getVitalityColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getVitalityStatus = (score) => {
    if (score >= 80) return "Healthy";
    if (score >= 60) return "Stable";
    return "Needs Attention";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className={`relative overflow-hidden bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-300 group ${colors.border}`}>
        <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        <div className="relative p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{ventureIcons[venture]}</span>
              <div>
                <h3 className={`font-semibold ${colors.accent}`}>{venture.replace(/_/g, ' ')}</h3>
                <p className={`text-xs ${getVitalityColor(vitality)}`}>
                  {getVitalityStatus(vitality)}
                </p>
              </div>
            </div>
            <div className={`text-2xl font-bold ${getVitalityColor(vitality)}`}>
              {vitality}
            </div>
          </div>

          {/* Vitality Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                vitality >= 80 ? "bg-emerald-500" : 
                vitality >= 60 ? "bg-amber-500" : "bg-red-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${vitality}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            />
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <p className="text-xs text-slate-500">Pipeline</p>
              <p className="text-sm font-semibold text-white">{pipeline}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Deals</p>
              <p className="text-sm font-semibold text-white">{deals}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Win Rate</p>
              <p className="text-sm font-semibold text-white">{winRate}%</p>
            </div>
          </div>

          {/* Action */}
          <Link to={createPageUrl(`Venture?name=${venture}`)}>
            <Button variant="ghost" className="w-full mt-2 text-slate-400 hover:text-white hover:bg-slate-800">
              View Details <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}