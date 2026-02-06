import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Clock, Users, Plus, Check, X, Send } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export default function TraditionalScheduler() {
  const queryClient = useQueryClient();
  const [gameData, setGameData] = useState({
    date: null,
    time: '19:00',
    home_team_id: '',
    away_team_id: '',
    location_id: '',
    age_group: 'prep',
    division: ''
  });

  const [showNewLocation, setShowNewLocation] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    city: '',
    province: 'Ontario',
    postal_code: ''
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => base44.entities.Location.list(),
  });

  const createLocationMutation = useMutation({
    mutationFn: (locationData) => base44.entities.Location.create(locationData),
    onSuccess: (newLoc) => {
      queryClient.invalidateQueries(['locations']);
      setGameData({ ...gameData, location_id: newLoc.id });
      setShowNewLocation(false);
      setNewLocation({
        name: '',
        address: '',
        city: '',
        province: 'Ontario',
        postal_code: ''
      });
    },
  });

  const createGameMutation = useMutation({
    mutationFn: async (data) => {
      const homeTeam = teams.find(t => t.id === data.home_team_id);
      const awayTeam = teams.find(t => t.id === data.away_team_id);
      const location = locations.find(l => l.id === data.location_id);

      return await base44.entities.Game.create({
        sport: "basketball",
        home_team_id: data.home_team_id,
        away_team_id: data.away_team_id,
        home_team_name: homeTeam.team_name,
        away_team_name: awayTeam.team_name,
        home_team_color: homeTeam.team_color,
        away_team_color: awayTeam.team_color,
        status: "not_started",
        game_date: format(data.date, 'yyyy-MM-dd'),
        game_time: data.time,
        location: location?.name || 'TBD',
        home_score: 0,
        away_score: 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['games']);
      setShowConfirmModal(false);
      setGameData({
        date: null,
        time: '19:00',
        home_team_id: '',
        away_team_id: '',
        location_id: '',
        age_group: 'prep',
        division: ''
      });
    },
  });

  const handleCreateLocation = () => {
    createLocationMutation.mutate(newLocation);
  };

  const handleSubmitForm = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmGame = () => {
    createGameMutation.mutate(gameData);
  };

  const filteredAwayTeams = teams.filter(t => 
    t.id !== gameData.home_team_id && 
    (!gameData.division || t.division === gameData.division)
  );

  const isFormValid = gameData.date && gameData.home_team_id && gameData.away_team_id && gameData.location_id;

  const homeTeam = teams.find(t => t.id === gameData.home_team_id);
  const awayTeam = teams.find(t => t.id === gameData.away_team_id);
  const location = locations.find(l => l.id === gameData.location_id);

  const text = "Create Game";

  return (
    <div className="max-w-4xl mx-auto">
      <style>{`
        .fancy-input {
          border: none;
          outline: none;
          border-radius: 15px;
          padding: 1em;
          background-color: #ccc;
          box-shadow: inset 2px 5px 10px rgba(0,0,0,0.3);
          transition: 300ms ease-in-out;
          width: 100%;
        }
        .fancy-input:focus {
          background-color: white;
          transform: scale(1.05);
          box-shadow: 13px 13px 100px #969696, -13px -13px 100px #ffffff;
        }

        .fancy-select button {
          border: none !important;
          outline: none !important;
          border-radius: 15px !important;
          padding: 1em !important;
          background-color: #ccc !important;
          box-shadow: inset 2px 5px 10px rgba(0,0,0,0.3) !important;
          transition: 300ms ease-in-out !important;
        }
        .fancy-select button:focus {
          background-color: white !important;
          transform: scale(1.05) !important;
          box-shadow: 13px 13px 100px #969696, -13px -13px 100px #ffffff !important;
        }

        .fancy-button {
          --primary: #000435;
          --neutral-1: #f7f8f7;
          --neutral-2: #e7e7e7;
          --radius: 14px;
          cursor: pointer;
          border-radius: var(--radius);
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
          border: none;
          box-shadow: 0 0.5px 0.5px 1px rgba(255, 255, 255, 0.2), 0 10px 20px rgba(0, 0, 0, 0.2), 0 4px 5px 0px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
          width: 100%;
          padding: 20px;
          height: 68px;
          font-family: "Galano Grotesque", Poppins, Montserrat, sans-serif;
          font-style: normal;
          font-size: 18px;
          font-weight: 600;
        }
        .fancy-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .fancy-button:not(:disabled):hover {
          transform: scale(1.02);
          box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.3), 0 15px 30px rgba(0, 0, 0, 0.3), 0 10px 3px -3px rgba(0, 0, 0, 0.04);
        }
        .fancy-button:not(:disabled):active {
          transform: scale(1);
          box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.3), 0 10px 3px -3px rgba(0, 0, 0, 0.2);
        }
        .fancy-button:after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: var(--radius);
          border: 2.5px solid transparent;
          background: linear-gradient(var(--neutral-1), var(--neutral-2)) padding-box, linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.45)) border-box;
          z-index: 0;
          transition: all 0.4s ease;
        }
        .fancy-button:not(:disabled):hover::after {
          transform: scale(1.05, 1.1);
          box-shadow: inset 0 -1px 3px 0 rgba(255, 255, 255, 1);
        }
        .fancy-button::before {
          content: "";
          inset: 7px 6px 6px 6px;
          position: absolute;
          background: linear-gradient(to top, var(--neutral-1), var(--neutral-2));
          border-radius: 30px;
          filter: blur(0.5px);
          z-index: 2;
        }
        .state p {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .state .icon {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          transform: scale(1.25);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .state .icon svg {
          overflow: visible;
        }
        .outline {
          position: absolute;
          border-radius: inherit;
          overflow: hidden;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.4s ease;
          inset: -2px -3.5px;
        }
        .outline::before {
          content: "";
          position: absolute;
          inset: -100%;
          background: conic-gradient(from 180deg, transparent 60%, white 80%, transparent 100%);
          animation: spin 2s linear infinite;
          animation-play-state: paused;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .fancy-button:not(:disabled):hover .outline {
          opacity: 1;
        }
        .fancy-button:not(:disabled):hover .outline::before {
          animation-play-state: running;
        }
        .state p span {
          display: block;
          opacity: 0;
          animation: slideDown 0.8s ease forwards calc(var(--i) * 0.03s);
        }
        .fancy-button:not(:disabled):hover p span {
          opacity: 1;
          animation: wave 0.5s ease forwards calc(var(--i) * 0.02s);
        }
        .fancy-button:not(:disabled):focus p span {
          opacity: 1;
          animation: disapear 0.6s ease forwards calc(var(--i) * 0.03s);
        }
        @keyframes wave {
          30% {
            opacity: 1;
            transform: translateY(4px) translateX(0) rotate(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-3px) translateX(0) rotate(0);
            color: var(--primary);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(0);
          }
        }
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-20px) translateX(5px) rotate(-90deg);
            color: var(--primary);
            filter: blur(5px);
          }
          30% {
            opacity: 1;
            transform: translateY(4px) translateX(0) rotate(0);
            filter: blur(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-3px) translateX(0) rotate(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(0);
          }
        }
        @keyframes disapear {
          from { opacity: 1; }
          to {
            opacity: 0;
            transform: translateX(5px) translateY(20px);
            color: var(--primary);
            filter: blur(5px);
          }
        }
        .state--default .icon svg {
          animation: land 0.6s ease forwards;
        }
        .fancy-button:not(:disabled):hover .state--default .icon {
          transform: rotate(45deg) scale(1.25);
        }
        .fancy-button:not(:disabled):focus .state--default svg {
          animation: takeOff 0.8s linear forwards;
        }
        .fancy-button:not(:disabled):focus .state--default .icon {
          transform: rotate(0) scale(1.25);
        }
        @keyframes takeOff {
          0% { opacity: 1; }
          60% {
            opacity: 1;
            transform: translateX(70px) rotate(45deg) scale(2);
          }
          100% {
            opacity: 0;
            transform: translateX(160px) rotate(45deg) scale(0);
          }
        }
        @keyframes land {
          0% {
            transform: translateX(-60px) translateY(30px) rotate(-50deg) scale(2);
            opacity: 0;
            filter: blur(3px);
          }
          100% {
            transform: translateX(0) translateY(0) rotate(0);
            opacity: 1;
            filter: blur(0);
          }
        }
        .state--default .icon:before {
          content: "";
          position: absolute;
          top: 50%;
          height: 2px;
          width: 0;
          left: -5px;
          background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5));
        }
        .fancy-button:not(:disabled):focus .state--default .icon:before {
          animation: contrail 0.8s linear forwards;
        }
        @keyframes contrail {
          0% { width: 0; opacity: 1; }
          8% { width: 15px; }
          60% {
            opacity: 0.7;
            width: 80px;
          }
          100% {
            opacity: 0;
            width: 160px;
          }
        }
        .state {
          padding-left: 29px;
          z-index: 2;
          display: flex;
          position: relative;
        }
        .state--default span:nth-child(4) {
          margin-right: 5px;
        }
        .state--sent {
          display: none;
        }
        .state--sent svg {
          transform: scale(1.25);
          margin-right: 8px;
        }
        .fancy-button:not(:disabled):focus .state--default {
          position: absolute;
        }
        .fancy-button:not(:disabled):focus .state--sent {
          display: flex;
        }
        .fancy-button:not(:disabled):focus .state--sent span {
          opacity: 0;
          animation: slideDown 0.8s ease forwards calc(var(--i) * 0.2s);
        }
        .fancy-button:not(:disabled):focus .state--sent .icon svg {
          opacity: 0;
          animation: appear 1.2s ease forwards 0.8s;
        }
        @keyframes appear {
          0% {
            opacity: 0;
            transform: scale(4) rotate(-40deg);
            color: var(--primary);
            filter: blur(4px);
          }
          30% {
            opacity: 1;
            transform: scale(0.6);
            filter: blur(1px);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div 
        className="p-6 rounded-2xl"
        style={{
          background: '#e0e0e0',
          boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
        }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule New Game</h2>

        <div className="space-y-6">
          {/* Division & Age Group */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Division</label>
              <Select value={gameData.division} onValueChange={(val) => setGameData({ ...gameData, division: val, home_team_id: '', away_team_id: '' })}>
                <SelectTrigger className="fancy-select">
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OSBA Mens">OSBA Mens</SelectItem>
                  <SelectItem value="OSBA Womens">OSBA Womens</SelectItem>
                  <SelectItem value="Trillium Mens">Trillium Mens</SelectItem>
                  <SelectItem value="D-League Boys">D-League Boys</SelectItem>
                  <SelectItem value="D-League Girls">D-League Girls</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Age Group</label>
              <Select value={gameData.age_group} onValueChange={(val) => setGameData({ ...gameData, age_group: val })}>
                <SelectTrigger className="fancy-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prep">Prep</SelectItem>
                  <SelectItem value="varsity">Varsity</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Teams */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Home Team
              </label>
              <Select 
                value={gameData.home_team_id} 
                onValueChange={(val) => setGameData({ ...gameData, home_team_id: val })}
                disabled={!gameData.division}
              >
                <SelectTrigger className="fancy-select">
                  <SelectValue placeholder="Select home team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.filter(t => !gameData.division || t.division === gameData.division).map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.team_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Away Team
              </label>
              <Select 
                value={gameData.away_team_id} 
                onValueChange={(val) => setGameData({ ...gameData, away_team_id: val })}
                disabled={!gameData.home_team_id}
              >
                <SelectTrigger className="fancy-select">
                  <SelectValue placeholder="Select away team" />
                </SelectTrigger>
                <SelectContent>
                  {filteredAwayTeams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.team_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Game Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="fancy-input text-left"
                  >
                    {gameData.date ? format(gameData.date, 'PPP') : 'Pick a date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker
                    mode="single"
                    selected={gameData.date}
                    onSelect={(date) => setGameData({ ...gameData, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Game Time
              </label>
              <input
                type="time"
                value={gameData.time}
                onChange={(e) => setGameData({ ...gameData, time: e.target.value })}
                className="fancy-input"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <div className="flex gap-2">
              <Select value={gameData.location_id} onValueChange={(val) => setGameData({ ...gameData, location_id: val })}>
                <SelectTrigger className="fancy-select flex-1">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name} - {loc.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => setShowNewLocation(!showNewLocation)}
                style={{
                  background: showNewLocation ? '#10b981' : '#e0e0e0',
                  color: showNewLocation ? 'white' : '#666',
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* New Location Form */}
          {showNewLocation && (
            <div 
              className="p-4 rounded-xl space-y-3"
              style={{
                background: 'white',
                boxShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h3 className="font-semibold text-gray-800 mb-3">Add New Location</h3>
              
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Location Name *</label>
                <input
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  placeholder="e.g. Madison Square Garden"
                  className="fancy-input"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">Address *</label>
                <input
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                  placeholder="Street address"
                  className="fancy-input"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">City</label>
                  <input
                    value={newLocation.city}
                    onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                    placeholder="City"
                    className="fancy-input"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Province</label>
                  <input
                    value={newLocation.province}
                    onChange={(e) => setNewLocation({ ...newLocation, province: e.target.value })}
                    placeholder="Province"
                    className="fancy-input"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Postal Code</label>
                  <input
                    value={newLocation.postal_code}
                    onChange={(e) => setNewLocation({ ...newLocation, postal_code: e.target.value })}
                    placeholder="A1A 1A1"
                    className="fancy-input"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleCreateLocation}
                  disabled={!newLocation.name || !newLocation.address}
                  className="flex-1"
                  style={{
                    background: '#10b981',
                    color: 'white'
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Location
                </Button>
                <Button
                  onClick={() => setShowNewLocation(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-4 border-t border-gray-300">
            <button
              onClick={handleSubmitForm}
              disabled={!isFormValid}
              className="fancy-button"
            >
              <span className="outline"></span>
              <span className="state state--default">
                <span className="icon">
                  <Send size={20} />
                </span>
                <p>
                  {text.split('').map((char, i) => (
                    <span key={i} style={{ '--i': i }}>{char}</span>
                  ))}
                </p>
              </span>
              <span className="state state--sent">
                <span className="icon">
                  <Check size={20} />
                </span>
                <p>
                  {'Sent!'.split('').map((char, i) => (
                    <span key={i} style={{ '--i': i }}>{char}</span>
                  ))}
                </p>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{
              background: '#e0e0e0',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Confirm Game Details</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    background: '#e0e0e0',
                    boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div 
                className="space-y-4 p-6 rounded-2xl mb-6"
                style={{
                  background: 'white',
                  boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {/* Matchup */}
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div 
                      className="w-12 h-12 rounded-full"
                      style={{ background: homeTeam?.team_color }}
                    />
                    <span className="text-2xl font-bold text-gray-800">vs</span>
                    <div 
                      className="w-12 h-12 rounded-full"
                      style={{ background: awayTeam?.team_color }}
                    />
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {homeTeam?.team_name}
                    <span className="mx-2 text-gray-400">vs</span>
                    {awayTeam?.team_name}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Division:</span>
                    <span className="font-semibold text-gray-800">{gameData.division}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Age Group:</span>
                    <span className="font-semibold text-gray-800 capitalize">{gameData.age_group}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Date:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {format(gameData.date, 'PPPP')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Time:
                    </span>
                    <span className="font-semibold text-gray-800">{gameData.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Location:
                    </span>
                    <span className="font-semibold text-gray-800">{location?.name}</span>
                  </div>
                  {location?.address && (
                    <div className="text-xs text-gray-500 text-right">
                      {location.address}
                      {location.city && `, ${location.city}`}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmGame}
                  className="flex-1"
                  style={{
                    background: '#10b981',
                    color: 'white',
                    boxShadow: '4px 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirm & Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}