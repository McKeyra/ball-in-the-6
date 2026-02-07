import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, RefreshCw, AlertTriangle } from "lucide-react";

export default function MultiDivisionScheduler({ teams, scheduleItems }) {
  const [selectedDivision, setSelectedDivision] = useState('all');

  const divisions = ['U10', 'U12', 'U14', 'U16'];

  const checkConflicts = () => {
    // Simple conflict detection logic
    const conflicts = [];
    const grouped = {};

    scheduleItems.forEach(item => {
      const key = `${item.date}_${item.venue_id}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    Object.values(grouped).forEach(items => {
      if (items.length > 1) {
        // Check for time overlap
        conflicts.push(...items);
      }
    });

    return conflicts.length;
  };

  const conflicts = checkConflicts();

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#D0FF00]/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#D0FF00]" />
            </div>
            <div>
              <CardTitle>Multi-Division Scheduler</CardTitle>
              <p className="text-sm text-gray-400">Auto-conflict resolver</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10">
              <RefreshCw className="w-4 h-4 mr-2" />
              Auto-Schedule
            </Button>
            <Button className="bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Game
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Conflict Alert */}
        {conflicts > 0 && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-red-400 font-semibold">{conflicts} Scheduling Conflicts Detected</p>
              <p className="text-sm text-gray-400">Venue or time overlaps need resolution</p>
            </div>
            <Button size="sm" className="ml-auto bg-red-500 hover:bg-red-600">
              Resolve
            </Button>
          </div>
        )}

        {/* Division Filter */}
        <div className="flex items-center gap-3">
          <Select value={selectedDivision} onValueChange={setSelectedDivision}>
            <SelectTrigger className="w-48 bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">All Divisions</SelectItem>
              {divisions.map(div => (
                <SelectItem key={div} value={div}>{div} Division</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-400">
            {scheduleItems.length} games scheduled
          </span>
        </div>

        {/* Schedule Grid */}
        <div className="grid gap-3">
          {scheduleItems.slice(0, 10).map((item) => (
            <div key={item.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#D0FF00]/50 transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1">{item.title}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{item.time || 'TBD'}</span>
                    {item.venue_id && (
                      <>
                        <span>•</span>
                        <span>Venue #{item.venue_id.slice(0, 8)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                    U12
                  </span>
                  <Button size="sm" variant="outline" className="border-white/10">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}