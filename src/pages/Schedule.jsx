import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus, MapPin, Clock, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import VenueOpponentManager from "../components/schedule/VenueOpponentManager";

export default function Schedule() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const { data: scheduleItems = [] } = useQuery({
    queryKey: ['schedule'],
    queryFn: () => base44.entities.ScheduleItem.list('-date'),
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  const { data: opponents = [] } = useQuery({
    queryKey: ['opponents'],
    queryFn: () => base44.entities.Opponent.list(),
  });

  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ScheduleItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['schedule']);
      setCreateOpen(false);
      resetForm();
    },
  });

  const [formData, setFormData] = useState({
    type: 'game',
    title: '',
    team_id: '',
    opponent_id: '',
    venue_id: '',
    date: '',
    time: '',
    home_away: 'home',
    visibility: 'public',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      type: 'game',
      title: '',
      team_id: '',
      opponent_id: '',
      venue_id: '',
      date: '',
      time: '',
      home_away: 'home',
      visibility: 'public',
      notes: '',
    });
  };

  const getTeamName = (teamId) => teams.find(t => t.id === teamId)?.name || 'Unknown Team';
  const getOpponentName = (oppId) => opponents.find(o => o.id === oppId)?.name || 'TBD';
  const getVenueName = (venueId) => venues.find(v => v.id === venueId)?.name || 'TBD';

  const typeColors = {
    game: 'from-red-500 to-pink-500',
    practice: 'from-blue-500 to-cyan-500',
    tournament: 'from-purple-500 to-indigo-500',
    event: 'from-green-500 to-emerald-500',
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Schedule</h1>
            <p className="text-white/40">Manage games, practices, tournaments & events</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setManageOpen(true)}
              variant="outline"
              className="border-white/[0.06]"
            >
              Manage Venues & Opponents
            </Button>
            <Button 
              onClick={() => setCreateOpen(true)}
              className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Schedule
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {scheduleItems.length === 0 ? (
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardContent className="py-12 text-center">
                <CalendarIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/40">No scheduled items yet. Add your first game or event!</p>
              </CardContent>
            </Card>
          ) : (
            scheduleItems.map((item) => (
              <Card key={item.id} className="bg-white/[0.05] border-white/[0.06] hover:border-[#c9a962]/50 transition-all overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className={`w-full md:w-2 bg-gradient-to-b ${typeColors[item.type]}`} />
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${typeColors[item.type]} text-white`}>
                            {item.type.toUpperCase()}
                          </span>
                          {item.visibility === 'team_only' && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Team Only
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">
                          {item.type === 'game' && item.opponent_id ? 
                            `${getTeamName(item.team_id)} vs ${getOpponentName(item.opponent_id)}` :
                            item.title
                          }
                        </h3>

                        <div className="space-y-2 text-sm text-white/40">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{format(new Date(item.date), 'EEEE, MMMM d, yyyy')}</span>
                          </div>
                          {item.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{item.time}</span>
                            </div>
                          )}
                          {item.venue_id && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{getVenueName(item.venue_id)}</span>
                            </div>
                          )}
                        </div>

                        {item.notes && (
                          <p className="mt-3 text-sm text-white/50">{item.notes}</p>
                        )}
                      </div>

                      {item.status === 'completed' && item.type === 'game' && (
                        <div className="flex md:flex-col items-center md:items-end gap-2">
                          <div className="text-center bg-white/[0.05] rounded-lg p-3">
                            <p className="text-2xl font-bold">{item.our_score || 0}</p>
                            <p className="text-xs text-white/40">Us</p>
                          </div>
                          <div className="text-xl font-bold text-white/30">-</div>
                          <div className="text-center bg-white/[0.05] rounded-lg p-3">
                            <p className="text-2xl font-bold">{item.opponent_score || 0}</p>
                            <p className="text-xs text-white/40">Them</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Create Schedule Item Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="bg-[#121212] border-white/[0.06] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add to Schedule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                    <SelectTrigger className="bg-white/[0.05] border-white/[0.06]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/[0.06]">
                      <SelectItem value="game">Game</SelectItem>
                      <SelectItem value="practice">Practice</SelectItem>
                      <SelectItem value="tournament">Tournament</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Team</Label>
                  <Select value={formData.team_id} onValueChange={(val) => setFormData({...formData, team_id: val})}>
                    <SelectTrigger className="bg-white/[0.05] border-white/[0.06]">
                      <SelectValue placeholder="Select team..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/[0.06]">
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title / Description</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Practice Session, Championship Game"
                  className="bg-white/[0.05] border-white/[0.06]"
                />
              </div>

              {formData.type === 'game' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Opponent</Label>
                    <Select value={formData.opponent_id} onValueChange={(val) => setFormData({...formData, opponent_id: val})}>
                      <SelectTrigger className="bg-white/[0.05] border-white/[0.06]">
                        <SelectValue placeholder="Select opponent..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-white/[0.06]">
                        {opponents.map(opp => (
                          <SelectItem key={opp.id} value={opp.id}>{opp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Home / Away</Label>
                    <Select value={formData.home_away} onValueChange={(val) => setFormData({...formData, home_away: val})}>
                      <SelectTrigger className="bg-white/[0.05] border-white/[0.06]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-white/[0.06]">
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="away">Away</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Venue</Label>
                <Select value={formData.venue_id} onValueChange={(val) => setFormData({...formData, venue_id: val})}>
                  <SelectTrigger className="bg-white/[0.05] border-white/[0.06]">
                    <SelectValue placeholder="Select venue..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121212] border-white/[0.06]">
                    {venues.map(venue => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name} - {venue.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="bg-white/[0.05] border-white/[0.06]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input 
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="bg-white/[0.05] border-white/[0.06]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select value={formData.visibility} onValueChange={(val) => setFormData({...formData, visibility: val})}>
                  <SelectTrigger className="bg-white/[0.05] border-white/[0.06]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121212] border-white/[0.06]">
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="team_only">Team Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional details..."
                  className="bg-white/[0.05] border-white/[0.06]"
                  rows={3}
                />
              </div>

              <Button 
                onClick={() => createMutation.mutate(formData)}
                className="w-full bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90"
                disabled={!formData.title || !formData.date}
              >
                Add to Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Venue & Opponent Manager */}
        <VenueOpponentManager open={manageOpen} onOpenChange={setManageOpen} />
      </div>
    </div>
  );
}