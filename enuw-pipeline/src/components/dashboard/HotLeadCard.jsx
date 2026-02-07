import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, ArrowRight, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { VENTURE_COLORS, formatCurrency } from "../scoring/scoringUtils";

export default function HotLeadCard({ lead, score, index }) {
  const ventureColor = VENTURE_COLORS[lead?.venture] || "#3B82F6";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-red-500/30 transition-all duration-300 overflow-hidden">
        <div className="flex">
          {/* Left accent */}
          <div className="w-1 bg-gradient-to-b from-red-500 to-orange-500" />
          
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-500" />
                  <h4 className="font-semibold text-white truncate">{lead?.company_name}</h4>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400">{lead?.city}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">{lead?.industry}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs border-slate-700"
                    style={{ color: ventureColor, borderColor: ventureColor + '40' }}
                  >
                    {lead?.venture?.replace(/_/g, ' ')}
                  </Badge>
                  <span className="text-xs text-emerald-400">
                    {formatCurrency(score?.projected_mrr_target || 175)}/mo
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-red-400">
                  {score?.overall_score || 90}
                </div>
                <div className="text-xs text-slate-500">Score</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-slate-700 hover:bg-slate-800 hover:text-white">
                <Phone className="w-3 h-3 mr-1" /> Call
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-slate-700 hover:bg-slate-800 hover:text-white">
                <Mail className="w-3 h-3 mr-1" /> Email
              </Button>
              <Link to={createPageUrl(`LeadDetail?id=${lead?.id}`)}>
                <Button size="sm" className="h-8 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border-0">
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}