import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Settings, Users, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TeamsSection() {
  const navigate = useNavigate();
  const [filterLeague, setFilterLeague] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');
  const [filterGender, setFilterGender] = useState('all');

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  const filteredTeams = teams.filter(team => {
    if (filterLeague !== 'all' && team.league !== filterLeague) return false;
    if (filterDivision !== 'all' && team.division !== filterDivision) return false;
    if (filterGender !== 'all' && team.gender !== filterGender) return false;
    return true;
  });

  const leagues = ['all', 'OSBA', 'Trillium', 'D-League'];
  const divisions = ['all', ...new Set(teams.map(t => t.division))];
  const genders = ['all', 'mens', 'womens', 'boys', 'girls'];

  const TeamCard = ({ team }) => (
    <button
      onClick={() => navigate(createPageUrl("TeamManagement") + `?teamId=${team.id}`)}
      className="w-full p-4 rounded-2xl text-left transition-all hover:scale-[1.02]"
      style={{
        background: '#e0e0e0',
        boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
      }}
    >
      <div className="flex items-center gap-4">
        {team.logo_url ? (
          <img 
            src={team.logo_url} 
            alt={team.team_name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ background: team.team_color || '#666' }}
          >
            {team.team_name.charAt(0)}
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1">{team.team_name}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span 
              className="px-2 py-1 rounded"
              style={{
                background: 'rgba(0,0,0,0.05)'
              }}
            >
              {team.league}
            </span>
            <span>{team.division}</span>
            <span>•</span>
            <span className="capitalize">{team.gender}</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
            <span>
              <Users className="w-3 h-3 inline mr-1" />
              {team.roster?.length || 0} players
            </span>
            {team.staff?.length > 0 && (
              <span>• {team.staff.length} staff</span>
            )}
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );

  return (
    <div>
      {/* Header Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={filterLeague} onValueChange={setFilterLeague}>
            <SelectTrigger 
              className="w-40"
              style={{
                background: '#e0e0e0',
                boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)'
              }}
            >
              <SelectValue placeholder="League" />
            </SelectTrigger>
            <SelectContent>
              {leagues.map(league => (
                <SelectItem key={league} value={league}>
                  {league === 'all' ? 'All Leagues' : league}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterDivision} onValueChange={setFilterDivision}>
            <SelectTrigger 
              className="w-52"
              style={{
                background: '#e0e0e0',
                boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)'
              }}
            >
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              {divisions.map(div => (
                <SelectItem key={div} value={div}>
                  {div === 'all' ? 'All Divisions' : div}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterGender} onValueChange={setFilterGender}>
            <SelectTrigger 
              className="w-40"
              style={{
                background: '#e0e0e0',
                boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)'
              }}
            >
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              {genders.map(gender => (
                <SelectItem key={gender} value={gender}>
                  {gender === 'all' ? 'All' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate(createPageUrl("CreateTeam"))}
            style={{
              background: '#000435',
              color: 'white',
              boxShadow: '4px 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Team
          </Button>
          <Button
            variant="ghost"
            size="icon"
            style={{
              background: '#e0e0e0',
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
            }}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div 
        className="grid grid-cols-4 gap-4 mb-6 p-6 rounded-2xl"
        style={{
          background: '#e0e0e0',
          boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
        }}
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{teams.length}</div>
          <div className="text-sm text-gray-500">Total Teams</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{teams.filter(t => t.league === 'OSBA').length}</div>
          <div className="text-sm text-gray-500">OSBA</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{teams.filter(t => t.league === 'Trillium').length}</div>
          <div className="text-sm text-gray-500">Trillium</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{teams.filter(t => t.league === 'D-League').length}</div>
          <div className="text-sm text-gray-500">D-League</div>
        </div>
      </div>

      {/* Teams List */}
      <div className="space-y-3">
        {filteredTeams.length === 0 ? (
          <div 
            className="p-12 rounded-2xl text-center"
            style={{
              background: '#e0e0e0',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
            }}
          >
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No teams found matching your filters</p>
          </div>
        ) : (
          filteredTeams.map(team => <TeamCard key={team.id} team={team} />)
        )}
      </div>
    </div>
  );
}