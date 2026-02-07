import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Settings, Users, DollarSign, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import CreateFormDialog from "../components/programs/CreateFormDialog";

export default function Programs() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const { data: programs = [] } = useQuery({
    queryKey: ['programs'],
    queryFn: () => base44.entities.Program.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Program.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['programs']);
      setCreateOpen(false);
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    type: 'rep_team',
    description: '',
    season: '',
    age_group: '',
    start_date: '',
    end_date: '',
    price: 0,
    max_participants: null,
    status: 'draft',
  });

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const programTypes = {
    private_training: { icon: Users, color: 'from-purple-500 to-pink-500' },
    rep_team: { icon: Users, color: 'from-blue-500 to-cyan-500' },
    house_league: { icon: Users, color: 'from-green-500 to-emerald-500' },
    tournament: { icon: Calendar, color: 'from-orange-500 to-red-500' },
    camp: { icon: Calendar, color: 'from-yellow-500 to-orange-500' },
    clinic: { icon: Users, color: 'from-indigo-500 to-purple-500' },
    tryout: { icon: Users, color: 'from-red-500 to-pink-500' },
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Programs</h1>
            <p className="text-sm md:text-base text-white/40">Manage training, teams, leagues & tournaments</p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90 min-h-[44px] px-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Program
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {programs.map((program) => {
            const typeConfig = programTypes[program.type] || programTypes.rep_team;
            const Icon = typeConfig.icon;
            
            return (
              <Card key={program.id} className="bg-white/[0.05] border-white/[0.06] hover:border-[#c9a962]/50 transition-all group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeConfig.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      program.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      program.status === 'full' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-white/40'
                    }`}>
                      {program.status}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <p className="text-sm text-white/40">{program.type.replace(/_/g, ' ').toUpperCase()}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-white/50 line-clamp-2">{program.description || 'No description'}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-white/40">
                      <Users className="w-4 h-4" />
                      <span>{program.current_participants || 0}/{program.max_participants || '∞'}</span>
                    </div>
                    {program.price > 0 && (
                      <div className="flex items-center gap-1 text-white/40">
                        <DollarSign className="w-4 h-4" />
                        <span>${program.price}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-white/[0.06] hover:border-[#c9a962]/50 min-h-[44px] text-sm"
                      onClick={() => {
                        setSelectedProgram(program);
                        setFormDialogOpen(true);
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Create Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Create Program Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="bg-[#121212] border-white/[0.06] text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Program</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Program Name</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Elite Skills Training"
                    className="bg-white/[0.05] border-white/[0.06]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                    <SelectTrigger className="bg-white/[0.05] border-white/[0.06]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/[0.06]">
                      <SelectItem value="private_training">Private Training</SelectItem>
                      <SelectItem value="rep_team">Rep Team</SelectItem>
                      <SelectItem value="house_league">House League</SelectItem>
                      <SelectItem value="tournament">Tournament</SelectItem>
                      <SelectItem value="camp">Camp</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="tryout">Tryout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe this program..."
                  className="bg-white/[0.05] border-white/[0.06]"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                  <Label>Age Group</Label>
                  <Input 
                    value={formData.age_group}
                    onChange={(e) => setFormData({...formData, age_group: e.target.value})}
                    placeholder="e.g., U12, U14"
                    className="bg-white/[0.05] border-white/[0.06]"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input 
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="bg-white/[0.05] border-white/[0.06]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input 
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="bg-white/[0.05] border-white/[0.06]"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="bg-white/[0.05] border-white/[0.06]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Participants</Label>
                  <Input 
                    type="number"
                    value={formData.max_participants || ''}
                    onChange={(e) => setFormData({...formData, max_participants: parseInt(e.target.value) || null})}
                    placeholder="Leave empty for unlimited"
                    className="bg-white/[0.05] border-white/[0.06]"
                  />
                </div>
              </div>

              <Button 
                onClick={handleCreate}
                className="w-full bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90"
                disabled={!formData.name}
              >
                Create Program
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Form Builder Dialog */}
        {selectedProgram && (
          <CreateFormDialog 
            program={selectedProgram}
            open={formDialogOpen}
            onOpenChange={setFormDialogOpen}
          />
        )}
      </div>
    </div>
  );
}