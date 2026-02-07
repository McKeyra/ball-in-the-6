import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, Calendar, FileText, CheckSquare, Clock } from "lucide-react";
import { format } from "date-fns";

const activityIcons = {
  Call: Phone,
  Email: Mail,
  Meeting: Calendar,
  Note: FileText,
  Task: CheckSquare
};

const outcomeColors = {
  Completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Sent: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "No Answer": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Left Voicemail": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Scheduled Follow-up": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Not Interested": "bg-red-500/20 text-red-400 border-red-500/30"
};

export default function ActivityTimeline({ activities = [] }) {
  const [filter, setFilter] = useState("All");

  const filteredActivities = filter === "All" 
    ? activities 
    : activities.filter(a => a.activity_type === filter);

  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white text-lg">Activity Timeline</h3>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Activities</SelectItem>
            <SelectItem value="Call">Calls</SelectItem>
            <SelectItem value="Email">Emails</SelectItem>
            <SelectItem value="Meeting">Meetings</SelectItem>
            <SelectItem value="Note">Notes</SelectItem>
            <SelectItem value="Task">Tasks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No activities yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => {
            const Icon = activityIcons[activity.activity_type] || FileText;
            return (
              <div key={activity.id} className="border-l-2 border-slate-700 pl-4 pb-4 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900" />
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{activity.activity_type}</Badge>
                      {activity.outcome && (
                        <Badge className={`text-xs ${outcomeColors[activity.outcome] || "bg-slate-700 text-slate-300"}`}>
                          {activity.outcome}
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-white mb-1">{activity.subject}</h4>
                    
                    {activity.description && (
                      <p className="text-sm text-slate-400 mb-2">{activity.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{format(new Date(activity.created_date), 'MMM d, yyyy h:mm a')}</span>
                      {activity.created_by && <span>by {activity.created_by}</span>}
                      {activity.next_action_date && (
                        <span className="text-amber-400">
                          Follow-up: {format(new Date(activity.next_action_date), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}