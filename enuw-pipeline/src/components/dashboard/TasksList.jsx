import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ListTodo, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { format, isPast, isToday, isTomorrow } from "date-fns";

export default function TasksList() {
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const allTasks = await base44.entities.Task.filter({ 
        status: { $in: ["To Do", "In Progress"] }
      });
      return allTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    }
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      return base44.entities.Task.update(taskId, { status: "Completed" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const getDueLabel = (dueDate) => {
    const date = new Date(dueDate);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isPast(date)) return "Overdue";
    return format(date, "MMM d");
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: "text-red-400",
      Medium: "text-amber-400",
      Low: "text-slate-400"
    };
    return colors[priority] || "text-slate-400";
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-white text-sm">Tasks</h3>
          {tasks.length > 0 && (
            <Badge className="bg-blue-500/20 text-blue-400 text-xs">{tasks.length}</Badge>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <ListTodo className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No pending tasks</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, index) => {
            const taskContent = (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3 group hover:bg-slate-800/50 p-2 rounded-lg transition-colors"
              >
                <Checkbox 
                  className="mt-0.5 border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  onCheckedChange={() => completeTaskMutation.mutate(task.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 group-hover:text-white transition-colors truncate">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                      <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {getDueLabel(task.due_date)}
                      </span>
                    </div>
                    {task.priority !== "Medium" && (
                      <Badge className={`text-xs ${
                        task.priority === "High" ? "bg-red-500/20 text-red-400" : "bg-slate-500/20 text-slate-400"
                      }`}>
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            );

            return task.related_lead_id ? (
              <Link key={task.id} to={createPageUrl("LeadDetail") + `?id=${task.related_lead_id}`}>
                {taskContent}
              </Link>
            ) : (
              <div key={task.id}>{taskContent}</div>
            );
          })}
        </div>
      )}
    </Card>
  );
}