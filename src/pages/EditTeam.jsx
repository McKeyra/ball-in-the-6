import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Upload, Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditTeam() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get('teamId');

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const teams = await base44.entities.Team.filter({ id: teamId });
      return teams[0];
    },
    enabled: !!teamId,
  });

  const [teamData, setTeamData] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  React.useEffect(() => {
    if (team && !teamData) {
      setTeamData({
        team_name: team.team_name || "",
        division: team.division || "",
        team_color: team.team_color || "#000000",
        logo_url: team.logo_url || "",
        roster: Array.isArray(team.roster) ? team.roster.map(p => ({
          ...p,
          _id: p._id || crypto.randomUUID()
        })) : [],
        staff: Array.isArray(team.staff) ? team.staff.map(s => ({
          ...s,
          _id: s._id || crypto.randomUUID()
        })) : []
      });
    }
  }, [team, teamData]);

  const updateTeamMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.Team.update(teamId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['team']);
      queryClient.invalidateQueries(['teams']);
      navigate(createPageUrl("TeamManagement") + `?teamId=${teamId}`);
    },
  });

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setTeamData({ ...teamData, logo_url: file_url });
    }
  };

  const addPlayer = () => {
    setTeamData({
      ...teamData,
      roster: [...(teamData.roster || []), { 
        _id: crypto.randomUUID(),
        first_name: "", 
        last_name: "", 
        number: "", 
        position: "PG", 
        height: "" 
      }]
    });
  };

  const removePlayer = (id) => {
    const newRoster = teamData.roster.filter(p => p._id !== id);
    setTeamData({ ...teamData, roster: newRoster });
    
    // Clear validation errors for removed player
    const newErrors = { ...validationErrors };
    delete newErrors[`player_${id}_first_name`];
    delete newErrors[`player_${id}_last_name`];
    delete newErrors[`player_${id}_number`];
    setValidationErrors(newErrors);
  };

  const updatePlayer = (id, field, value) => {
    const newRoster = teamData.roster.map(p => 
      p._id === id ? { ...p, [field]: value } : p
    );
    setTeamData({ ...teamData, roster: newRoster });
    
    // Clear error for this field
    if (validationErrors[`player_${id}_${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`player_${id}_${field}`];
      setValidationErrors(newErrors);
    }
  };

  const addStaff = () => {
    setTeamData({
      ...teamData,
      staff: [...(teamData.staff || []), { 
        _id: crypto.randomUUID(),
        name: "", 
        title: "" 
      }]
    });
  };

  const removeStaff = (id) => {
    const newStaff = teamData.staff.filter(s => s._id !== id);
    setTeamData({ ...teamData, staff: newStaff });
    
    // Clear validation errors for removed staff
    const newErrors = { ...validationErrors };
    delete newErrors[`staff_${id}_name`];
    delete newErrors[`staff_${id}_title`];
    setValidationErrors(newErrors);
  };

  const updateStaff = (id, field, value) => {
    const newStaff = teamData.staff.map(s => 
      s._id === id ? { ...s, [field]: value } : s
    );
    setTeamData({ ...teamData, staff: newStaff });
    
    // Clear error for this field
    if (validationErrors[`staff_${id}_${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`staff_${id}_${field}`];
      setValidationErrors(newErrors);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate roster
    teamData.roster.forEach(player => {
      if (!player.first_name?.trim()) {
        errors[`player_${player._id}_first_name`] = "First name is required";
      }
      if (!player.last_name?.trim()) {
        errors[`player_${player._id}_last_name`] = "Last name is required";
      }
      if (!player.number && player.number !== 0) {
        errors[`player_${player._id}_number`] = "Number is required";
      } else {
        const num = Number(player.number);
        if (isNaN(num) || num < 0 || num > 99) {
          errors[`player_${player._id}_number`] = "Number must be between 0-99";
        }
      }
    });

    // Validate staff
    teamData.staff.forEach(member => {
      if (!member.name?.trim()) {
        errors[`staff_${member._id}_name`] = "Name is required";
      }
      if (!member.title?.trim()) {
        errors[`staff_${member._id}_title`] = "Title is required";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const processedData = {
      team_name: teamData.team_name,
      division: teamData.division,
      team_color: teamData.team_color,
      logo_url: teamData.logo_url,
      roster: teamData.roster.map(p => ({
        _id: p._id,
        first_name: p.first_name?.trim() || "",
        last_name: p.last_name?.trim() || "",
        number: p.number ? Number(p.number) : 0,
        position: p.position || "PG",
        height: p.height?.trim() || ""
      })),
      staff: teamData.staff.map(s => ({
        _id: s._id,
        name: s.name?.trim() || "",
        title: s.title?.trim() || ""
      }))
    };

    updateTeamMutation.mutate(processedData);
  };

  if (isLoading || !teamData) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-xl text-white/60">Loading team...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl("TeamManagement") + `?teamId=${teamId}`)}
            style={{
              boxShadow: '0 10px 26px rgba(0,0,0,.10)',
              background: '#1a1a1a'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white/90">Edit Team</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Information */}
          <div 
            className="p-6 rounded-3xl"
            style={{
              background: '#1a1a1a',
              boxShadow: '0 10px 26px rgba(0,0,0,.10)'
            }}
          >
            <h2 className="text-xl font-semibold text-white/70 mb-4">Team Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Team Logo</label>
                <div className="flex items-center gap-4">
                  {teamData.logo_url && (
                    <img src={teamData.logo_url} alt="Team Logo" className="w-20 h-20 rounded-full object-cover" />
                  )}
                  <label className="cursor-pointer">
                    <div 
                      className="px-4 py-2 rounded-xl flex items-center gap-2"
                      style={{
                        background: '#1a1a1a',
                        boxShadow: '0 10px 26px rgba(0,0,0,.10)'
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload New Logo</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Team Name</label>
                <Input
                  value={teamData.team_name}
                  onChange={(e) => setTeamData({ ...teamData, team_name: e.target.value })}
                  required
                  className="bg-white/[0.07]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Division</label>
                <Input
                  value={teamData.division}
                  onChange={(e) => setTeamData({ ...teamData, division: e.target.value })}
                  required
                  className="bg-white/[0.07]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Team Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={teamData.team_color}
                    onChange={(e) => setTeamData({ ...teamData, team_color: e.target.value })}
                    className="w-16 h-10 rounded-lg cursor-pointer"
                  />
                  <Input
                    value={teamData.team_color}
                    onChange={(e) => setTeamData({ ...teamData, team_color: e.target.value })}
                    className="bg-white/[0.07] flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Roster */}
          <div 
            className="p-6 rounded-3xl"
            style={{
              background: '#1a1a1a',
              boxShadow: '0 10px 26px rgba(0,0,0,.10)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white/70">Roster</h2>
              <Button
                type="button"
                onClick={addPlayer}
                className="flex items-center gap-2"
                style={{
                  background: '#10b981',
                  color: 'white'
                }}
              >
                <Plus className="w-4 h-4" />
                Add Player
              </Button>
            </div>

            <div className="space-y-4">
              {teamData.roster && teamData.roster.map((player) => (
                <div 
                  key={player._id}
                  className="p-4 rounded-2xl"
                  style={{
                    background: '#1a1a1a',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div>
                      <Input
                        placeholder="First Name"
                        value={player.first_name || ""}
                        onChange={(e) => updatePlayer(player._id, 'first_name', e.target.value)}
                        className={`bg-white/[0.07] ${validationErrors[`player_${player._id}_first_name`] ? 'border-red-500' : ''}`}
                      />
                      {validationErrors[`player_${player._id}_first_name`] && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors[`player_${player._id}_first_name`]}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="Last Name"
                        value={player.last_name || ""}
                        onChange={(e) => updatePlayer(player._id, 'last_name', e.target.value)}
                        className={`bg-white/[0.07] ${validationErrors[`player_${player._id}_last_name`] ? 'border-red-500' : ''}`}
                      />
                      {validationErrors[`player_${player._id}_last_name`] && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors[`player_${player._id}_last_name`]}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="Number"
                        type="number"
                        min="0"
                        max="99"
                        value={player.number || ""}
                        onChange={(e) => updatePlayer(player._id, 'number', e.target.value)}
                        className={`bg-white/[0.07] ${validationErrors[`player_${player._id}_number`] ? 'border-red-500' : ''}`}
                      />
                      {validationErrors[`player_${player._id}_number`] && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors[`player_${player._id}_number`]}
                        </div>
                      )}
                    </div>
                    <Select
                      value={player.position || "PG"}
                      onValueChange={(value) => updatePlayer(player._id, 'position', value)}
                    >
                      <SelectTrigger className="bg-white/[0.07]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PG">PG</SelectItem>
                        <SelectItem value="SG">SG</SelectItem>
                        <SelectItem value="SF">SF</SelectItem>
                        <SelectItem value="PF">PF</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Height (optional)"
                      value={player.height || ""}
                      onChange={(e) => updatePlayer(player._id, 'height', e.target.value)}
                      className="bg-white/[0.07]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePlayer(player._id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff */}
          <div 
            className="p-6 rounded-3xl"
            style={{
              background: '#1a1a1a',
              boxShadow: '0 10px 26px rgba(0,0,0,.10)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white/70">Coaching Staff</h2>
              <Button
                type="button"
                onClick={addStaff}
                className="flex items-center gap-2"
                style={{
                  background: '#10b981',
                  color: 'white'
                }}
              >
                <Plus className="w-4 h-4" />
                Add Staff
              </Button>
            </div>

            <div className="space-y-4">
              {teamData.staff && teamData.staff.map((member) => (
                <div 
                  key={member._id}
                  className="p-4 rounded-2xl"
                  style={{
                    background: '#1a1a1a',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Input
                        placeholder="Name"
                        value={member.name || ""}
                        onChange={(e) => updateStaff(member._id, 'name', e.target.value)}
                        className={`bg-white/[0.07] ${validationErrors[`staff_${member._id}_name`] ? 'border-red-500' : ''}`}
                      />
                      {validationErrors[`staff_${member._id}_name`] && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors[`staff_${member._id}_name`]}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="Title"
                        value={member.title || ""}
                        onChange={(e) => updateStaff(member._id, 'title', e.target.value)}
                        className={`bg-white/[0.07] ${validationErrors[`staff_${member._id}_title`] ? 'border-red-500' : ''}`}
                      />
                      {validationErrors[`staff_${member._id}_title`] && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors[`staff_${member._id}_title`]}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStaff(member._id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("TeamManagement") + `?teamId=${teamId}`)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateTeamMutation.isPending}
              className="flex-1"
              style={{
                background: '#10b981',
                color: 'white'
              }}
            >
              {updateTeamMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}