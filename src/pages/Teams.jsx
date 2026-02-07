import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Trophy, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TeamRosterDialog from "../components/teams/TeamRosterDialog";

export default function Teams() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [rosterOpen, setRosterOpen] = useState(false);

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Team.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teams']);
      setCreateOpen(false);
      setFormData({
        name: '',
        sport: 'basketball',
        age_group: '',
        season: '',
        color: '#c9a962',
      });
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    sport: 'basketball',
    age_group: '',
    season: '',
    color: '#c9a962',
  });

  const sportColors = {
    basketball: '#FF6B35',
    hockey: '#004E89',
    soccer: '#2ECC40',
    baseball: '#B91D73',
    football: '#8B4513',
    volleyball: '#FFD700',
    lacrosse: '#9C27B0',
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Teams</h1>
            <p className="text-sm md:text-base text-white/40">Manage rosters, assign members & track records</p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90 min-h-[44px] min-w-[44px] px-4 md:px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Team
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {teams.map((team) => (
            <Card 
              key={team.id} 
              className="bg-white/[0.05] border-white/[0.06] hover:border-[#c9a962]/50 transition-all overflow-hidden group"
            >
              <div 
                className="h-24 relative"
                style={{ 
                  background: `linear-gradient(135deg, ${team.color || sportColors[team.sport]} 0%, ${team.color || sportColors[team.sport]}66 100%)` 
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
                {team.logo_url && (
                  <img src={team.logo_url} alt={team.name} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{team.name}</span>
                  <span className="text-xs px-2 py-1 bg-white/[0.08] rounded">
                    {team.sport}
                  </span>
                </CardTitle>
                <p className="text-sm text-white/40">{team.age_group} • {team.season}</p>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/[0.05] rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#c9a962]" />
                    <span className="text-sm">Record</span>
                  </div>
                  <span className="font-semibold">
                    {team.wins || 0}-{team.losses || 0}-{team.ties || 0}
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-white/[0.06] hover:border-[#c9a962]/50 min-h-[44px]"
                  onClick={() => {
                    setSelectedTeam(team);
                    setRosterOpen(true);
                  }}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Manage Roster
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Team Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="bg-[#121212] border-white/[0.06] text-white">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Team Name</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Elite Raptors U14"
                  className="bg-white/[0.05] border-white/[0.06]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sport</Label>
                  <Select value={formData.sport} onValueChange={(val) => setFormData({...formData, sport: val})}>
                    <SelectTrigger className="bg-white/[0.05] border-white/[0.06]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/[0.06]">
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="hockey">Hockey</SelectItem>
                      <SelectItem value="soccer">Soccer</SelectItem>
                      <SelectItem value="baseball">Baseball</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="volleyball">Volleyball</SelectItem>
                      <SelectItem value="lacrosse">Lacrosse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Age Group</Label>
                  <Input 
                    value={formData.age_group}
                    onChange={(e) => setFormData({...formData, age_group: e.target.value})}
                    placeholder="e.g., U12, U14"
                    className="bg-white/[0.05] border-white/[0.06]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Season</Label>
                <Input 
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                  placeholder="e.g., Winter 2024"
                  className="bg-white/[0.05] border-white/[0.06]"
                />
              </div>

              <div className="space-y-2">
                <Label>Team Color</Label>
                <div className="flex gap-3">
                  <Input 
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-20 h-10 bg-white/[0.05] border-white/[0.06]"
                  />
                  <Input 
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="flex-1 bg-white/[0.05] border-white/[0.06]"
                  />
                </div>
              </div>

              <Button
                onClick={() => createMutation.mutate(formData)}
                className="w-full bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90 min-h-[44px]"
                disabled={!formData.name}
              >
                Create Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Roster Management Dialog */}
        {selectedTeam && (
          <TeamRosterDialog 
            team={selectedTeam}
            open={rosterOpen}
            onOpenChange={setRosterOpen}
          />
        )}
      </div>
    </div>
  );
}