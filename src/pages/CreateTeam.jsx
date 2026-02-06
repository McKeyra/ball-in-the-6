import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, X, Upload, AlertCircle } from "lucide-react";

export default function CreateTeam() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [teamName, setTeamName] = useState('');
  const [division, setDivision] = useState('');
  const [teamColor, setTeamColor] = useState('#000435');
  const [logoUrl, setLogoUrl] = useState('');
  const [roster, setRoster] = useState([{ 
    _id: crypto.randomUUID(),
    first_name: '', 
    last_name: '', 
    jersey_number: '', 
    position: 'PG', 
    height: '',
    is_starter: false
  }]);
  const [staff, setStaff] = useState([{ 
    _id: crypto.randomUUID(),
    name: '', 
    title: 'Head Coach' 
  }]);
  const [validationErrors, setValidationErrors] = useState({});

  const createTeamMutation = useMutation({
    mutationFn: async ({ teamData, playerDataList }) => {
      // First create the team to get its ID
      const team = await base44.entities.Team.create(teamData);
      
      // Create PlayerBase records for each player
      if (playerDataList.length > 0) {
        const playerBaseRecords = playerDataList.map(p => ({
          first_name: p.first_name,
          last_name: p.last_name,
          height: p.height,
          primary_position: p.position,
          jersey_number: p.jersey_number,
          current_team_id: team.id,
          status: 'active'
        }));
        
        const createdPlayers = await base44.entities.PlayerBase.bulkCreate(playerBaseRecords);
        
        // Update team roster with player_base_id references
        const rosterWithIds = createdPlayers.map((player, index) => ({
          player_base_id: player.id,
          jersey_number: playerDataList[index].jersey_number,
          position: playerDataList[index].position,
          is_starter: playerDataList[index].is_starter || false
        }));
        
        await base44.entities.Team.update(team.id, { roster: rosterWithIds });
      }
      
      return team;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teams']);
      queryClient.invalidateQueries(['playerBases']);
      navigate(createPageUrl("TeamList"));
    },
  });

  const handleAddPlayer = () => {
    setRoster([...roster, { 
      _id: crypto.randomUUID(),
      first_name: '', 
      last_name: '', 
      jersey_number: '', 
      position: 'PG', 
      height: '',
      is_starter: false
    }]);
  };

  const handleRemovePlayer = (id) => {
    setRoster(roster.filter(p => p._id !== id));
    
    const newErrors = { ...validationErrors };
    delete newErrors[`player_${id}_first_name`];
    delete newErrors[`player_${id}_last_name`];
    delete newErrors[`player_${id}_jersey_number`];
    setValidationErrors(newErrors);
  };

  const handlePlayerChange = (id, field, value) => {
    const updated = roster.map(p => 
      p._id === id ? { ...p, [field]: value } : p
    );
    setRoster(updated);
    
    if (validationErrors[`player_${id}_${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`player_${id}_${field}`];
      setValidationErrors(newErrors);
    }
  };

  const handleAddStaff = () => {
    setStaff([...staff, { 
      _id: crypto.randomUUID(),
      name: '', 
      title: 'Assistant Coach' 
    }]);
  };

  const handleRemoveStaff = (id) => {
    setStaff(staff.filter(s => s._id !== id));
    
    const newErrors = { ...validationErrors };
    delete newErrors[`staff_${id}_name`];
    delete newErrors[`staff_${id}_title`];
    setValidationErrors(newErrors);
  };

  const handleStaffChange = (id, field, value) => {
    const updated = staff.map(s => 
      s._id === id ? { ...s, [field]: value } : s
    );
    setStaff(updated);
    
    if (validationErrors[`staff_${id}_${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`staff_${id}_${field}`];
      setValidationErrors(newErrors);
    }
  };

  const handleUploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setLogoUrl(file_url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate roster
    roster.forEach(player => {
      if (!player.first_name?.trim()) {
        errors[`player_${player._id}_first_name`] = "First name is required";
      }
      if (!player.last_name?.trim()) {
        errors[`player_${player._id}_last_name`] = "Last name is required";
      }
      if (!player.jersey_number && player.jersey_number !== 0) {
        errors[`player_${player._id}_jersey_number`] = "Number is required";
      } else {
        const num = Number(player.jersey_number);
        if (isNaN(num) || num < 0 || num > 99) {
          errors[`player_${player._id}_jersey_number`] = "Number must be between 0-99";
        }
      }
    });

    // Validate staff
    staff.forEach(member => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare player data for PlayerBase creation
    const playerDataList = roster.map(p => ({
      first_name: p.first_name?.trim() || "",
      last_name: p.last_name?.trim() || "",
      jersey_number: p.jersey_number ? Number(p.jersey_number) : 0,
      position: p.position || "PG",
      height: p.height?.trim() || "",
      is_starter: p.is_starter || false
    }));
    
    const teamData = {
      team_name: teamName,
      league: 'D-League', // Default, could add selector
      division,
      gender: 'coed', // Default, could add selector
      team_color: teamColor,
      logo_url: logoUrl,
      roster: [], // Will be populated after PlayerBase creation
      staff: staff.map(s => ({
        _id: s._id,
        name: s.name?.trim() || "",
        title: s.title?.trim() || ""
      }))
    };

    createTeamMutation.mutate({ teamData, playerDataList });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <style>{`
        .inputbox {
          position: relative;
          width: 100%;
        }

        .inputbox input {
          position: relative;
          width: 100%;
          padding: 20px 10px 10px;
          background: transparent;
          outline: none;
          box-shadow: none;
          border: none;
          color: #ffffff;
          font-size: 1em;
          letter-spacing: 0.05em;
          transition: 0.5s;
          z-index: 10;
        }

        .inputbox span {
          position: absolute;
          left: 0;
          padding: 20px 10px 10px;
          font-size: 1em;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.05em;
          transition: 0.5s;
          pointer-events: none;
        }

        .inputbox input:valid ~ span,
        .inputbox input:focus ~ span {
          color: #c9a962;
          transform: translateX(-10px) translateY(-34px);
          font-size: 0.75em;
        }

        .inputbox i {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background: #c9a962;
          border-radius: 4px;
          transition: 0.5s;
          pointer-events: none;
          z-index: 9;
        }

        .inputbox input:valid ~ i,
        .inputbox input:focus ~ i {
          height: 44px;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl("TeamList"))}
            style={{
              boxShadow: '0 10px 26px rgba(0,0,0,.10)',
              background: '#1a1a1a'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white/90">Create Team</h1>
            <p className="text-white/60">Set up a new basketball team</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Information */}
          <div 
            className="p-6 rounded-3xl"
            style={{
              background: '#1a1a1a',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <h2 className="text-xl font-bold text-white/70 mb-4">Team Information</h2>
            
            <div className="space-y-4">
              <div className="inputbox">
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
                <span>Team Name *</span>
                <i></i>
              </div>

              <div className="inputbox">
                <input
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  required
                />
                <span>Division *</span>
                <i></i>
              </div>

              <div>
                <label className="text-sm font-semibold text-white/60 mb-2 block">Team Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={teamColor}
                    onChange={(e) => setTeamColor(e.target.value)}
                    className="w-16 h-10 rounded-lg cursor-pointer"
                  />
                  <div className="inputbox flex-1">
                    <input
                      value={teamColor}
                      onChange={(e) => setTeamColor(e.target.value)}
                    />
                    <span>Hex Color</span>
                    <i></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-white/60 mb-2 block">Team Logo</label>
                <div className="flex items-center gap-4">
                  {logoUrl && (
                    <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
                  )}
                  <label className="cursor-pointer">
                    <div 
                      className="px-4 py-2 rounded-xl flex items-center gap-2 font-semibold"
                      style={{
                        background: '#1a1a1a',
                        boxShadow: '0 10px 26px rgba(0,0,0,.10)'
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadLogo}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Roster */}
          <div 
            className="p-6 rounded-3xl"
            style={{
              background: '#1a1a1a',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white/70">Roster</h2>
              <Button
                type="button"
                onClick={handleAddPlayer}
                size="sm"
                style={{
                  background: '#c9a962',
                  color: 'white',
                  boxShadow: '0 10px 26px rgba(0,0,0,.10)'
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Player
              </Button>
            </div>

            <div className="space-y-4">
              {roster.map((player) => (
                <div key={player._id} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-3">
                    <div className="inputbox">
                      <input
                        value={player.first_name}
                        onChange={(e) => handlePlayerChange(player._id, 'first_name', e.target.value)}
                        className={validationErrors[`player_${player._id}_first_name`] ? 'border-red-500' : ''}
                      />
                      <span>First Name</span>
                      <i></i>
                    </div>
                    {validationErrors[`player_${player._id}_first_name`] && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors[`player_${player._id}_first_name`]}
                      </div>
                    )}
                  </div>
                  <div className="col-span-3">
                    <div className="inputbox">
                      <input
                        value={player.last_name}
                        onChange={(e) => handlePlayerChange(player._id, 'last_name', e.target.value)}
                        className={validationErrors[`player_${player._id}_last_name`] ? 'border-red-500' : ''}
                      />
                      <span>Last Name</span>
                      <i></i>
                    </div>
                    {validationErrors[`player_${player._id}_last_name`] && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors[`player_${player._id}_last_name`]}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <div className="inputbox">
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={player.jersey_number}
                        onChange={(e) => handlePlayerChange(player._id, 'jersey_number', e.target.value)}
                        className={validationErrors[`player_${player._id}_jersey_number`] ? 'border-red-500' : ''}
                      />
                      <span>#</span>
                      <i></i>
                    </div>
                    {validationErrors[`player_${player._id}_jersey_number`] && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors[`player_${player._id}_jersey_number`]}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-white/40 mb-1 block">Position</label>
                    <Select value={player.position} onValueChange={(val) => handlePlayerChange(player._id, 'position', val)}>
                      <SelectTrigger className="bg-transparent">
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
                  </div>
                  <div className="col-span-1">
                    <div className="inputbox">
                      <input
                        value={player.height}
                        onChange={(e) => handlePlayerChange(player._id, 'height', e.target.value)}
                      />
                      <span>Ht</span>
                      <i></i>
                    </div>
                  </div>
                  <div className="col-span-1 pt-5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePlayer(player._id)}
                      disabled={roster.length === 1}
                      className="h-10"
                    >
                      <X className="w-4 h-4" />
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
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white/70">Staff</h2>
              <Button
                type="button"
                onClick={handleAddStaff}
                size="sm"
                style={{
                  background: '#c9a962',
                  color: 'white',
                  boxShadow: '0 10px 26px rgba(0,0,0,.10)'
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Staff
              </Button>
            </div>

            <div className="space-y-3">
              {staff.map((member) => (
                <div key={member._id} className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-6">
                    <div className="inputbox">
                      <input
                        value={member.name}
                        onChange={(e) => handleStaffChange(member._id, 'name', e.target.value)}
                        className={validationErrors[`staff_${member._id}_name`] ? 'border-red-500' : ''}
                      />
                      <span>Name</span>
                      <i></i>
                    </div>
                    {validationErrors[`staff_${member._id}_name`] && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors[`staff_${member._id}_name`]}
                      </div>
                    )}
                  </div>
                  <div className="col-span-5">
                    <div className="inputbox">
                      <input
                        value={member.title}
                        onChange={(e) => handleStaffChange(member._id, 'title', e.target.value)}
                        className={validationErrors[`staff_${member._id}_title`] ? 'border-red-500' : ''}
                      />
                      <span>Title</span>
                      <i></i>
                    </div>
                    {validationErrors[`staff_${member._id}_title`] && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors[`staff_${member._id}_title`]}
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 pt-5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveStaff(member._id)}
                      disabled={staff.length === 1}
                      className="h-10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("TeamList"))}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTeamMutation.isPending}
              className="flex-1 h-12 font-semibold"
              style={{
                background: '#c9a962',
                color: 'white',
                boxShadow: '0 10px 26px rgba(0,0,0,.10)'
              }}
            >
              {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}