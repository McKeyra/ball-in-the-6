import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeamRosterDialog({ team, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [addMode, setAddMode] = useState(false);

  const { data: members = [] } = useQuery({
    queryKey: ['team-members', team.id],
    queryFn: () => base44.entities.TeamMember.filter({ team_id: team.id }),
    enabled: !!team.id,
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => base44.entities.Player.list(),
  });

  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.TeamMember.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['team-members']);
      setAddMode(false);
      setNewMember({ role: 'player', player_id: '', jersey_number: '' });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id) => base44.entities.TeamMember.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['team-members']);
    },
  });

  const [newMember, setNewMember] = useState({
    role: 'player',
    player_id: '',
    jersey_number: '',
  });

  const playerMembers = members.filter(m => m.role === 'player');
  const staffMembers = members.filter(m => m.role !== 'player');

  const getPlayerInfo = (playerId) => {
    return players.find(p => p.id === playerId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Roster - {team.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="players" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-white/5 border-white/10 w-full justify-start">
            <TabsTrigger value="players">Players ({playerMembers.length})</TabsTrigger>
            <TabsTrigger value="staff">Staff & Coaches ({staffMembers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="flex-1 overflow-y-auto mt-4 space-y-4">
            {!addMode ? (
              <>
                <Button 
                  onClick={() => setAddMode(true)}
                  className="w-full bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Player
                </Button>

                <div className="space-y-2">
                  {playerMembers.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No players added yet</p>
                  ) : (
                    playerMembers.map((member) => {
                      const player = getPlayerInfo(member.player_id);
                      return (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#D0FF00]/20 rounded-full flex items-center justify-center">
                              <span className="font-bold text-[#D0FF00]">
                                {member.jersey_number || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {player ? `${player.first_name} ${player.last_name}` : 'Unknown Player'}
                              </p>
                              <p className="text-sm text-gray-400">{player?.position || 'No position'}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMutation.mutate(member.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#D0FF00]" />
                  Add Player to Roster
                </h3>

                <div className="space-y-2">
                  <Label>Select Player</Label>
                  <Select 
                    value={newMember.player_id} 
                    onValueChange={(val) => setNewMember({...newMember, player_id: val})}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Choose a player..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-white/10">
                      {players.map(player => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.first_name} {player.last_name} - {player.primary_sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Jersey Number</Label>
                  <Input 
                    value={newMember.jersey_number}
                    onChange={(e) => setNewMember({...newMember, jersey_number: e.target.value})}
                    placeholder="#"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => addMutation.mutate({
                      team_id: team.id,
                      ...newMember,
                    })}
                    className="flex-1 bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90"
                    disabled={!newMember.player_id}
                  >
                    Add to Roster
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setAddMode(false)}
                    className="border-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="staff" className="flex-1 overflow-y-auto mt-4 space-y-4">
            <p className="text-gray-400 text-sm">Staff management coming soon...</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}