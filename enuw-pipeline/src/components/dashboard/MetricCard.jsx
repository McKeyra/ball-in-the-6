import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function MetricCard({ title, value, icon: Icon, trend, trendValue, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-emerald-500/10 text-emerald-500",
    purple: "bg-violet-500/10 text-violet-500",
    orange: "bg-orange-500/10 text-orange-500",
    red: "bg-red-500/10 text-red-500"
  };

  const isPositive = trend === "up";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-300">
        <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-20 ${colorClasses[color].split(' ')[0]}`} />
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">{title}</p>
              <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
              {Icon && <Icon className="w-5 h-5" />}
            </div>
          </div>
          
          {trendValue && (
            <div className="flex items-center mt-4 text-sm">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
              )}
              <span className={isPositive ? "text-emerald-500" : "text-red-500"}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}