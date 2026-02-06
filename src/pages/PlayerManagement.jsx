import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Save, Trash2 } from "lucide-react";

export default function PlayerManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const playerId = urlParams.get('playerId');
  const teamId = urlParams.get('teamId');
  const isNew = !playerId;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    jersey_number: '',
    position: 'PG',
    height: '',
    weight: '',
    date_of_birth: '',
    bio: '',
    status: 'active',
    team_id: teamId || '',
    photo_url: ''
  });

  const { data: player, isLoading: playerLoading } = useQuery({
    queryKey: ['persistentPlayer', playerId],
    queryFn: async () => {
      const players = await base44.entities.PersistentPlayer.filter({ id: playerId });
      return players[0];
    },
    enabled: !!playerId,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  React.useEffect(() => {
    if (player) {
      setFormData({
        first_name: player.first_name || '',
        last_name: player.last_name || '',
        jersey_number: player.jersey_number || '',
        position: player.position || 'PG',
        height: player.height || '',
        weight: player.weight || '',
        date_of_birth: player.date_of_birth || '',
        bio: player.bio || '',
        status: player.status || 'active',
        team_id: player.team_id || '',
        photo_url: player.photo_url || ''
      });
    }
  }, [player]);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const newPlayer = await base44.entities.PersistentPlayer.create(data);
      
      // Add player to team's player_ids
      if (data.team_id) {
        const teams = await base44.entities.Team.filter({ id: data.team_id });
        if (teams.length > 0) {
          const team = teams[0];
          const playerIds = team.player_ids || [];
          await base44.entities.Team.update(data.team_id, {
            player_ids: [...playerIds, newPlayer.id]
          });
        }
      }
      return newPlayer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['persistentPlayers']);
      queryClient.invalidateQueries(['teams']);
      if (teamId) {
        navigate(createPageUrl("TeamManagement") + `?teamId=${teamId}`);
      } else {
        navigate(-1);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      // Check if team changed
      if (player && player.team_id !== data.team_id) {
        // Remove from old team
        if (player.team_id) {
          const oldTeams = await base44.entities.Team.filter({ id: player.team_id });
          if (oldTeams.length > 0) {
            const oldTeam = oldTeams[0];
            await base44.entities.Team.update(player.team_id, {
              player_ids: (oldTeam.player_ids || []).filter(id => id !== playerId)
            });
          }
        }
        // Add to new team
        if (data.team_id) {
          const newTeams = await base44.entities.Team.filter({ id: data.team_id });
          if (newTeams.length > 0) {
            const newTeam = newTeams[0];
            await base44.entities.Team.update(data.team_id, {
              player_ids: [...(newTeam.player_ids || []), playerId]
            });
          }
        }
      }
      await base44.entities.PersistentPlayer.update(playerId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['persistentPlayer']);
      queryClient.invalidateQueries(['persistentPlayers']);
      queryClient.invalidateQueries(['teams']);
      navigate(-1);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Remove from team first
      if (player?.team_id) {
        const teams = await base44.entities.Team.filter({ id: player.team_id });
        if (teams.length > 0) {
          const team = teams[0];
          await base44.entities.Team.update(player.team_id, {
            player_ids: (team.player_ids || []).filter(id => id !== playerId)
          });
        }
      }
      await base44.entities.PersistentPlayer.delete(playerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['persistentPlayers']);
      queryClient.invalidateQueries(['teams']);
      navigate(-1);
    },
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, photo_url: file_url });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      jersey_number: formData.jersey_number ? Number(formData.jersey_number) : null
    };
    
    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  if (!isNew && playerLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-xl text-white/60">Loading player...</div>
      </div>
    );
  }

  const currentTeam = teams.find(t => t.id === formData.team_id);

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            style={{
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
              background: '#0f0f0f'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white/90">
            {isNew ? 'Add Player' : 'Edit Player'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo */}
          <div 
            className="p-6 rounded-3xl"
            style={{
              background: '#0f0f0f',
              boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)'
            }}
          >
            <h2 className="text-lg font-semibold text-white/70 mb-4">Photo</h2>
            <div className="flex items-center gap-4">
              {formData.photo_url ? (
                <img 
                  src={formData.photo_url} 
                  alt="Player" 
                  className="w-24 h-24 rounded-full object-cover"
                  style={{ boxShadow: '4px 4px 8px rgba(0,0,0,0.15)' }}
                />
              ) : (
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                  style={{ 
                    background: currentTeam?.team_color || '#666',
                    boxShadow: '4px 4px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  {formData.jersey_number || '?'}
                </div>
              )}
              <label className="cursor-pointer">
                <div 
                  className="px-4 py-2 rounded-xl flex items-center gap-2"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                  }}
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Upload Photo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div 
            className="p-6 rounded-3xl"
            style={{
              background: '#0f0f0f',
              boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)'
            }}
          >
            <h2 className="text-lg font-semibold text-white/70 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white/60 mb-1 block">First Name *</label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                    className="bg-white/[0.07]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/60 mb-1 block">Last Name *</label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                    className="bg-white/[0.07]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-white/60 mb-1 block">Jersey #</label>
                  <Input
                    type="number"
                    min="0"
                    max="99"
                    value={formData.jersey_number}
                    onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
                    className="bg-white/[0.07]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/60 mb-1 block">Position</label>
                  <Select 
                    value={formData.position} 
                    onValueChange={(val) => setFormData({ ...formData, position: val })}
                  >
                    <SelectTrigger className="bg-white/[0.07]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PG">Point Guard (PG)</SelectItem>
                      <SelectItem value="SG">Shooting Guard (SG)</SelectItem>
                      <SelectItem value="SF">Small Forward (SF)</SelectItem>
                      <SelectItem value="PF">Power Forward (PF)</SelectItem>
                      <SelectItem value="C">Center (C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/60 mb-1 block">Status</label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="bg-white/[0.07]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="injured">Injured</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white/60 mb-1 block">Height</label>
                  <Input
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="e.g., 6'2&quot;"
                    className="bg-white/[0.07]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/60 mb-1 block">Weight</label>
                  <Input
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g., 185 lbs"
                    className="bg-white/[0.07]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white/60 mb-1 block">Date of Birth</label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="bg-white/[0.07]"
                />
              </div>
            </div>
          </div>

          {/* Team Assignment */}
          <div 
            className="p-6 rounded-3xl"
            style={{
              background: '#0f0f0f',
              boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)'
            }}
          >
            <h2 className="text-lg font-semibold text-white/70 mb-4">Team Assignment</h2>
            <Select 
              value={formData.team_id || "none"} 
              onValueChange={(val) => setFormData({ ...formData, team_id: val === "none" ? "" : val })}
            >
              <SelectTrigger className="bg-white/[0.07]">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Team</SelectItem>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.team_name} - {team.division}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bio */}
          <div 
            className="p-6 rounded-3xl"
            style={{
              background: '#0f0f0f',
              boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)'
            }}
          >
            <h2 className="text-lg font-semibold text-white/70 mb-4">Biography</h2>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Player biography..."
              rows={4}
              className="w-full p-3 rounded-xl bg-white/[0.07] border-0"
              style={{ outline: 'none' }}
            />
          </div>

          {/* Career Stats (read-only if editing) */}
          {!isNew && player && (
            <div 
              className="p-6 rounded-3xl"
              style={{
                background: '#0f0f0f',
                boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
              }}
            >
              <h2 className="text-lg font-semibold text-white/70 mb-4">Career Statistics</h2>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white/90">{player.career_games || 0}</div>
                  <div className="text-xs text-white/40">Games</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white/90">{player.career_points || 0}</div>
                  <div className="text-xs text-white/40">Points</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white/90">{player.career_rebounds || 0}</div>
                  <div className="text-xs text-white/40">Rebounds</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white/90">{player.career_assists || 0}</div>
                  <div className="text-xs text-white/40">Assists</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            {!isNew && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this player?')) {
                    deleteMutation.mutate();
                  }
                }}
                className="text-red-600 border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1"
              style={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                boxShadow: '4px 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Player'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}