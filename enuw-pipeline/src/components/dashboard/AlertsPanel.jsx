import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Zap, Target, X, Bell, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const alertTypeConfig = {
  "Warning": { icon: AlertCircle, bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  "Action Required": { icon: Zap, bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  "Opportunity": { icon: Target, bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  "Info": { icon: Info, bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" }
};

export default function AlertsPanel() {
  const queryClient = useQueryClient();

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const allAlerts = await base44.entities.Alert.filter({ is_read: false });
      return allAlerts.sort((a, b) => {
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId) => {
      return base44.entities.Alert.update(alertId, { is_read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    }
  });

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-white text-sm">Alerts</h3>
          {alerts.length > 0 && (
            <Badge className="bg-red-500/20 text-red-400 text-xs">{alerts.length}</Badge>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No new alerts</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert, index) => {
            const config = alertTypeConfig[alert.alert_type] || alertTypeConfig["Info"];
            const Icon = config.icon;
            
            const alertContent = (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-start gap-3 p-3 rounded-lg border ${config.border} ${config.bg} group hover:scale-[1.02] transition-transform relative`}
              >
                <Icon className={`w-4 h-4 ${config.text} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 mb-1">{alert.title}</p>
                  <p className="text-sm ${config.text}">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{getTimeAgo(alert.created_date)}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    markAsReadMutation.mutate(alert.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </motion.div>
            );

            return alert.related_lead_id ? (
              <Link key={alert.id} to={createPageUrl("LeadDetail") + `?id=${alert.related_lead_id}`}>
                {alertContent}
              </Link>
            ) : (
              <div key={alert.id}>{alertContent}</div>
            );
          })}
        </div>
      )}
    </Card>
  );
}